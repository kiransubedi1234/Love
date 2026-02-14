// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'


const SUPABASE_URL = 'https://nrvqojqlhzzwdtmhnysr.supabase.co'
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ydnFvanFsaHp6d2R0bWhueXNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEwMzU0ODUsImV4cCI6MjA4NjYxMTQ4NX0.wakiLJenyC0fGvXXtrrBvV84zCmNJoTLsxEz4-0ivsQ'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)