import { create } from 'zustand';

interface ActiveItemState {
	activeIds: string[];
	setActiveIds: (ids: string[]) => void;
}

export const useActiveItemStore = create<ActiveItemState>()((set) => ({
	activeIds: [],
	setActiveIds: (ids: string[]) => set({ activeIds: ids }),
}));
