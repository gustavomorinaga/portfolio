<script lang="ts">
	import '../app.scss';
	import { PUBLIC_DOMAIN } from '$env/static/public';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import { getGPUTier } from 'detect-gpu';
	import { Analytics, Background, Footer, Icon, PageTransition, Preload } from '$lib/components';
	import { profileJSON } from '$lib/databases';
	import { DRAWER, GPU, LANG } from '$lib/stores';
	import { containerElement } from '$lib/utils';
	import type { IRoute } from '$lib/types';
	import type { LayoutServerData } from './$types';

	const baseURL = PUBLIC_DOMAIN;

	export let data: LayoutServerData;

	let finished: boolean;
	let showDrawer = false;

	$: showContent = $GPU.isThree ? finished : true;
	$: readMode = ['/blog'].includes(data.pathname);
	$: isMobile = browser && window.matchMedia('(max-width: 640px)').matches;
	$: routes = [
		{
			title: $LANG.header.home,
			path: '/',
			icon: 'home',
			active: true,
			special: false
		},
		{
			title: $LANG.header.blog,
			path: '/blog',
			icon: 'news',
			active: false,
			special: false
		},
		{
			title: $LANG.header.about,
			path: '/about',
			icon: 'user',
			active: true,
			special: false
		},
		{
			title: $LANG.header.projects,
			path: '/projects',
			icon: 'code',
			active: true,
			special: false
		},
		{
			title: $LANG.header.bookmark,
			path: '/bookmarks',
			icon: 'bookmark',
			active: false,
			special: true
		}
	] satisfies IRoute[];
	$: trigger = data.pathname.split('/').slice(1).shift()?.replace('', '/');

	const handleResize = () => {
		showDrawer = isMobile;

		!showDrawer && DRAWER.set(false);
	};

	onMount(async () => {
		if (!$GPU?.gpu) {
			const detectedGPU = await getGPUTier();

			GPU.change(detectedGPU);
		}

		(containerElement as HTMLElement).classList.toggle('low__end', $GPU.isLowEnd);

		showDrawer = isMobile;
	});
</script>

<svelte:window on:resize={handleResize} />

<Preload />

<Analytics />

<Background bind:finished bind:readMode />

{#if showContent}
	{#await import('$lib/components/header') then { Header }}
		<Header routes={routes.filter(r => r.path !== '/')} />
	{/await}

	{#if showDrawer}
		{#await import('$lib/components/drawer') then { Drawer }}
			<Drawer>
				<svelte:fragment slot="content">
					<ul class="menu">
						{#each routes as route}
							<li>
								<a
									class="menu__item"
									class:disabled={!route.active}
									href={route.path}
									on:click={() => DRAWER.set(false)}
								>
									<Icon icon={route.icon} />
									{route.title}
								</a>
							</li>
						{/each}
					</ul>

					<div class="divider" />

					<ul class="social">
						{#each profileJSON.social as socialLink}
							<li>
								<a
									href={socialLink.url}
									target="_blank"
									rel="noopener noreferrer"
									aria-label={socialLink.title}
								>
									<Icon icon={socialLink.icon} size="sm" />
								</a>
							</li>
						{/each}

						<li data-tip={$LANG.curriculum.title}>
							<a
								href={`${baseURL}/files/pdfs/curriculum-${$LANG.code}.pdf`}
								target="_blank"
								rel="noopener noreferrer"
								aria-label={$LANG.curriculum.title}
							>
								<Icon icon="file-download" size="sm" />
							</a>
						</li>
					</ul>
				</svelte:fragment>
			</Drawer>
		{/await}
	{/if}
{/if}

<main>
	<PageTransition isMain {trigger}>
		<slot />
	</PageTransition>
</main>

<Footer />

{#if showContent}
	{#await import('$lib/components/scroll-top') then { ScrollTop }}
		<ScrollTop />
	{/await}

	{#if data.playlist && data.playlist.meta.pagination.pageCount}
		{#await import('$lib/components/player') then { Player }}
			<Player playlist={data.playlist.data} />
		{/await}
	{/if}
{/if}

<style lang="scss" global>
	main {
		@apply relative max-w-screen-lg min-h-screen my-0 mx-auto px-4 lg:px-0 pt-8 pb-40;
	}

	.drawer {
		& .menu {
			& .menu__item {
				@apply rounded font-futuristic;

				&.disabled {
					@apply pointer-events-none opacity-50;
				}
			}
		}

		& .social {
			@apply flex flex-wrap justify-center;

			& li {
				@apply btn btn-link btn-sm;
			}
		}
	}
</style>
