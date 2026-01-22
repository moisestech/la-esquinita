const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

(async () => {
  console.log("Looking for item 231...");

  // First, let's find item 231
  const { data: findData, error: findError } = await supabase
    .from('products')
    .select('*')
    .eq('inventory_number', 231)
    .single();

  if (findError) {
    console.error('Error finding item:', findError);
    return;
  }

  console.log('Found item 231:', findData);
  console.log('\n');

  // Now mark it as sold
  console.log("Marking item 231 as sold...");

  const { data, error } = await supabase
    .from('products')
    .update({
      status: 'sold',
      sold_at: new Date().toISOString()
    })
    .eq('inventory_number', 231)
    .select();

  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('✅ Successfully marked item 231 as sold!');
    console.log('Updated:', data);
  }
})();
