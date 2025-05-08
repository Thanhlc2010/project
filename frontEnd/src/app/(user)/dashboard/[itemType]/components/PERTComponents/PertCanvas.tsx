'use client';

import { useDroppable } from '@dnd-kit/core';
import React, {
	forwardRef,
	useCallback,
	useEffect,
	useImperativeHandle,
	useRef,
	useState,
} from 'react';
import ReactFlow, {
	MiniMap,
	Controls,
	Background,
	BackgroundVariant,
	addEdge,
	useNodesState,
	useEdgesState,
	Node,
	Edge,
	Connection,
	applyNodeChanges,
	Position,
	MarkerType,
	ReactFlowInstance,
} from 'reactflow';
import 'reactflow/dist/style.css';

import TaskNode from './TaskNode';
import { PertCanvasRef } from '@/mocks/PertCanvasRef';

interface Task {
	id: string;
	name: string;
	duration: number;
	dependencies: string[];
	priority: 'high' | 'medium' | 'low';
	position?: { x: number; y: number };
	type?: 'start' | 'end' | 'task';
	ES?: number;
	EF?: number;
	LS?: number;
	LF?: number;
}

interface CriticalPathNode {
	id: string;
	data: Task;
}

type CriticalPath = CriticalPathNode[];

function DroppableCanvas({
	children,
	setNodes,
	nodes,
	reactFlowInstance,
}: {
	children: React.ReactNode;
	setNodes: (nodes: Node[] | ((prev: Node[]) => Node[])) => void;
	nodes: Node[];
	reactFlowInstance: ReactFlowInstance | null;
}) {
	const { setNodeRef } = useDroppable({
		id: 'reactflow-canvas',
	});

	return (
		<div ref={setNodeRef} style={{ flex: 1 }}>
			{children}
		</div>
	);
}

interface PertCanvasProps {
	tasks: Task[];
	edges: Edge[];
	onEdgesChange: (edges: Edge[]) => void;
	onTasksChange?: (tasks: Task[]) => void;
	onInit?: (instance: ReactFlowInstance) => void;
}

const nodeTypes = {
	task: TaskNode,
};

const PertCanvas = forwardRef<PertCanvasRef, PertCanvasProps>(
	(
		{ tasks, edges: externalEdges, onEdgesChange: handleEdgesChange, onTasksChange, onInit },
		ref,
	) => {
		const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>(externalEdges || []);
		const [nodes, setNodes, onNodesChange] = useNodesState([]);
		const [isHighlighted, setIsHighlighted] = useState(false);
		const hasInitialized = useRef(false);
		const createConnectionRef = useRef<(sourceId: string, targetId: string) => void>(() => { });
		const deleteConnectionRef = useRef<(taskId: string, dependencyId: string) => void>(
			() => { },
		);
		const deleteNodeRef = useRef<(taskId: string) => void>(() => { });
		const reactFlowInstanceRef = useRef<ReactFlowInstance | null>(null);

		const handleNodesChange = useCallback(
			(changes: any) => {
				console.log('Nodes changes:', changes);
				const updatedNodes = applyNodeChanges(changes, nodes);
				setNodes(updatedNodes);
			},
			[nodes, setNodes],
		);

		const createAllTasks = useCallback((importedNodes: Node[]): Task[] => {
			const defaultTasks: Task[] = [
				{
					id: 'start',
					name: 'Start',
					duration: 0,
					dependencies: [],
					priority: 'high',
					type: 'start',
					ES: 0,
					EF: 0,
					LS: 0,
					LF: 0,
				},
				{
					id: 'end',
					name: 'End',
					duration: 0,
					dependencies: [],
					priority: 'high',
					type: 'end',
					ES: 0,
					EF: 0,
					LS: 0,
					LF: 0,
				},
			];
			const taskNodes = importedNodes
				.filter((node) => node.id !== 'start' && node.id !== 'end')
				.map((node) => ({
					id: node.id,
					name: node.data?.name || 'Unnamed Task',
					duration: node.data?.duration || 0,
					dependencies: node.data?.dependencies || [],
					priority: node.data?.priority || 'medium',
					position: node.position,
					type: node.data?.type || 'task',
					ES: node.data?.ES,
					EF: node.data?.EF,
					LS: node.data?.LS,
					LF: node.data?.LF,
				}));
			return [...defaultTasks, ...taskNodes];
		}, []);

		const getConnectedNodesFromSource = useCallback(
			(sourceId: string) => {
				const connectedEdges = edges.filter((edge) => edge.source === sourceId);
				return connectedEdges
					.map((edge) => nodes.find((node) => node.id === edge.target))
					.filter((node): node is Node => !!node);
			},
			[edges, nodes],
		);

		const generateUniqueEdgeId = useCallback(
			(sourceId: string, targetId: string) => {
				const baseId = `e${sourceId}-${targetId}`;
				let counter = 0;
				let uniqueId = baseId;
				while (edges.some((edge) => edge.id === uniqueId)) {
					counter++;
					uniqueId = `${baseId}-${counter}`;
				}
				return uniqueId;
			},
			[edges],
		);

		const createConnection = useCallback(
			(sourceId: string, targetId: string) => {
				const sourceNode = nodes.find((node) => node.id === sourceId);
				const targetNode = nodes.find((node) => node.id === targetId);

				if (sourceNode?.data.type === 'end' || targetNode?.data.type === 'start') {
					console.log('Invalid connection');
					return;
				}

				const edgeId = generateUniqueEdgeId(sourceId, targetId);
				const connectionExists = edges.some(
					(edge) => edge.source === sourceId && edge.target === targetId,
				);
				const connectionExistsReverse = edges.some(
					(edge) => edge.source === targetId && edge.target === sourceId,
				);
				if (connectionExistsReverse || connectionExists) {
					console.log('Connection already exists');
					return;
				}

				const newEdge: Edge = {
					id: edgeId,
					source: sourceId,
					target: targetId,
					type: 'default',
					animated: false,
					markerEnd: {
						type: MarkerType.ArrowClosed,
						width: 20,
						height: 20,
						color: '#2563eb',
					},
					style: {
						strokeWidth: 2,
						stroke: '#2563eb',
					},
				};

				const newEdges = [...edges, newEdge];
				setEdges(newEdges);
				if (handleEdgesChange) {
					handleEdgesChange(newEdges);
				}

				setNodes((nodes) =>
					nodes.map((node) => {
						const currentDeps = node.data.dependencies || [];
						const allTasks = createAllTasks(nodes);
						if (node.id === targetId && !currentDeps.includes(sourceId)) {
							return {
								...node,
								data: {
									...node.data,
									dependencies: [...currentDeps, sourceId],
									allTasks,
								},
							};
						}

						if (node.id === sourceId && !currentDeps.includes(targetId)) {
							return {
								...node,
								data: {
									...node.data,
									dependencies: [...currentDeps, targetId],
									allTasks,
								},
							};
						}
						return node;
					}),
				);

				if (onTasksChange) {
					const updatedTasks = tasks.map((task) => {
						if (task.id === targetId && !task.dependencies.includes(sourceId)) {
							return {
								...task,
								dependencies: [...task.dependencies, sourceId],
							};
						}
						if (task.id === sourceId && !task.dependencies.includes(targetId)) {
							return {
								...task,
								dependencies: [...task.dependencies, targetId],
							};
						}
						return task;
					});

					onTasksChange(updatedTasks);
				}
			},
			[
				edges,
				nodes,
				setEdges,
				setNodes,
				handleEdgesChange,
				generateUniqueEdgeId,
				tasks,
				onTasksChange,
			],
		);

		const deleteConnection = useCallback(
			(taskId: string, dependencyId: string) => {
				let edgeFound = false;

				let newEdges = edges.filter((edge) => {
					const match = edge.source === dependencyId && edge.target === taskId;
					if (match) edgeFound = true;
					return !match;
				});

				if (!edgeFound) {
					newEdges = edges.filter(
						(edge) => !(edge.source === taskId && edge.target === dependencyId),
					);
				}

				setEdges(newEdges);
				if (handleEdgesChange) {
					handleEdgesChange(newEdges);
				}

				setNodes((nodes) =>
					nodes.map((node) => {
						const allTasks = createAllTasks(nodes);
						if (node.id === taskId) {
							const newDeps = (node.data.dependencies || []).filter(
								(id: string) => id !== dependencyId,
							);
							console.log(`Data for node ${node.id}:`, node.data);

							return {
								...node,
								data: {
									...node.data,
									dependencies: newDeps,
									allTasks,
								},
							};
						}

						if (node.id === dependencyId) {
							const newDeps = (node.data.dependencies || []).filter(
								(id: string) => id !== taskId,
							);
							return {
								...node,
								data: {
									...node.data,
									dependencies: newDeps,
									allTasks,
								},
							};
						}

						return node;
					}),
				);

				if (onTasksChange) {
					const updatedTasks = tasks.map((task) => {
						if (task.id === taskId) {
							return {
								...task,
								dependencies: task.dependencies.filter((id) => id !== dependencyId),
							};
						}
						if (task.id === dependencyId) {
							return {
								...task,
								dependencies: task.dependencies.filter((id) => id !== taskId),
							};
						}
						return task;
					});

					onTasksChange(updatedTasks);
				}
			},
			[edges, setEdges, handleEdgesChange, setNodes, tasks, onTasksChange],
		);

		const findAllCriticalPaths = useCallback((): {
			paths: CriticalPath[];
			criticalEdges: Edge[];
		} => {
			if (!reactFlowInstanceRef.current) {
				console.log('React Flow instance not available yet');
				return { paths: [], criticalEdges: [] };
			}

			const allNodes = reactFlowInstanceRef.current.getNodes();

			const criticalTasks = allNodes.filter(
				(node: any) =>
					node.data.ES === node.data.LS &&
					node.data.EF === node.data.LF &&
					node.id !== 'start' &&
					node.id !== 'end',
			);

			console.log(
				'Critical Tasks:',
				criticalTasks.map((n: any) => n.id),
			);

			const criticalPaths: CriticalPath[] = [];
			const criticalEdges: Edge[] = [];
			const visited = new Set<string>();

			const findPaths = (
				currentNodeId: string,
				currentPath: CriticalPathNode[] = [],
				isAllCritical: boolean = true,
			) => {
				const currentNode = allNodes.find((n: any) => n.id === currentNodeId);
				if (!currentNode) return;

				currentPath.push(currentNode);

				if (currentNodeId === 'end') {
					if (isAllCritical) {
						criticalPaths.push([...currentPath]);

						// Collect critical edges
						for (let i = 0; i < currentPath.length - 1; i++) {
							const sourceId = currentPath[i].id;
							const targetId = currentPath[i + 1].id;
							const edge = edges.find(
								(e) => e.source === sourceId && e.target === targetId,
							);
							if (edge && !criticalEdges.some((ce) => ce.id === edge.id)) {
								criticalEdges.push(edge);
							}
						}
					}
					currentPath.pop();
					return;
				}

				visited.add(currentNodeId);

				const successors = getConnectedNodesFromSource(currentNodeId);

				for (const successor of successors) {
					if (visited.has(successor.id)) continue;

					const isCritical =
						successor.id === 'end' ||
						(successor.data.ES === successor.data.LS &&
							successor.data.EF === successor.data.LF);

					findPaths(successor.id, currentPath, isAllCritical && isCritical);
				}

				currentPath.pop();
				visited.delete(currentNodeId);
			};

			findPaths('start');

			if (criticalPaths.length === 0) {
				console.log('No critical paths found');
			} else {
				console.log(`Found ${criticalPaths.length} critical paths:`);
				criticalPaths.forEach((path, index) => {
					const pathDescription = path.map((node) => ({
						id: node.id,
						name: node.data.name || node.id,
						duration: node.data.duration || 0,
					}));
					console.log(`Critical Path ${index + 1}:`, pathDescription);
					const totalDuration = pathDescription.reduce(
						(sum: number, task: any) => sum + task.duration,
						0,
					);
					console.log(`Total duration of Critical Path ${index + 1}: ${totalDuration}`);
				});
			}

			return { paths: criticalPaths, criticalEdges };
		}, [edges, getConnectedNodesFromSource]);

		const resetHighlights = useCallback(() => {
			setNodes((nds) =>
				nds.map((node) => ({
					...node,
					style: {
						...node.style,
						backgroundColor: undefined,
						border: undefined,
						color: undefined,
					},
				})),
			);
			setEdges((eds) =>
				eds.map((edge) => ({
					...edge,
					style: {
						...edge.style,
						stroke: '#2563eb',
						strokeWidth: 2,
					},
					animated: false,
					markerEnd: {
						type: MarkerType.ArrowClosed,
						color: '#2563eb',
					},
				})),
			);
		}, [setNodes, setEdges]);

		const handleShowCriticalPaths = useCallback(() => {
			if (isHighlighted) {
				resetHighlights();
				setIsHighlighted(false);
				return;
			}

			const { paths, criticalEdges } = findAllCriticalPaths();

			const criticalNodeIds = new Set<string>();
			paths.forEach((path) => {
				path.forEach((node) => {
					criticalNodeIds.add(node.id);
				});
			});
			setEdges((eds) =>
				eds.map((edge) => {
					if (criticalEdges.some((ce) => ce.id === edge.id)) {
						return {
							...edge,
							style: {
								...edge.style,
								stroke: '#ff4d4f',
								strokeWidth: 4,
							},
							animated: true,
							markerEnd: {
								type: MarkerType.ArrowClosed,
								color: '#ff4d4f',
							},
						};
					}
					return {
						...edge,
						style: {
							...edge.style,
							stroke: '#2563eb',
							strokeWidth: 2,
						},
						animated: false,
						markerEnd: {
							type: MarkerType.ArrowClosed,
							color: '#2563eb',
						},
					};
				}),
			);

			setIsHighlighted(true);
		}, [isHighlighted, findAllCriticalPaths, setNodes, setEdges, resetHighlights]);
		const deleteNode = useCallback(
			(nodeId: string) => {
				if (nodeId === 'start' || nodeId === 'end') {
					console.log('Cannot delete start or end node');
					return;
				}

				const newNodes = nodes.filter((node) => node.id !== nodeId);
				setNodes(newNodes);

				const newEdges = edges.filter(
					(edge) => edge.source !== nodeId && edge.target !== nodeId,
				);
				setEdges(newEdges);
				if (handleEdgesChange) {
					handleEdgesChange(newEdges);
				}

				setNodes((nodes) =>
					nodes.map((node) => {
						const allTasks = createAllTasks(nodes);
						const newDeps = (node.data.dependencies || []).filter(
							(id: string) => id !== nodeId,
						);

						return {
							...node,
							data: {
								...node.data,
								dependencies: newDeps,
								allTasks,
							},
						};
					}),
				);

				if (onTasksChange) {
					const updatedTasks = tasks
						.filter((task) => task.id !== nodeId)
						.map((task) => ({
							...task,
							dependencies: task.dependencies.filter((id) => id !== nodeId),
						}));
					onTasksChange(updatedTasks);
				}
			},
			[nodes, edges, setNodes, setEdges, handleEdgesChange, tasks, onTasksChange, createAllTasks],
		);
		useEffect(() => {
			createConnectionRef.current = createConnection;
			deleteConnectionRef.current = deleteConnection;
			deleteNodeRef.current = deleteNode;
		}, [createConnection, deleteConnection, deleteNode]);

		useEffect(() => {
			console.log('Tasks props:', tasks);

			const defaultTasks: Task[] = [
				{
					id: 'start',
					name: 'Start',
					duration: 0,
					dependencies: [],
					priority: 'high',
					type: 'start',
					ES: 0,
					EF: 0,
					LS: 0,
					LF: 0,
				},
				{
					id: 'end',
					name: 'End',
					duration: 0,
					dependencies: [],
					priority: 'high',
					type: 'end',
					ES: 0,
					EF: 0,
					LS: 0,
					LF: 0,
				},
			];
			const allTasks = createAllTasks(nodes);
			console.log('All tasks:', allTasks);

			if (!hasInitialized.current) {
				const defaultNodes: Node[] = [
					{
						id: 'start',
						type: 'task',
						position: { x: 50, y: 300 },
						data: {
							id: 'start',
							name: 'Start',
							duration: 0,
							dependencies: [],
							priority: 'high',
							type: 'start',
							allTasks,
							onCreateConnection: (sourceId: string, targetId: string) =>
								createConnectionRef.current(sourceId, targetId),
							onDeleteConnection: (taskId: string, dependencyId: string) =>
								deleteConnectionRef.current(taskId, dependencyId),
							onDeleteTask: (taskId: string) => deleteNodeRef.current(taskId),
						},
						sourcePosition: Position.Right,
					},
					{
						id: 'end',
						type: 'task',
						position: { x: 800, y: 300 },
						data: {
							id: 'end',
							name: 'End',
							duration: 0,
							dependencies: [],
							priority: 'high',
							type: 'end',
							allTasks,
							onCreateConnection: (sourceId: string, targetId: string) =>
								createConnectionRef.current(sourceId, targetId),
							onDeleteConnection: (taskId: string, dependencyId: string) =>
								deleteConnectionRef.current(taskId, dependencyId),
							onDeleteTask: (taskId: string) => deleteNodeRef.current(taskId),
						},
						sourcePosition: Position.Left,
					},
				];

				setNodes((currentNodes) => {
					const newNodesMap = new Map(currentNodes.map((node) => [node.id, node]));

					tasks.forEach((task) => {
						if (!newNodesMap.has(task.id)) {
							newNodesMap.set(task.id, {
								id: task.id,
								type: 'task',
								position: task.position || {
									x: Math.random() * 500 + 200,
									y: Math.random() * 500,
								},
								data: {
									...task,
									type: 'task',
									allTasks,
									onCreateConnection: (sourceId: string, targetId: string) =>
										createConnectionRef.current(sourceId, targetId),
									onDeleteConnection: (taskId: string, dependencyId: string) =>
										deleteConnectionRef.current(taskId, dependencyId),
									onDeleteTask: (taskId: string) => deleteNodeRef.current(taskId),
								},
							});
						} else {
							const existingNode = newNodesMap.get(task.id)!;
							newNodesMap.set(task.id, {
								...existingNode,
								data: {
									...task,
									type: 'task',
									allTasks,
									onCreateConnection: (sourceId: string, targetId: string) =>
										createConnectionRef.current(sourceId, targetId),
									onDeleteConnection: (taskId: string, dependencyId: string) =>
										deleteConnectionRef.current(taskId, dependencyId),
									onDeleteTask: (taskId: string) => deleteNodeRef.current(taskId),
								},
							});
						}
					});

					defaultNodes.forEach((defaultNode) => {
						if (!newNodesMap.has(defaultNode.id)) {
							newNodesMap.set(defaultNode.id, defaultNode);
						}
					});

					return Array.from(newNodesMap.values());
				});

				hasInitialized.current = true;
			} else {
				setNodes((currentNodes) => {
					const newNodesMap = new Map(currentNodes.map((node) => [node.id, node]));

					tasks.forEach((task) => {
						if (!newNodesMap.has(task.id)) {
							newNodesMap.set(task.id, {
								id: task.id,
								type: 'task',
								position: task.position || {
									x: Math.random() * 500 + 200,
									y: Math.random() * 500,
								},
								data: {
									...task,
									type: 'task',
									allTasks,
									onCreateConnection: (sourceId: string, targetId: string) =>
										createConnectionRef.current(sourceId, targetId),
									onDeleteConnection: (taskId: string, dependencyId: string) =>
										deleteConnectionRef.current(taskId, dependencyId),
									onDeleteTask: (taskId: string) => deleteNodeRef.current(taskId),
								},
							});
						} else {
							const existingNode = newNodesMap.get(task.id)!;
							newNodesMap.set(task.id, {
								...existingNode,
								data: {
									...task,
									type: 'task',
									allTasks,
									onCreateConnection: (sourceId: string, targetId: string) =>
										createConnectionRef.current(sourceId, targetId),
									onDeleteConnection: (taskId: string, dependencyId: string) =>
										deleteConnectionRef.current(taskId, dependencyId),
									onDeleteTask: (taskId: string) => deleteNodeRef.current(taskId),
								},
							});
						}
					});

					const updatedDefaultNodes: Node[] = [
						{
							id: 'start',
							type: 'task',
							position: { x: 50, y: 300 },
							data: {
								id: 'start',
								name: 'Start',
								duration: 0,
								dependencies: [],
								priority: 'high',
								type: 'start',
								allTasks,
								onCreateConnection: (sourceId: string, targetId: string) =>
									createConnectionRef.current(sourceId, targetId),
								onDeleteConnection: (taskId: string, dependencyId: string) =>
									deleteConnectionRef.current(taskId, dependencyId),
								onDeleteTask: (taskId: string) => deleteNodeRef.current(taskId),
							},
							sourcePosition: Position.Right,
						},
						{
							id: 'end',
							type: 'task',
							position: { x: 800, y: 300 },
							data: {
								id: 'end',
								name: 'End',
								duration: 0,
								dependencies: [],
								priority: 'high',
								type: 'end',
								allTasks,
								onCreateConnection: (sourceId: string, targetId: string) =>
									createConnectionRef.current(sourceId, targetId),
								onDeleteConnection: (taskId: string, dependencyId: string) =>
									deleteConnectionRef.current(taskId, dependencyId),
								onDeleteTask: (taskId: string) => deleteNodeRef.current(taskId),
							},
							sourcePosition: Position.Left,
						},
					];

					updatedDefaultNodes.forEach((defaultNode) => {
						if (newNodesMap.has(defaultNode.id)) {
							const existingNode = newNodesMap.get(defaultNode.id)!;
							newNodesMap.set(defaultNode.id, {
								...existingNode,
								data: {
									...existingNode.data,
									allTasks,
								},
							});
						}
					});

					return Array.from(newNodesMap.values());
				});
			}

			console.log('Nodes after update:', nodes);
		}, [tasks, setNodes]);

		useEffect(() => {
			if (externalEdges && externalEdges.length > 0 && edges.length === 0) {
				setEdges(externalEdges);
			}
		}, [externalEdges, edges.length, setEdges]);

		const onConnect = useCallback(
			(params: Connection) => {
				if (!params.source || !params.target) return;

				const sourceNode = nodes.find((node) => node.id === params.source);
				const targetNode = nodes.find((node) => node.id === params.target);

				if (sourceNode?.data.type === 'end' || targetNode?.data.type === 'start') {
					console.log('Invalid connection');
					return;
				}
				const connectionExists = edges.some(
					(edge) => edge.source === sourceNode?.id && edge.target === targetNode?.id,
				);
				const connectionExistsReverse = edges.some(
					(edge) => edge.source === targetNode?.id && edge.target === sourceNode?.id,
				);
				if (connectionExistsReverse) {
					console.log('Connection already exists');
					return;
				}
				if (connectionExists) {
					console.log('Connection already exists');
					return;
				}
				const edgeId = generateUniqueEdgeId(params.source, params.target);
				const newEdges = addEdge(
					{
						...params,
						id: edgeId,
						type: 'smoothstep',
						animated: true,
						style: { stroke: '#2563eb' },
					},
					edges,
				);
				setEdges(newEdges);
				if (handleEdgesChange) {
					handleEdgesChange(newEdges);
				}

				createConnection(params.source, params.target);
			},
			[edges, nodes, setEdges, handleEdgesChange, generateUniqueEdgeId, createConnection],
		);

		function flattenTask(task: any) {
			return {
				id: task.id,
				type: task.type,
				position_x: task.position?.x || 0,
				position_y: task.position?.y || 0,
				name: task.data?.name || '',
				duration: task.data?.duration || 0,
				priority: task.data?.priority || '',
				ES: task.data?.ES || 0,
				EF: task.data?.EF || 0,
				LS: task.data?.LS || 0,
				LF: task.data?.LF || 0,
				data_position_x: task.data?.position?.x || 0,
				data_position_y: task.data?.position?.y || 0,
				dependencies: (task.data?.dependencies || []).join('|'), // chuyển thành chuỗi
			};
		}

		function flattenEdge(Edge: any) {
			return {
				id: Edge.id,
				source: Edge.source,
				target: Edge.target,
			};
		}

		function unflattenTask(flatTask: any) {
			return {
				id: flatTask.id,
				type: flatTask.type,
				position: {
					x: flatTask.position_x,
					y: flatTask.position_y,
				},
				data: {
					id: flatTask.id,
					name: flatTask.name,
					duration: flatTask.duration,
					dependencies: flatTask.dependencies ? flatTask.dependencies.split('|') : [],
					priority: flatTask.priority,
					position: {
						x: flatTask.data_position_x,
						y: flatTask.data_position_y,
					},
					ES: flatTask.ES,
					EF: flatTask.EF,
					LS: flatTask.LS,
					LF: flatTask.LF,
					type: flatTask.type,
				},
				width: 192,
				height: 155,
				selected: false,
				dragging: false,
				style: {},
			};
		}

		//import export
		useImperativeHandle(
			ref,
			() => ({
				exportToJSON: () => ({
					nodes: nodes
						.filter((node) => node.id !== 'start' && node.id !== 'end')
						.map((node) => flattenTask(node))
						.filter((task) => task !== null && task !== undefined),
					edges: edges.map((edge) => flattenEdge(edge)),
				}),
				
				importFromJSON: (data: { nodes: Node[]; edges: Edge[]; metadata: any }) => {
					const tempNode = data.nodes;
					data.nodes = [];
					tempNode.map((node) => {
						data.nodes.push(unflattenTask(node));
					});
					const updatedDefaultNodes: Node[] = [
						{
							id: 'start',
							type: 'task',
							position: { x: 50, y: 300 },
							data: {
								id: 'start',
								name: 'Start',
								duration: 0,
								dependencies: [],
								priority: 'high',
								type: 'start',
							},
							sourcePosition: Position.Right,
						},
						{
							id: 'end',
							type: 'task',
							position: { x: 800, y: 300 },
							data: {
								id: 'end',
								name: 'End',
								duration: 0,
								dependencies: [],
								priority: 'high',
								type: 'end',
							},
							sourcePosition: Position.Left,
						},
					];

					data.nodes = [...updatedDefaultNodes, ...data.nodes];

					const allTasks = createAllTasks(data.nodes);
					const updatedNodes = data.nodes.map((node) => {
						let sourcePosition = node.sourcePosition;
						if (node.id === 'start' || node.data?.type === 'start') {
							sourcePosition = Position.Right;
						} else if (node.id === 'end' || node.data?.type === 'end') {
							sourcePosition = Position.Left;
						}

						return {
							...node,
							sourcePosition,
							data: {
								...node.data,
								allTasks,
								onCreateConnection: (sourceId: string, targetId: string) =>
									createConnectionRef.current(sourceId, targetId),
								onDeleteConnection: (taskId: string, dependencyId: string) =>
									deleteConnectionRef.current(taskId, dependencyId),
								onDeleteTask: (taskId: string) => deleteNodeRef.current(taskId),
							},
						};
					});

					const updatedEdges: Edge[] = data.edges.map((edge) => ({
						...edge,
						type: 'default',
						animated: false,
						markerEnd: {
							type: MarkerType.ArrowClosed,
							color: '#2563eb',
						},
						style: {
							strokeWidth: 2,
							stroke: '#2563eb',
						},
					}));

					setNodes(updatedNodes);
					setEdges(updatedEdges);
					// setEdges(data.edges);
				},
				showCriticalPaths: handleShowCriticalPaths,
				resetHighlights,
			}),
			[
				nodes,
				edges,
				setNodes,
				setEdges,
				createAllTasks,
				handleShowCriticalPaths,
				resetHighlights,
			],
		);

		return (
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={handleNodesChange}
				onEdgesChange={onEdgesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
				onInit={(instance) => {
					reactFlowInstanceRef.current = instance;
					if (onInit) onInit(instance);
				}}
				fitView>
				<DroppableCanvas
					setNodes={setNodes}
					nodes={nodes}
					reactFlowInstance={reactFlowInstanceRef.current}>
					<Controls />
					<MiniMap />
					<Background variant={BackgroundVariant.Dots} gap={12} size={1} />
				</DroppableCanvas>
			</ReactFlow>
		);
	},
);

export default PertCanvas;
