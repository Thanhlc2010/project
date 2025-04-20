import { Edge } from "reactflow";

export interface PertCanvasRef {
    exportToJSON: () => { nodes: any[]; edges: Edge[]; metadata: any };
    importFromJSON: (data: any) => void;
    showCriticalPaths: () => void;
    resetHighlights: () => void;
}