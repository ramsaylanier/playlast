import moment from 'moment';

export const normalizeHistory = (history) => {
	// console.log({ history });

	const data = history.reduce((previous, current) => {
		const { listId } = current;
		console.log({ ...current });

		current.startTime = moment(current.startTime).unix() * 1000;
		current.listStartTime = moment(current.listStartTime).unix() * 1000;
		console.log({ ...current });

		if (previous[listId]) {
			previous[listId].tracks.push(current);
		} else {
			previous[listId] = {
				id: listId,
				startTime: current.listStartTime,
				tracks: [current]
			};
		}
		return previous;
	}, {});

	return Object.values(data).map((list) => {
		if (!list) return;
		const tracks = list.tracks;
		const lastTrack = tracks[tracks.length - 1];
		const endTime = moment.unix(lastTrack.startTime + lastTrack.length);
		const startTime = moment.unix(lastTrack.listStartTime);
		const setLength = moment.unix(endTime - startTime).minutes();
		return { ...list, setLength };
	});
};
