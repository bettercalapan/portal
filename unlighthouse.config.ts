import { defineUnlighthouseConfig } from "unlighthouse/config";

const isDesktop = process.env.UNLIGHTHOUSE_DEVICE === "desktop";
const budget = isDesktop ? 70 : 90;

export default defineUnlighthouseConfig({
	site: "http://localhost:4173",
	outputPath: isDesktop ? ".unlighthouse/desktop" : ".unlighthouse/mobile",
	cache: false,
	urls: [
		"/",
		"/accessibility",
		"/contact",
		"/government",
		"/government/barangays",
		"/government/departments",
		"/government/officials",
		"/privacy-policy",
		"/search",
		"/services",
		"/services/business",
		"/services/business/business-permit",
		"/services/business/business-status-certificate",
		"/services/business/ctc-business-license",
		"/services/business/occupational-permit",
		"/services/business/safety-seal-certificate",
		"/services/business/special-permit",
		"/services/certificates",
		"/services/certificates/barangay-clearance",
		"/services/certificates/barangay-id",
		"/services/certificates/birth-certificate",
		"/services/certificates/death-certificate",
		"/services/certificates/drivers-license",
		"/services/certificates/marriage-certificate",
		"/services/certificates/police-clearance",
		"/sitemap",
		"/statistics",
		"/terms-of-use"
	],
	scanner: {
		device: isDesktop ? "desktop" : "mobile",
		samples: 3,
		throttle: true
	},
	ci: {
		budget: {
			performance: budget,
			accessibility: budget,
			"best-practices": budget,
			seo: budget
		},
		buildStatic: true
	}
});
