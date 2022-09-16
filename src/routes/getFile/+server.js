import fs from 'fs/promises';

/** @type {import('./$types').PageServerLoad} */
export async function POST({ request }) {
	const { path } = await request.json();
	const file = await fs.readFile(path);
	return new Response(file);
}
