// Script to mark items 31, 265, and 154 as SOLD
// Run with: node mark-31-265-154-sold.js

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

async function markItemsAsSold() {
  const itemsToMark = [31, 265, 154];

  console.log('🔍 Checking current status of items 31, 265, and 154...\n');

  // Check current status
  const { data: before, error: beforeError } = await supabase
    .from('products')
    .select('inventory_number, name, status, sold_at')
    .in('inventory_number', itemsToMark)
    .order('inventory_number');

  if (beforeError) {
    console.error('❌ Error fetching items:', beforeError);
    return;
  }

  console.log('BEFORE:');
  console.table(before);

  // Mark all items as sold
  const now = new Date().toISOString();

  for (const itemNum of itemsToMark) {
    console.log(`\n📝 Marking item ${itemNum} as sold...`);
    const { data, error } = await supabase
      .from('products')
      .update({
        sold_at: now,
        updated_at: now
      })
      .eq('inventory_number', itemNum)
      .select();

    if (error) {
      console.error(`❌ Error updating item ${itemNum}:`, error);
    } else {
      console.log(`✅ Item ${itemNum} marked as sold`);
    }
  }

  // Check final status
  console.log('\n🔍 Checking final status...\n');
  const { data: after, error: afterError } = await supabase
    .from('products')
    .select('inventory_number, name, status, sold_at')
    .in('inventory_number', itemsToMark)
    .order('inventory_number');

  if (afterError) {
    console.error('❌ Error fetching final status:', afterError);
    return;
  }

  console.log('AFTER:');
  console.table(after);

  console.log('\n✨ Migration complete! Items 31, 265, and 154 are now marked as sold.');
  console.log('   They will appear on the website with a "Sold Out" overlay.');
}

markItemsAsSold().catch(console.error);
