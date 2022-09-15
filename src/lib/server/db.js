import Database from 'better-sqlite3';

export const connectDatabase = (databaseLocation) => {
	const db = new Database(databaseLocation, {
		verbose: console.log
	});

	return db;
};

export const getPlayHistory = async (location) => {
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

	try {
		// const formatTime = timeFormat('%B %d, %Y');
		const result = await db.prepare(query).all();

		if (result) {
			const data = result.reduce((previous, current) => {
				const { listId } = current;

				if (previous[listId]) {
					previous[listId].tracks.push(current);
				} else {
					previous[listId] = {
						id: listId,
						startTime: new Date(current.listStartTime * 1000),
						tracks: [current]
					};
				}
				return previous;
			}, {});

			return Object.values(data);
		}
	} catch (error) {
		console.log(error);
		throw Error(error);
	}

	return;
};
