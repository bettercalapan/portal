const BACKGROUND_MOUNT_INTERVAL = 6_000;
const IDLE_TIMEOUT = 2_000;

type Job = {
	backgroundMountAt: number;
	cancelled: boolean;
	failed: boolean;
	loaded: boolean;
	mounted: boolean;
	preload: () => Promise<void>;
	mount: () => void;
	onError: () => void;
	priority: boolean;
};

export type ChartLoadQueue = ReturnType<typeof createChartLoadQueue>;

export function createChartLoadQueue() {
	const jobs: Job[] = [];
	let running = false;
	let scheduled: (() => void) | undefined;

	function clearScheduled() {
		scheduled?.();
		scheduled = undefined;
	}

	function getPendingJobs() {
		return jobs.filter((job) => !job.cancelled && !job.failed && !job.mounted);
	}

	function getNextOperation() {
		const pendingJobs = getPendingJobs();
		const priorityJob = pendingJobs.find((job) => job.priority);

		if (priorityJob) {
			return priorityJob.loaded
				? { job: priorityJob, type: "mount" as const }
				: { job: priorityJob, type: "preload" as const };
		}

		const unloadedJob = pendingJobs.find((job) => !job.loaded);
		if (unloadedJob) return { job: unloadedJob, type: "preload" as const };

		const now = performance.now();
		const backgroundJob = pendingJobs.find((job) => job.backgroundMountAt <= now);
		if (backgroundJob) return { job: backgroundJob, type: "mount" as const };

		return undefined;
	}

	function scheduleIdle(callback: () => void) {
		if ("requestIdleCallback" in window) {
			const id = window.requestIdleCallback(callback, { timeout: IDLE_TIMEOUT });
			return () => window.cancelIdleCallback(id);
		}

		const id = globalThis.setTimeout(callback, IDLE_TIMEOUT);
		return () => globalThis.clearTimeout(id);
	}

	function schedule() {
		if (running || scheduled) return;

		const pendingJobs = getPendingJobs();
		if (pendingJobs.length === 0) return;

		const priorityJob = pendingJobs.find((job) => job.priority);
		if (priorityJob) {
			const id = window.setTimeout(runNextOperation);
			scheduled = () => window.clearTimeout(id);
			return;
		}

		if (pendingJobs.some((job) => !job.loaded)) {
			scheduled = scheduleIdle(runNextOperation);
			return;
		}

		const nextMountAt = Math.min(...pendingJobs.map((job) => job.backgroundMountAt));
		const delay = Math.max(0, nextMountAt - performance.now());
		const id = window.setTimeout(() => {
			scheduled = scheduleIdle(runNextOperation);
		}, delay);
		scheduled = () => window.clearTimeout(id);
	}

	async function runNextOperation() {
		scheduled = undefined;
		if (running) return;

		const operation = getNextOperation();
		if (!operation) {
			schedule();
			return;
		}

		running = true;
		const { job, type } = operation;

		try {
			if (type === "preload") {
				await job.preload();
				job.loaded = true;
			} else if (!job.cancelled) {
				job.mount();
				job.mounted = true;
				job.priority = false;
			}
		} catch {
			job.failed = true;
			if (!job.cancelled) job.onError();
		}

		// Let the browser paint each completed operation before starting another one.
		requestAnimationFrame(() => {
			running = false;
			schedule();
		});
	}

	return {
		register<T>(load: () => Promise<T>, mount: (module: T) => void, onError: () => void) {
			let loadedModule: T;
			const job: Job = {
				backgroundMountAt: performance.now() + BACKGROUND_MOUNT_INTERVAL * (jobs.length + 1),
				cancelled: false,
				failed: false,
				loaded: false,
				mounted: false,
				preload: async () => {
					loadedModule = await load();
				},
				mount: () => mount(loadedModule),
				onError,
				priority: false
			};

			jobs.push(job);
			schedule();

			return {
				prioritize() {
					if (job.cancelled || job.failed || job.mounted) return;
					job.priority = true;
					clearScheduled();
					schedule();
				},
				cancel() {
					job.cancelled = true;
					clearScheduled();
					schedule();
				}
			};
		}
	};
}
