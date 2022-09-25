import sqljs from 'sql.js';
import sqlite3 from '@journeyapps/sqlcipher';
import path from 'path';
import EngineDB from './engine.js';
import RekordboxDB from './rekordbox.js';
sqlite3.verbose();

export let db;

export const connectDatabase = async ({ type, options, request }) => {
	console.log({ request });
	try {
		if (type === 'Rekordbox') {
			const filename = 'master.db';
			const filePath = '/Volumes/Seagate/PIONEER/Master';
			const db = RekordboxDB(new sqlite3.Database(path.resolve(`${filePath}/${filename}`)));
			const history = await db.getPlayHistory();
			return history;
		} else if (type === 'Engine DJ') {
			const SQL = await sqljs();
			const db = EngineDB(new SQL.Database(new Uint8Array(options.buffer)));
			const history = await db.getPlayHistory();
			return history;
		}
	} catch (err) {
		console.log({ err });
	}
};
