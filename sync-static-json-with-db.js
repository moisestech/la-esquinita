// Sync static JSON file with Supabase database sold items
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

async function syncStaticJSON() {
  console.log('📊 Fetching all sold items from Supabase...\n');

  // Get all sold items from Supabase
  const { data: soldItems, error } = await supabase
    .from('products')
    .select('inventory_number, sold_at')
    .not('sold_at', 'is', null);

  if (error) {
    console.error('❌ Error fetching sold items:', error);
    return;
  }

  console.log(`Found ${soldItems.length} sold items in database\n`);

  // Read static JSON file
  const jsonPath = path.join(__dirname, 'data', 'generated-inventory.json');
  const inventory = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

  // Create a map of sold inventory numbers with their sold_at timestamps
  const soldMap = new Map();
  soldItems.forEach(item => {
    soldMap.set(item.inventory_number, item.sold_at);
  });

  // Update static JSON
  let updated = 0;
  inventory.forEach(item => {
    if (soldMap.has(item.inventoryNumber)) {
      // Mark as sold
      if (!item.soldAt || item.status !== 'sold') {
        item.soldAt = soldMap.get(item.inventoryNumber);
        item.status = 'sold';
        item.availability = 'sold';
        updated++;
      }
    } else {
      // Mark as available if it was marked as sold
      if (item.soldAt || item.status === 'sold') {
        item.soldAt = null;
        item.status = 'active';
        item.availability = 'available';
        updated++;
      }
    }
  });

  // Write back to file
  fs.writeFileSync(jsonPath, JSON.stringify(inventory, null, 2), 'utf8');

  console.log(`✅ Updated ${updated} items in static JSON`);
  console.log(`   File: ${jsonPath}\n`);

  // Show stats
  const soldInJSON = inventory.filter(i => i.soldAt || i.status === 'sold').length;
  console.log(`📊 Static JSON Stats:`);
  console.log(`   Total items: ${inventory.length}`);
  console.log(`   Sold items: ${soldInJSON}`);
  console.log(`   Available items: ${inventory.length - soldInJSON}`);
}

syncStaticJSON().catch(console.error);
