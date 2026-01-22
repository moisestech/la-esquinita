// Update the static JSON file to mark items 33, 48, 176, and 270 as sold
// (Item 140 is already sold, skipping it)
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'data', 'generated-inventory.json');

console.log('📝 Updating static inventory JSON...\n');
console.log('ℹ️  Note: Item 140 is already sold, skipping it.\n');

// Read the current JSON
const inventory = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let updated = 0;
const now = new Date().toISOString();
const itemsToMark = [33, 48, 176, 270];

// Update items 33, 48, 176, and 270
inventory.forEach(item => {
  if (itemsToMark.includes(item.inventoryNumber)) {
    console.log(`Updating item ${item.inventoryNumber}: ${item.title}`);
    item.soldAt = now;
    item.status = 'sold';
    item.availability = 'sold';
    updated++;
  }
});

// Write back to file
fs.writeFileSync(jsonPath, JSON.stringify(inventory, null, 2), 'utf8');

console.log(`\n✅ Updated ${updated} items in static JSON`);
console.log('   File:', jsonPath);
console.log('\n⚠️  Remember to:');
console.log('   1. Restart your Next.js dev server');
console.log('   2. Clear browser cache (Cmd+Shift+R)');
