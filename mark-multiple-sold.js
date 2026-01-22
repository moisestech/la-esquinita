const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

(async () => {
  const itemsToMark = [40, 55, 96, 60, 140];

  console.log(`Marking items ${itemsToMark.join(', ')} as sold...\n`);

  for (const itemNumber of itemsToMark) {
    // First find the item
    const { data: findData, error: findError } = await supabase
      .from('products')
      .select('inventory_number, name, status, sold_at')
      .eq('inventory_number', itemNumber)
      .single();

    if (findError) {
      console.error(`❌ Error finding item ${itemNumber}:`, findError.message);
      continue;
    }

    console.log(`Found item ${itemNumber}: ${findData.name}`);

    // Update it
    const { data, error } = await supabase
      .from('products')
      .update({
        status: 'active',  // Keep status as 'active' so it shows on site
        sold_at: new Date().toISOString()  // Add sold_at timestamp to mark as sold
      })
      .eq('inventory_number', itemNumber)
      .select();

    if (error) {
      console.error(`❌ Error updating item ${itemNumber}:`, error.message);
    } else {
      console.log(`✅ Marked as sold - Status: ${data[0].status}, Sold at: ${data[0].sold_at}`);
    }
    console.log('');
  }

  console.log('🎉 All items processed!');
})();
