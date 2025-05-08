import { Task, User } from '@/common/types'; // điều chỉnh đường dẫn import phù hợp với dự án của bạn

export const convertIssueToTask = (issue: any): Task => {
	return {
		id: issue.id,
		name: issue.title,
		subtasks: [],
		status:
			issue.issueStatus === 'TODO'
				? 'TO DO'
				: issue.issueStatus === 'IN_PROGRESS'
				? 'IN PROGRESS'
				: issue.issueStatus === 'DONE'
				? 'COMPLETE'
				: 'TO DO',
		completed: issue.issueStatus === 'DONE',
		assignees: issue.assignee
			? [
					{
						id: issue.assignee.id,
						name: issue.assignee.name,
                        email: ''
				  }
			  ]
			: [],
		dueDate: issue.dueDate || null,
		priority:
			issue.priority === 'LOW'
				? 'Low'
				: issue.priority === 'MEDIUM'
				? 'Normal'
				: issue.priority === 'HIGH'
				? 'High'
				: 'Urgent',
		comments: [],
		parentId: issue.parentId || null,
		ES: undefined,
		EF: undefined,
		LS: undefined,
		LF: undefined,
	};
};
