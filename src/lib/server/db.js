import sqljs from 'sql.js';
import sqlite3 from '@journeyapps/sqlcipher';
import path from 'path';
import EngineDB from './engine.js';
import RekordboxDB from './rekordbox.js';
sqlite3.verbose();

export let db;

export const connectDatabase = async ({ type, options }) => {
	try {
		if (type === 'Rekordbox') {
			const file = path.resolve('F:/Pioneer/Master/master.db');
			const db = RekordboxDB(new sqlite3.Database(file));
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
