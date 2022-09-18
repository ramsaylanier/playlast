import { getPlayHistory } from '$lib/server/db';
import moment from 'moment';

/** @type {import('./$types').PageServerLoad} */
export async function GET() {
	let playHistory = [],
		error;

	try {
		const result = await getPlayHistory();

		if (!result) return;

		playHistory = result.map((list) => {
			if (!list) return;
			const tracks = list.tracks;
			const lastTrack = tracks[tracks.length - 1];
			const endTime = moment.unix(lastTrack.startTime + lastTrack.length);
			const startTime = moment.unix(lastTrack.listStartTime);
			const setLength = endTime.diff(startTime, 'minutes');
			return { ...list, setLength };
		});
	} catch (e) {
		console.log(e);
		error = e;
	}

	return new Response(JSON.stringify({ playHistory, error: error?.message }));
}
