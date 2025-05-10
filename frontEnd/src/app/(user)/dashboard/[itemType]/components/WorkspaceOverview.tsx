import { Users, Briefcase, CheckSquare, ListTodo, TrendingUp, TrendingDown } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function WorkspaceOverview() {
	return (
		<section className="w-full pt-3 pb-12">
			<div className="container">
				<div className="text-2xl font-bold tracking-tight mb-4">Statistics</div>
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
					{/* Projects Card */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Projects</CardTitle>
							<Briefcase className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">248</div>
							<p className="text-xs text-muted-foreground">
								<span className="text-emerald-500 flex items-center gap-1">
									<TrendingUp className="h-3 w-3" />
									+12.5%
								</span>{' '}
								from last month
							</p>
						</CardContent>
					</Card>

					{/* Tasks Card */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
							<ListTodo className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">1,429</div>
							<p className="text-xs text-muted-foreground">
								<span className="text-emerald-500 flex items-center gap-1">
									<TrendingUp className="h-3 w-3" />
									+8.2%
								</span>{' '}
								from last month
							</p>
						</CardContent>
					</Card>

					{/* Completed Tasks Card */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Completed Tasks</CardTitle>
							<CheckSquare className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">842</div>
							<p className="text-xs text-muted-foreground">
								<span className="text-emerald-500 flex items-center gap-1">
									<TrendingUp className="h-3 w-3" />
									+19.6%
								</span>{' '}
								from last month
							</p>
						</CardContent>
					</Card>

					{/* Users Card */}
					<Card>
						<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
							<CardTitle className="text-sm font-medium">Total Users</CardTitle>
							<Users className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-2xl font-bold">573</div>
							<p className="text-xs text-muted-foreground">
								<span className="text-rose-500 flex items-center gap-1">
									<TrendingDown className="h-3 w-3" />
									-2.3%
								</span>{' '}
								from last month
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</section>
	);
}
