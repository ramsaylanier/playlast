import { zipObject } from 'lodash';
import { normalizeHistory } from './normalize';

const EngineDB = (database) => {
	return {
		db: database,
		getPlayHistory: async function () {
			const fields = `
        Historylist.startTime as listStartTime,
        HistorylistEntity.listId, 
        HistorylistEntity.startTime,
        Track.id,
        Track.path,
        Track.filename,
        Track.length, 
        Track.bpmAnalyzed as bpm,
        Track.title,
        Track.artist,
        Track.genre,
        Track.key
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
				const [{ columns, values }] = await this.db.exec(query);

				const result = values.map((v) => {
					return zipObject(columns, v);
				});

				if (result) {
					return normalizeHistory(result);
				}
			} catch (error) {
				console.log(error);
				throw Error(error);
			}

			return;
		}
	};
};

export default EngineDB;
