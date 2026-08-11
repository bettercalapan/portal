<script lang="ts">
	import { resolveRoute } from "$lib/utils/paths";
	import { government } from "$lib/data/government.data";
	import { services } from "$lib/data/services.data";
	import Facebook from "$lib/icons/facebook.svelte";
	import GitHub from "$lib/icons/github.svelte";

	const prefix = "/(content)";
	const others = [
		{
			name: "Terms of Use",
			url: `${prefix}/terms-of-use`
		},
		{
			name: "Privacy Policy",
			url: `${prefix}/privacy-policy`
		},
		{
			name: "Accessibility",
			url: `${prefix}/accessibility`
		},
		{
			name: "Report",
			url: `${prefix}/report`
		},
		{
			name: "Sitemap",
			url: `${prefix}/sitemap`
		}
	];
</script>

<footer>
	<div class="wrapper">
		<div class="info">
			<h1>BetterCalapan</h1>
			<p class="description">
				An open-source initiative providing transparent access to municipal services, local
				legislation, and public data for the people of Calapan.
			</p>
			<div class="socials">
				<a
					class="social"
					href="https://facebook.com/bettercalapan.org"
					target="_blank"
					rel="external noopener noreferrer"
					aria-label="Go to Facebook page"
				>
					<Facebook />
				</a>
				<a
					class="social"
					href="https://github.com/BetterCalapan/bettercalapan"
					target="_blank"
					rel="external noopener noreferrer"
					aria-label="Go to GitHub repository"
				>
					<GitHub />
				</a>
			</div>
		</div>
		<div class="footer-sections">
			<div class="footer-section">
				<h1>Services</h1>
				<ul class="footer-section-list">
					{#each services.data as service (service.name)}
						<li class="service">
							<a href={resolveRoute(service.url)} class="link">{service.name}</a>
						</li>
					{/each}
				</ul>
			</div>
			<div class="footer-section">
				<h1>Government</h1>
				<ul class="footer-section-list">
					{#each government.data as gov (gov.name)}
						<li class="government">
							<a href={resolveRoute(gov.url)} class="link">{gov.name}</a>
						</li>
					{/each}
				</ul>
			</div>
			<div class="footer-section">
				<h1>Others</h1>
				<ul class="footer-section-list">
					{#each others as other (other.name)}
						<li class="other">
							<a class="link" href={resolveRoute(other.url)}>{other.name}</a>
						</li>
					{/each}
				</ul>
			</div>
		</div>
	</div>
</footer>

<style>
	h1 {
		font-size: 1.125rem;
		color: var(--bg);
		font-weight: 500;
	}
	footer {
		padding: 4rem 1rem;
		display: grid;
		place-items: center;
		gap: 3rem;
		background: var(--fg);
		color: var(--neutral-dark);

		.wrapper {
			width: 100%;
			max-width: 80rem;
			display: flex;
			flex-direction: column;
			gap: 2rem;

			.info {
				display: flex;
				flex-direction: column;
				gap: 1rem;

				.description {
					max-width: 635px;
				}
				.socials {
					margin-top: 1rem;
					display: flex;
					flex: 1;
					gap: 1rem;

					.social {
						width: 20px;
						height: 20px;
						align-self: end;
						color: var(--neutral-dark);
					}
				}
			}
			.footer-sections {
				margin-top: 1.75rem;
				display: flex;
				flex-direction: column;
				gap: 2rem;

				.footer-section {
					display: flex;
					flex-direction: column;
					gap: 1rem;
					color: var(--fg);

					.footer-section-list {
						display: flex;
						flex-direction: column;
						gap: 0.25rem;

						li {
							.link {
								color: var(--neutral-dark);

								&:hover {
									text-decoration: underline;
								}
							}
						}
					}
				}
			}
		}
	}

	@media (min-width: 1300px) {
		footer {
			.wrapper {
				display: grid;
				grid-template-columns: 24rem 1fr;
				gap: 16rem;

				.footer-sections {
					margin: 0;
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
				}
			}
		}
	}
</style>
