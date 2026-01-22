// Update the static JSON file to mark items 31, 265, and 154 as sold
const fs = require('fs');
const path = require('path');

const jsonPath = path.join(__dirname, 'data', 'generated-inventory.json');

console.log('📝 Updating static inventory JSON...\n');

// Read the current JSON
const inventory = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

let updated = 0;
const now = new Date().toISOString();
const itemsToMark = [31, 265, 154];

// Update items 31, 265, and 154
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
