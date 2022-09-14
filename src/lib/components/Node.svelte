<script>
	import { blur } from 'svelte/transition';
	import { circOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	export let node;
	export let index;
	export let handleClick;
	export let isActive;

	let loaded = false;

	onMount(() => {
		loaded = true;
	});
</script>

{#if loaded}
	<circle
		in:blur={{ duration: 2000, delay: index * 10 + 500, easing: circOut }}
		r={10}
		cx={node.cx}
		cy={node.cy}
		fill={node.color}
		on:click={() => handleClick(node)}
		class:node
		class:isActive
	/>
{/if}

<style>
	.node {
		opacity: 0.6;
		transition: opacity 300ms ease-out;
		stroke-width: 0.5;
		stroke: var(--dark-color);
		cursor: pointer;
	}

	.node.isActive {
		opacity: 1;
		stroke-width: 2;
		stroke: var(--main-color);
	}

	.node:hover {
		opacity: 0.8;
	}
</style>
