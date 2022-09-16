import { getPlayHistory } from '$lib/server/db';
import moment from 'moment';

/** @type {import('./$types').PageServerLoad} */
export async function load({ cookies }) {
	const location = cookies.get('location');
	let playHistory = [],
		error;
	if (location) {
		try {
			const result = await getPlayHistory(location);
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
		return { location, playHistory, error: error?.message };
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
