import Database from 'better-sqlite3';
const db = new Database('/Users/ramsay.lanier/Desktop/Engine Library/Database2/hm.db', {
	verbose: console.log
});
export default db;
