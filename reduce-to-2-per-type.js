// Script to reduce available items to only 2 of each type
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

// Helper to extract item type from name
function getItemType(name) {
  const parts = name.split('·');
  if (parts.length > 1) {
    return parts[1].trim().toLowerCase();
  }
  return 'unknown';
}

async function reduceTo2PerType() {
  console.log('📊 Fetching all currently available items...\n');

  // Get all items that are NOT sold
  const { data: allItems, error: fetchError } = await supabase
    .from('products')
    .select('inventory_number, name, slug, sold_at')
    .is('sold_at', null)
    .order('inventory_number');

  if (fetchError) {
    console.error('❌ Error fetching items:', fetchError);
    return;
  }

  console.log(`Found ${allItems.length} available items\n`);

  // Group items by type
  const itemsByType = {};
  allItems.forEach(item => {
    const type = getItemType(item.name);
    if (!itemsByType[type]) {
      itemsByType[type] = [];
    }
    itemsByType[type].push(item);
  });

  console.log('📋 Items currently available by type:');
  Object.keys(itemsByType).sort().forEach(type => {
    console.log(`  ${type}: ${itemsByType[type].length} items`);
  });

  // Keep only 2 of each type, mark extras as sold
  const itemsToSell = [];
  const itemsToKeep = [];

  Object.keys(itemsByType).forEach(type => {
    const items = itemsByType[type];
    if (items.length <= 2) {
      // Keep all if 2 or fewer
      itemsToKeep.push(...items);
      console.log(`  ✅ ${type}: Keeping all ${items.length} (${items.map(i => `#${i.inventory_number}`).join(', ')})`);
    } else {
      // Keep first 2, sell the rest
      itemsToKeep.push(...items.slice(0, 2));
      itemsToSell.push(...items.slice(2));
      console.log(`  ✂️  ${type}: Keeping 2, selling ${items.length - 2} (Keeping: ${items.slice(0, 2).map(i => `#${i.inventory_number}`).join(', ')})`);
    }
  });

  console.log(`\n✅ Total items to KEEP available: ${itemsToKeep.length}`);
  console.log(`❌ Total items to MARK AS SOLD: ${itemsToSell.length}\n`);

  if (itemsToSell.length === 0) {
    console.log('✅ Already at 2 or fewer per type!');
    return;
  }

  console.log('📝 Marking extra items as sold...\n');

  // Mark items as sold
  const now = new Date().toISOString();
  const inventoryNumbersToSell = itemsToSell.map(i => i.inventory_number);

  const { error: updateError } = await supabase
    .from('products')
    .update({
      sold_at: now,
      updated_at: now
    })
    .in('inventory_number', inventoryNumbersToSell);

  if (updateError) {
    console.error('❌ Error updating items:', updateError);
    return;
  }

  console.log(`✅ Successfully marked ${itemsToSell.length} items as sold\n`);

  // Show final stats
  const { count: totalSold } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .not('sold_at', 'is', null);

  const { count: totalItems } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  console.log(`📊 Final Statistics:`);
  console.log(`   Total Collection: ${totalItems} items`);
  console.log(`   Sold: ${totalSold} items (${((totalSold / totalItems) * 100).toFixed(1)}%)`);
  console.log(`   Available: ${totalItems - totalSold} items (${((1 - totalSold / totalItems) * 100).toFixed(1)}%)`);
}

reduceTo2PerType().catch(console.error);
