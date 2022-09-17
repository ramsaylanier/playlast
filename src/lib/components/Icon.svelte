<script>
	export let name;
	export let size = 24;

	const icons = {
		play: {
			d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z'
		},
		pause: {
			d: 'M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z'
		}
	};
</script>

<svg viewBox={`0 0 24 24`}>
	<path {...icons[name]} />
</svg>

<style>
	svg {
		height: 100%;
	}
	path {
		fill: var(--dark-color);
	}
</style>
