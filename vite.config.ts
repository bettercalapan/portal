import { defineConfig } from "vitest/config";
import { playwright } from "@vitest/browser-playwright";
import adapter from "@sveltejs/adapter-cloudflare";
import { sveltekit } from "@sveltejs/kit/vite";
import { mdsvex } from "mdsvex";
import { fileURLToPath } from "node:url";
import rehypeSlug from "rehype-slug";

const contentLayout = fileURLToPath(
	new URL("./src/lib/components/macro/content-layout.svelte", import.meta.url)
);

export default defineConfig({
	plugins: [
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.endsWith(".svx")
						? false
						: filename.split(/[/\\]/).includes("node_modules")
							? undefined
							: true
			},
			extensions: [".svelte", ".svx"],
			serviceWorker: {
				register: true,
				files: (file) =>
					(file === "manifest.webmanifest" || file.startsWith("pwa/")) &&
					file !== "pwa/offline.html"
			},
			preprocess: [
				mdsvex({
					layout: { content: contentLayout },
					rehypePlugins: [rehypeSlug]
				}),
				// mdsvex emits `<script context="module">`, which Svelte 5 complains about.
				// See this reference to a workaround.
				// https://github.com/pngwn/MDsveX/issues/649#issuecomment-5199404294
				{
					name: "mdsvex-script-module-fix",
					markup: ({ content, filename }) => {
						if (!filename?.endsWith(".svx")) return;
						return { code: content.replace('<script context="module">', "<script module>") };
					}
				}
			],
			adapter: adapter()
		})
	],
	test: {
		expect: { requireAssertions: true },
		projects: [
			{
				extends: "./vite.config.ts",
				test: {
					name: "client",
					browser: {
						enabled: true,
						provider: playwright(),
						instances: [{ browser: "chromium", headless: true }]
					},
					include: ["src/**/*.svelte.{test,spec}.{js,ts}"],
					exclude: ["src/lib/server/**"]
				}
			},

			{
				extends: "./vite.config.ts",
				test: {
					name: "server",
					environment: "node",
					include: ["src/**/*.{test,spec}.{js,ts}", "scripts/**/*.{test,spec}.{js,mjs,ts}"],
					exclude: ["src/**/*.svelte.{test,spec}.{js,ts}"]
				}
			}
		]
	}
});
