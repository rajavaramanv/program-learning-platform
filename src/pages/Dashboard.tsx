import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User } from "@supabase/supabase-js";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { BookOpen, Code2, Sparkles } from "lucide-react";

interface Language {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [languages, setLanguages] = useState<Language[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
      }
    });

    const fetchLanguages = async () => {
      const { data } = await supabase
        .from("programming_languages")
        .select("*")
        .order("name");
      
      if (data) setLanguages(data);
    };

    fetchLanguages();
  }, [navigate]);

  if (!user) return null;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-gradient animate-fade-in">
            Welcome to CodeMaster
          </h1>
          <p className="text-xl text-muted-foreground">
            Choose a programming language to start your learning journey
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {languages.map((language, index) => (
            <Card
              key={language.id}
              className={`p-6 card-glow cursor-pointer group hover:border-primary hover:shadow-xl hover:-translate-y-1 transition-all duration-300 animate-fade-in`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => navigate(`/learn/${language.id}`)}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-5xl group-hover:scale-110 transition-transform">{language.icon}</span>
                  <div className={`p-3 rounded-xl bg-gradient-to-br ${language.color} opacity-20 group-hover:opacity-40 transition-all group-hover:rotate-6`}>
                    <Code2 className="h-6 w-6 text-white" />
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{language.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{language.description}</p>
                </div>

                <div className="flex items-center gap-2 text-sm text-primary font-medium">
                  <BookOpen className="h-4 w-4" />
                  <span>Start Learning →</span>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Card className="p-8 bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-gradient-primary rounded-xl">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold mb-1">AI Assistant Available</h3>
              <p className="text-muted-foreground">
                Get instant help with coding problems from our AI chatbot
              </p>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;