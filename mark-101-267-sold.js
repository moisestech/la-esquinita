// Script to mark items 101 and 267 as SOLD
// Run with: node mark-101-267-sold.js

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

async function markItemsAsSold() {
  console.log('🔍 Checking current status of items 101 and 267...\n');

  // Check current status
  const { data: before, error: beforeError } = await supabase
    .from('products')
    .select('inventory_number, name, status, sold_at')
    .in('inventory_number', [101, 267])
    .order('inventory_number');

  if (beforeError) {
    console.error('❌ Error fetching items:', beforeError);
    return;
  }

  console.log('BEFORE:');
  console.table(before);

  // Mark item 101 as sold
  console.log('\n📝 Marking item 101 as sold...');
  const { data: item101, error: error101 } = await supabase
    .from('products')
    .update({
      sold_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('inventory_number', 101)
    .select();

  if (error101) {
    console.error('❌ Error updating item 101:', error101);
  } else {
    console.log('✅ Item 101 marked as sold');
  }

  // Mark item 267 as sold
  console.log('\n📝 Marking item 267 as sold...');
  const { data: item267, error: error267 } = await supabase
    .from('products')
    .update({
      sold_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    })
    .eq('inventory_number', 267)
    .select();

  if (error267) {
    console.error('❌ Error updating item 267:', error267);
  } else {
    console.log('✅ Item 267 marked as sold');
  }

  // Check final status
  console.log('\n🔍 Checking final status...\n');
  const { data: after, error: afterError } = await supabase
    .from('products')
    .select('inventory_number, name, status, sold_at')
    .in('inventory_number', [101, 267])
    .order('inventory_number');

  if (afterError) {
    console.error('❌ Error fetching final status:', afterError);
    return;
  }

  console.log('AFTER:');
  console.table(after);

  console.log('\n✨ Migration complete! Items 101 and 267 are now marked as sold.');
  console.log('   They will appear on the website with a "Sold Out" overlay, just like items 1, 2, and 3.');
}

markItemsAsSold().catch(console.error);
