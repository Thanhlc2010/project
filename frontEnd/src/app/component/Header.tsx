'use client';

import { Input, Space, Button } from 'antd';
import type { GetProps } from 'antd';
import { useRouter } from 'next/navigation';
import React from 'react';

const { Search } = Input;

type SearchProps = GetProps<typeof Input.Search>;
const onSearch: SearchProps['onSearch'] = (value, _e, info) => console.log(info?.source, value);

const Header = () => {
	const router = useRouter();

	const onSearch = (value: string) => {
		if (value) {
			router.push(`/search?q=${encodeURIComponent(value)}`);
		}
	};

	return (
		<div className="sticky top-0 w-full p-6 bg-white rounded-md shadow-sm">
			<div className="flex gap-4">
				<Search placeholder="search" onSearch={onSearch} className="w-full" />
				<Space direction="horizontal" className="gap-2">
					<Button type="primary" onClick={() => router.push('/login')}>
						Login
					</Button>
					<Button onClick={() => router.push('/register')}>Register</Button>
				</Space>
			</div>
		</div>
	);
};

export default Header;
