import { defineUnlighthouseConfig } from "unlighthouse/config";

const isDesktop = process.env.UNLIGHTHOUSE_DEVICE === "desktop";
const budget = isDesktop ? 70 : 90;

export default defineUnlighthouseConfig({
	site: "http://localhost:4173",
	outputPath: isDesktop ? ".unlighthouse/desktop" : ".unlighthouse/mobile",
	cache: false,
	scanner: {
		device: isDesktop ? "desktop" : "mobile",
		samples: 3,
		throttle: true,
		robotsTxt: false,
		sitemap: ["/sitemap.xml"],
		crawler: false,
		dynamicSampling: false,
		maxRoutes: false
	},
	ci: {
		budget: {
			performance: budget,
			accessibility: budget,
			"best-practices": budget,
			seo: budget
		},
		buildStatic: false,
		reporter: "jsonSimple"
	}
});
