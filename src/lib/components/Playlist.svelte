<script>
	import Color from 'color';
	import { fly, fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { scaleLinear } from 'd3-scale';
	import { interpolatePuRd } from 'd3-scale-chromatic';
	import Track from './Track.svelte';
	import moment from 'moment';

	import { activeList, activeTrack, isPlaying } from '$lib/stores/store.js';

	let tracksRef;
	let trackWidth;
	let activeTrackIndex = 0;
	let mouseDown = false;
	let percentScrolled = 0;
	let autoScrollDone = false;

	$: trackLength = $activeList.tracks.length || 0;
	$: trackDuration = $activeTrack?.length * 1000 || 0;
	$: pixelsPerSecond = trackWidth / trackDuration;
	$: avgDuration = moment.duration($activeList.setLength / trackLength, 'minutes');
	$: trackColorScale = scaleLinear().domain([0, trackLength]).range([0.1, 0.6]);
	$: timeRemaining = Math.max(
		0,
		Math.floor($activeList.setLength - $activeList.setLength * percentScrolled)
	);

	// reset scroll when tracklist changes
	$: if ($activeList && tracksRef) {
		console.log('reset scroll');
		tracksRef.scroll({
			left: 0,
			behavior: 'smooth'
		});
	}

	// scroll list based on active track duration
	const startAutoScroll = () => {
		let start, previousTimeStamp;

		const step = (timestamp) => {
			if (!$isPlaying) return;
			if (start === undefined) {
				start = timestamp;
			}
			const elapsed = timestamp - start;

			if (previousTimeStamp !== timestamp && !mouseDown) {
				// Math.min() is used here to make sure the element stops at exactly 200px
				const count = Math.min(pixelsPerSecond * elapsed, trackDuration);
				tracksRef.scroll({ left: count, behavior: 'smooth' });
				if (count === trackDuration) autoScrollDone = true;
			}

			if (elapsed < trackDuration) {
				// Stop the animation after 2 seconds
				previousTimeStamp = timestamp;
				if (!autoScrollDone) {
					window.requestAnimationFrame(step);
				}
			}
		};

		window.requestAnimationFrame(step);
	};

	const handleScroll = (e) => {
		if (trackWidth) {
			const totalDistance = trackWidth * trackLength;
			percentScrolled = e.target.scrollLeft / totalDistance;
			activeTrackIndex = Math.floor(trackLength * percentScrolled);
			const track = $activeList.tracks[activeTrackIndex];
			if (!$activeTrack || (track && track.id !== $activeTrack?.id)) {
				activeTrack.set(track);
			}
		}
	};

	const handleClick = () => {
		const track = $activeList.tracks[activeTrackIndex];
		activeTrack.set(track);
		isPlaying.set(true);
		startAutoScroll();
	};

	const handleMouseWheel = (e) => {
		console.log(e);
	};

	const handleMouseDown = (e) => {
		console.log(e);
		mouseDown = true;
		autoScrollDone = true;
	};

	const handleMouseUp = (e) => {
		mouseDown = false;
	};
</script>

{#if $activeList}
	<div class="playlist" transition:fade={{ duration: 1000, delay: 1000 }}>
		<div class="playlist-meta">
			<div class="play-head" on:click={handleClick} />
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

		<div
			class="tracks"
			bind:this={tracksRef}
			on:scroll={handleScroll}
			on:mousedown={handleMouseDown}
			on:mousewheel={handleMouseWheel}
			on:mouseup={handleMouseUp}
		>
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
		display: flex;
		height: 100%;
		width: 100%;
		overflow: hidden;
	}

	.playlist-meta {
		display: flex;
		flex-flow: column;
		height: 100%;
		padding: 0rem 1rem;
		max-width: 100px;
		min-width: 60px;
		z-index: 10;
		position: relative;
		box-shadow: -25px 0px 25px 1px var(--dark-color);
	}

	.tracks {
		display: flex;
		overflow: auto;
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
