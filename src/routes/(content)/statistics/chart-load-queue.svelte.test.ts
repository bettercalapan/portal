import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createChartLoadQueue } from "./chart-load-queue";

beforeEach(() => {
	vi.useFakeTimers();
	vi.stubGlobal(
		"requestIdleCallback",
		vi.fn((callback: IdleRequestCallback) =>
			window.setTimeout(() => callback({ didTimeout: false, timeRemaining: () => 50 }), 0)
		)
	);
	vi.stubGlobal(
		"cancelIdleCallback",
		vi.fn((id: number) => window.clearTimeout(id))
	);
});

afterEach(() => {
	vi.unstubAllGlobals();
	vi.useRealTimers();
});

describe("chart load queue", () => {
	it("preloads sequentially and mounts offscreen charts over time", async () => {
		const events: string[] = [];
		const queue = createChartLoadQueue();

		for (const chart of ["growth", "distribution", "competitiveness"]) {
			queue.register(
				async () => {
					events.push(`load:${chart}`);
					return chart;
				},
				() => events.push(`mount:${chart}`),
				() => events.push(`error:${chart}`)
			);
		}

		await vi.advanceTimersByTimeAsync(100);
		expect(events).toEqual(["load:growth", "load:distribution", "load:competitiveness"]);

		await vi.advanceTimersByTimeAsync(6_000);
		expect(events).toContain("mount:growth");
		expect(events).not.toContain("mount:distribution");

		await vi.advanceTimersByTimeAsync(12_000);
		expect(events).toEqual([
			"load:growth",
			"load:distribution",
			"load:competitiveness",
			"mount:growth",
			"mount:distribution",
			"mount:competitiveness"
		]);
	});

	it("promotes an approaching chart ahead of background mounts", async () => {
		const mounted: string[] = [];
		const queue = createChartLoadQueue();
		const registrations = ["growth", "distribution", "competitiveness"].map((chart) =>
			queue.register(
				async () => chart,
				() => mounted.push(chart),
				vi.fn()
			)
		);

		await vi.advanceTimersByTimeAsync(100);
		registrations[2].prioritize();
		await vi.advanceTimersByTimeAsync(100);

		expect(mounted).toEqual(["competitiveness"]);
	});
});
