import { createClient } from "@supabase/supabase-js";

const supabaseUrl : string = process.env.REACT_APP_SUPABASE_URL || "https://zorabffafcnosguxhyax.supabase.co";
const supabaseKey : string = process.env.REACT_APP_SUPABASE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvcmFiZmZhZmNub3NndXhoeWF4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzI0NjgxODQsImV4cCI6MjA0ODA0NDE4NH0.OPM9xRltXMEhJuUJQolLamyBvg7Y0euo8ecXn3FXOJw";

export const supabase = createClient(supabaseUrl, supabaseKey);