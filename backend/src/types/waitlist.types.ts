export interface WaitlistEntry {
  id?: string; // Optional because it will be generated on the server
  email: string;
  name: string;
  position: string;
  industry: string;
  leads_per_week: number;
  company_size: string;
  use_case: string;
}
