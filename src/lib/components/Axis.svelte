<script>
	import { fade } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { onMount } from 'svelte';
	import { select } from 'd3-selection';
	import { axisBottom } from 'd3-axis';

	export let scale;
	export let height;
	let axisRef;
	let loaded = false;

	$: select(axisRef).call(axisBottom(scale).tickSizeOuter(0).tickSizeInner(5));

	onMount(() => {
		loaded = true;
	});
</script>

{#if loaded}
	<g
		in:fade={{ duration: 1000, easing: quadOut, delay: 0 }}
		transform={`translate(0,${height - 40})`}
		bind:this={axisRef}
	/>
{/if}
