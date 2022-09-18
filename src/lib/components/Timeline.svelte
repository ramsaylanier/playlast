<script>
	import Node from './Node.svelte';
	import Axis from './Axis.svelte';
	import { onMount, beforeUpdate } from 'svelte';
	import { min, max, select } from 'd3';
	import { zoom as Zoom } from 'd3-zoom';
	import { scaleLog, scaleTime, scaleLinear } from 'd3-scale';
	import { interpolatePuRd } from 'd3-scale-chromatic';

	import { activeList, isPlaying, playHistory } from '$lib/stores/store.js';

	export let width, height;
	let svgRef;
	const margin = 20;

	const handleNodeClick = (list) => {
		activeList.set(list);
		isPlaying.set(false);
	};

	const scaleExtent = [-Infinity, Infinity];

	$: colorDomain = $playHistory.map((d) => {
		return d.setLength;
	});
	$: minDate = min($playHistory, (d) => d.startTime);
	$: maxDate = max($playHistory, (d) => d.startTime);
	$: xScale = scaleTime()
		.domain([minDate, maxDate])
		.range([margin, width - margin]);
	$: xScaleCopy = scaleTime()
		.domain([minDate, maxDate])
		.range([margin, width - margin]);
	$: yScale = scaleLinear()
		.domain([0, max($playHistory, (d) => d.setLength)])
		.range([height - 52, margin]);
	$: colorScale = scaleLog()
		.domain([min(colorDomain), max(colorDomain)])
		.range([0, 1]);
	$: timelineData = $playHistory.map((d) => {
		const color = interpolatePuRd(colorScale(d.setLength));
		const cx = xScale(d.startTime);
		const cy = yScale(d.setLength);
		return { ...d, cx, cy, color };
	});
	$: zoom = Zoom().scaleExtent(scaleExtent).on('zoom', zoomed);

	function zoomed(event) {
		xScale = event.transform.rescaleX(xScaleCopy);
	}

	onMount(() => {
		select(svgRef).call(zoom);
		xScaleCopy = xScale.copy();
	});

	// set default active node
	beforeUpdate(() => {
		if (!$activeList && timelineData) {
			activeList.set(timelineData[0]);
		}
	});
</script>

<svg {width} bind:this={svgRef}>
	{#each timelineData as node, index}
		<Node {node} {index} isActive={node.id === activeList?.id} handleClick={handleNodeClick} />
	{/each}

	{#if timelineData.length > 0}
		<Axis scale={xScale} {height} />
	{/if}
</svg>

<style>
	svg {
		height: 100%;
		overflow: visible;
		position: relative;
		z-index: 5;
	}
</style>
