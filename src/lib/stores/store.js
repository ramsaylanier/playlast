import { writable } from 'svelte/store';

export const database = writable('');
export const databaseType = writable('');
export const playHistory = writable([]);
export const activeList = writable(null);
export const activeTrack = writable(null);
export const isPlaying = writable(false);
export const db = writable(null);
