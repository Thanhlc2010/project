'use client';

import React from 'react';

import LayoutWrap from './component/LayoutWrap';
import './globals.css';

interface AppProps {
	children: React.ReactNode | React.ReactNode[];
}

function App({ children }: AppProps) {
	return <LayoutWrap auth={false}>{children}</LayoutWrap>;
}

export default App;
