<script>
	import Icon from '$lib/components/Icon.svelte';
	import Color from 'color';
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { scaleLinear } from 'd3-scale';
	import { interpolatePuRd } from 'd3-scale-chromatic';
	import Track from './Track.svelte';
	import moment from 'moment';

	import { activeList, activeTrack, isPlaying } from '$lib/stores/store.js';

	let tracksRef;
	let handleRef;
	let trackWidth;
	let activeTrackIndex = 0;
	let mouseDown = false;
	let percentScrolled = 0;
	let autoScrollDone = false;
	let x;
	let padWidth = 0;
	let handleWidth = 0;
	let dx = 0;

	$: trackLength = $activeList.tracks.length || 0;
	$: trackDuration = $activeTrack?.length * 1000 || 0;
	$: totalDistance = trackWidth * trackLength;
	$: offsetRatio = (window.innerWidth - handleWidth - padWidth) / totalDistance;
	$: pixelsPerSecond = trackWidth / trackDuration;
	$: avgDuration = moment.duration($activeList.setLength / trackLength, 'minutes');
	$: trackColorScale = scaleLinear().domain([0, trackLength]).range([0.1, 0.6]);
	$: timeRemaining = Math.max(
		0,
		Math.floor($activeList.setLength - $activeList.setLength * percentScrolled)
	);

	// scroll list based on active track duration
	const startAutoScroll = () => {
		let previousTimeStamp;
		let start;

		const step = (timestamp) => {
			if (!$isPlaying || mouseDown) return;
			if (start === undefined) {
				start = timestamp;
			}
			const elapsed = timestamp - start;

			if (previousTimeStamp !== timestamp && !mouseDown) {
				const count = Math.min(pixelsPerSecond * elapsed, trackDuration);
				tracksRef.style.right = `${count}px`;
				handleRef.style.left = `${count * offsetRatio}px`;
				if (count === trackDuration) autoScrollDone = true;
			}

			if (elapsed < trackDuration) {
				previousTimeStamp = timestamp;
				if (!autoScrollDone) {
					window.requestAnimationFrame(step);
				}
			}
		};

		window.requestAnimationFrame(step);
	};

	const handleMouseDown = (e) => {
		const track = $activeList.tracks[activeTrackIndex];
		activeTrack.set(track);
		isPlaying.set(!$isPlaying);
		mouseDown = true;
		x = e.clientX;
	};

	const handleMouseMove = (e) => {
		if (mouseDown) {
			isPlaying.set(true);
			dx = e.clientX - x;
			const newLeft = Math.min(
				Math.max(0, handleRef.offsetLeft + dx),
				window.innerWidth - padWidth - handleWidth
			);
			percentScrolled = newLeft / (window.innerWidth - padWidth - handleWidth);
			tracksRef.style.right = `${Math.max(0, newLeft / offsetRatio)}px`;
			handleRef.style.left = `${newLeft}px`;

			activeTrackIndex = Math.floor(trackLength * percentScrolled);
			const track = $activeList.tracks[activeTrackIndex];
			if (!$activeTrack || (track && track.id !== $activeTrack?.id)) {
				activeTrack.set(track);
			}
		}

		x = e.clientX;
	};

	const handleMouseUp = () => {
		mouseDown = false;
		if (dx > 0) {
			isPlaying.set(true);
		}

		dx = 0;
	};
</script>

{#if $activeList}
	<div
		class="playlist"
		transition:fade={{ duration: 1000, delay: 1000 }}
		on:mouseup={handleMouseUp}
		on:mousemove={handleMouseMove}
	>
		<div class="scroll-pad" bind:offsetWidth={padWidth} />
		<div class="scroll-bar">
			<span
				class="scroll-handle"
				style:background={interpolatePuRd(trackColorScale(activeTrackIndex - 3))}
				style:color={interpolatePuRd(trackColorScale(activeTrackIndex + 20))}
				bind:offsetWidth={handleWidth}
				bind:this={handleRef}
				on:mousedown={handleMouseDown}
			>
				<Icon name={$isPlaying ? 'pause' : 'play'} size={18} />
			</span>
		</div>

		<div class="playlist-meta">
			<div class="play-head" />
			<section class="section">
				<h3>{moment($activeList.startTime).format('MMM Do Y - hh:mma')}</h3>
			</section>

			<section class="section">
				<h3>{timeRemaining}</h3>
				<span class="small">minutes left</span>
			</section>

			<section class="section">
				<h3>{trackLength}</h3>
				<span class="small">tracks</span>
			</section>

			<section class="section">
				<h3>
					{`${avgDuration.get('minutes')}:${avgDuration.get('seconds')}`}
				</h3>
				<span class="small">avg.</span>
			</section>
		</div>

		<div class="tracks" bind:this={tracksRef}>
			{#each $activeList.tracks as track, index (track)}
				{@const color = interpolatePuRd(trackColorScale(index + 1))}
				<div
					bind:offsetWidth={trackWidth}
					in:fade
					out:fly={{ y: 20, delay: index * 20 }}
					animate:flip
					class="track"
					style:background={color}
					style:border-color={Color(color).darken(0.1).hex()}
				>
					<Track {track} />
				</div>
			{/each}
			<div class="track-padding" />
		</div>
	</div>
{/if}

<style>
	.playlist {
		display: grid;
		grid-template-rows: 30px auto;
		grid-template-columns: 100px 1fr;
		grid-template-areas:
			'scrollpad scroll'
			'meta tracks';
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	.scroll-pad {
		grid-area: scrollpad;
		background: var(--main-color);
	}

	.scroll-bar {
		grid-area: scroll;
		background: var(--main-color);
		display: flex;
		align-items: center;
		position: relative;
		z-index: 20;
	}

	.scroll-handle {
		height: 24px;
		width: 60px;
		cursor: move;
		border-radius: 20px;
		background: white;
		display: block;
		position: absolute;
		left: 0;
		user-select: none;
		display: flex;
		align-items: center;
		justify-content: center;
		border: 2px solid;
		border-color: currentColor;
	}

	.playlist-meta {
		grid-area: meta;
		display: flex;
		flex-flow: column;
		height: 100%;
		padding: 0rem 1rem;
		max-width: 100px;
		z-index: 10;
		position: relative;
		box-shadow: -25px 0px 25px 1px var(--dark-color);
		background: white;
	}

	.tracks {
		grid-area: tracks;
		display: flex;
		width: 100%;
		z-index: 5;
		position: relative;
	}

	.track {
		display: flex;
		flex-flow: column;
		height: 100%;
		padding: 0rem 1rem;
		flex-basis: 200px;
		width: 200px;
		max-width: 200px;
		min-width: 200px;
		border-width: 0px 1px 0px 0px;
		border-style: solid;
	}

	.track-padding {
		width: 100%;
		height: 100%;
		min-width: 100vw;
		background-color: var(--main-color);
	}

	.section {
		flex: 1;
		text-align: center;
	}

	.section h3 {
		font-weight: 700;
		font-size: 0.9rem;
		margin-bottom: 0.25rem;
		letter-spacing: 2px;
	}

	.small {
		font-size: 0.7rem;
	}

	.play-head {
		position: absolute;
		top: -8px;
		right: -20px;
		width: 0;
		height: 0;
		border-style: solid;
		border-width: 20px 20px 0 20px;
		border-color: var(--main-color) transparent transparent transparent;
	}
</style>
