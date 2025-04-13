import { Layout, theme } from 'antd';
import React from 'react';

import Breadcrumb from './CustomBreadcrumb';
import Footer from './Footer';
import Header from './Header';
import Sidebar from './Sidebar';

const { Content } = Layout;

interface Props {
	auth?: boolean;
	children: React.ReactNode | React.ReactNode[];
}

const LayoutWrap = ({ auth, children }: Props) => {
	const {
		token: { colorBgContainer, borderRadiusLG },
	} = theme.useToken();

	return (
		<Layout>
			<Sidebar />
			<Layout
				style={{
					padding: '0 24px 24px',
				}}>
				<Header />
				<Breadcrumb />
				<Content
					style={{
						padding: 24,
						margin: 0,
						minHeight: 280,
						background: colorBgContainer,
						borderRadius: borderRadiusLG,
					}}>
					{/* {auth ? <h1>AUTH!</h1> : <h1>NO AUTH!</h1>} */}
					{children}
				</Content>
				<Footer />
			</Layout>
		</Layout>
	);
};

export default LayoutWrap;
