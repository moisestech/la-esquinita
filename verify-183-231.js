const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

(async () => {
  console.log("Checking items 183 and 231...\n");

  const { data, error } = await supabase
    .from('products')
    .select('inventory_number, name, status, sold_at')
    .in('inventory_number', [183, 231])
    .order('inventory_number');

  if (error) {
    console.error('Error:', error);
  } else {
    console.table(data);

    console.log('\n✅ Verification:');
    data.forEach(item => {
      const willDisplay = item.status === 'active';
      const showsAsSold = !!item.sold_at;
      console.log(`\nItem ${item.inventory_number} (${item.name}):`);
      console.log(`  - Will display on site: ${willDisplay ? '✅ YES' : '❌ NO'}`);
      console.log(`  - Shows as SOLD OUT: ${showsAsSold ? '✅ YES' : '❌ NO'}`);
    });
  }
})();
