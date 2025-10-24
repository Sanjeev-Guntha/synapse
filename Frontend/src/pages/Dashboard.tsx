import { motion } from 'framer-motion';
import { Upload, Layers, FileQuestion, Network, TrendingUp, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { useLearningStore } from '@/store/useLearningStore';
import { Badge } from '@/components/ui/badge';

export default function Dashboard() {
  const { user } = useAuthStore();
  const { materials, flashcards, quizzes } = useLearningStore();

  const stats = [
    {
      label: 'Materials Uploaded',
      value: materials.length,
      icon: Upload,
      color: 'text-primary',
    },
    {
      label: 'Flashcards Created',
      value: flashcards.length,
      icon: Layers,
      color: 'text-accent',
    },
    {
      label: 'Quizzes Completed',
      value: quizzes.filter(q => q.completed).length,
      icon: FileQuestion,
      color: 'text-success',
    },
    {
      label: 'Learning Streak',
      value: '7 days',
      icon: TrendingUp,
      color: 'text-warning',
    },
  ];

  const quickActions = [
    {
      title: 'Upload New Material',
      description: 'Add documents or YouTube links',
      icon: Upload,
      to: '/upload',
    },
    {
      title: 'Review Flashcards',
      description: 'Practice with your flashcards',
      icon: Layers,
      to: '/flashcards',
    },
    {
      title: 'Take a Quiz',
      description: 'Test your knowledge',
      icon: FileQuestion,
      to: '/quizzes',
    },
    {
      title: 'Explore Mind Maps',
      description: 'Visualize connections',
      icon: Network,
      to: '/mindmap',
    },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl gradient-primary p-8 text-white"
        >
          <div className="relative z-10">
            <h1 className="text-3xl font-bold mb-2">
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-white/90 text-lg">
              Ready to continue your learning journey? Let's make today count!
            </p>
          </div>
          <div className="absolute top-0 right-0 opacity-20">
            <Sparkles className="h-32 w-32" />
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <stat.icon className={`h-8 w-8 ${stat.color}`} />
                    <Badge variant="secondary">{stat.value}</Badge>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <motion.div
                key={action.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link to={action.to}>
                  <Card className="glass hover:shadow-lg transition-all hover:scale-[1.02] cursor-pointer">
                    <CardHeader>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                          <action.icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <CardTitle>{action.title}</CardTitle>
                          <CardDescription>{action.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Materials */}
        {materials.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recent Materials</h2>
              <Link to="/upload">
                <Button variant="outline">View All</Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {materials.slice(0, 3).map((material) => (
                <Card key={material.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{material.title}</CardTitle>
                    <CardDescription className="capitalize">
                      {material.type} • {new Date(material.uploadedAt).toLocaleDateString()}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Badge
                      variant={material.status === 'completed' ? 'default' : 'secondary'}
                    >
                      {material.status}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {materials.length === 0 && (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-xl font-semibold mb-2">No materials yet</h3>
              <p className="text-muted-foreground text-center mb-6">
                Upload your first document to start generating study materials
              </p>
              <Link to="/upload">
                <Button>Upload Material</Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
