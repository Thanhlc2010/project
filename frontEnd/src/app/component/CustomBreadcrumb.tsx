import { HomeOutlined, SearchOutlined } from '@ant-design/icons';
import { Breadcrumb } from 'antd';
import { usePathname } from 'next/navigation';

const CustomBreadcrumb = () => {
	const pathname = usePathname();

	const generateBreadcrumbItems = () => {
		const pathnames = pathname.split('/').filter((x) => x);

		const items = [
			{
				href: '/',
				title: <HomeOutlined />,
			},
		];

		pathnames.forEach((value, index) => {
			const to = `/${pathnames.slice(0, index + 1).join('/')}`;
			const isLast = index === pathnames.length - 1;
			const isInvestigate = value.substring(0, 11) === 'investigate';

			if (isInvestigate) {
				if (value.substring(12, 15) === 'add') {
					items.push({
						href: '',
						title: (
							<>
								<SearchOutlined />
								<span>Investigate by address</span>
							</>
						),
					});
				} else {
					items.push({
						href: '',
						title: (
							<>
								<SearchOutlined />
								<span>Investigate by transaction hash</span>
							</>
						),
					});
				}
			} else {
				items.push({
					href: isLast ? to : '',
					title: isLast ? (
						<>
							<SearchOutlined />
							<span>{value}</span>
						</>
					) : (
						<>
							<span>{value}</span>
						</>
					),
				});
			}

			// items.push({ // trong trường hợp sidebar hierachy có 3 level
			//   href: !isLast ? to : '',
			//   title: !isLast ? (
			//     <>
			//       <UserOutlined />
			//       <span>{value}</span>
			//     </>
			//   ) : (
			//     <>
			//       <span>{value}</span>
			//     </>
			//   ),
			// });
		});
		return items;
	};

	return <Breadcrumb className="py-4" items={generateBreadcrumbItems()} />;
};

export default CustomBreadcrumb;
