import { connectDatabase } from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export async function POST({ request }) {
	const { type } = await request.json();
	const history = await connectDatabase({ type, request });
	return new Response(JSON.stringify(history));
}
