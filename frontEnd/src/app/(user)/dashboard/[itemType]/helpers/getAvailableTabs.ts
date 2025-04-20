import { AvailableTabs } from '../types';

export const getAvailableTabs = (itemType: string) => {
	switch (itemType) {
		case 'l':
			return [AvailableTabs.LIST, AvailableTabs.BOARD, AvailableTabs.PERT];
		case 'f':
			return [AvailableTabs.OVERVIEW, AvailableTabs.LIST, AvailableTabs.BOARD, AvailableTabs.PERT];
		case 's':
			return [AvailableTabs.OVERVIEW, AvailableTabs.LIST, AvailableTabs.BOARD, AvailableTabs.PERT];
		default:
			return [];
	}
};
