import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Code2, Zap } from "lucide-react";

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty_level: string;
}

const PracticePage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);

  useEffect(() => {
    const fetchProblems = async () => {
      const { data } = await supabase
        .from("practice_problems")
        .select("*")
        .order("difficulty_level")
        .limit(10);

      if (data) setProblems(data);
    };

    fetchProblems();
  }, []);

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "easy":
        return "bg-code-green/20 text-code-green border-code-green/50";
      case "medium":
        return "bg-code-yellow/20 text-code-yellow border-code-yellow/50";
      case "hard":
        return "bg-code-orange/20 text-code-orange border-code-orange/50";
      default:
        return "bg-muted";
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Practice Problems</h1>
          <p className="text-muted-foreground">Sharpen your coding skills</p>
        </div>

        <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-secondary rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg mb-1">Coming Soon!</h3>
              <p className="text-sm text-muted-foreground">
                Interactive code editor and problem solving platform
              </p>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {problems.length === 0 ? (
            <Card className="p-12 text-center">
              <Code2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No problems available</h3>
              <p className="text-muted-foreground">Check back later for practice problems</p>
            </Card>
          ) : (
            problems.map((problem, index) => (
              <Card key={problem.id} className="p-6 card-glow hover:border-primary cursor-pointer">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-lg">{problem.title}</h3>
                      <Badge className={getDifficultyColor(problem.difficulty_level)}>
                        {problem.difficulty_level}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{problem.description}</p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default PracticePage;