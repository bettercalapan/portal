<script lang="ts">
	import { curveMonotoneX } from "d3-shape";
	import {
		LineChart,
		defaultChartPadding,
		type ChartResizeDetail,
		type ChartState
	} from "layerchart";

	let { interactive = true }: { interactive?: boolean } = $props();

	type CompetitivenessDatum = {
		year: number;
		peaceAndOrder: number;
		socialProtection: number | null;
		education: number;
		health: number;
		lguInvestment: number;
	};

	const STORAGE_KEY = "bettercalapan:competitiveness:selected-series";
	const seriesKeys = ["peaceAndOrder", "socialProtection", "education", "health", "lguInvestment"];
	const competitiveness: CompetitivenessDatum[] = [
		{
			year: 2014,
			peaceAndOrder: 0.4033,
			socialProtection: null,
			education: 0.2067,
			health: 0.0457,
			lguInvestment: 0.7377
		},
		{
			year: 2015,
			peaceAndOrder: 0.4069,
			socialProtection: null,
			education: 0.6905,
			health: 0.3574,
			lguInvestment: 3.3333
		},
		{
			year: 2016,
			peaceAndOrder: 0.6475,
			socialProtection: 0.203,
			education: 0.4699,
			health: 0.1608,
			lguInvestment: 0
		},
		{
			year: 2017,
			peaceAndOrder: 0.2938,
			socialProtection: 0.5995,
			education: 0.5063,
			health: 1.3303,
			lguInvestment: 0.4404
		},
		{
			year: 2018,
			peaceAndOrder: 0.0901,
			socialProtection: 1.5266,
			education: 0.5595,
			health: 1.208,
			lguInvestment: 0.4002
		},
		{
			year: 2019,
			peaceAndOrder: 0.0813,
			socialProtection: 0.5655,
			education: 0.6216,
			health: 0.757,
			lguInvestment: 0.2769
		},
		{
			year: 2020,
			peaceAndOrder: 0.1315,
			socialProtection: 0.5084,
			education: 0.4393,
			health: 0.6768,
			lguInvestment: 0.4039
		},
		{
			year: 2021,
			peaceAndOrder: 0.2676,
			socialProtection: 0.5014,
			education: 0.5528,
			health: 0.7168,
			lguInvestment: 0.1135
		},
		{
			year: 2022,
			peaceAndOrder: 1.3894,
			socialProtection: 0.8597,
			education: 0.5166,
			health: 0.7745,
			lguInvestment: 0.0038
		},
		{
			year: 2023,
			peaceAndOrder: 0.8482,
			socialProtection: 0.4799,
			education: 0.4301,
			health: 0.7228,
			lguInvestment: 0.6787
		},
		{
			year: 2024,
			peaceAndOrder: 0.5984,
			socialProtection: 1.5508,
			education: 0.5068,
			health: 0.8354,
			lguInvestment: 0.4042
		}
	];
	const compactYearTicks = competitiveness
		.filter((_, index) => index % 2 === 0)
		.map(({ year }) => year);
	const yearTicks = competitiveness.map(({ year }) => year);
	const scoreTicks = [0, 0.5, 1, 1.5, 2, 2.5, 3, 3.5];
	const gridLineStyle = {
		stroke: "var(--fg-alt)",
		strokeWidth: 1.5,
		dashArray: [2, 6],
		opacity: 0.35
	};
	const axisRuleStyle = {
		stroke: "var(--fg-alt)",
		strokeWidth: 2,
		opacity: 0.65
	};

	let compactChart = $state(false);
	let context = $state<ChartState<CompetitivenessDatum>>();
	let selectionLoaded = $state(false);

	const formatYear = (value: number) => String(value);
	const formatScore = (value: number | null) =>
		value === null ? "Not available" : value.toFixed(4);
	const formatScoreTick = (value: number) => value.toFixed(value % 1 === 0 ? 0 : 1);

	function handleChartResize({ containerWidth }: ChartResizeDetail) {
		compactChart = containerWidth < 520;
	}

	$effect(() => {
		if (selectionLoaded || !context?.isMounted) return;

		const savedSelection = localStorage.getItem(STORAGE_KEY);
		if (savedSelection) {
			try {
				const selectedKeys: unknown = JSON.parse(savedSelection);
				if (Array.isArray(selectedKeys)) {
					context.series.selectedKeys.current = selectedKeys.filter(
						(key): key is string => typeof key === "string" && seriesKeys.includes(key)
					);
				}
			} catch {
				localStorage.removeItem(STORAGE_KEY);
			}
		}

		selectionLoaded = true;
	});

	$effect(() => {
		const selectedKeys = context?.series.selectedKeys.current;
		if (selectionLoaded && selectedKeys) {
			localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedKeys));
		}
	});
</script>

<figure class="chart-card">
	<LineChart
		bind:context
		data={competitiveness}
		x="year"
		xDomain={[2014, 2024]}
		yDomain={[0, 3.5]}
		series={[
			{
				key: "peaceAndOrder",
				label: "Peace and Order",
				value: "peaceAndOrder",
				color: "var(--chart-blue)"
			},
			{
				key: "socialProtection",
				label: "Social Protection",
				value: "socialProtection",
				color: "var(--chart-purple)"
			},
			{
				key: "education",
				label: "Education",
				value: "education",
				color: "var(--chart-yellow)"
			},
			{
				key: "health",
				label: "Health",
				value: "health",
				color: "var(--chart-green)"
			},
			{
				key: "lguInvestment",
				label: "LGU Investment",
				value: "lguInvestment",
				color: "var(--accent)"
			}
		]}
		grid={{
			y: gridLineStyle,
			yTicks: scoreTicks.slice(1)
		}}
		highlight={interactive
			? {
					axis: "x",
					lines: {
						stroke: "var(--fg-alt)",
						strokeWidth: 1.5,
						dashArray: [2, 6]
					},
					points: {
						class: "competitiveness-highlight-point",
						stroke: "var(--neutral-1)",
						strokeWidth: compactChart ? 3 : 4
					}
				}
			: false}
		tooltipContext={interactive}
		padding={defaultChartPadding({
			legend: true,
			top: 16,
			right: 16,
			bottom: compactChart ? 52 : 36,
			left: 40
		})}
		height={compactChart ? 400 : 420}
		onResize={handleChartResize}
		legend
		role="img"
		aria-label="Calapan City competitiveness indicator scores for Peace and Order, Social Protection, Education, Health, and LGU Investment from 2014 to 2024"
		props={{
			legend: {
				classes: {
					root: "competitiveness-legend",
					items: "competitiveness-legend-items",
					item: "competitiveness-legend-item"
				}
			},
			spline: {
				curve: curveMonotoneX,
				strokeWidth: compactChart ? 2.5 : 3
			},
			xAxis: {
				format: formatYear,
				ticks: compactChart ? compactYearTicks : yearTicks,
				rule: axisRuleStyle,
				tickLabelProps: { dy: 10 },
				classes: { tickLabel: "competitiveness-axis-label" }
			},
			yAxis: {
				format: formatScoreTick,
				ticks: scoreTicks,
				rule: axisRuleStyle,
				tickLabelProps: { dx: -10 },
				classes: { tickLabel: "competitiveness-axis-label" }
			},
			tooltip: {
				root: {
					variant: "none",
					class: "competitiveness-tooltip"
				},
				header: {
					format: formatYear,
					class: "competitiveness-tooltip-header"
				},
				list: { class: "competitiveness-tooltip-list" },
				item: {
					format: formatScore,
					classes: {
						label: "competitiveness-tooltip-label",
						value: "competitiveness-tooltip-value",
						color: "competitiveness-tooltip-dot"
					}
				}
			}
		}}
	/>
	<figcaption>Select indicators in the legend to show or hide them.</figcaption>
</figure>

<style>
	.chart-card {
		margin-top: 0.5rem;
		padding: 1.25rem 1rem 1rem;
		background-color: var(--neutral-1);
		border-radius: 2rem;
		overflow: hidden;

		:global(.competitiveness-axis-label) {
			fill: var(--fg-alt);
			font-family: inherit;
			font-size: 0.75rem;
			font-weight: 500;
			stroke: none;
		}
	}

	figcaption {
		padding-bottom: 0.75rem;
		margin-top: 0.5rem;
		color: var(--fg);
		font-size: 0.75rem;
		text-align: center;
	}

	:global(.competitiveness-legend) {
		width: 100%;
		max-width: 100%;
		padding-inline: 0.5rem;
	}

	:global(.competitiveness-legend-items) {
		flex-wrap: wrap;
		justify-content: center;
	}

	:global(.competitiveness-legend-item) {
		padding: 0;
		border: 0;
		appearance: none;
		background: transparent;
		box-shadow: none;
		color: inherit;
		font: inherit;
	}

	:global(.competitiveness-legend-item:focus-visible) {
		border-radius: 0.25rem;
		outline: 2px solid var(--fg-alt);
		outline-offset: 3px;
	}

	:global(.competitiveness-highlight-point) {
		filter: none;
	}

	:global(.competitiveness-tooltip) {
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

	:global(.competitiveness-tooltip-header) {
		margin-bottom: 0.25rem;
		padding-bottom: 0;
		border-bottom: 0;
		font-size: 0.875rem;
	}

	:global(.competitiveness-tooltip-list) {
		column-gap: 0.75rem;
	}

	:global(.competitiveness-tooltip-label) {
		color: var(--fg-alt);
	}

	:global(.competitiveness-tooltip-value) {
		font-weight: 600;
		font-variant-numeric: tabular-nums;
	}

	:global(.competitiveness-tooltip-dot) {
		width: 0.5rem;
		height: 0.5rem;
	}

	@media (min-width: 900px) {
		.chart-card {
			padding: 1.5rem 1.5rem 1rem;
		}
	}
</style>
