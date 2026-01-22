// Get collection statistics - total items and sold items
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://ezmtyrtlkapqtzhlzhct.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV6bXR5cnRsa2FwcXR6aGx6aGN0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MzMwNTY5NiwiZXhwIjoyMDc4ODgxNjk2fQ.-UoYsva-feHaWoK6hu27YakKsWsT1DXqu4GifBF7F8g'
);

async function getCollectionStats() {
  console.log('📊 La Esquinita Collection Statistics\n');
  console.log('═'.repeat(50));

  // Get total count of products
  const { count: totalCount, error: totalError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .not('inventory_number', 'is', null);

  if (totalError) {
    console.error('❌ Error getting total count:', totalError);
    return;
  }

  // Get sold items count
  const { count: soldCount, error: soldError } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .not('sold_at', 'is', null);

  if (soldError) {
    console.error('❌ Error getting sold count:', soldError);
    return;
  }

  // Get available items count
  const availableCount = totalCount - soldCount;
  const soldPercentage = ((soldCount / totalCount) * 100).toFixed(1);
  const availablePercentage = ((availableCount / totalCount) * 100).toFixed(1);

  console.log('\n📦 Total Collection Size:     ', totalCount, 'items');
  console.log('✅ Sold Items:                ', soldCount, `items (${soldPercentage}%)`);
  console.log('🛍️  Available Items:           ', availableCount, `items (${availablePercentage}%)`);
  console.log('\n' + '═'.repeat(50));

  // Get list of recently sold items (last 10)
  const { data: recentSold, error: recentError } = await supabase
    .from('products')
    .select('inventory_number, name, sold_at')
    .not('sold_at', 'is', null)
    .order('sold_at', { ascending: false })
    .limit(10);

  if (!recentError && recentSold) {
    console.log('\n🕐 Recently Sold (Last 10):');
    console.table(recentSold.map(item => ({
      'Item #': item.inventory_number,
      'Name': item.name,
      'Sold Date': new Date(item.sold_at).toLocaleDateString()
    })));
  }
}

getCollectionStats().catch(console.error);
