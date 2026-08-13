<script lang="ts">
	import { BarChart, type ChartResizeDetail } from "layerchart";
	import { currentPopulation, populationDistribution } from "$lib/data/statistics.data";

	let { interactive = true }: { interactive?: boolean } = $props();

	const cityPopulation = currentPopulation;
	const populationDomainMax = 7_000;
	const populationTicks = [0, 2_000, 4_000, 6_000];
	const barangayPopulationTotal = populationDistribution.reduce(
		(total, barangay) => total + barangay.population,
		0
	);

	let compactChart = $state(false);
	const chartHeight = $derived(populationDistribution.length * (compactChart ? 28 : 30) + 24);

	const formatBarangay = (value: string) => value;
	const formatPopulation = (value: number) => value.toLocaleString("en-US");
	const gridLineStyle = {
		stroke: "var(--fg-secondary)",
		strokeWidth: 1.5,
		dashArray: [2, 6],
		opacity: 0.35
	};

	function handleChartResize({ containerWidth }: ChartResizeDetail) {
		compactChart = containerWidth < 520;
	}
</script>

<figure class="chart-card">
	<BarChart
		data={populationDistribution}
		x="population"
		y="barangay"
		xDomain={[0, populationDomainMax]}
		orientation="horizontal"
		series={[
			{
				key: "population",
				label: "Population",
				value: "population",
				color: "var(--accent)"
			}
		]}
		bandPadding={0.4}
		grid={{
			x: gridLineStyle,
			xTicks: populationTicks
		}}
		labels={{
			value: "population",
			placement: "outside",
			offset: compactChart ? 5 : 6,
			format: formatPopulation,
			fill: "var(--fg)",
			class: "distribution-value-label"
		}}
		axis="y"
		rule={false}
		highlight={interactive ? { axis: "y" } : false}
		tooltipContext={interactive}
		padding={{
			top: 8,
			right: 32,
			bottom: 8,
			left: compactChart ? 116 : 124
		}}
		height={chartHeight}
		onResize={handleChartResize}
		role="img"
		tabindex={0}
		aria-label={`Population distribution across ${populationDistribution.length} Calapan City barangays, totaling ${formatPopulation(barangayPopulationTotal)} of the city's ${formatPopulation(cityPopulation)} residents, ordered from highest to lowest`}
		props={{
			bars: {
				radius: compactChart ? 4 : 5,
				strokeWidth: 0
			},
			yAxis: {
				format: formatBarangay,
				ticks: populationDistribution.map(({ barangay }) => barangay),
				rule: false,
				tickLength: 0,
				tickMarks: false,
				tickLabelProps: {
					dx: compactChart ? -6 : -8,
					dy: 2
				},
				classes: { tickLabel: "distribution-barangay-label" }
			},
			tooltip: {
				root: {
					variant: "none",
					class: "distribution-tooltip"
				},
				header: {
					format: formatBarangay,
					class: "distribution-tooltip-header"
				},
				list: { class: "distribution-tooltip-list" },
				item: {
					format: formatPopulation,
					classes: {
						label: "distribution-tooltip-label",
						value: "distribution-tooltip-value",
						color: "distribution-tooltip-dot"
					}
				}
			}
		}}
	/>
</figure>

<style>
	.chart-card {
		margin-top: 0.5rem;
		max-height: 400px;
		padding: 1.25rem 1rem 1rem;
		background-color: var(--neutral-light);
		border-radius: 2rem;
		overflow: hidden;
		overflow-y: scroll;
		scrollbar-color: var(--gray) var(--neutral-light);

		:global(.distribution-barangay-label),
		:global(.distribution-value-label) {
			fill: var(--fg);
			font-family: inherit;
			font-size: 0.6875rem;
			font-weight: 600;
			stroke: none;
		}

		:global(.distribution-value-label) {
			font-variant-numeric: tabular-nums;
		}

		:global(.lc-root-container:focus-visible) {
			outline: 2px solid var(--accent);
			outline-offset: 2px;
		}
	}

	:global(.distribution-tooltip) {
		padding: 0.625rem 0.75rem;
		border: 1px solid var(--neutral-2);
		border-radius: 0.75rem;
		background-color: var(--bg);
		box-shadow: 0 0.25rem 1rem rgb(0 0 0 / 12%);
		color: var(--fg);
		font-family: inherit;
		font-size: 0.75rem;
		line-height: 1.25;
	}

	:global(.distribution-tooltip-header) {
		margin-bottom: 0.25rem;
		padding-bottom: 0;
		border-bottom: 0;
		font-size: 0.875rem;
	}

	:global(.distribution-tooltip-list) {
		column-gap: 0.75rem;
	}

	:global(.distribution-tooltip-label) {
		color: var(--fg-secondary);
	}

	:global(.distribution-tooltip-value) {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	:global(.distribution-tooltip-dot) {
		width: 0.5rem;
		height: 0.5rem;
	}

	@media (min-width: 520px) {
		.chart-card {
			:global(.distribution-barangay-label),
			:global(.distribution-value-label) {
				font-size: 0.75rem;
			}
		}
	}

	@media (min-width: 900px) {
		.chart-card {
			padding: 1.5rem 1.5rem 1rem;
			border-radius: 2rem 0 0 2rem;
		}
	}
</style>
