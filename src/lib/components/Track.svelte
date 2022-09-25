<script>
	import moment from 'moment';
	export let track;

	const sections = [
		{
			id: 'title',
			label: 'Title'
		},
		{ id: 'artist', label: 'Artist' },
		{ id: 'genre', label: 'Genre' },
		{
			id: 'length',
			label: 'Length',
			format: (track) => moment(track.length * 1000).format('m:ss')
		},
		{ id: 'bpm', label: 'BPM', format: (track) => Math.floor(track.bpm) },
		{
			id: 'startTime',
			label: 'Start Time',
			format: (track) => moment.unix(track.startTime).format('hh:mma')
		}
	];
</script>

{#each sections as section (section.id)}
	<section class="section">
		<h3>
			{section.label}
		</h3>

		<div class="cell">
			{#if section.component}
				<svelte:component this={section.component} {...section.componentProps} />
			{:else if section.format}
				{@html section.format(track)}
			{:else}
				{track[section.id] || '-'}
			{/if}
		</div>
	</section>
{/each}

<style>
	.section {
		flex: 1;
		text-align: center;
	}

	.section h3 {
		font-family: mono45-headline, monospace;
		font-weight: 700;
		font-size: 0.9rem;
		margin-bottom: 0.25rem;
		letter-spacing: 2px;
	}

	.cell {
		hyphens: auto;
	}
</style>
