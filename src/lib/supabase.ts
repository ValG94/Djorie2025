import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          role: 'admin' | 'editor' | 'moderator';
          name: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          role?: 'admin' | 'editor' | 'moderator';
          name: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          role?: 'admin' | 'editor' | 'moderator';
          name?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          title_en: string;
          slug: string;
          category: string;
          content: string;
          content_en: string;
          excerpt: string;
          excerpt_en: string;
          image_url: string | null;
          published: boolean;
          published_at: string | null;
          author_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_en: string;
          slug: string;
          category?: string;
          content: string;
          content_en: string;
          excerpt: string;
          excerpt_en: string;
          image_url?: string | null;
          published?: boolean;
          published_at?: string | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_en?: string;
          slug?: string;
          category?: string;
          content?: string;
          content_en?: string;
          excerpt?: string;
          excerpt_en?: string;
          image_url?: string | null;
          published?: boolean;
          published_at?: string | null;
          author_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      videos: {
        Row: {
          id: string;
          title: string;
          title_en: string;
          video_url: string;
          thumbnail_url: string | null;
          description: string;
          description_en: string;
          location: string | null;
          tags: string[];
          duration: number;
          published: boolean;
          event_date: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_en: string;
          video_url: string;
          thumbnail_url?: string | null;
          description: string;
          description_en: string;
          location?: string | null;
          tags?: string[];
          duration?: number;
          published?: boolean;
          event_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_en?: string;
          video_url?: string;
          thumbnail_url?: string | null;
          description?: string;
          description_en?: string;
          location?: string | null;
          tags?: string[];
          duration?: number;
          published?: boolean;
          event_date?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          name: string;
          email: string;
          phone: string | null;
          message_type: 'support' | 'grievance' | 'idea' | 'question';
          subject: string;
          content: string;
          status: 'pending' | 'approved' | 'rejected';
          response: string | null;
          is_public: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          email: string;
          phone?: string | null;
          message_type: 'support' | 'grievance' | 'idea' | 'question';
          subject: string;
          content: string;
          status?: 'pending' | 'approved' | 'rejected';
          response?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          email?: string;
          phone?: string | null;
          message_type?: 'support' | 'grievance' | 'idea' | 'question';
          subject?: string;
          content?: string;
          status?: 'pending' | 'approved' | 'rejected';
          response?: string | null;
          is_public?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      donations: {
        Row: {
          id: string;
          donor_name: string;
          email: string;
          phone: string | null;
          amount: number;
          currency: string;
          payment_method: 'card' | 'mobile_money' | 'bank_transfer';
          payment_provider: string | null;
          transaction_id: string | null;
          status: 'pending' | 'completed' | 'failed' | 'refunded';
          receipt_url: string | null;
          is_anonymous: boolean;
          message: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          donor_name: string;
          email: string;
          phone?: string | null;
          amount: number;
          currency?: string;
          payment_method: 'card' | 'mobile_money' | 'bank_transfer';
          payment_provider?: string | null;
          transaction_id?: string | null;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          receipt_url?: string | null;
          is_anonymous?: boolean;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          donor_name?: string;
          email?: string;
          phone?: string | null;
          amount?: number;
          currency?: string;
          payment_method?: 'card' | 'mobile_money' | 'bank_transfer';
          payment_provider?: string | null;
          transaction_id?: string | null;
          status?: 'pending' | 'completed' | 'failed' | 'refunded';
          receipt_url?: string | null;
          is_anonymous?: boolean;
          message?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      newsletter_subscriptions: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          confirmed: boolean;
          confirmation_token: string | null;
          language: 'fr' | 'en';
          subscribed_at: string;
          confirmed_at: string | null;
          unsubscribed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          confirmed?: boolean;
          confirmation_token?: string | null;
          language?: 'fr' | 'en';
          subscribed_at?: string;
          confirmed_at?: string | null;
          unsubscribed_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          confirmed?: boolean;
          confirmation_token?: string | null;
          language?: 'fr' | 'en';
          subscribed_at?: string;
          confirmed_at?: string | null;
          unsubscribed_at?: string | null;
          created_at?: string;
        };
      };
      program_sections: {
        Row: {
          id: string;
          title: string;
          title_en: string;
          slug: string;
          content: string;
          content_en: string;
          icon: string;
          priority: number;
          color: string;
          published: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          title_en: string;
          slug: string;
          content: string;
          content_en: string;
          icon?: string;
          priority?: number;
          color?: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          title_en?: string;
          slug?: string;
          content?: string;
          content_en?: string;
          icon?: string;
          priority?: number;
          color?: string;
          published?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
