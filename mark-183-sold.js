const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

(async () => {
  console.log("Looking for item 183...");

  // First, find item 183
  const { data: findData, error: findError } = await supabase
    .from('products')
    .select('*')
    .eq('inventory_number', 183)
    .single();

  if (findError) {
    console.error('Error finding item:', findError);
    return;
  }

  console.log('Found item 183:', findData.name);
  console.log('\n');

  // Mark it as sold with status='active' and sold_at timestamp
  console.log("Marking item 183 as sold...");

  const { data, error } = await supabase
    .from('products')
    .update({
      status: 'active',  // Keep status as 'active' so it shows on site
      sold_at: new Date().toISOString()  // Add sold_at timestamp to mark as sold
    })
    .eq('inventory_number', 183)
    .select();

  if (error) {
    console.error('Error updating:', error);
  } else {
    console.log('✅ Successfully marked item 183 as sold!');
    console.log('Name:', data[0].name);
    console.log('Status:', data[0].status);
    console.log('Sold at:', data[0].sold_at);
  }
})();
