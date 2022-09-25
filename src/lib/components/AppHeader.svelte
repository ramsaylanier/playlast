<script>
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	import { database, databaseType, playHistory } from '$lib/stores/store.js';

	let loaded = false;

	const databaseTypes = ['Rekordbox', 'Engine DJ'];

	const connectAndGetHistory = async (file) => {
		let result, data;

		try {
			if (file) {
				const formData = new FormData();
				formData.append('file', file);
				formData.append('type', $databaseType);
				result = await fetch('?/connectDatabaseByFileBuffer', {
					method: 'POST',
					body: formData
				});

				result = await result.json();
				data = result.data;
			} else {
				result = await fetch('/connectDatabase', {
					method: 'POST',
					body: JSON.stringify({ type: $databaseType }),
					headers: {
						'content-type': 'application/json',
						accept: 'application/json'
					}
				});
				data = await result.json();
			}

			playHistory.set(data);
		} catch (err) {
			console.log(err);
		}
	};

	const handleChange = async (e) => {
		const value = e.target.value;
		databaseType.set(value);

		// connect automatically for rekordbox
		if (value === databaseTypes[0]) {
			connectAndGetHistory();
		}
	};

	const handleClick = async () => {
		const [fileHandle] = await window.showOpenFilePicker();
		const file = await fileHandle.getFile();
		const formData = new FormData();
		formData.append('database', file);

		try {
			connectAndGetHistory(file);
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
		<labell>Select Database Type</labell>
		<select on:change={handleChange} bind:value={$databaseType}>
			<option disabled selected value>--select</option>
			{#each databaseTypes as type}
				<option value={type}>{type}</option>
			{/each}
		</select>

		{#if $databaseType == databaseTypes[1]}
			<button on:click={handleClick}>Select Database</button>
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
