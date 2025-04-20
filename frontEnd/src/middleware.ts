import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicRoutes = ['/login', '/register'];

async function getUserData(token: string) {
	try {
		const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/me`, {
			headers: {
				Cookie: `accessToken=${token}`,
			},
		});

		const data = await response.json();
		if (!response.ok) {
			return undefined;
		}

		return data.data;
	} catch (error) {
		return undefined;
	}
}

export async function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;
	const cookieStore = await cookies();
	const token = cookieStore.get('accessToken')?.value;
	let userData = undefined;
	if (token) {
		userData = await getUserData(token);
	}
	const isAuthenticated = !!userData;
	const isPublicRoute = publicRoutes.some((route) => pathname.startsWith(route));
	if (!isAuthenticated) {
		cookieStore.delete('accessToken');
		cookieStore.delete('userData');
	}

	if (isAuthenticated && isPublicRoute) {
		return NextResponse.redirect(new URL('/dashboard', request.url));
	} else if (!isAuthenticated && !isPublicRoute) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	const response = NextResponse.next();

	if (userData) {
		response.cookies.set('userData', JSON.stringify(userData), {
			path: '/',
			sameSite: 'strict',
			maxAge: 60 * 60 * 24, // 1 day
		});
	}

	return response;
}

export const config = {
	matcher: [
		/*
		 * Match all request paths except for the ones starting with:
		 * - api (API routes)
		 * - _next/static (static files)
		 * - _next/image (image optimization files)
		 * - favicon.ico (favicon file)
		 */
		'/((?!api|_next/static|_next/image|favicon.ico).*)',
	],
};
