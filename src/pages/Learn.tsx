import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, Circle, ArrowLeft } from "lucide-react";

interface Topic {
  id: string;
  title: string;
  content: string;
  difficulty_level: string;
  order_index: number;
}

interface Language {
  id: string;
  name: string;
  icon: string;
  color: string;
}

const Learn = () => {
  const { languageId } = useParams();
  const navigate = useNavigate();
  const [language, setLanguage] = useState<Language | null>(null);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchData = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch language
      const { data: langData } = await supabase
        .from("programming_languages")
        .select("*")
        .eq("id", languageId)
        .single();
      
      if (langData) setLanguage(langData);

      // Fetch topics
      const { data: topicsData } = await supabase
        .from("topics")
        .select("*")
        .eq("language_id", languageId)
        .order("order_index");
      
      if (topicsData) setTopics(topicsData);

      // Fetch user progress
      const { data: progressData } = await supabase
        .from("user_progress")
        .select("topic_id")
        .eq("user_id", user.id)
        .eq("completed", true);
      
      if (progressData) {
        setCompletedTopics(new Set(progressData.map(p => p.topic_id)));
      }
    };

    fetchData();
  }, [languageId]);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-code-green/20 text-code-green border-code-green/50";
      case "intermediate":
        return "bg-code-yellow/20 text-code-yellow border-code-yellow/50";
      case "advanced":
        return "bg-code-orange/20 text-code-orange border-code-orange/50";
      default:
        return "bg-muted";
    }
  };

  const progress = topics.length > 0 ? (completedTopics.size / topics.length) * 100 : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/dashboard")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
          
          {language && (
            <div className="flex items-center gap-4 mb-4">
              <span className="text-6xl">{language.icon}</span>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-gradient mb-2">
                  {language.name} Course
                </h1>
                <p className="text-muted-foreground">
                  {topics.length} topics • {completedTopics.size} completed
                </p>
              </div>
            </div>
          )}

          <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">Course Progress</span>
                <span className="text-muted-foreground">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-3" />
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          {topics.map((topic, index) => {
            const isCompleted = completedTopics.has(topic.id);
            const isPrevCompleted = index === 0 || completedTopics.has(topics[index - 1].id);
            const isLocked = !isPrevCompleted;

            return (
              <Card
                key={topic.id}
                className={`p-6 card-glow transition-all duration-300 ${
                  isLocked ? "opacity-60 cursor-not-allowed" : "hover:border-primary cursor-pointer"
                }`}
                onClick={() => !isLocked && navigate(`/topic/${topic.id}`)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-lg ${
                    isCompleted ? "bg-gradient-primary" : "bg-muted"
                  } flex items-center justify-center flex-shrink-0`}>
                    {isCompleted ? (
                      <CheckCircle2 className="h-6 w-6 text-white" />
                    ) : (
                      <Circle className="h-6 w-6 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg">{topic.title}</h3>
                      <Badge className={getDifficultyColor(topic.difficulty_level)}>
                        {topic.difficulty_level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {topic.content}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-primary">
                      <BookOpen className="h-4 w-4" />
                      <span>{isLocked ? "Complete previous topic to unlock" : isCompleted ? "Review Topic" : "Start Learning"}</span>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Learn;
