import moment from 'moment';

// With Engine, we can more accurately put together a recreation of a DJ set
// because each track in the history list has a start time. Rekorbox doesn't
// write a start time to the database, so we have to just add the track's length
// to the existing set list.
export const normalizeHistory = (history) => {
	const data = history.reduce((previous, current) => {
		const { listId } = current;
		const existingList = previous[listId];
		const listStartTime = existingList?.startTime || current.listStartTime * 1000;
		let setLength = existingList?.setLength;
		current.listStartTime = listStartTime;

		if (!current.startTime) {
			if (existingList) {
				current.startTime = listStartTime + existingList.setLength;
				existingList.setLength += current.length;
			} else {
				current.startTime = listStartTime;
				setLength = current.length;
			}
		}

		if (existingList) {
			existingList.tracks.push(current);
		} else {
			previous[listId] = {
				id: listId,
				startTime: listStartTime,
				tracks: [current],
				setLength
			};
		}

		return previous;
	}, {});

	return Object.values(data).map((list) => {
		if (!list) return;
		let setLength;

		if (list.setLength) {
			setLength = moment.duration(list.setLength, 'seconds').asMinutes();
		} else {
			const tracks = list.tracks;
			const lastTrack = tracks[tracks.length - 1];
			const startTime = list.startTime;
			const endTime = lastTrack.startTime * 1000 + lastTrack.length * 1000;
			setLength = moment.duration(endTime - startTime).asMinutes();
		}

		return { ...list, setLength };
	});
};
