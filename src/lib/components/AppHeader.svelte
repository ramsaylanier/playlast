<script>
	import { enhance } from '$app/forms';
	import { fade } from 'svelte/transition';
	import { onMount } from 'svelte';

	let loaded = false;

	onMount(() => {
		loaded = true;
	});
</script>

<header class="app-header">
	{#if loaded}
		<h1 class="app-title fancy-font" in:fade={{ duration: 1000 }}>PlayLast</h1>
		<form method="POST" action="?/setDatabaseLocation" use:enhance>
			<label for="location-field">Location of Engine Database</label>
			<input id="location-field" type="text" name="location" />
		</form>
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

	form {
		flex: 1;
		font-size: 0.8rem;
	}
	label {
		display: block;
		margin-bottom: 0.5rem;
		color: var(--title-color);
	}
	input {
		appearance: none;
		border: 0;
		border-radius: 3px;
		padding: 0.5rem;
		width: 100%;
	}
</style>
