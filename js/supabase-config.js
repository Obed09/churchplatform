// Supabase Client Configuration
// This file initializes the Supabase client for use throughout the application

// NOTE: In production, these would come from environment variables
// For now, we're embedding them directly since this is a static site
// These keys are SAFE for frontend use (anon key only has RLS-controlled access)

const SUPABASE_CONFIG = {
    url: 'https://ypfignmkwoesqcelckma.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlwZmlnbm1rd29lc3FjZWxja21hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODIxNTg1MzEsImV4cCI6MjA5NzczNDUzMX0.3_IfTV1Bx4-8rZgre8fRMg0U8yLItFNnfUmhpBag55w'
};

// Wait for Supabase library to be ready
if (typeof window.supabase === 'undefined') {
    console.error('❌ Supabase library not loaded! Check CSP and script loading.');
    alert('Database connection failed. Please refresh the page.');
    throw new Error('Supabase library not available');
}

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_CONFIG.url, SUPABASE_CONFIG.anonKey);

console.log('✅ Supabase client initialized:', supabase);
