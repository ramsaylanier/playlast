<script>
	import { dbLocation, activeTrack, isPlaying } from '$lib/stores/store.js';

	let audioSrc = '';
	let audioRef;

	$: activeTrackPath = `${$dbLocation}/../../${$activeTrack?.path}`;
	$: if ($isPlaying && $activeTrack) {
		start();
	} else {
		stop();
	}

	const start = async () => {
		await getFile();
		audioRef?.play();
	};

	const stop = async () => {
		audioRef?.pause();
	};

	const getFile = async () => {
		if ($activeTrack) {
			try {
				const response = await fetch('/getFile', {
					method: 'POST',
					body: JSON.stringify({ path: activeTrackPath }),
					headers: {
						'content-type': 'application/json',
						accept: 'application/json'
					}
				});

				const blob = await response.blob();
				audioSrc = URL.createObjectURL(blob);
			} catch (err) {
				console.log(err);
			}
		}
	};
</script>

<audio src={audioSrc} bind:this={audioRef} />
