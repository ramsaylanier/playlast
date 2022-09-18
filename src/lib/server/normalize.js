import moment from 'moment';

export const normalizeHistory = (history) => {
	// console.log({ history });

	const data = history.reduce((previous, current) => {
		const { listId } = current;

		current.startTime = moment(current.startTime).unix() * 1000;
		current.listStartTime = moment(current.listStartTime).unix() * 1000;

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

	console.log({ data });

	return Object.values(data).map((list) => {
		if (!list) return;
		const tracks = list.tracks;
		const lastTrack = tracks[tracks.length - 1];

		// console.log({ lastTrack });

		const endTime = moment.unix(lastTrack.startTime + lastTrack.length);
		// console.log({ endTime });
		const startTime = moment.unix(lastTrack.listStartTime);
		const setLength = endTime.diff(startTime, 'minutes');
		return { ...list, setLength };
	});
};
