import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Code2, Sparkles, Trophy, BookOpen } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in
    import("@/integrations/supabase/client").then(({ supabase }) => {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session) {
          navigate("/dashboard");
        }
      });
    });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <nav className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-primary rounded-lg">
              <Code2 className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gradient">CodeMaster</span>
          </div>
          <Button onClick={() => navigate("/auth")} className="bg-gradient-primary">
            Get Started
          </Button>
        </div>
      </nav>

      <main className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          <div className="space-y-6 animate-fade-in">
            <h1 className="text-6xl md:text-7xl font-bold">
              <span className="text-gradient">Master Programming</span>
              <br />
              <span className="text-foreground">with AI Guidance</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Learn Python, Java, C++, and more with interactive lessons, quizzes, and
              real-time AI assistance
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="text-lg px-8 bg-gradient-primary hover:opacity-90"
              >
                Start Learning Free
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="p-6 rounded-2xl bg-card border border-border card-glow">
              <div className="w-12 h-12 bg-gradient-primary rounded-xl flex items-center justify-center mb-4">
                <BookOpen className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Interactive Lessons</h3>
              <p className="text-muted-foreground">
                Learn with structured topics and hands-on examples
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border card-glow">
              <div className="w-12 h-12 bg-gradient-secondary rounded-xl flex items-center justify-center mb-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">AI Assistant</h3>
              <p className="text-muted-foreground">
                Get instant help with your coding questions 24/7
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card border border-border card-glow">
              <div className="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4">
                <Trophy className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">Track Progress</h3>
              <p className="text-muted-foreground">
                Monitor your learning journey with detailed analytics
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
