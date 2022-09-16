import { writable } from 'svelte/store';

export const dbLocation = writable('');
export const activeList = writable(null);
export const activeTrack = writable(null);
export const isPlaying = writable(false);
