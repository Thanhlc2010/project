import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

import { APP_ROUTES } from '@/common/constants';
import { useAuthStore } from '@/store/authStore';

export default function useAuthenticated(isPublicRoute = false) {
	const router = useRouter();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
	const shouldGoToLogin = !isPublicRoute && !isAuthenticated;
	const shouldGoToDashboard = isPublicRoute && isAuthenticated;

	useEffect(() => {
		if (shouldGoToDashboard) {
			router.replace(APP_ROUTES.DASHBOARD);
		}

		if (shouldGoToLogin) {
			router.replace(APP_ROUTES.LOGIN);
		}
	}, [shouldGoToDashboard, shouldGoToLogin, router]);
}
