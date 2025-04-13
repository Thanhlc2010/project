'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { APP_ROUTES } from '@/common/constants';

export default function Home() {
	const router = useRouter();

	useEffect(() => {
		router.push(APP_ROUTES.DASHBOARD);
	}, [router]);

	return null;
}
