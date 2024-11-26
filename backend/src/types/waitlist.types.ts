export interface WaitlistEntry {
  id?: string; // Optional because it will be generated on the server
  email: string;
  name: string;
  position: string;
  use_case: string;
}
