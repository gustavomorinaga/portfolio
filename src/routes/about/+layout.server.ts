import type { LayoutServerLoad } from './$types';

export const load = (async ({ parent }) => {
	const { pathname } = await parent();

	return { pathname };
}) satisfies LayoutServerLoad;
