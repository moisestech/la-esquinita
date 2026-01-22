const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

(async () => {
  console.log("Checking items 1, 2, 3 (sold pattern), and items 101, 267 (to be marked as sold)...\n");

  const { data, error } = await supabase
    .from('products')
    .select('inventory_number, name, status, sold_at, square_order_id')
    .in('inventory_number', [1, 2, 3, 101, 267])
    .order('inventory_number');

  if (error) {
    console.error('Error:', error);
  } else {
    console.table(data);
  }

  // Also check all sold items
  console.log("\n\nAll currently sold items:");
  const { data: soldData, error: soldError } = await supabase
    .from('products')
    .select('inventory_number, name, sold_at')
    .not('sold_at', 'is', null)
    .order('inventory_number');

  if (soldError) {
    console.error('Error:', soldError);
  } else {
    console.log(`Found ${soldData.length} sold items:`);
    console.table(soldData);
  }
})();
