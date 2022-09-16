<script>
	import { dbLocation, activeTrack, isPlaying } from '$lib/stores/store.js';

	let audioSrc = '';
	let audioRef;

	$: activeTrackPath = `${$dbLocation}/../../${$activeTrack?.path}`;
	$: getFileAndPlay($isPlaying);

	const getFileAndPlay = async (isPlaying) => {
		if (isPlaying) {
			await getFile();
		}
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
				audioRef.src = audioSrc;
				audioRef.onloadeddata = () => {
					console.log(audioRef.duration);
				};

				audioRef.play();
			} catch (err) {
				console.log(err);
			}
		}
	};
</script>

<audio src={audioSrc} bind:this={audioRef} />
