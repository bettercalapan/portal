import type { Link } from "$lib/types/link.types";

const governmentPrefix = "/(content)/government";
export const government: {
	heading: string;
	description: string;
	data: Link[];
} = {
	heading: "Government",
	description:
		"See information on elected officials, municipal departments, and the 62 barangays of Calapan.",
	data: [
		{
			name: "Officials",
			url: `${governmentPrefix}/officials`
		},
		{
			name: "Departments",
			url: `${governmentPrefix}/departments`
		},
		{
			name: "Barangays",
			url: `${governmentPrefix}/barangays`
		}
	]
};

export const officials = {
	heading: "Officials",
	description:
		"The elected officials of Calapan in the local executive branch and local legislative branch.",
	source: {
		description: "Source from",
		linkLabel: "Rappler",
		linkURL: "https://ph.rappler.com/elections/2025/local-race/oriental-mindoro/calapan-city"
	}
};

export const executive = [
	{
		title: "Mayor",
		name: "Doy C. Leachon",
		email: "lgu.calapancity@gmail.com",
		phoneNumber: "(043) 288-7508",
		workingHours: "Mon-Fri: 8:00 AM - 5:00 PM"
	},
	{
		title: "Vice Mayor",
		name: 'Rommel "Bim" Aquino Ignacio',
		email: "lgu.calapancity@gmail.com",
		phoneNumber: "(043) 288-7508",
		workingHours: "Mon-Fri: 8:00 AM - 5:00 PM"
	}
];

export const legislative = [
	{
		title: "City Councilor",
		name: "Atty. Bel Tanyag-Panaligan",
		description: "Laws & Rules"
	},
	{
		title: "City Councilor",
		name: "Rius Agua",
		description: "Education"
	},
	{
		title: "City Councilor",
		name: "Mylene De Jesus",
		description: "Health & Sanitation"
	},
	{
		title: "City Councilor",
		name: "Rap Infantado",
		description: "Commerce & Industry"
	},
	{
		title: "City Councilor",
		name: "Joseph Umali",
		description: "Agriculture"
	},
	{
		title: "City Councilor",
		name: "Genie Fortu",
		description: "Fisheries"
	},
	{
		title: "City Councilor",
		name: "Jun Cabailo",
		description: "Tourism"
	},
	{
		title: "City Councilor",
		name: "Atty. Ricka Plata Goco",
		description: "Human Rights"
	},
	{
		title: "City Councilor",
		name: "RC Concepcion",
		description: "Economic Enterprises"
	},
	{
		title: "City Councilor",
		name: "Atty. Jel Magsuci",
		description: "Women & Family"
	}
];

export const departments = {
	heading: "Departments",
	description: "Municipal offices providing services to citizens.",
	source: {
		description: "Source from the official",
		linkLabel: "website",
		linkURL: "https://cityofcalapan.gov.ph"
	},
	data: [
		"City Economic Enterprise Department (CEED)",
		"City Public Library",
		"City Housing and Urban Settlements Department (CHUSD)",
		"City Environment and Natural Resources Department (CENRD)",
		"City Disaster Risk Reduction Management Department (CDRRM)",
		"City Public Safety Department (CPSD)",
		"City Trade and Industry Department (CTID)",
		"City Treasury Department (CTD)",
		"City Nutrition Office",
		"Business Permit and Licensing Office (BPLO)",
		"City Assessor’s Department (CAD)",
		"City General Services Department (CGSO)",
		"City Veterinary Services Department (CVSD)",
		"City Population Development Office",
		"City Health and Sanitation Department (CHSD)",
		"City Socialized Medical Health Care Office",
		"City Human Resource Management Department (CHRMD)",
		"City Accounting and Internal Audit Department (CAIAD)",
		"City Budget Department (CBD)",
		"City Legal Department (CLD)",
		"City Social Welfare Development Department (CSWD)",
		"City Public Employment Services Office (CPESO)",
		"Barangay Development Affairs Office",
		"City Civil Registry Department (CCRD)",
		"City Youth and Sports Development Department (CYSDD)",
		"City Education Department (CED)",
		"City Agricultural Services Department (CASD)",
		"City Cooperative Development Office (CCDO)",
		"Community Affairs Office",
		"City Engineering and Public Works Department (CEPWD)",
		"Management Information System Office (MISO)",
		"Gender and Development Office",
		"City Architectural Planning and Design Department (CAPDD)",
		"Urban Planning and Development Department (UPDD)",
		"Fisheries Management Office",
		"Office for Senior Citizen’s Affairs (OSCA)",
		"Person with Disability Affairs Office (PDAO)",
		"City Information Office (CIO)",
		"City Tourism, Culture and Arts Office (CTCAO)"
	]
};

export const barangays = {
	heading: "Barangays",
	description: "The 62 barangays serving Calapeños.",
	source: {
		description: "Source from the official",
		linkLabel: "website",
		linkURL: "https://cityofcalapan.gov.ph/barangays/"
	},
	data: [
		{
			name: "Balingayan",
			captain: "Ramil D. Evangelista",
			phoneNumber: "09356865590/09190984500"
		},
		{
			name: "Balite",
			captain: "Lalaine B. De Castro",
			phoneNumber: "09392315565/09060948218"
		},
		{
			name: "Baruyan",
			captain: "Henry L. Dris",
			phoneNumber: "09755329854"
		},
		{
			name: "Batino",
			captain: "Anthony M. De Chavez",
			phoneNumber: "09813350697"
		},
		{
			name: "Bayanan I",
			captain: "Pepito R. Villanueva",
			phoneNumber: "09634014485"
		},
		{
			name: "Bayanan II",
			captain: "Maria Virginia A. Garcia",
			phoneNumber: "09857565923"
		},
		{
			name: "Biga",
			captain: "Perla B. Masangkay",
			phoneNumber: "09660282524"
		},
		{
			name: "Bondoc",
			captain: "Jerry R. Delos Reyes",
			phoneNumber: "09770333257/09924192445"
		},
		{
			name: "Bucayao",
			captain: "Ernesto S. Culla",
			phoneNumber: "09172030399"
		},
		{
			name: "Buhuan",
			captain: "Elvira I. Dimayuga",
			phoneNumber: "09081383184/09563001713"
		},
		{
			name: "Bulusan",
			captain: "Carmelita F. Mañibo",
			phoneNumber: "09985692698"
		},
		{
			name: "Calero",
			captain: "Randy S. Ahorro",
			phoneNumber: "09988450179"
		},
		{
			name: "Camansihan",
			captain: "Jimmy B. Soriano",
			phoneNumber: "09085450371"
		},
		{
			name: "Camilmil",
			captain: "Redemcy J. Frayre",
			phoneNumber: "09705958024"
		},
		{
			name: "Canubing I",
			captain: "Emmanuel Q. Matibag",
			phoneNumber: "09494144342"
		},
		{
			name: "Canubing II",
			captain: "Rey R. Alagao",
			phoneNumber: "09357214490"
		},
		{
			name: "Comunal",
			captain: "Rolando D. Dimasacat Sr.",
			phoneNumber: "09568448892"
		},
		{
			name: "Guinobatan",
			captain: "Pedro B. Ilagan",
			phoneNumber: "09955359663"
		},
		{
			name: "Gulod",
			captain: "Menandro M. Pesig",
			phoneNumber: "09082503323"
		},
		{
			name: "Gutad",
			captain: "Francisco G. Tinio",
			phoneNumber: "09350357662"
		},
		{
			name: "Ibaba East",
			captain: "Teresita M. Zamora",
			phoneNumber: "09288906298"
		},
		{
			name: "Ibaba West",
			captain: "Donna Villa A. Abao",
			phoneNumber: "09475394513"
		},
		{
			name: "Ilaya",
			captain: "Jesusa G. Narsoles",
			phoneNumber: "09680745401/09071472952"
		},
		{
			name: "Lalud",
			captain: "Jolly L. De Chavez",
			phoneNumber: "09108716738"
		},
		{
			name: "Lazareto",
			captain: "Alma J. Lara",
			phoneNumber: "09983092521"
		},
		{
			name: "Libis",
			captain: "Dennis A. Rojas",
			phoneNumber: "09399301365"
		},
		{
			name: "Lumangbayan",
			captain: "Rowena B. Mallari",
			phoneNumber: "09917901158"
		},
		{
			name: "Mahal na Pangalan",
			captain: "Edna D. Santiago",
			phoneNumber: "09651872273"
		},
		{
			name: "Maidlang",
			captain: "Oliver Bukid",
			phoneNumber: "09301333698"
		},
		{
			name: "Malad",
			captain: "Hector E. Africa",
			phoneNumber: "09958206222"
		},
		{
			name: "Malamig",
			captain: "Norwin V. Lizardo",
			phoneNumber: "09494402710"
		},
		{
			name: "Managpi",
			captain: "Teodulo A. Macaraig",
			phoneNumber: "09550677374"
		},
		{
			name: "Masipit",
			captain: "Carlos G. Jocson",
			phoneNumber: "09502301804"
		},
		{
			name: "Nag-Iba I",
			captain: "Hipolito S. Pontivedra",
			phoneNumber: "09634026470"
		},
		{
			name: "Nag-Iba II",
			captain: "Wenie C. Wong",
			phoneNumber: "09650935751"
		},
		{
			name: "Navotas",
			captain: "Lauro A. Escarez",
			phoneNumber: "09970813546"
		},
		{
			name: "Pachoca",
			captain: "Juanito M. Alveyra",
			phoneNumber: "09127247933/09177127826"
		},
		{
			name: "Palhi",
			captain: "Maximo A. Babao",
			phoneNumber: "09122742429"
		},
		{
			name: "Panggalaan",
			captain: "Marcelo C. Belda",
			phoneNumber: "09278779173"
		},
		{
			name: "Parang",
			captain: "Emmanuel D. Cleofe",
			phoneNumber: "09278276811"
		},
		{
			name: "Patas",
			captain: "Benjamin S. Basilan",
			phoneNumber: "09859888597"
		},
		{
			name: "Personas",
			captain: "Marilyn R. De Rosales",
			phoneNumber: "09359811317/09461684610"
		},
		{
			name: "Puting Tubig",
			captain: "Lucas D. Cepillo",
			phoneNumber: "09956152471"
		},
		{
			name: "San Rafael",
			captain: "Danilo D. Espinosa",
			phoneNumber: "09298198320"
		},
		{
			name: "San Antonio",
			captain: "Baby Doris M. Corcuera",
			phoneNumber: "09498337359"
		},
		{
			name: "Sapul",
			captain: "Marcelino A. Cabral",
			phoneNumber: "09810080380"
		},
		{
			name: "San Vicente Central",
			captain: "Manuel Hezron G. Mendoza",
			phoneNumber: "09979424382"
		},
		{
			name: "San Vicente East",
			captain: "Percival A. Foja, Jr.",
			phoneNumber: "09999638839"
		},
		{
			name: "San Vicente North",
			captain: "Anacleto A. Bolor Sr.",
			phoneNumber: "09185612596"
		},
		{
			name: "San Vicente South",
			captain: "Hilario L. Acha",
			phoneNumber: "09186828724"
		},
		{
			name: "San Vicente West",
			captain: "Guillermo M. Quinto, Jr.",
			phoneNumber: "09171464959"
		},
		{
			name: "Sta. Cruz",
			captain: "Ricardo P. De Borja",
			phoneNumber: "09272026750"
		},
		{
			name: "Sta. Isabel",
			captain: "Mario G. Masangkay",
			phoneNumber: "09568938092"
		},
		{
			name: "Sta. Maria Village",
			captain: "Ave Deo Greg A. Cabrera",
			phoneNumber: "09301898000"
		},
		{
			name: "Sta. Rita",
			captain: "Raul V. Dinglasan",
			phoneNumber: "09295810056"
		},
		{
			name: "Sto. Niño",
			captain: "Eden C. Mendoza",
			phoneNumber: "09773205652/09205369057"
		},
		{
			name: "Silonay",
			captain: "Francisco C. Fortu",
			phoneNumber: "09688555013"
		},
		{
			name: "Suqui",
			captain: "Richard A. San Agustin",
			phoneNumber: "09475848489"
		},
		{
			name: "Tawagan",
			captain: "Nicanor B. Mañibo",
			phoneNumber: "09291724612/09777031726"
		},
		{
			name: "Tawiran",
			captain: "Alberto A. Yabut",
			phoneNumber: "09094418747/09171121186"
		},
		{
			name: "Tibag",
			captain: "Ferdinand M. Evora",
			phoneNumber: "09075390205"
		},
		{
			name: "Wawa",
			captain: "Maricris P. Alcuran",
			phoneNumber: "09219861110/09173268825"
		}
	]
};
