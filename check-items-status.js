// Check status of items 140, 270, 176, 33, and 48
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

async function checkItems() {
  const itemsToCheck = [140, 270, 176, 33, 48];

  console.log('🔍 Checking status of items 140, 270, 176, 33, and 48...\n');

  const { data, error } = await supabase
    .from('products')
    .select('inventory_number, name, status, sold_at')
    .in('inventory_number', itemsToCheck)
    .order('inventory_number');

  if (error) {
    console.error('❌ Error fetching items:', error);
    return;
  }

  console.table(data);

  const alreadySold = data.filter(item => item.sold_at !== null);
  const needsUpdate = data.filter(item => item.sold_at === null);

  console.log('\n📊 Summary:');
  console.log(`   Already sold: ${alreadySold.length} items`);
  console.log(`   Need to mark as sold: ${needsUpdate.length} items`);

  if (alreadySold.length > 0) {
    console.log('\n✅ Already marked as sold:');
    alreadySold.forEach(item => {
      console.log(`   - Item ${item.inventory_number}: ${item.name}`);
    });
  }

  if (needsUpdate.length > 0) {
    console.log('\n🔄 Need to mark as sold:');
    needsUpdate.forEach(item => {
      console.log(`   - Item ${item.inventory_number}: ${item.name}`);
    });
  }
}

checkItems().catch(console.error);
