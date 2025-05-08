import { Edge } from "reactflow";

export interface PertCanvasRef {
    exportToJSON: () => { nodes: any[]; edges: Edge[] };
    importFromJSON: (data: any) => void;
    showCriticalPaths: () => void;
    resetHighlights: () => void;
}