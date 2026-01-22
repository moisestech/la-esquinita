const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

(async () => {
  console.log("Checking item 231 current status...\n");

  const { data, error } = await supabase
    .from('products')
    .select('inventory_number, name, status, sold_at')
    .eq('inventory_number', 231)
    .single();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('Item 231 status:');
    console.log('Name:', data.name);
    console.log('Status:', data.status);
    console.log('Sold at:', data.sold_at);
    console.log('\nItem should now appear in the "sold" filter on your website! ✅');
  }
})();
