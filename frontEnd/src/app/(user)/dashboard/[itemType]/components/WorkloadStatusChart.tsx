'use client';

import { useState, useEffect } from 'react';
import { Task, User } from '@/common/types';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Task } from '@/common/types'; // Adjust import path as needed

type StatusCount = {
  name: string;
  value: number;
  color: string;
};

const RADIAN = Math.PI / 180;

// Define an interface for the label props
interface LabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
  name: string;
  value: number;
}

export default function WorkloadStatusChart({ tasks }: { tasks: Task[] }) {
  const [statusData, setStatusData] = useState<StatusCount[]>([]);

  type TaskStatus = 'TO DO' | 'IN PROGRESS' | 'COMPLETE';

  const statusColors: Record<TaskStatus, string> = {
    'TO DO': '#94979B',
    'IN PROGRESS': '#2196F3',
    'COMPLETE': '#4CAF50'
  };
  
  // When accessing the colors, use a type guard:
  const getStatusColor = (status: string): string => {
    if (status in statusColors) {
      return statusColors[status as TaskStatus];
    }
    return '#999999'; // Default color
  };

  useEffect(() => {
    // Count tasks by status (including subtasks)
    const countsByStatus: Record<string, number> = {};
    
    const countTaskStatus = (task: Task) => {
      // Count the main task
      countsByStatus[task.status] = (countsByStatus[task.status] || 0) + 1;
      
      // Count all subtasks
      if (task.subtasks && task.subtasks.length > 0) {
        task.subtasks.forEach((subtask : any) => {
          countTaskStatus(subtask);
        });
      }
    };
    
    tasks.forEach(task => {
      countTaskStatus(task);
    });
    
    // Convert to array format for chart
    const chartData = Object.keys(countsByStatus).map(status => ({
      name: status,
      value: countsByStatus[status],
      color: getStatusColor(status)
    }));
    
    setStatusData(chartData);
  }, [tasks]);

  const RADIAN = Math.PI / 180;
  
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name, value }: LabelProps) => {
    const radius = outerRadius * 1.35;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="#666" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
      >
        {name} {value}
      </text>
    );
  };

  return (
    <Card className="bg-white rounded-lg shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-medium">Workload by Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="w-full h-64">
          {statusData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No task data available</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}