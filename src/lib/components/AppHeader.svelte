<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	import { database, playHistory } from '$lib/stores/store.js';

	let loaded = false;

	const handleClick = async () => {
		const [fileHandle] = await window.showOpenFilePicker();
		const file = await fileHandle.getFile();
		const formData = new FormData();
		formData.append('database', file);

		try {
			await fetch('?/setDatabaseLocation', {
				method: 'POST',
				body: formData
			});

			const result = await fetch('/getPlayHistory');
			const data = await result.json();
			playHistory.set(data.playHistory);

			database.set(file);
		} catch (err) {
			console.log(err);
		}
	};

	onMount(() => {
		loaded = true;
	});
</script>

<header class="app-header">
	{#if loaded}
		<h1 class="app-title fancy-font" in:fade={{ duration: 1000 }}>PlayLast</h1>
		<button on:click={handleClick}>Set Database</button>
		{#if $database}
			<span>{$database.name}</span>
		{/if}
	{/if}
</header>

<style>
	.app-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		background-color: var(--main-color);
		padding: 1rem;
	}

	.app-title {
		margin: 0;
		font-size: 3rem;
		color: var(--title-color);
		flex: 1;
	}
</style>
