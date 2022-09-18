<script>
	import Timeline from '$lib/components/Timeline.svelte';
	import AudioPlayer from '$lib/components/AudioPlayer.svelte';
	import Playlist from '$lib/components/Playlist.svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';

	import { activeList, playHistory } from '$lib/stores/store.js';

	import 'normalize.css';
	import '../app.css';

	let width = 0;
	let height = 0;
</script>

<div class="container">
	<AppHeader />

	{#if $playHistory}
		<div class="svg-container" bind:offsetWidth={width} bind:offsetHeight={height}>
			<Timeline {width} {height} />
		</div>
		{#if $activeList}
			<div class="playlist-container">
				<AudioPlayer />
				<Playlist />
			</div>
		{/if}
	{/if}
</div>

<style>
	.container {
		display: grid;
		grid-template-columns: 1fr;
		grid-template-rows: auto 1fr 2fr;
		height: 100vh;
		width: 100vw;
	}

	.svg-container {
		display: flex;
		align-items: center;
	}

	.playlist-container {
		overflow: auto;
		position: relative;
		z-index: 10;
	}
</style>
