import { getPlayHistory } from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const location = cookies.get('location');

	if (location) {
		const playHistory = await getPlayHistory(location);
		return { playHistory, location };
	}
}

/** @type {import('./$types').Actions} */
export const actions = {
	setDatabaseLocation: async ({ cookies, request }) => {
		const data = await request.formData();
		const location = data.get('location');

		cookies.set('location', location);
	}
};
