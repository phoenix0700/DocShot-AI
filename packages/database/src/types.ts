export interface Database {
  public: {
    Tables: {
      projects: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          user_id: string;
          config: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          user_id: string;
          config?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          user_id?: string;
          config?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      screenshots: {
        Row: {
          id: string;
          project_id: string;
          name: string;
          url: string;
          selector: string | null;
          image_url: string | null;
          status: 'pending' | 'captured' | 'failed';
          approval_status: 'pending' | 'approved' | 'rejected';
          approved_by: string | null;
          approved_at: string | null;
          rejection_reason: string | null;
          github_url: string | null;
          integration_status: any | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          project_id: string;
          name: string;
          url: string;
          selector?: string | null;
          image_url?: string | null;
          status?: 'pending' | 'captured' | 'failed';
          approval_status?: 'pending' | 'approved' | 'rejected';
          approved_by?: string | null;
          approved_at?: string | null;
          rejection_reason?: string | null;
          github_url?: string | null;
          integration_status?: any | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          project_id?: string;
          name?: string;
          url?: string;
          selector?: string | null;
          image_url?: string | null;
          status?: 'pending' | 'captured' | 'failed';
          approval_status?: 'pending' | 'approved' | 'rejected';
          approved_by?: string | null;
          approved_at?: string | null;
          rejection_reason?: string | null;
          github_url?: string | null;
          integration_status?: any | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      screenshot_diffs: {
        Row: {
          id: string;
          screenshot_id: string;
          previous_image_url: string;
          current_image_url: string;
          diff_image_url: string | null;
          pixel_diff: number;
          percentage_diff: number;
          total_pixels: number;
          significant: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          screenshot_id: string;
          previous_image_url: string;
          current_image_url: string;
          diff_image_url?: string | null;
          pixel_diff?: number;
          percentage_diff?: number;
          total_pixels?: number;
          significant?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          screenshot_id?: string;
          previous_image_url?: string;
          current_image_url?: string;
          diff_image_url?: string | null;
          pixel_diff?: number;
          percentage_diff?: number;
          total_pixels?: number;
          significant?: boolean;
          created_at?: string;
        };
      };
      approval_history: {
        Row: {
          id: string;
          screenshot_id: string;
          diff_id: string | null;
          action: 'approved' | 'rejected' | 'pending';
          user_id: string;
          reason: string | null;
          metadata: any;
          created_at: string;
        };
        Insert: {
          id?: string;
          screenshot_id: string;
          diff_id?: string | null;
          action: 'approved' | 'rejected' | 'pending';
          user_id: string;
          reason?: string | null;
          metadata?: any;
          created_at?: string;
        };
        Update: {
          id?: string;
          screenshot_id?: string;
          diff_id?: string | null;
          action?: 'approved' | 'rejected' | 'pending';
          user_id?: string;
          reason?: string | null;
          metadata?: any;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  user_id: string;
  config?: any | null;
  created_at: string;
  updated_at: string;
}

export interface Screenshot {
  id: string;
  project_id: string;
  name: string;
  url: string;
  selector?: string | null;
  image_url?: string | null;
  status: 'pending' | 'captured' | 'failed';
  approval_status: 'pending' | 'approved' | 'rejected';
  approved_by?: string | null;
  approved_at?: string | null;
  rejection_reason?: string | null;
  github_url?: string | null;
  integration_status?: any;
  created_at: string;
  updated_at: string;
}
