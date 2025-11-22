const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

const tagMappings = [
  // Dish category
  { searchTerms: ['lobster', 'diamond', 'club'], addTag: 'dish' },

  // Goddess category
  { searchTerms: ['goddess'], addTag: 'goddess' },

  // Swan category
  { searchTerms: ['swan'], addTag: 'swan' },

  // Baby category
  { searchTerms: ['baby', 'doll'], addTag: 'baby' },

  // Ocean category
  { searchTerms: ['wave', 'wall fish', 'fish'], addTag: 'ocean' },
];

async function updateTags() {
  console.log('Fetching all products...');
  const { data: products, error } = await supabase
    .from('products')
    .select('*');

  if (error) {
    console.error('Error fetching products:', error);
    return;
  }

  console.log(`Found ${products.length} products`);

  for (const product of products) {
    const nameLower = product.name.toLowerCase();
    const slugLower = product.slug.toLowerCase();
    let newTags = [...(product.tags || [])];
    let updated = false;

    for (const mapping of tagMappings) {
      const matches = mapping.searchTerms.some(term =>
        nameLower.includes(term) || slugLower.includes(term)
      );

      if (matches && !newTags.includes(mapping.addTag)) {
        newTags.push(mapping.addTag);
        updated = true;
        console.log(`Adding "${mapping.addTag}" to ${product.name}`);
      }
    }

    if (updated) {
      const { error: updateError } = await supabase
        .from('products')
        .update({ tags: newTags })
        .eq('id', product.id);

      if (updateError) {
        console.error(`Failed to update ${product.name}:`, updateError);
      } else {
        console.log(`✅ Updated ${product.name}`);
      }
    }
  }

  console.log('Done!');
}

updateTags();
