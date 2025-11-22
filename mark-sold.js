const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

(async () => {
  console.log("Marking 001-pie as sold...")

  const { data, error } = await supabase
    .from('products')
    .update({
      status: 'sold',
      sold_at: new Date().toISOString(),
      square_order_id: 'd5bj47dZBNQ6V1PRFpdU9Yt8MzIZY'
    })
    .eq('slug', '001-pie')
    .select();

  if (error) {
    console.error('Error:', error);
  } else {
    console.log('✅ Successfully marked as sold!');
    console.log('Updated:', data);
  }
})();
