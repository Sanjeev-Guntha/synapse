import { create } from 'zustand';

interface Material {
  id: string;
  title: string;
  type: 'pdf' | 'docx' | 'youtube';
  uploadedAt: string;
  status: 'processing' | 'completed' | 'failed';
}

interface Flashcard {
  id: string;
  materialId: string;
  front: string;
  back: string;
  difficulty: 'easy' | 'medium' | 'hard';
  topic: string;
}

interface Quiz {
  id: string;
  materialId: string;
  title: string;
  questions: QuizQuestion[];
  score?: number;
  completed: boolean;
}

interface QuizQuestion {
  id: string;
  question: string;
  type: 'mcq' | 'true-false' | 'fill-blank';
  options?: string[];
  correctAnswer: string;
  userAnswer?: string;
}

interface MindMapNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

interface MindMapEdge {
  id: string;
  source: string;
  target: string;
}

interface ProgressData {
  timeSpent: number;
  quizAccuracy: number;
  retentionScore: number;
  flashcardsReviewed: number;
}

interface LearningStore {
  materials: Material[];
  flashcards: Flashcard[];
  quizzes: Quiz[];
  mindMapData: { nodes: MindMapNode[]; edges: MindMapEdge[] };
  progress: ProgressData;
  addMaterial: (material: Omit<Material, 'id' | 'uploadedAt'>) => void;
  generateContent: (materialId: string) => Promise<void>;
}

export const useLearningStore = create<LearningStore>((set, get) => ({
  materials: [],
  flashcards: [],
  quizzes: [],
  mindMapData: { nodes: [], edges: [] },
  progress: {
    timeSpent: 0,
    quizAccuracy: 0,
    retentionScore: 0,
    flashcardsReviewed: 0,
  },
  addMaterial: (material) => {
    const newMaterial: Material = {
      ...material,
      id: Math.random().toString(36).substr(2, 9),
      uploadedAt: new Date().toISOString(),
    };
    set((state) => ({
      materials: [...state.materials, newMaterial],
    }));
  },
  generateContent: async (materialId) => {
    // Mock AI generation with delay
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Update material status
    set((state) => ({
      materials: state.materials.map(m =>
        m.id === materialId ? { ...m, status: 'completed' } : m
      ),
    }));

    // Generate mock flashcards
    const mockFlashcards: Flashcard[] = Array.from({ length: 10 }, (_, i) => ({
      id: `fc-${materialId}-${i}`,
      materialId,
      front: `Question ${i + 1}: What is the key concept?`,
      back: `Answer ${i + 1}: This is the detailed explanation of the concept.`,
      difficulty: ['easy', 'medium', 'hard'][Math.floor(Math.random() * 3)] as any,
      topic: ['Biology', 'Physics', 'Chemistry', 'Math'][Math.floor(Math.random() * 4)],
    }));

    // Generate mock quiz
    const mockQuiz: Quiz = {
      id: `quiz-${materialId}`,
      materialId,
      title: 'Comprehension Quiz',
      completed: false,
      questions: Array.from({ length: 5 }, (_, i) => ({
        id: `q-${i}`,
        question: `Question ${i + 1}: Which of the following is correct?`,
        type: 'mcq' as const,
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
      })),
    };

    // Generate mock mind map
    const mockNodes: MindMapNode[] = [
      { id: '1', label: 'Main Topic', x: 250, y: 150 },
      { id: '2', label: 'Subtopic 1', x: 100, y: 50 },
      { id: '3', label: 'Subtopic 2', x: 400, y: 50 },
      { id: '4', label: 'Detail A', x: 50, y: 250 },
      { id: '5', label: 'Detail B', x: 450, y: 250 },
    ];

    const mockEdges: MindMapEdge[] = [
      { id: 'e1', source: '1', target: '2' },
      { id: 'e2', source: '1', target: '3' },
      { id: 'e3', source: '2', target: '4' },
      { id: 'e4', source: '3', target: '5' },
    ];

    set((state) => ({
      flashcards: [...state.flashcards, ...mockFlashcards],
      quizzes: [...state.quizzes, mockQuiz],
      mindMapData: { nodes: mockNodes, edges: mockEdges },
    }));
  },
}));
