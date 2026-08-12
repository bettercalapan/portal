import type { DataSource } from "$lib/types/source.types";

export const populationSource = {
	sources: [
		{
			name: "PSA 2024 POPCEN",
			url: "https://rssomimaropa.psa.gov.ph/content/2024-census-population-popcen-city-calapan-oriental-mindoro"
		}
	],
	lastVerified: "2026-08-12",
	asOf: "1 July 2024",
	methodology:
		"Official census population counts; values between census years are not interpolated."
} as const satisfies DataSource;

export const cityIncomeSource = {
	sources: [
		{
			name: "BLGF",
			url: "https://blgf.gov.ph/lgu-fiscal-data/"
		}
	],
	lastVerified: "2026-08-12",
	methodology: "NTA dependency is the National Tax Allotment divided by annual income."
} as const satisfies DataSource;

export const competitivenessSource = {
	sources: [
		{
			name: "CMCI",
			url: "https://cmci.dti.gov.ph/"
		}
	],
	lastVerified: "2026-08-12",
	asOf: "2014-2024 editions",
	methodology: "Annual CMCI indicator scores as published in the DTI data portal."
} as const satisfies DataSource;

export const currentPopulation = 148_558;

export const populationGrowth = [
	{ year: 2020, population: 145_786 },
	{ year: 2024, population: currentPopulation }
] as const;

export const barangayPopulation = [
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
	{ barangay: "Mahal na Pangalan", population: 1_661 },
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

export type CompetitivenessDatum = {
	year: number;
	peaceAndOrder: number;
	socialProtection: number | null;
	education: number;
	health: number;
	lguInvestment: number;
};

export const competitiveness: CompetitivenessDatum[] = [
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
