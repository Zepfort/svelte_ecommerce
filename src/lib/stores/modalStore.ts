// src/lib/stores/modalStore.ts
import { writable } from 'svelte/store';

export const isCategoryModalOpen = writable(false);
export const isSubCategoryModalOpen = writable(false);
export const selectedCategory = writable(null);
