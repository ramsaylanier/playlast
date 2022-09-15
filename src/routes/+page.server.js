import connectDatabase from '$lib/server/db';

/** @type {import('./$types').PageServerLoad} */
export function load(event) {
	console.log({ event });

	return;
}

/** @type {import('./$types').Actions} */
export const actions = {
	setDatabaseLocation: async ({ request }) => {
		const data = await request.formData();
		const location = data.get('location');

		if (location) {
			const db = connectDatabase(location);
			if (!db) throw Error('Cannot connect to database.');

			const fields = `
				Historylist.startTime as listStartTime,
				HistorylistEntity.listId,
				HistorylistEntity.startTime,
				Track.id,
				Track.filename,
				Track.length, 
				Track.bpmAnalyzed,
				Track.title,
				Track.path,
				Track.artist,
				Track.album,
				Track.genre,
				Track.key,
				Track.rating
			`;
			const query = `
				SELECT ${fields}
				FROM Historylist
				INNER JOIN HistorylistEntity
				ON HistoryListEntity.listId = Historylist.id
				INNER JOIN Track
				ON HistoryListEntity.trackId = Track.id
				WHERE Historylist.startTime > 0
			`;

			// const formatTime = timeFormat('%B %d, %Y');
			const result = await db.prepare(query).all();

			if (result) {
				const data = result.reduce((previous, current) => {
					const { listId } = current;

					if (previous[listId]) {
						previous[listId].tracks.push(current);
					} else {
						previous[listId] = {
							startTime: current.listStartTime,
							tracks: [current]
						};
					}
					return previous;
				}, {});

				return data;
			}
		}
	}
};
