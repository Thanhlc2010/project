import { DashboardBreadcrumb } from '@/components/layout/DashboardBreadcrumb';
import { AppSidebar } from '@/components/layout/DashboardSidebar';
import { Separator } from '@/components/ui/separator';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<main className="flex-1">
				<header className="flex h-16 shrink-0 items-center gap-2 border-b">
					<div className="flex items-center gap-2 px-3">
						<SidebarTrigger />
						<Separator orientation="vertical" className="mr-2 h-4" />
						<DashboardBreadcrumb />
					</div>
				</header>
				<div>{children}</div>
			</main>
		</SidebarProvider>
	);
}
