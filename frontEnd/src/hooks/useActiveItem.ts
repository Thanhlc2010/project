import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Path, useWorkspaceStore } from '@/store/workspaceStore';

export const useActiveItem = (id: string) => {
	const params = useParams();
	const [isActive, setIsActive] = useState(false);
	const [shouldExpandItem, setShouldExpandItem] = useState(false);
	const findPathToItem = useWorkspaceStore((state) => state.findPathToItem);

	const itemTypeFormParams = params.itemType as string;
	const itemIdFromParams = params.itemId as string;

	const hasItem = !!itemIdFromParams && !!itemTypeFormParams;

	useEffect(() => {
		if (hasItem) {
			const itemPath = findPathToItem(itemIdFromParams);
			if (itemPath) {
				const newActiveValue =
					itemIdFromParams === id ||
					(itemPath?.some((pathItem: Path) => pathItem.id === id) ?? false);
				setShouldExpandItem(newActiveValue);
				setIsActive(itemIdFromParams === id);
			}
		} else {
			setIsActive(false);
		}
	}, [hasItem, itemIdFromParams, findPathToItem, id, itemTypeFormParams]);

	return { isActive, shouldExpandItem };
};
