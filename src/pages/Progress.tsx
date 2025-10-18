import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Clock } from "lucide-react";

interface LanguageProgress {
  language: string;
  totalTopics: number;
  completedTopics: number;
  progress: number;
}

const ProgressPage = () => {
  const [progress, setProgress] = useState<LanguageProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: languages } = await supabase
        .from("programming_languages")
        .select("*");

      if (languages) {
        const progressData: LanguageProgress[] = await Promise.all(
          languages.map(async (lang) => {
            // Get total topics for this language
            const { count: totalTopics } = await supabase
              .from("topics")
              .select("*", { count: "exact", head: true })
              .eq("language_id", lang.id);

            // Get topic IDs for this language
            const { data: topicIds } = await supabase
              .from("topics")
              .select("id")
              .eq("language_id", lang.id);

            let completedCount = 0;
            if (topicIds && topicIds.length > 0) {
              // Get completed topics for this specific language
              const { count: completedTopics } = await supabase
                .from("user_progress")
                .select("*", { count: "exact", head: true })
                .eq("user_id", user.id)
                .eq("completed", true)
                .in("topic_id", topicIds.map(t => t.id));
              
              completedCount = completedTopics || 0;
            }

            const progress =
              totalTopics && totalTopics > 0
                ? Math.round((completedCount / totalTopics) * 100)
                : 0;

            return {
              language: lang.name,
              totalTopics: totalTopics || 0,
              completedTopics: completedCount,
              progress,
            };
          })
        );

        setProgress(progressData);
      }
      setLoading(false);
    };

    fetchProgress();
  }, []);

  const totalCompleted = progress.reduce((sum, p) => sum + p.completedTopics, 0);
  const totalTopics = progress.reduce((sum, p) => sum + p.totalTopics, 0);
  const overallProgress = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Your Progress</h1>
          <p className="text-muted-foreground">Track your learning journey</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6 card-glow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-primary rounded-xl">
                <Trophy className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Overall Progress</p>
                <p className="text-2xl font-bold">{overallProgress}%</p>
              </div>
            </div>
          </Card>

          <Card className="p-6 card-glow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-secondary rounded-xl">
                <Target className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Topics Completed</p>
                <p className="text-2xl font-bold">
                  {totalCompleted} / {totalTopics}
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-6 card-glow">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-primary/20 rounded-xl">
                <Clock className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Keep Learning</p>
                <p className="text-2xl font-bold">Every Day!</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Progress by Language</h2>
          {loading ? (
            <p className="text-muted-foreground">Loading...</p>
          ) : (
            <div className="space-y-4">
              {progress.map((item) => (
                <Card key={item.language} className="p-6 card-glow">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-bold text-lg">{item.language}</h3>
                      <span className="text-sm text-muted-foreground">
                        {item.completedTopics} / {item.totalTopics} topics
                      </span>
                    </div>
                    <Progress value={item.progress} className="h-2" />
                    <p className="text-sm text-muted-foreground">{item.progress}% complete</p>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProgressPage;