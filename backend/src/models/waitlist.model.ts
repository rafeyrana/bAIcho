import { supabase } from '../config/supabase';
import { WaitlistEntry } from '../types/waitlist.types';
import { v4 as uuidv4 } from 'uuid';

export const WaitlistModel = {
  async createEntry(entry: WaitlistEntry) {
    const entryWithId = {
      ...entry,
      id: uuidv4() // Generate a new UUID for each entry
    };

    
    const { data, error } = await supabase
      .from('waitlist')
      .insert([entryWithId])
      .select();

    if (error) {
      console.error('Error submitting waitlist entry:', error);
      throw error;
    }
    return data;
  },

  async getAllEntries() {
    const { data, error } = await supabase
      .from('waitlist')
      .select('*');

    if (error) throw error;
    return data;
  }
};
