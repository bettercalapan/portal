<script lang="ts">
	import { AreaChart, defaultChartPadding, type ChartResizeDetail } from "layerchart";

	let { interactive = true }: { interactive?: boolean } = $props();

	const populationGrowth = [
		{ year: 2020, population: 146_000 },
		{ year: 2021, population: 147_100 },
		{ year: 2022, population: 148_200 },
		{ year: 2023, population: 149_400 },
		{ year: 2024, population: 150_700 },
		{ year: 2025, population: 151_900 },
		{ year: 2026, population: 153_100 },
		{ year: 2027, population: 154_300 },
		{ year: 2028, population: 155_500 },
		{ year: 2029, population: 156_700 },
		{ year: 2030, population: 157_900 }
	] as const;
	const compactPopulationGrowth = populationGrowth.filter((_, index) => index % 2 === 0);

	let compactChart = $state(false);

	const formatYear = (value: number) => String(value);
	const formatPopulation = (value: number) => value.toLocaleString("en-US");
	const formatPopulationTick = (value: number) => `${value / 1_000}k`;
	const populationTicks = [140_000, 145_000, 150_000, 155_000, 160_000];
	const gridLineStyle = {
		stroke: "var(--fg-alt)",
		strokeWidth: 1.5,
		dashArray: [2, 6],
		opacity: 0.9
	};
	const axisRuleStyle = {
		stroke: "var(--fg-alt)",
		strokeWidth: 2,
		opacity: 0.65
	};

	function handleChartResize({ containerWidth }: ChartResizeDetail) {
		compactChart = containerWidth < 520;
	}
</script>

<figure class="chart-card">
	<AreaChart
		data={populationGrowth}
		x="year"
		y="population"
		xDomain={[2020, 2030]}
		yDomain={[140_000, 160_000]}
		yBaseline={140_000}
		series={[
			{
				key: "population",
				label: "Population",
				value: "population",
				color: "var(--accent)"
			}
		]}
		grid={{
			y: gridLineStyle,
			yTicks: populationTicks.slice(1)
		}}
		highlight={interactive
			? {
					axis: "x",
					lines: {
						stroke: "var(--accent)",
						strokeWidth: 1.5,
						dashArray: [2, 6]
					},
					points: {
						stroke: "var(--accent)",
						strokeWidth: 7
					}
				}
			: false}
		tooltipContext={interactive}
		points={{
			data: compactChart ? compactPopulationGrowth : populationGrowth,
			r: compactChart ? 4 : 6,
			strokeWidth: compactChart ? 2 : 3,
			stroke: "var(--neutral-1)"
		}}
		padding={defaultChartPadding({ top: 16, right: 16, bottom: 36, left: 40 })}
		height={320}
		onResize={handleChartResize}
		role="img"
		aria-label="Calapan City population growth from 146,000 people in 2020 to 157,900 people in 2030"
		props={{
			area: { fillOpacity: 0.18 },
			line: { strokeWidth: 3 },
			xAxis: {
				format: formatYear,
				ticks: (compactChart ? compactPopulationGrowth : populationGrowth).map(({ year }) => year),
				rule: axisRuleStyle,
				tickLabelProps: { dy: 10 },
				classes: { tickLabel: "growth-axis-label" }
			},
			yAxis: {
				format: formatPopulationTick,
				ticks: populationTicks,
				rule: axisRuleStyle,
				tickLabelProps: { dx: -10 },
				classes: { tickLabel: "growth-axis-label" }
			},
			tooltip: {
				root: {
					variant: "none",
					class: "growth-tooltip"
				},
				header: {
					format: formatYear,
					class: "growth-tooltip-header"
				},
				list: { class: "growth-tooltip-list" },
				item: {
					format: formatPopulation,
					classes: {
						label: "growth-tooltip-label",
						value: "growth-tooltip-value",
						color: "growth-tooltip-dot"
					}
				}
			}
		}}
	/>
</figure>

<style>
	.chart-card {
		margin-top: 0.5rem;
		padding: 1.25rem 1rem 1rem;
		background-color: var(--neutral-1);
		border-radius: 2rem;
		overflow: hidden;

		:global(.growth-axis-label) {
			fill: var(--fg-alt);
			font-family: inherit;
			font-size: 0.75rem;
			font-weight: 500;
			stroke: none;
		}
	}

	:global(.growth-tooltip) {
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

	:global(.growth-tooltip-header) {
		margin-bottom: 0.25rem;
		padding-bottom: 0;
		border-bottom: 0;
		font-size: 0.875rem;
	}

	:global(.growth-tooltip-list) {
		column-gap: 0.75rem;
	}

	:global(.growth-tooltip-label) {
		color: var(--fg-alt);
	}

	:global(.growth-tooltip-value) {
		font-weight: 600;
	}

	:global(.growth-tooltip-dot) {
		width: 0.5rem;
		height: 0.5rem;
	}

	@media (min-width: 900px) {
		.chart-card {
			padding: 1.5rem 1.5rem 1rem;
		}
	}
</style>
