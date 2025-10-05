import { supabase } from '@/integrations/supabase/client';
import { DiaryEntry, CommunityPost } from '@/types';

export interface UserProfile {
  id: string;
  email: string;
  full_name?: string;
  farm_name?: string;
  location?: any;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  preferences: any;
  created_at: string;
  updated_at: string;
}

export interface AdvisoryHistory {
  id: string;
  user_id: string;
  advisory_type: string;
  status: 'good' | 'caution' | 'alert';
  title: string;
  message: string;
  action?: string;
  location?: any;
  created_at: string;
}

class DatabaseService {
  // Profile Management
  async getProfile(userId: string): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data;
  }

  async updateProfile(userId: string, updates: Partial<UserProfile>): Promise<boolean> {
    const { error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating profile:', error);
      return false;
    }

    return true;
  }

  // Diary Entries
  async getDiaryEntries(userId: string): Promise<DiaryEntry[]> {
    const { data, error } = await supabase
      .from('diary_entries')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching diary entries:', error);
      return [];
    }

    return data.map(entry => ({
      ...entry,
      date: new Date(entry.date),
    }));
  }

  async createDiaryEntry(userId: string, entry: Omit<DiaryEntry, 'id'>): Promise<DiaryEntry | null> {
    const { data, error } = await supabase
      .from('diary_entries')
      .insert([
        {
          ...entry,
          user_id: userId,
          date: entry.date.toISOString().split('T')[0],
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating diary entry:', error);
      return null;
    }

    return {
      ...data,
      date: new Date(data.date),
    };
  }

  async updateDiaryEntry(userId: string, entryId: string, updates: Partial<DiaryEntry>): Promise<boolean> {
    const updateData: any = { ...updates };
    if (updates.date) {
      updateData.date = updates.date.toISOString().split('T')[0];
    }

    const { error } = await supabase
      .from('diary_entries')
      .update(updateData)
      .eq('id', entryId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error updating diary entry:', error);
      return false;
    }

    return true;
  }

  async deleteDiaryEntry(userId: string, entryId: string): Promise<boolean> {
    const { error } = await supabase
      .from('diary_entries')
      .delete()
      .eq('id', entryId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error deleting diary entry:', error);
      return false;
    }

    return true;
  }

  // Community Posts
  async getCommunityPosts(): Promise<CommunityPost[]> {
    const { data, error } = await supabase
      .from('community_posts')
      .select(`
        *,
        profiles:user_id (
          full_name,
          farm_name,
          avatar_url
        )
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching community posts:', error);
      return [];
    }

    return data.map(post => ({
      id: post.id,
      author: post.profiles?.full_name || post.profiles?.farm_name || 'Anonymous',
      content: post.content,
      timestamp: new Date(post.created_at),
      likes: post.likes_count,
    }));
  }

  async createCommunityPost(userId: string, content: string): Promise<CommunityPost | null> {
    const { data, error } = await supabase
      .from('community_posts')
      .insert([
        {
          user_id: userId,
          content,
        },
      ])
      .select(`
        *,
        profiles:user_id (
          full_name,
          farm_name,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error creating community post:', error);
      return null;
    }

    return {
      id: data.id,
      author: data.profiles?.full_name || data.profiles?.farm_name || 'Anonymous',
      content: data.content,
      timestamp: new Date(data.created_at),
      likes: data.likes_count,
    };
  }

  async likePost(postId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('post_likes')
      .insert([
        {
          post_id: postId,
          user_id: userId,
        },
      ]);

    if (error) {
      // If it's a duplicate key error, the user already liked the post
      if (error.code === '23505') {
        return true;
      }
      console.error('Error liking post:', error);
      return false;
    }

    return true;
  }

  async unlikePost(postId: string, userId: string): Promise<boolean> {
    const { error } = await supabase
      .from('post_likes')
      .delete()
      .eq('post_id', postId)
      .eq('user_id', userId);

    if (error) {
      console.error('Error unliking post:', error);
      return false;
    }

    return true;
  }

  // User Preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
      console.error('Error fetching user preferences:', error);
      return null;
    }

    return data;
  }

  async updateUserPreferences(userId: string, preferences: any): Promise<boolean> {
    const { error } = await supabase
      .from('user_preferences')
      .upsert([
        {
          user_id: userId,
          preferences,
          updated_at: new Date().toISOString(),
        },
      ]);

    if (error) {
      console.error('Error updating user preferences:', error);
      return false;
    }

    return true;
  }

  // Advisory History
  async saveAdvisoryHistory(userId: string, advisory: {
    advisory_type: string;
    status: 'good' | 'caution' | 'alert';
    title: string;
    message: string;
    action?: string;
    location?: any;
  }): Promise<boolean> {
    const { error } = await supabase
      .from('advisory_history')
      .insert([
        {
          user_id: userId,
          ...advisory,
        },
      ]);

    if (error) {
      console.error('Error saving advisory history:', error);
      return false;
    }

    return true;
  }

  async getAdvisoryHistory(userId: string): Promise<AdvisoryHistory[]> {
    const { data, error } = await supabase
      .from('advisory_history')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching advisory history:', error);
      return [];
    }

    return data;
  }
}

// Create singleton instance
const databaseService = new DatabaseService();

export default databaseService;
