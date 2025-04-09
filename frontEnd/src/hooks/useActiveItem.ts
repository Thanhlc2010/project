import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { Path, useSpaceStore } from '@/store/spaceStore';

export const useActiveItem = (id: string) => {
	const params = useParams();
	const [isActive, setIsActive] = useState(false);
	const [shouldExpandItem, setShouldExpandItem] = useState(false);
	const findPathToItem = useSpaceStore((state) => state.findPathToItem);

	const itemTypeFormParams = params.itemType as string;
	const itemIdFromParams = params.itemId as string;

	const hasItem = !!itemIdFromParams && !!itemTypeFormParams;

	useEffect(() => {
		if (hasItem) {
			const itemPath = findPathToItem(itemIdFromParams);
			const newActiveValue =
				itemIdFromParams === id ||
				itemPath?.spaceId === id ||
				(itemPath?.path.some((pathItem: Path) => pathItem.id === id) ?? false);
			setShouldExpandItem(newActiveValue);
			setIsActive(itemIdFromParams === id);
		}
	}, [hasItem, itemIdFromParams, findPathToItem, id, itemTypeFormParams]);

	return { isActive, shouldExpandItem };
};
