/// <reference no-default-lib="true" />
/// <reference lib="esnext" />
/// <reference lib="webworker" />
/// <reference types="@sveltejs/kit" />

import { base, build, files, version } from "$service-worker";
import { publishedPages } from "$lib/data/site.data";

declare const self: ServiceWorkerGlobalScope;

const CACHE_PREFIX = "bettercalapan-pwa-";
const CACHE_NAME = `${CACHE_PREFIX}${version}`;
const OFFLINE_PAGE = `${base}/pwa/offline`;
const PUBLIC_ROUTES = publishedPages
	.filter((page) => page.id !== "report")
	.map((page) => `${base}${page.href}`);
const PUBLIC_ROUTE_DATA = PUBLIC_ROUTES.map(
	(route) => `${route.endsWith("/") ? route.slice(0, -1) : route}/__data.json`
);
const PRECACHE_URLS = [OFFLINE_PAGE, ...PUBLIC_ROUTES, ...PUBLIC_ROUTE_DATA, ...files, ...build];
const PRECACHE_PATHS = new Set(
	PRECACHE_URLS.map((file) => new URL(file, self.location.origin).pathname)
);
const PUBLIC_ROUTE_PATHS = new Set(
	PUBLIC_ROUTES.map((route) => new URL(route, self.location.origin).pathname)
);
const PUBLIC_ROUTE_DATA_PATHS = new Set(
	PUBLIC_ROUTE_DATA.map((route) => new URL(route, self.location.origin).pathname)
);

self.addEventListener("install", (event) => {
	event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS)));
});

self.addEventListener("activate", (event) => {
	event.waitUntil(
		caches
			.keys()
			.then((keys) =>
				Promise.all(
					keys
						.filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
						.map((key) => caches.delete(key))
				)
			)
			.then(() => self.clients.claim())
	);
});

self.addEventListener("fetch", (event) => {
	if (event.request.method !== "GET") return;

	const url = new URL(event.request.url);
	if (url.origin !== self.location.origin) return;

	if (event.request.mode === "navigate") {
		event.respondWith(
			fetch(event.request)
				.then((response) => {
					if (response.ok && PUBLIC_ROUTE_PATHS.has(url.pathname)) {
						event.waitUntil(
							caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()))
						);
					}
					return response;
				})
				.catch(async () => {
					const cached = await caches.match(event.request, { ignoreSearch: true });
					if (cached) return cached;
					return (await caches.match(OFFLINE_PAGE)) ?? Response.error();
				})
		);
		return;
	}

	if (PUBLIC_ROUTE_DATA_PATHS.has(url.pathname)) {
		event.respondWith(
			fetch(event.request)
				.then((response) => {
					if (response.ok) {
						event.waitUntil(
							caches.open(CACHE_NAME).then((cache) => cache.put(event.request, response.clone()))
						);
					}
					return response;
				})
				.catch(async () => {
					return (await caches.match(event.request, { ignoreSearch: true })) ?? Response.error();
				})
		);
		return;
	}

	if (!PRECACHE_PATHS.has(url.pathname)) return;

	event.respondWith(caches.match(event.request).then((cached) => cached ?? fetch(event.request)));
});
