import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nxazebbbrnxjoxvvyqwh.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54YXplYmJicm54am94dnZ5cXdoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTczNzM5NTQ4NCwiZXhwIjoyMDUyOTcxNDg0fQ.w95sNMO3zY_GBWZ26ipxMJQPXCIBGRd-QdwAo7fPpFQ'

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: {
    schema: 'public',
  },
  global: {
    headers: {
      'x-connection-encrypted': 'true'
    }
  }
})

async function fixItems() {
  console.log('Starting fixes...\n')

  // 1. Fix 'flaming' -> 'flamingo' in names
  console.log('1. Fixing flaming -> flamingo...')
  const { data: flamingItems, error: flamingError } = await supabase
    .from('inventory')
    .select('id, slug, name')
    .ilike('name', '%flaming%')
    .not('name', 'ilike', '%flamingo%')

  if (flamingError) {
    console.error('Error finding flaming items:', flamingError)
  } else {
    console.log(`Found ${flamingItems?.length || 0} items with 'flaming'`)
    for (const item of flamingItems || []) {
      const newName = item.name.replace(/flaming/gi, 'flamingo')
      const { error } = await supabase
        .from('inventory')
        .update({ name: newName })
        .eq('id', item.id)

      if (error) {
        console.error(`Failed to update ${item.slug}:`, error)
      } else {
        console.log(`✓ Updated ${item.slug}: "${item.name}" -> "${newName}"`)
      }
    }
  }

  // 2. Update flamingo price to $100
  console.log('\n2. Updating flamingo prices to $100...')
  const { data: flamingos, error: flamingoError } = await supabase
    .from('inventory')
    .select('id, slug, name, price')
    .ilike('name', '%flamingo%')

  if (flamingoError) {
    console.error('Error finding flamingos:', flamingoError)
  } else {
    console.log(`Found ${flamingos?.length || 0} flamingo items`)
    for (const item of flamingos || []) {
      const { error } = await supabase
        .from('inventory')
        .update({ price: 100 })
        .eq('id', item.id)

      if (error) {
        console.error(`Failed to update ${item.slug}:`, error)
      } else {
        console.log(`✓ Updated ${item.slug}: $${item.price} -> $100`)
      }
    }
  }

  // 3. Update all swans to $120
  console.log('\n3. Updating swan prices to $120...')
  const { data: swans, error: swanError } = await supabase
    .from('inventory')
    .select('id, slug, name, price')
    .ilike('name', '%swan%')

  if (swanError) {
    console.error('Error finding swans:', swanError)
  } else {
    console.log(`Found ${swans?.length || 0} swan items`)
    for (const item of swans || []) {
      const { error } = await supabase
        .from('inventory')
        .update({ price: 120 })
        .eq('id', item.id)

      if (error) {
        console.error(`Failed to update ${item.slug}:`, error)
      } else {
        console.log(`✓ Updated ${item.slug}: $${item.price} -> $120`)
      }
    }
  }

  // 4. Update all regular "dish" to $75
  console.log('\n4. Updating dish prices to $75...')
  const { data: dishes, error: dishError } = await supabase
    .from('inventory')
    .select('id, slug, name, price')
    .ilike('name', '%dish%')

  if (dishError) {
    console.error('Error finding dishes:', dishError)
  } else {
    console.log(`Found ${dishes?.length || 0} dish items`)
    for (const item of dishes || []) {
      const { error } = await supabase
        .from('inventory')
        .update({ price: 75 })
        .eq('id', item.id)

      if (error) {
        console.error(`Failed to update ${item.slug}:`, error)
      } else {
        console.log(`✓ Updated ${item.slug}: $${item.price} -> $75`)
      }
    }
  }

  // 5. Update all tuba ash trays to $100
  console.log('\n5. Updating tuba ash tray prices to $100...')
  const { data: tubas, error: tubaError } = await supabase
    .from('inventory')
    .select('id, slug, name, price')
    .contains('tags', ['tuba'])

  if (tubaError) {
    console.error('Error finding tuba items:', tubaError)
  } else {
    console.log(`Found ${tubas?.length || 0} tuba items`)
    for (const item of tubas || []) {
      const { error } = await supabase
        .from('inventory')
        .update({ price: 100 })
        .eq('id', item.id)

      if (error) {
        console.error(`Failed to update ${item.slug}:`, error)
      } else {
        console.log(`✓ Updated ${item.slug}: $${item.price} -> $100`)
      }
    }
  }

  console.log('\n✅ All fixes complete!')
}

fixItems().catch(console.error)
