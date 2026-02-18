import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://ohiqxvvqxwsvfffwkjur.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9oaXF4dnZxeHdzdmZmZndranVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTIxMjIsImV4cCI6MjA4Njk4ODEyMn0.WrzBkHxea69MTWDkq18ELD0DMinQ0FBUofBE5xdQzCo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
