import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Upload, FileText, Youtube, Loader2, CheckCircle2 } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { useLearningStore } from '@/store/useLearningStore';
import { toast } from 'sonner';

export default function UploadPage() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [fileName, setFileName] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const { addMaterial, generateContent, materials } = useLearningStore();

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      const type = file.name.endsWith('.pdf') ? 'pdf' : 'docx';
      addMaterial({
        title: file.name,
        type,
        status: 'processing',
      });
      toast.success(`${file.name} uploaded successfully`);
    }
  }, [addMaterial]);

  const handleYoutubeSubmit = useCallback(() => {
    if (youtubeUrl) {
      addMaterial({
        title: `YouTube: ${youtubeUrl}`,
        type: 'youtube',
        status: 'processing',
      });
      toast.success('YouTube link added successfully');
      setYoutubeUrl('');
    }
  }, [youtubeUrl, addMaterial]);

  const handleGenerate = async () => {
    if (materials.length === 0) {
      toast.error('Please upload a material first');
      return;
    }

    const latestMaterial = materials[materials.length - 1];
    setIsGenerating(true);
    setProgress(0);

    // Simulate progress
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 10;
      });
    }, 300);

    try {
      await generateContent(latestMaterial.id);
      setProgress(100);
      toast.success('Learning materials generated successfully!');
    } catch (error) {
      toast.error('Failed to generate materials');
    } finally {
      clearInterval(interval);
      setTimeout(() => {
        setIsGenerating(false);
        setProgress(0);
      }, 1000);
    }
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-bold mb-2">Upload Materials</h1>
          <p className="text-muted-foreground text-lg">
            Upload documents or add YouTube links to generate personalized study materials
          </p>
        </motion.div>

        <Tabs defaultValue="file" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="file">
              <FileText className="h-4 w-4 mr-2" />
              Document
            </TabsTrigger>
            <TabsTrigger value="youtube">
              <Youtube className="h-4 w-4 mr-2" />
              YouTube
            </TabsTrigger>
          </TabsList>

          <TabsContent value="file">
            <Card>
              <CardHeader>
                <CardTitle>Upload Document</CardTitle>
                <CardDescription>
                  Supports PDF and DOCX files up to 50MB
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary transition-colors">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <Label
                    htmlFor="file-upload"
                    className="cursor-pointer text-primary hover:underline text-lg font-medium"
                  >
                    Click to upload
                  </Label>
                  <p className="text-sm text-muted-foreground mt-2">
                    or drag and drop your file here
                  </p>
                  <Input
                    id="file-upload"
                    type="file"
                    accept=".pdf,.docx"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                  {fileName && (
                    <div className="mt-4 flex items-center justify-center gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-success" />
                      <span>{fileName}</span>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="youtube">
            <Card>
              <CardHeader>
                <CardTitle>YouTube Link</CardTitle>
                <CardDescription>
                  Paste a YouTube video URL to extract and learn from its content
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex gap-4">
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={youtubeUrl}
                    onChange={(e) => setYoutubeUrl(e.target.value)}
                  />
                  <Button onClick={handleYoutubeSubmit}>
                    Add Link
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Materials List */}
        {materials.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Your Materials</CardTitle>
              <CardDescription>
                {materials.length} material{materials.length !== 1 && 's'} uploaded
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {materials.map((material) => (
                  <div
                    key={material.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      {material.type === 'youtube' ? (
                        <Youtube className="h-5 w-5 text-destructive" />
                      ) : (
                        <FileText className="h-5 w-5 text-primary" />
                      )}
                      <div>
                        <p className="font-medium">{material.title}</p>
                        <p className="text-sm text-muted-foreground capitalize">
                          {material.status}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Generate Button */}
        <Card className="border-primary/50">
          <CardContent className="pt-6">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-xl font-semibold mb-2">Generate Learning Materials</h3>
                <p className="text-muted-foreground">
                  Transform your uploaded materials into flashcards, quizzes, and mind maps
                </p>
              </div>

              {isGenerating && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Generating with AI...</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}

              <Button
                onClick={handleGenerate}
                disabled={isGenerating || materials.length === 0}
                className="w-full"
                size="lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-5 w-5" />
                    Generate Learning Materials
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}
