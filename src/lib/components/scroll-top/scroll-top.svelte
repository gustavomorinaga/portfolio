<script lang="ts">
	import { Icon } from '$lib/components';
	import { LANG } from '$lib/stores';
	import { containerElement, scrollToTop } from '$lib/utils';

	let scrollTopButtonRef: HTMLButtonElement;
	let MINIMUM_OFFSET = 200;

	const handleOnScroll = () => {
		const { scrollTop } = containerElement as HTMLElement;

		scrollTopButtonRef.classList.toggle('show', scrollTop > MINIMUM_OFFSET);
	};
</script>

<svelte:window on:scroll={handleOnScroll} />

<button
	bind:this={scrollTopButtonRef}
	id="btn-scroll-top"
	title={$LANG.scrollTop}
	aria-label={$LANG.scrollTop}
	on:click={scrollToTop}
>
	<Icon icon="arrow-big-up-lines" />
</button>

<style lang="scss" global>
	button#btn-scroll-top {
		@apply fixed z-40 right-0 md:right-8 bottom-44 btn rounded-l-full md:btn-circle opacity-0 outline outline-black shadow-lg pointer-events-none transition-opacity duration-300 ease-out;

		&.show {
			@apply opacity-100 pointer-events-auto;
		}
	}
</style>
