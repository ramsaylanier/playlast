<script>
	import Axis from '$lib/components/Axis.svelte';

	import Node from '$lib/components/Node.svelte';
	import Playlist from '$lib/components/Playlist.svelte';
	import AppHeader from '$lib/components/AppHeader.svelte';

	import { onMount, beforeUpdate } from 'svelte';

	import { min, max, select } from 'd3';
	import { scaleLog, scaleTime, scaleLinear } from 'd3-scale';
	import { zoom as Zoom } from 'd3-zoom';
	import { interpolatePuRd } from 'd3-scale-chromatic';
	import moment from 'moment';
	import 'normalize.css';
	import '../app.css';

	/** @type {import('./$types').ActionData} */
	export let form;

	let activeNode;
	let svgRef;

	let width = 0;
	let height = 0;

	const margin = 20;

	const handleNodeClick = (node) => {
		activeNode = node;
	};

	function zoomed(event) {
		xScale = event.transform.rescaleX(xScaleCopy);
	}

	const scaleExtent = [1, Infinity];

	$: data = form ? Object.values(form) : {};
	$: zoom = Zoom().scaleExtent(scaleExtent).on('zoom', zoomed);

	$: dataAsArray = Object.keys(data).map((key) => {
		const value = data[key];
		if (!value) return;

		const tracks = value.tracks;
		const lastTrack = tracks[tracks.length - 1];
		const endTime = moment.unix(lastTrack.startTime + lastTrack.length);
		const startTime = moment.unix(lastTrack.listStartTime);
		return { ...data[key], id: key, setLength: endTime.diff(startTime, 'minutes') };
	});
	$: colorDomain = dataAsArray.map((d) => d.setLength);
	$: minDate = min(dataAsArray, (d) => d.startTime);
	$: maxDate = max(dataAsArray, (d) => d.startTime);
	$: xScale = scaleTime()
		.domain([minDate, maxDate])
		.range([margin, width - margin])
		.clamp(true);
	$: xScaleCopy = scaleTime()
		.domain([minDate, maxDate])
		.range([margin, width - margin]);
	$: yScale = scaleLinear()
		.domain([0, max(dataAsArray, (d) => d.setLength)])
		.range([height - 50, margin]);
	$: colorScale = scaleLog()
		.domain([min(colorDomain), max(colorDomain)])
		.range([0, 1]);
	$: timelineData = dataAsArray.map((d) => {
		const color = interpolatePuRd(colorScale(d.setLength));
		const cx = xScale(d.startTime);
		const cy = yScale(d.setLength);
		return { ...d, cx, cy, color };
	});

	onMount(() => {
		select(svgRef).call(zoom);
		xScaleCopy = xScale.copy();
	});

	// set default active node
	beforeUpdate(() => {
		if (!activeNode && timelineData) {
			activeNode = timelineData[0];
		}
	});
</script>

<div class="container">
	<AppHeader />

	<div class="svg-container" bind:offsetWidth={width} bind:offsetHeight={height}>
		<svg class="timeline-svg" {width} bind:this={svgRef}>
			{#each timelineData as node, index}
				<Node {node} {index} isActive={node.id === activeNode?.id} handleClick={handleNodeClick} />
			{/each}

			{#if timelineData.length > 0}
				<Axis scale={xScale} {height} />
			{/if}
		</svg>
	</div>

	{#if activeNode}
		<div class="playlist-container">
			<Playlist list={activeNode} />
		</div>
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

	.timeline-svg {
		height: 100%;
		overflow: visible;
		position: relative;
		z-index: 5;
	}

	.playlist-container {
		overflow: auto;
		position: relative;
		z-index: 10;
		border-top: 3px solid var(--main-color);
	}
</style>
