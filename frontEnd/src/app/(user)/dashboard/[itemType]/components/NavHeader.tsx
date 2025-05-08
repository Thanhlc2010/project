'use client';

import { AvailableTabs } from '../types';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

type NavHeaderProps = {
	activeTab: AvailableTabs;
	setActiveTab: (tab: AvailableTabs) => void;
	availableTabs: AvailableTabs[];
};

export default function NavHeader({ activeTab, setActiveTab, availableTabs }: NavHeaderProps) {
	if (availableTabs.length === 0) {
		return null;
	}

	return (
		<div className="border-b">
			<div className="flex items-center justify-between px-4 h-14">
				<div className="flex items-center space-x-4">
					<Tabs
						defaultValue={activeTab}
						className="w-auto "
						onValueChange={(value) => setActiveTab(value as AvailableTabs)}>
						<TabsList className="bg-transparent gap-2">
							{availableTabs.map((tab) => (
								<TabsTrigger
									key={tab}
									value={tab}
									className={cn(
										'relative flex items-center gap-2 capitalize hover:bg-gray-200',
										tab === activeTab &&
											'!border-none !outline-none !bg-transparent  !shadow-transparent text-primary-foreground after:content-[""] after:absolute after:bottom-[-14px] after:left-0 after:w-full after:h-[2px] after:bg-primary',
									)}>
									{tab === AvailableTabs.LIST && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round">
											<line x1="8" y1="6" x2="21" y2="6" />
											<line x1="8" y1="12" x2="21" y2="12" />
											<line x1="8" y1="18" x2="21" y2="18" />
											<line x1="3" y1="6" x2="3.01" y2="6" />
											<line x1="3" y1="12" x2="3.01" y2="12" />
											<line x1="3" y1="18" x2="3.01" y2="18" />
										</svg>
									)}
									{tab === AvailableTabs.OVERVIEW && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round">
											<rect x="3" y="3" width="18" height="18" rx="2" />
											<path d="M3 9h18" />
										</svg>
									)}
									{tab === AvailableTabs.BOARD && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round">
											<rect x="3" y="3" width="7" height="7" />
											<rect x="14" y="3" width="7" height="7" />
											<rect x="14" y="14" width="7" height="7" />
											<rect x="3" y="14" width="7" height="7" />
										</svg>
									)}
									{tab === AvailableTabs.PERT && (
										<svg
											xmlns="http://www.w3.org/2000/svg"
											width="16"
											height="16"
											viewBox="0 0 24 24"
											fill="none"
											stroke="currentColor"
											strokeWidth="2"
											strokeLinecap="round"
											strokeLinejoin="round">
											<rect x="3" y="3" width="7" height="7" />
											<rect x="14" y="3" width="7" height="7" />
											<rect x="14" y="14" width="7" height="7" />
											<rect x="3" y="14" width="7" height="7" />
										</svg>
									)}
									{tab}
								</TabsTrigger>
							))}
						</TabsList>
					</Tabs>
				</div>
			</div>
		</div>
	);
}
