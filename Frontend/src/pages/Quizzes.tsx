import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, XCircle, Trophy, ArrowRight } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useLearningStore } from '@/store/useLearningStore';
import { toast } from 'sonner';

export default function Quizzes() {
  const { quizzes } = useLearningStore();
  const [selectedQuizId, setSelectedQuizId] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const selectedQuiz = quizzes.find((q) => q.id === selectedQuizId);
  const currentQuestion = selectedQuiz?.questions[currentQuestionIndex];

  const handleAnswerSelect = (answer: string) => {
    if (!currentQuestion) return;
    setUserAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: answer,
    }));
  };

  const handleNext = () => {
    if (!selectedQuiz) return;
    
    if (currentQuestionIndex < selectedQuiz.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    } else {
      // Calculate score
      const correctAnswers = selectedQuiz.questions.filter(
        (q) => userAnswers[q.id] === q.correctAnswer
      ).length;
      const score = Math.round((correctAnswers / selectedQuiz.questions.length) * 100);
      
      setShowResults(true);
      toast.success(`Quiz completed! Score: ${score}%`);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setShowResults(false);
  };

  const calculateScore = () => {
    if (!selectedQuiz) return 0;
    const correctAnswers = selectedQuiz.questions.filter(
      (q) => userAnswers[q.id] === q.correctAnswer
    ).length;
    return Math.round((correctAnswers / selectedQuiz.questions.length) * 100);
  };

  if (quizzes.length === 0) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1 className="text-4xl font-bold mb-4">No Quizzes Yet</h1>
            <p className="text-muted-foreground text-lg mb-6">
              Generate learning materials to create quizzes
            </p>
            <Button onClick={() => window.location.href = '/upload'}>
              Upload Materials
            </Button>
          </motion.div>
        </div>
      </Layout>
    );
  }

  // Quiz Selection
  if (!selectedQuizId) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-bold mb-2">Quizzes</h1>
            <p className="text-muted-foreground text-lg">
              Test your knowledge and track your progress
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quizzes.map((quiz, index) => (
              <motion.div
                key={quiz.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <CardTitle>{quiz.title}</CardTitle>
                    <CardDescription>
                      {quiz.questions.length} questions
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      {quiz.completed ? (
                        <Badge variant="secondary">
                          <Trophy className="h-3 w-3 mr-1" />
                          Completed {quiz.score}%
                        </Badge>
                      ) : (
                        <Badge>Not Started</Badge>
                      )}
                      <Button onClick={() => setSelectedQuizId(quiz.id)}>
                        {quiz.completed ? 'Retake' : 'Start'}
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Layout>
    );
  }

  // Quiz Taking Interface
  if (!showResults && currentQuestion) {
    const progress = ((currentQuestionIndex + 1) / selectedQuiz.questions.length) * 100;

    return (
      <Layout>
        <div className="max-w-3xl mx-auto space-y-8">
          <div>
            <Button
              variant="ghost"
              onClick={() => {
                setSelectedQuizId(null);
                handleRestart();
              }}
            >
              ← Back to Quizzes
            </Button>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">{selectedQuiz.title}</h2>
              <span className="text-sm text-muted-foreground">
                Question {currentQuestionIndex + 1} of {selectedQuiz.questions.length}
              </span>
            </div>
            <Progress value={progress} className="h-2" />
          </motion.div>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <RadioGroup
                value={userAnswers[currentQuestion.id] || ''}
                onValueChange={handleAnswerSelect}
                className="space-y-3"
              >
                {currentQuestion.options?.map((option) => (
                  <div
                    key={option}
                    className="flex items-center space-x-3 rounded-lg border p-4 hover:bg-muted/50 transition-colors"
                  >
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="flex-1 cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="mt-6 flex justify-end">
                <Button
                  onClick={handleNext}
                  disabled={!userAnswers[currentQuestion.id]}
                >
                  {currentQuestionIndex < selectedQuiz.questions.length - 1
                    ? 'Next Question'
                    : 'Finish Quiz'}
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Results Screen
  if (showResults && selectedQuiz) {
    const score = calculateScore();
    const correctCount = selectedQuiz.questions.filter(
      (q) => userAnswers[q.id] === q.correctAnswer
    ).length;

    return (
      <Layout>
        <div className="max-w-4xl mx-auto space-y-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6">
              <Trophy className="h-10 w-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2">Quiz Completed!</h1>
            <p className="text-muted-foreground text-lg">
              You scored {score}% ({correctCount} out of {selectedQuiz.questions.length} correct)
            </p>
          </motion.div>

          <Card>
            <CardHeader>
              <CardTitle>Answer Review</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {selectedQuiz.questions.map((question, index) => {
                const isCorrect = userAnswers[question.id] === question.correctAnswer;
                return (
                  <div key={question.id} className="space-y-3">
                    <div className="flex items-start gap-3">
                      {isCorrect ? (
                        <CheckCircle2 className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                      ) : (
                        <XCircle className="h-5 w-5 text-destructive mt-1 flex-shrink-0" />
                      )}
                      <div className="flex-1">
                        <p className="font-medium mb-2">
                          {index + 1}. {question.question}
                        </p>
                        <div className="space-y-1 text-sm">
                          <p>
                            <span className="text-muted-foreground">Your answer:</span>{' '}
                            <span className={isCorrect ? 'text-success' : 'text-destructive'}>
                              {userAnswers[question.id]}
                            </span>
                          </p>
                          {!isCorrect && (
                            <p>
                              <span className="text-muted-foreground">Correct answer:</span>{' '}
                              <span className="text-success">{question.correctAnswer}</span>
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          <div className="flex gap-4 justify-center">
            <Button onClick={handleRestart}>
              Retake Quiz
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedQuizId(null);
                handleRestart();
              }}
            >
              Back to Quizzes
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  return null;
}
