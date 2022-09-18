import sqljs from 'sql.js';
import sqlite3 from '@journeyapps/sqlcipher';
import { zipObject } from 'lodash';
import path from 'path';

sqlite3.verbose();

let db;
// let cypherDb;

export const connectDatabase = async (buffer) => {
	try {
		// const SQL = await sqljs();
		// db = new SQL.Database(new Uint8Array(buffer));
		const file = path.resolve('/Volumes/Seagate/PIONEER/Master/master.db');
		console.log({ file });

		db = new sqlite3.Database(path.resolve(file));

		console.log({ db });
	} catch (err) {
		console.log({ err });
	}
};

export const getPlayHistory = async () => {
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
	Track.rating,
	Track.trackData
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
		db.serialize(async function () {
			// This is the default, but it is good to specify explicitly:
			db.run('PRAGMA cipher_compatibility = 4');

			// To open a database created with SQLCipher 3.x, use this:
			// db.run("PRAGMA cipher_compatibility = 3");

			db.run("PRAGMA key = 'mysecret'");
			// db.run('CREATE TABLE lorem (info TEXT)');
			db.all(query, function (err, res) {
				console.log({ err, res });
			});

			db.close();
		});
	} catch (err) {
		console.log(err);
	}

	// 	return;
	// 	// const result = values.map((v) => {
	// 	// 	return zipObject(columns, v);
	// 	// });

	// 	if (result) {
	// 		const data = result.reduce((previous, current) => {
	// 			console.log(current.trackData.type);
	// 			const { listId } = current;

	// 			if (previous[listId]) {
	// 				previous[listId].tracks.push(current);
	// 			} else {
	// 				previous[listId] = {
	// 					id: listId,
	// 					startTime: current.listStartTime * 1000,
	// 					tracks: [current]
	// 				};
	// 			}
	// 			return previous;
	// 		}, {});

	// 		return Object.values(data);
	// 	}
	// } catch (error) {
	// 	console.log(error);
	// 	throw Error(error);
	// }

	return;
};
