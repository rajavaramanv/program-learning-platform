export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      lessons: {
        Row: {
          content: string
          created_at: string | null
          id: string
          order_index: number
          title: string
          topic_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          order_index: number
          title: string
          topic_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          order_index?: number
          title?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      practice_problems: {
        Row: {
          created_at: string | null
          description: string
          difficulty_level: string | null
          id: string
          language_id: string | null
          solution: string | null
          starter_code: string | null
          test_cases: Json | null
          title: string
        }
        Insert: {
          created_at?: string | null
          description: string
          difficulty_level?: string | null
          id?: string
          language_id?: string | null
          solution?: string | null
          starter_code?: string | null
          test_cases?: Json | null
          title: string
        }
        Update: {
          created_at?: string | null
          description?: string
          difficulty_level?: string | null
          id?: string
          language_id?: string | null
          solution?: string | null
          starter_code?: string | null
          test_cases?: Json | null
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "practice_problems_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "programming_languages"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          age: number | null
          created_at: string | null
          email: string
          id: string
          mobile_number: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          age?: number | null
          created_at?: string | null
          email: string
          id: string
          mobile_number?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          age?: number | null
          created_at?: string | null
          email?: string
          id?: string
          mobile_number?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      programming_languages: {
        Row: {
          color: string | null
          created_at: string | null
          description: string | null
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          color?: string | null
          created_at?: string | null
          description?: string | null
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      quizzes: {
        Row: {
          correct_answer: string
          created_at: string | null
          explanation: string | null
          id: string
          options: Json
          question: string
          topic_id: string | null
        }
        Insert: {
          correct_answer: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          options: Json
          question: string
          topic_id?: string | null
        }
        Update: {
          correct_answer?: string
          created_at?: string | null
          explanation?: string | null
          id?: string
          options?: Json
          question?: string
          topic_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          content: string
          created_at: string | null
          difficulty_level: string | null
          id: string
          language_id: string | null
          order_index: number
          title: string
        }
        Insert: {
          content: string
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          language_id?: string | null
          order_index: number
          title: string
        }
        Update: {
          content?: string
          created_at?: string | null
          difficulty_level?: string | null
          id?: string
          language_id?: string | null
          order_index?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "programming_languages"
            referencedColumns: ["id"]
          },
        ]
      }
      user_lesson_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          lesson_id: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          lesson_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      user_notes: {
        Row: {
          content: string
          created_at: string | null
          id: string
          language_id: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          language_id?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          language_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_notes_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "programming_languages"
            referencedColumns: ["id"]
          },
        ]
      }
      user_progress: {
        Row: {
          completed: boolean | null
          completed_at: string | null
          created_at: string | null
          id: string
          topic_id: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          topic_id?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          topic_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_progress_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      user_quiz_scores: {
        Row: {
          created_at: string | null
          id: string
          score: number
          topic_id: string | null
          total_questions: number
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          score: number
          topic_id?: string | null
          total_questions: number
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          score?: number
          topic_id?: string | null
          total_questions?: number
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_quiz_scores_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
