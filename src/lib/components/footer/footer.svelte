<script lang="ts">
	import { LANG } from '$lib/stores';
	import { inlineSvg } from '@svelte-put/inline-svg';

	import { IMAGES_SVG } from '$lib/images';
</script>

<footer id="footer">
	<div class="footer__wrapper">
		<div>
			<p>{$LANG.footer}</p>

			<span class="powered-by">
				Powered by
				<a class="w-16 mr-1" href="https://vercel.com" target="_blank" rel="noopener noreferrer">
					<svg use:inlineSvg={IMAGES_SVG.logoVercel} width="64" height="14" />
				</a>
				|
				<a class="w-24" href="https://kit.svelte.dev" target="_blank" rel="noopener noreferrer">
					<svg use:inlineSvg={IMAGES_SVG.logoSvelteKit} width="96" height="19" />
				</a>
			</span>
		</div>
	</div>

	<div id="player-offset" />
</footer>

<style lang="scss">
	#footer {
		@apply relative z-40 block bg-black border-t border-base-100;

		& .footer__wrapper {
			@apply footer footer-center p-4 text-base-content;

			& > div {
				@apply flex items-center justify-between flex-col md:flex-row max-w-screen-lg w-full;

				& .powered-by {
					@apply flex items-center gap-1;
				}
			}
		}

		& #player-offset {
			@apply block w-screen h-0;
		}
	}
</style>
