-- Create lessons table for structured learning content
CREATE TABLE public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view lessons"
  ON public.lessons FOR SELECT
  TO authenticated
  USING (true);

-- Create user lesson progress table
CREATE TABLE public.user_lesson_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id UUID REFERENCES public.lessons(id) ON DELETE CASCADE,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, lesson_id)
);

ALTER TABLE public.user_lesson_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own lesson progress"
  ON public.user_lesson_progress FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON public.user_lesson_progress FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON public.user_lesson_progress FOR UPDATE
  USING (auth.uid() = user_id);