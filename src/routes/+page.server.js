import { connectDatabase } from '$lib/server/db';

/** @type {import('./$types').Actions} */
export const actions = {
	setDatabaseLocation: async ({ request }) => {
		const data = await request.formData();
		const databaseFile = data.get('database');
		const buffer = await databaseFile.arrayBuffer();
		connectDatabase(buffer);
	}
};
