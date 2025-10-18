import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { User } from "@supabase/supabase-js";
import { z } from "zod";

const phoneSchema = z.string().regex(/^[6-9]\d{9}$/, "Please enter a valid 10-digit Indian mobile number");

const Onboarding = () => {
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        navigate("/auth");
      } else {
        setUser(user);
      }
    });
  }, [navigate]);

  const validatePhone = (phone: string) => {
    if (!phone) return true; // Phone is optional
    try {
      phoneSchema.parse(phone);
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    if (mobileNumber && !validatePhone(mobileNumber)) {
      toast({
        title: "Invalid Phone Number",
        description: "Please enter a valid 10-digit Indian mobile number starting with 6-9",
        variant: "destructive",
      });
      return;
    }

    if (age && (parseInt(age) < 10 || parseInt(age) > 120)) {
      toast({
        title: "Invalid Age",
        description: "Please enter a valid age between 10 and 120",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          name,
          age: age ? parseInt(age) : null,
          mobile_number: mobileNumber,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast({
        title: "Profile updated!",
        description: "Welcome to CodeMaster",
      });
      navigate("/dashboard");
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-background to-secondary/10">
      <Card className="w-full max-w-lg p-8 card-glow">
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-gradient">Complete Your Profile</h1>
            <p className="text-muted-foreground">Tell us a bit about yourself</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                placeholder="25"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                min="10"
                max="120"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobile">Indian Mobile Number (Optional)</Label>
              <Input
                id="mobile"
                type="tel"
                placeholder="9876543210"
                value={mobileNumber}
                onChange={(e) => setMobileNumber(e.target.value)}
                maxLength={10}
              />
              <p className="text-xs text-muted-foreground">
                Enter 10-digit mobile number without country code
              </p>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-secondary hover:opacity-90 transition-opacity"
              disabled={loading}
            >
              {loading ? "Saving..." : "Continue"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Onboarding;