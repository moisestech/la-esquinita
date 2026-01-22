// Script to mark most items as sold, keeping only ~25 random items (2-3 of each type)
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

// Helper to shuffle array
function shuffle(array) {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper to extract item type from name (e.g., "No. 5 · Tuba Ash Tray" -> "tuba ash tray")
function getItemType(name) {
  const parts = name.split('·');
  if (parts.length > 1) {
    return parts[1].trim().toLowerCase();
  }
  return 'unknown';
}

async function markBulkSold() {
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

  console.log('📋 Items grouped by type:');
  Object.keys(itemsByType).sort().forEach(type => {
    console.log(`  ${type}: ${itemsByType[type].length} items`);
  });

  // Select 2-3 random items from each type to KEEP
  const itemsToKeep = [];
  Object.keys(itemsByType).forEach(type => {
    const items = itemsByType[type];
    const shuffled = shuffle(items);
    const keepCount = Math.min(items.length, Math.random() > 0.5 ? 2 : 3); // Randomly 2 or 3
    const kept = shuffled.slice(0, keepCount);
    itemsToKeep.push(...kept);
    console.log(`  Keeping ${keepCount} ${type}(s): ${kept.map(i => `#${i.inventory_number}`).join(', ')}`);
  });

  console.log(`\n✅ Total items to KEEP available: ${itemsToKeep.length}`);

  // All other items will be marked as sold
  const keepInventoryNumbers = new Set(itemsToKeep.map(i => i.inventory_number));
  const itemsToSell = allItems.filter(i => !keepInventoryNumbers.has(i.inventory_number));

  console.log(`❌ Total items to MARK AS SOLD: ${itemsToSell.length}\n`);

  // Ask for confirmation
  console.log('⚠️  This will mark the following as SOLD:');
  console.log(`   ${itemsToSell.map(i => `#${i.inventory_number}`).join(', ')}`);
  console.log('\n📝 Proceeding with bulk update...\n');

  // Mark items as sold in batches
  const now = new Date().toISOString();
  const inventoryNumbersToSell = itemsToSell.map(i => i.inventory_number);

  if (inventoryNumbersToSell.length === 0) {
    console.log('✅ No items to mark as sold!');
    return;
  }

  // Update in batches of 50
  const batchSize = 50;
  let totalUpdated = 0;

  for (let i = 0; i < inventoryNumbersToSell.length; i += batchSize) {
    const batch = inventoryNumbersToSell.slice(i, i + batchSize);

    const { error: updateError } = await supabase
      .from('products')
      .update({
        sold_at: now,
        updated_at: now
      })
      .in('inventory_number', batch);

    if (updateError) {
      console.error(`❌ Error updating batch ${Math.floor(i / batchSize) + 1}:`, updateError);
    } else {
      totalUpdated += batch.length;
      console.log(`✅ Updated batch ${Math.floor(i / batchSize) + 1}: ${batch.length} items (Total: ${totalUpdated}/${inventoryNumbersToSell.length})`);
    }
  }

  console.log(`\n✨ Bulk update complete!`);
  console.log(`   Marked ${totalUpdated} items as sold`);
  console.log(`   Kept ${itemsToKeep.length} items available`);

  // Show final stats
  const { count: totalSold } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .not('sold_at', 'is', null);

  const { count: totalItems } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true });

  console.log(`\n📊 Final Statistics:`);
  console.log(`   Total Collection: ${totalItems} items`);
  console.log(`   Sold: ${totalSold} items`);
  console.log(`   Available: ${totalItems - totalSold} items`);
}

markBulkSold().catch(console.error);
