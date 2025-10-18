import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";

interface Lesson {
  id: string;
  topic_id: string;
  title: string;
  content: string;
  order_index: number;
}

interface Topic {
  id: string;
  title: string;
  language_id: string;
}

const Lesson = () => {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [topic, setTopic] = useState<Topic | null>(null);
  const [allLessons, setAllLessons] = useState<Lesson[]>([]);
  const [completed, setCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth");
        return;
      }

      // Fetch current lesson
      const { data: lessonData } = await supabase
        .from("lessons")
        .select("*")
        .eq("id", lessonId)
        .single();

      if (lessonData) {
        setLesson(lessonData);

        // Fetch topic details
        const { data: topicData } = await supabase
          .from("topics")
          .select("*")
          .eq("id", lessonData.topic_id)
          .single();

        if (topicData) setTopic(topicData);

        // Fetch all lessons in this topic
        const { data: lessonsData } = await supabase
          .from("lessons")
          .select("*")
          .eq("topic_id", lessonData.topic_id)
          .order("order_index");

        if (lessonsData) setAllLessons(lessonsData);

        // Check if lesson is completed
        const { data: progressData } = await supabase
          .from("user_lesson_progress")
          .select("completed")
          .eq("user_id", user.id)
          .eq("lesson_id", lessonId)
          .maybeSingle();

        if (progressData) setCompleted(progressData.completed);
      }

      setLoading(false);
    };

    fetchData();
  }, [lessonId, navigate]);

  const handleCompleteLesson = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !lesson) return;

    // Mark lesson as completed
    const { error } = await supabase
      .from("user_lesson_progress")
      .upsert({
        user_id: user.id,
        lesson_id: lesson.id,
        completed: true,
        completed_at: new Date().toISOString(),
      });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to mark lesson as complete",
        variant: "destructive",
      });
      return;
    }

    setCompleted(true);
    toast({
      title: "Lesson Completed!",
      description: "Great job! You've completed this lesson.",
    });
  };

  const handleNext = () => {
    if (!lesson || !allLessons.length) return;

    const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
    
    if (currentIndex < allLessons.length - 1) {
      // Navigate to next lesson
      const nextLesson = allLessons[currentIndex + 1];
      navigate(`/lesson/${nextLesson.id}`);
    } else {
      // Last lesson - navigate to topic quiz
      navigate(`/topic/${lesson.topic_id}`);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-screen">
          <p className="text-muted-foreground">Loading lesson...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!lesson || !topic) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">Lesson not found</p>
          <Button onClick={() => navigate("/dashboard")} className="mt-4">
            Back to Dashboard
          </Button>
        </div>
      </DashboardLayout>
    );
  }

  const currentIndex = allLessons.findIndex(l => l.id === lesson.id);
  const isLastLesson = currentIndex === allLessons.length - 1;

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <Button
            variant="ghost"
            onClick={() => navigate(`/topic/${topic.id}`)}
            className="mb-4"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to {topic.title}
          </Button>

          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Lesson {lesson.order_index} of {allLessons.length}
                  </p>
                  <h1 className="text-3xl font-bold text-gradient">
                    {lesson.title}
                  </h1>
                </div>
                {completed && (
                  <div className="flex items-center gap-2 text-code-green">
                    <CheckCircle className="h-6 w-6" />
                    <span className="font-medium">Completed</span>
                  </div>
                )}
              </div>

              <div className="prose prose-slate dark:prose-invert max-w-none">
                <p className="text-lg leading-relaxed">{lesson.content}</p>
              </div>

              <div className="flex gap-4 pt-6 border-t">
                {!completed && (
                  <Button
                    onClick={handleCompleteLesson}
                    className="bg-gradient-primary hover:opacity-90"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Mark as Complete
                  </Button>
                )}

                <Button
                  onClick={handleNext}
                  variant={completed ? "default" : "outline"}
                  className={completed ? "bg-gradient-primary hover:opacity-90" : ""}
                >
                  {isLastLesson ? "Start Quiz" : "Next Lesson"}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Lesson;
