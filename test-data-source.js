// Test which data source the website is using
const { createClient } = require('@supabase/supabase-js');

const SUPABASE_URL = 'https://ezmtyrtlkapqtzhlzhct.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g';

console.log('\n🔍 Testing data source connection...\n');
console.log('SUPABASE_URL:', SUPABASE_URL ? '✅ Set' : '❌ Missing');
console.log('SUPABASE_KEY:', SUPABASE_KEY ? '✅ Set' : '❌ Missing');

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.log('\n⚠️  Supabase credentials missing - website will use STATIC JSON fallback\n');
  process.exit(0);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function testConnection() {
  try {
    console.log('\n📡 Testing Supabase connection...');
    const { data, error } = await supabase
      .from('products')
      .select('inventory_number, name, sold_at')
      .in('inventory_number', [101, 267])
      .order('inventory_number');

    if (error) {
      console.error('❌ Supabase query failed:', error);
      console.log('\n⚠️  Website will fall back to STATIC JSON');
      return;
    }

    console.log('✅ Supabase connection successful!\n');
    console.log('Items 101 and 267 from Supabase:');
    console.table(data);

    console.log('\n✅ Website SHOULD be using Supabase data');
    console.log('If items still show as available, try:');
    console.log('  1. Clear browser cache (Cmd+Shift+R)');
    console.log('  2. Restart the dev server');
    console.log('  3. Check Next.js cache');
  } catch (err) {
    console.error('❌ Error:', err.message);
    console.log('\n⚠️  Website will fall back to STATIC JSON');
  }
}

testConnection();
