import { useCallback } from 'react';
import { motion } from 'framer-motion';
import ReactFlow, {
  Node,
  Edge,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  BackgroundVariant,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { Layout } from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, ZoomIn, ZoomOut } from 'lucide-react';
import { useLearningStore } from '@/store/useLearningStore';
import { toast } from 'sonner';

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'default',
    data: { label: 'Main Topic' },
    position: { x: 250, y: 0 },
    style: {
      background: 'hsl(var(--primary))',
      color: 'hsl(var(--primary-foreground))',
      border: '2px solid hsl(var(--primary))',
      borderRadius: '12px',
      padding: '16px',
      fontSize: '16px',
      fontWeight: 'bold',
    },
  },
  {
    id: '2',
    data: { label: 'Subtopic 1' },
    position: { x: 100, y: 150 },
    style: {
      background: 'hsl(var(--card))',
      border: '2px solid hsl(var(--border))',
      borderRadius: '8px',
      padding: '12px',
    },
  },
  {
    id: '3',
    data: { label: 'Subtopic 2' },
    position: { x: 400, y: 150 },
    style: {
      background: 'hsl(var(--card))',
      border: '2px solid hsl(var(--border))',
      borderRadius: '8px',
      padding: '12px',
    },
  },
  {
    id: '4',
    data: { label: 'Detail A' },
    position: { x: 0, y: 300 },
    style: {
      background: 'hsl(var(--accent))',
      color: 'hsl(var(--accent-foreground))',
      border: '2px solid hsl(var(--accent))',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '14px',
    },
  },
  {
    id: '5',
    data: { label: 'Detail B' },
    position: { x: 200, y: 300 },
    style: {
      background: 'hsl(var(--accent))',
      color: 'hsl(var(--accent-foreground))',
      border: '2px solid hsl(var(--accent))',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '14px',
    },
  },
  {
    id: '6',
    data: { label: 'Detail C' },
    position: { x: 350, y: 300 },
    style: {
      background: 'hsl(var(--accent))',
      color: 'hsl(var(--accent-foreground))',
      border: '2px solid hsl(var(--accent))',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '14px',
    },
  },
  {
    id: '7',
    data: { label: 'Detail D' },
    position: { x: 500, y: 300 },
    style: {
      background: 'hsl(var(--accent))',
      color: 'hsl(var(--accent-foreground))',
      border: '2px solid hsl(var(--accent))',
      borderRadius: '8px',
      padding: '10px',
      fontSize: '14px',
    },
  },
];

const initialEdges: Edge[] = [
  { id: 'e1-2', source: '1', target: '2', animated: true, style: { stroke: 'hsl(var(--primary))' } },
  { id: 'e1-3', source: '1', target: '3', animated: true, style: { stroke: 'hsl(var(--primary))' } },
  { id: 'e2-4', source: '2', target: '4', style: { stroke: 'hsl(var(--muted-foreground))' } },
  { id: 'e2-5', source: '2', target: '5', style: { stroke: 'hsl(var(--muted-foreground))' } },
  { id: 'e3-6', source: '3', target: '6', style: { stroke: 'hsl(var(--muted-foreground))' } },
  { id: 'e3-7', source: '3', target: '7', style: { stroke: 'hsl(var(--muted-foreground))' } },
];

export default function MindMap() {
  const { materials } = useLearningStore();
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const handleExport = () => {
    toast.success('Mind map exported! (Mock feature)');
  };

  if (materials.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">No Mind Maps Yet</h1>
            <p className="text-muted-foreground text-lg mb-6">
              Generate learning materials to create mind maps
            </p>
            <Button onClick={() => window.location.href = '/upload'}>
              Upload Materials
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-bold mb-2">Mind Map</h1>
            <p className="text-muted-foreground text-lg">
              Visualize connections between concepts
            </p>
          </div>
          <Button onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </motion.div>

        <Card className="overflow-hidden">
          <div style={{ height: '700px' }}>
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              fitView
              attributionPosition="bottom-left"
            >
              <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
              <Controls />
            </ReactFlow>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="font-semibold mb-4">How to use:</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Drag nodes to rearrange the mind map</li>
            <li>• Click and drag from a node's edge to create new connections</li>
            <li>• Use the controls to zoom and pan around the map</li>
            <li>• Export your mind map as an image for studying</li>
          </ul>
        </Card>
      </div>
    </Layout>
  );
}
