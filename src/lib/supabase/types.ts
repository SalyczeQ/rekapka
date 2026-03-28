export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          avatar_url: string | null
          color: string | null
          ui_theme: Database['public']['Enums']['ui_theme']
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          name?: string | null
          avatar_url?: string | null
          color?: string | null
          ui_theme?: Database['public']['Enums']['ui_theme']
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          avatar_url?: string | null
          color?: string | null
          ui_theme?: Database['public']['Enums']['ui_theme']
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      teams: {
        Row: {
          id: string
          name: string
          slug: string
          created_by: string
          ics_token: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          slug: string
          created_by: string
          ics_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          slug?: string
          created_by?: string
          ics_token?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'teams_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      team_members: {
        Row: {
          id: string
          team_id: string
          user_id: string
          role: Database['public']['Enums']['team_role']
          joined_at: string
        }
        Insert: {
          id?: string
          team_id: string
          user_id: string
          role?: Database['public']['Enums']['team_role']
          joined_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          user_id?: string
          role?: Database['public']['Enums']['team_role']
          joined_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'team_members_team_id_fkey'
            columns: ['team_id']
            isOneToOne: false
            referencedRelation: 'teams'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'team_members_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      retros: {
        Row: {
          id: string
          team_id: string
          title: string
          status: Database['public']['Enums']['retro_status']
          template: Database['public']['Enums']['retro_template']
          location: string | null
          photo_url: string | null
          date: string
          phase_timer_seconds: number | null
          max_votes: number
          created_by: string
          created_at: string
          completed_at: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          team_id: string
          title: string
          status?: Database['public']['Enums']['retro_status']
          template?: Database['public']['Enums']['retro_template']
          location?: string | null
          photo_url?: string | null
          date?: string
          phase_timer_seconds?: number | null
          max_votes?: number
          created_by: string
          created_at?: string
          completed_at?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          team_id?: string
          title?: string
          status?: Database['public']['Enums']['retro_status']
          template?: Database['public']['Enums']['retro_template']
          location?: string | null
          photo_url?: string | null
          date?: string
          phase_timer_seconds?: number | null
          max_votes?: number
          created_by?: string
          created_at?: string
          completed_at?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'retros_team_id_fkey'
            columns: ['team_id']
            isOneToOne: false
            referencedRelation: 'teams'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'retros_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      categories: {
        Row: {
          id: string
          retro_id: string
          name: string
          icon: string | null
          sort_order: number
          color: string | null
        }
        Insert: {
          id?: string
          retro_id: string
          name: string
          icon?: string | null
          sort_order?: number
          color?: string | null
        }
        Update: {
          id?: string
          retro_id?: string
          name?: string
          icon?: string | null
          sort_order?: number
          color?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'categories_retro_id_fkey'
            columns: ['retro_id']
            isOneToOne: false
            referencedRelation: 'retros'
            referencedColumns: ['id']
          },
        ]
      }
      cards: {
        Row: {
          id: string
          retro_id: string
          category_id: string
          author_id: string
          text: string
          sort_order: number
          group_label: string | null
          is_discussed: boolean
          carried_from_retro_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          retro_id: string
          category_id: string
          author_id: string
          text: string
          sort_order?: number
          group_label?: string | null
          is_discussed?: boolean
          carried_from_retro_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          retro_id?: string
          category_id?: string
          author_id?: string
          text?: string
          sort_order?: number
          group_label?: string | null
          is_discussed?: boolean
          carried_from_retro_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'cards_retro_id_fkey'
            columns: ['retro_id']
            isOneToOne: false
            referencedRelation: 'retros'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cards_category_id_fkey'
            columns: ['category_id']
            isOneToOne: false
            referencedRelation: 'categories'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cards_author_id_fkey'
            columns: ['author_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'cards_carried_from_retro_id_fkey'
            columns: ['carried_from_retro_id']
            isOneToOne: false
            referencedRelation: 'retros'
            referencedColumns: ['id']
          },
        ]
      }
      tags: {
        Row: {
          id: string
          team_id: string
          name: string
          usage_count: number
        }
        Insert: {
          id?: string
          team_id: string
          name: string
          usage_count?: number
        }
        Update: {
          id?: string
          team_id?: string
          name?: string
          usage_count?: number
        }
        Relationships: [
          {
            foreignKeyName: 'tags_team_id_fkey'
            columns: ['team_id']
            isOneToOne: false
            referencedRelation: 'teams'
            referencedColumns: ['id']
          },
        ]
      }
      card_tags: {
        Row: {
          id: string
          card_id: string
          tag_id: string
        }
        Insert: {
          id?: string
          card_id: string
          tag_id: string
        }
        Update: {
          id?: string
          card_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'card_tags_card_id_fkey'
            columns: ['card_id']
            isOneToOne: false
            referencedRelation: 'cards'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'card_tags_tag_id_fkey'
            columns: ['tag_id']
            isOneToOne: false
            referencedRelation: 'tags'
            referencedColumns: ['id']
          },
        ]
      }
      votes: {
        Row: {
          id: string
          card_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          card_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          card_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'votes_card_id_fkey'
            columns: ['card_id']
            isOneToOne: false
            referencedRelation: 'cards'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'votes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
        ]
      }
      action_items: {
        Row: {
          id: string
          retro_id: string
          text: string
          assignee_id: string | null
          due_date: string | null
          status: Database['public']['Enums']['action_status']
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          retro_id: string
          text: string
          assignee_id?: string | null
          due_date?: string | null
          status?: Database['public']['Enums']['action_status']
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          retro_id?: string
          text?: string
          assignee_id?: string | null
          due_date?: string | null
          status?: Database['public']['Enums']['action_status']
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'action_items_retro_id_fkey'
            columns: ['retro_id']
            isOneToOne: false
            referencedRelation: 'retros'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'action_items_assignee_id_fkey'
            columns: ['assignee_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
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
      retro_status: 'draft' | 'writing' | 'grouping' | 'voting' | 'discussing' | 'actions' | 'completed'
      retro_template: 'went_well_improve' | 'mad_sad_glad' | 'start_stop_continue' | 'four_ls' | 'custom'
      team_role: 'owner' | 'facilitator' | 'member'
      action_status: 'open' | 'in_progress' | 'done'
      ui_theme: 'default' | 'cli' | 'msdos' | 'material3' | 'windows'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Convenience type helpers
type PublicSchema = Database[Extract<keyof Database, 'public'>]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema['Tables'] & PublicSchema['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema['Tables'] &
        PublicSchema['Views'])
    ? (PublicSchema['Tables'] &
        PublicSchema['Views'])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema['Tables']
    ? PublicSchema['Tables'][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema['Enums']
    ? PublicSchema['Enums'][PublicEnumNameOrOptions]
    : never
