import { createClient } from "@supabase/supabase-js";

const supabaseUrl = 'https://nmiqxgxanhteoorinlci.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5taXF4Z3hhbmh0ZW9vcmlubGNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUwODMzMTIsImV4cCI6MjA3MDY1OTMxMn0.1gezpMa-HPaIrR5pmuydl-rqehekMjHPQkINSG2KVYQ';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase
