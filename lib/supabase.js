// ============================================================
// lib/supabase.js — the bridge between your app and Supabase
// ------------------------------------------------------------
// Supabase is a hosted PostgreSQL database with an instant API.
// This file creates ONE shared client the whole app can import.
//
// The two values below come from your Supabase project settings
// (Project Settings → API). They live in a file called .env.local
// which is NEVER committed to git (see .gitignore).
// ============================================================

import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// If Supabase isn't configured yet, we export `null`.
// The app detects this and runs in "demo mode" with sample data,
// so you can play with the UI before setting up the database.
export const supabase = url && anonKey ? createClient(url, anonKey) : null;
