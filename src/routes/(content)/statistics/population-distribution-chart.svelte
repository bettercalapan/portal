<script lang="ts">
	import { BarChart, type ChartResizeDetail } from "layerchart";

	let { interactive = true }: { interactive?: boolean } = $props();

	const cityPopulation = 148_558;
	const populationDomainMax = 7_000;
	const populationTicks = [0, 2_000, 4_000, 6_000];
	const barangays = [
		{ barangay: "Balingayan", population: 1_633 },
		{ barangay: "Balite", population: 4_586 },
		{ barangay: "Baruyan", population: 3_112 },
		{ barangay: "Batino", population: 1_669 },
		{ barangay: "Bayanan I", population: 1_101 },
		{ barangay: "Bayanan II", population: 3_057 },
		{ barangay: "Biga", population: 2_383 },
		{ barangay: "Bondoc", population: 729 },
		{ barangay: "Bucayao", population: 2_617 },
		{ barangay: "Buhuan", population: 829 },
		{ barangay: "Bulusan", population: 6_145 },
		{ barangay: "Sta. Rita", population: 1_824 },
		{ barangay: "Calero", population: 1_427 },
		{ barangay: "Camansihan", population: 2_418 },
		{ barangay: "Camilmil", population: 3_938 },
		{ barangay: "Canubing I", population: 3_962 },
		{ barangay: "Canubing II", population: 3_819 },
		{ barangay: "Comunal", population: 3_297 },
		{ barangay: "Guinobatan", population: 4_444 },
		{ barangay: "Gulod", population: 884 },
		{ barangay: "Gutad", population: 1_830 },
		{ barangay: "Ibaba East", population: 988 },
		{ barangay: "Ibaba West", population: 2_616 },
		{ barangay: "Ilaya", population: 3_957 },
		{ barangay: "Lalud", population: 4_131 },
		{ barangay: "Lazareto", population: 4_916 },
		{ barangay: "Libis", population: 1_366 },
		{ barangay: "Lumangbayan", population: 5_210 },
		{ barangay: "Mahal Na Pangalan", population: 1_661 },
		{ barangay: "Maidlang", population: 1_212 },
		{ barangay: "Malad", population: 959 },
		{ barangay: "Malamig", population: 2_247 },
		{ barangay: "Managpi", population: 2_914 },
		{ barangay: "Masipit", population: 3_060 },
		{ barangay: "Nag-Iba I", population: 1_011 },
		{ barangay: "Navotas", population: 560 },
		{ barangay: "Pachoca", population: 4_042 },
		{ barangay: "Palhi", population: 3_379 },
		{ barangay: "Panggalaan", population: 586 },
		{ barangay: "Parang", population: 3_353 },
		{ barangay: "Patas", population: 926 },
		{ barangay: "Personas", population: 1_871 },
		{ barangay: "Puting Tubig", population: 1_536 },
		{ barangay: "Salong", population: 4_062 },
		{ barangay: "San Antonio", population: 3_586 },
		{ barangay: "San Vicente Central", population: 285 },
		{ barangay: "San Vicente East", population: 998 },
		{ barangay: "San Vicente North", population: 587 },
		{ barangay: "San Vicente South", population: 448 },
		{ barangay: "San Vicente West", population: 598 },
		{ barangay: "Sta. Cruz", population: 842 },
		{ barangay: "Sta. Isabel", population: 4_588 },
		{ barangay: "Sto. Niño", population: 3_722 },
		{ barangay: "Sapul", population: 4_557 },
		{ barangay: "Silonay", population: 1_551 },
		{ barangay: "Sta. Maria Village", population: 1_045 },
		{ barangay: "Suqui", population: 4_475 },
		{ barangay: "Tawagan", population: 1_375 },
		{ barangay: "Tawiran", population: 2_517 },
		{ barangay: "Tibag", population: 2_441 },
		{ barangay: "Wawa", population: 848 },
		{ barangay: "Nag-Iba II", population: 1_828 }
	] as const;
	const populationDistribution = [...barangays].sort((a, b) => b.population - a.population);
	const barangayPopulationTotal = barangays.reduce(
		(total, barangay) => total + barangay.population,
		0
	);

	let compactChart = $state(false);
	const chartHeight = $derived(populationDistribution.length * (compactChart ? 28 : 30) + 24);

	const formatBarangay = (value: string) => value;
	const formatPopulation = (value: number) => value.toLocaleString("en-US");
	const gridLineStyle = {
		stroke: "var(--fg-alt)",
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
		background-color: var(--neutral-1);
		border-radius: 2rem;
		overflow: hidden;
		overflow-y: scroll;
		scrollbar-color: var(--gray) var(--neutral-1);

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
		color: var(--fg-alt);
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
