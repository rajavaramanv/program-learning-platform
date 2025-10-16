import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Code2, Zap, Filter } from "lucide-react";

interface Problem {
  id: string;
  title: string;
  description: string;
  difficulty_level: string;
  language_id: string;
  starter_code: string | null;
}

const PracticePage = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [languages, setLanguages] = useState<any[]>([]);
  const [selectedLanguage, setSelectedLanguage] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  useEffect(() => {
    const fetchData = async () => {
      // Fetch languages
      const { data: langData } = await supabase
        .from("programming_languages")
        .select("*")
        .order("name");

      if (langData) setLanguages(langData);

      // Fetch problems
      let query = supabase.from("practice_problems").select("*");

      if (selectedLanguage !== "all") {
        query = query.eq("language_id", selectedLanguage);
      }

      if (selectedDifficulty !== "all") {
        query = query.eq("difficulty_level", selectedDifficulty);
      }

      const { data } = await query.order("difficulty_level");
      if (data) setProblems(data);
    };

    fetchData();
  }, [selectedLanguage, selectedDifficulty]);

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

  const filteredProblems = problems.filter(problem => {
    const matchesLanguage = selectedLanguage === "all" || problem.language_id === selectedLanguage;
    const matchesDifficulty = selectedDifficulty === "all" || problem.difficulty_level === selectedDifficulty;
    return matchesLanguage && matchesDifficulty;
  });

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gradient mb-2">Practice Problems</h1>
          <p className="text-muted-foreground">Sharpen your coding skills with hands-on challenges</p>
        </div>

        <Card className="p-6 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Zap className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-lg mb-1">Practice Makes Perfect</h3>
              <p className="text-sm text-muted-foreground">
                {problems.length} coding challenges across multiple languages
              </p>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-4 mb-6">
            <Filter className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-bold">Filter Problems</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Tabs value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <TabsList className="w-full flex-wrap h-auto">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  {languages.map(lang => (
                    <TabsTrigger key={lang.id} value={lang.id} className="flex-1">
                      {lang.icon} {lang.name}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Difficulty</label>
              <Tabs value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <TabsList className="w-full">
                  <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
                  <TabsTrigger value="easy" className="flex-1">Easy</TabsTrigger>
                  <TabsTrigger value="medium" className="flex-1">Medium</TabsTrigger>
                  <TabsTrigger value="hard" className="flex-1">Hard</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          {filteredProblems.length === 0 ? (
            <Card className="p-12 text-center">
              <Code2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-bold mb-2">No problems match your filters</h3>
              <p className="text-muted-foreground">Try adjusting your filter settings</p>
            </Card>
          ) : (
            filteredProblems.map((problem, index) => (
              <Card key={problem.id} className="p-6 card-glow hover:border-primary transition-all duration-300 cursor-pointer group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                    <span className="text-white font-bold">{index + 1}</span>
                  </div>

                  <div className="flex-1 space-y-3 w-full max-w-full overflow-hidden">
                    <div className="flex items-center gap-3 flex-wrap">
                      <h3 className="font-bold text-lg break-words">Hello World</h3>
                      <div
                        className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 hover:bg-primary/80 bg-code-green/20 text-code-green border-code-green/50"
                      >
                        easy
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground break-words">
                      Write a program that prints "Hello, World!" to the console.
                    </p>

                    <div className="bg-muted/50 rounded-lg p-3 mt-2 w-full overflow-hidden">
                      <p className="text-xs text-muted-foreground mb-2">Starter Code:</p>
                      <div className="w-full overflow-x-auto">
                        <pre className="text-xs whitespace-pre-wrap break-words">
                          <code>def hello_world():
                            # Your code here
                            pass...</code>
                        </pre>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-primary pt-2 flex-wrap">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        className="lucide lucide-code-xml h-4 w-4"
                      >
                        <path d="m18 16 4-4-4-4"></path>
                        <path d="m6 8-4 4 4 4"></path>
                        <path d="m14.5 4-5 16"></path>
                      </svg>
                      <span className="truncate">Start Solving</span>
                    </div>
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