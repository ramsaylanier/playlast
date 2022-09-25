import { connectDatabase } from '$lib/server/db';

/** @type {import('./$types').Actions} */
export const actions = {
	connectDatabaseByFileBuffer: async ({ request }) => {
		const data = await request.formData();
		const databaseFile = data.get('file');
		const databaseType = data.get('type');
		const buffer = await databaseFile.arrayBuffer();
		const history = await connectDatabase({ request, type: databaseType, options: { buffer } });
		return history;
	}
};
