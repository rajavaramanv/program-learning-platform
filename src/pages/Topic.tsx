import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { ArrowLeft, CheckCircle2, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Topic {
  id: string;
  title: string;
  content: string;
  difficulty_level: string;
  language_id: string;
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correct_answer: string;
  explanation: string;
}

const TopicPage = () => {
  const { topicId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [currentQuizIndex, setCurrentQuizIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      // Fetch topic
      const { data: topicData } = await supabase
        .from("topics")
        .select("*")
        .eq("id", topicId)
        .single();
      
      if (topicData) setTopic(topicData);

      // Fetch quizzes
      const { data: quizzesData } = await supabase
        .from("quizzes")
        .select("*")
        .eq("topic_id", topicId);
      
      if (quizzesData) {
        const formattedQuizzes = quizzesData.map(quiz => ({
          ...quiz,
          options: Array.isArray(quiz.options) 
            ? quiz.options as string[]
            : JSON.parse(quiz.options as string)
        }));
        setQuizzes(formattedQuizzes);
      }
    };

    fetchData();
  }, [topicId]);

  const handleSubmitAnswer = () => {
    if (!selectedAnswer) return;
    
    const currentQuiz = quizzes[currentQuizIndex];
    const correct = selectedAnswer === currentQuiz.correct_answer;
    
    setIsCorrect(correct);
    setShowResult(true);
    
    if (correct) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuizIndex < quizzes.length - 1) {
      setCurrentQuizIndex(currentQuizIndex + 1);
      setSelectedAnswer("");
      setShowResult(false);
    } else {
      handleCompleteQuiz();
    }
  };

  const handleCompleteQuiz = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || !topic) return;

    // Save quiz score
    await supabase.from("user_quiz_scores").insert({
      user_id: user.id,
      topic_id: topicId,
      score,
      total_questions: quizzes.length
    });

    // Mark topic as completed
    await supabase.from("user_progress").upsert({
      user_id: user.id,
      topic_id: topicId,
      completed: true,
      completed_at: new Date().toISOString()
    });

    toast({
      title: "Topic Completed!",
      description: `You scored ${score}/${quizzes.length}`,
    });

    navigate(`/learn/${topic.language_id}`);
  };

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

  if (!topic) return null;

  const currentQuiz = quizzes[currentQuizIndex];

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate(`/learn/${topic.language_id}`)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Course
          </Button>

          <div className="flex items-center gap-4 mb-6">
            <h1 className="text-4xl font-bold text-gradient">{topic.title}</h1>
            <Badge className={getDifficultyColor(topic.difficulty_level)}>
              {topic.difficulty_level}
            </Badge>
          </div>

          <Card className="p-8 bg-card/50 backdrop-blur-sm">
            <div className="prose prose-invert max-w-none">
              <p className="text-lg leading-relaxed">{topic.content}</p>
            </div>
          </Card>
        </div>

        {quizzes.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold mb-4">Quiz Time!</h2>
            <Card className="p-6 card-glow">
              <div className="space-y-6">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    Question {currentQuizIndex + 1} of {quizzes.length}
                  </span>
                  <span className="text-sm font-medium">
                    Score: {score}/{quizzes.length}
                  </span>
                </div>

                <h3 className="text-xl font-bold">{currentQuiz.question}</h3>

                <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
                  <div className="space-y-3">
                    {currentQuiz.options.map((option, index) => (
                      <div
                        key={index}
                        className={`flex items-center space-x-2 p-4 rounded-lg border transition-all ${
                          showResult
                            ? option === currentQuiz.correct_answer
                              ? "border-code-green bg-code-green/10"
                              : option === selectedAnswer
                              ? "border-destructive bg-destructive/10"
                              : "border-border"
                            : "border-border hover:border-primary"
                        }`}
                      >
                        <RadioGroupItem value={option} id={`option-${index}`} disabled={showResult} />
                        <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                          {option}
                        </Label>
                        {showResult && option === currentQuiz.correct_answer && (
                          <CheckCircle2 className="h-5 w-5 text-code-green" />
                        )}
                        {showResult && option === selectedAnswer && option !== currentQuiz.correct_answer && (
                          <XCircle className="h-5 w-5 text-destructive" />
                        )}
                      </div>
                    ))}
                  </div>
                </RadioGroup>

                {showResult && (
                  <Card className="p-4 bg-muted/50">
                    <p className="text-sm text-muted-foreground">
                      <strong>Explanation:</strong> {currentQuiz.explanation}
                    </p>
                  </Card>
                )}

                <div className="flex gap-3">
                  {!showResult ? (
                    <Button
                      onClick={handleSubmitAnswer}
                      disabled={!selectedAnswer}
                      className="flex-1"
                    >
                      Submit Answer
                    </Button>
                  ) : (
                    <Button onClick={handleNextQuestion} className="flex-1">
                      {currentQuizIndex < quizzes.length - 1 ? "Next Question" : "Complete Topic"}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default TopicPage;
