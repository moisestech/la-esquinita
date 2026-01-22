const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

(async () => {
  console.log("Fixing item 231 and 1 - setting status to 'active' but keeping sold_at timestamp...\n");

  // Fix item 231
  const { data: data231, error: error231 } = await supabase
    .from('products')
    .update({
      status: 'active'
      // Keep sold_at timestamp as-is
    })
    .eq('inventory_number', 231)
    .select();

  if (error231) {
    console.error('Error updating 231:', error231);
  } else {
    console.log('✅ Fixed item 231:');
    console.log('  Status:', data231[0].status);
    console.log('  Sold at:', data231[0].sold_at);
  }

  console.log('\n');

  // Fix item 1
  const { data: data1, error: error1 } = await supabase
    .from('products')
    .update({
      status: 'active'
      // Keep sold_at timestamp as-is
    })
    .eq('inventory_number', 1)
    .select();

  if (error1) {
    console.error('Error updating 1:', error1);
  } else {
    console.log('✅ Fixed item 1:');
    console.log('  Status:', data1[0].status);
    console.log('  Sold at:', data1[0].sold_at);
  }

  console.log('\n🎉 Both items should now show as sold on your website!');
})();
