import Database from 'better-sqlite3';

const connectDatabase = (databaseLocation) => {
	const db = new Database(databaseLocation, {
		verbose: console.log
	});

	return db;
};

export default connectDatabase;
