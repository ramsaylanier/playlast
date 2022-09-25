import { env as private_env } from '$env/dynamic/private';
import { Blowfish } from 'javascript-blowfish';
import { normalizeHistory } from './normalize';

export const getKey = () => {
	const password = private_env.VITE_REKORDBOX_PASSWORD;
	const secret = private_env.VITE_REKORDBOX_SECRET;
	const base64Password = atob(password);
	const bf = new Blowfish(secret);
	let key = bf.decrypt(base64Password);
	return key;
};

const RekordboxDB = (database) => {
	return {
		db: database,
		getPlayHistory: async function () {
			try {
				const key = getKey();
				const db = this.db;
				const fields = `
        djmdHistory.ID as listId,
				strftime('%s', strftime('%Y-%m-%dT00:00:00+00:00', djmdHistory.created_at)) as listStartTime,
        djmdContent.ID as Id,
        djmdContent.FolderPath as path,
        djmdContent.FilenameL as filename,
        djmdContent.Length as length,
        djmdContent.BPM as bpm,
        djmdContent.Title as title,
        djmdArtist.Name as artist,
        djmdGenre.Name as genre,
        djmdKey.ScaleName as key
      `;
				const query = `
        SELECT ${fields}
        FROM djmdHistory
        INNER JOIN djmdContent
        ON djmdContent.ID = djmdSongHistory.ContentID
        INNER JOIN djmdSongHistory
        ON djmdSongHistory.HistoryID = djmdHistory.ID AND djmdSongHistory.ContentID = djmdContent.ID
        INNER JOIN djmdGenre
        ON djmdContent.GenreID = djmdGenre.ID
        INNER JOIN djmdKey
        ON djmdKey.ID = djmdContent.KeyID
        INNER JOIN djmdArtist
        ON djmdArtist.ID = djmdContent.ArtistID
        `;

				const result = await new Promise((resolve, reject) => {
					db.serialize(function () {
						db.run('PRAGMA cipher_compatibility = 4');
						db.run(`PRAGMA key = "${key}"`);
						db.all(query, function (err, res) {
							if (res) {
								resolve(res);
							} else {
								reject(err);
							}
						});
					});
				});

				return normalizeHistory(result);
			} catch (err) {
				console.log(err);
			}

			return;
		}
	};
};

export default RekordboxDB;
