import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://mfzskeomwclswndyoxyb.supabase.co'
const supabaseKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1menNrZW9td2Nsc3duZHlveHliIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM2MTg1MTksImV4cCI6MjA1OTE5NDUxOX0.-g7F6c21U-mr8aWfT353ELLi-nZkYz403IGWz-67ORw'
export const supabase = createClient(supabaseUrl, supabaseKey)
