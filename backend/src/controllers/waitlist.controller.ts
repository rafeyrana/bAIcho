import { Request, Response } from 'express';
import { WaitlistModel } from '../models/waitlist.model';
import { WaitlistEntry } from '../types/waitlist.types';

export const WaitlistController = {
  async submitEntry(req: Request, res: Response) {
    try {
      const entry: WaitlistEntry = req.body;
      
      const result = await WaitlistModel.createEntry(entry);
      res.status(201).json(result);
    } catch (error) {
      console.error('Error submitting waitlist entry:', error);
      res.status(500).json({ error: 'Failed to submit waitlist entry' });
    }
  },

  async getAllEntries(req: Request, res: Response) {
    try {
      const entries = await WaitlistModel.getAllEntries();
      res.status(200).json(entries);
    } catch (error) {
      console.error('Error fetching waitlist entries:', error);
      res.status(500).json({ error: 'Failed to fetch waitlist entries' });
    }
  }
};
