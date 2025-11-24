import { NextResponse } from "next/server"
import { getSupabaseAdmin, INVENTORY_TABLE } from "@/lib/server/supabase-admin"

export async function POST() {
  try {
    const supabase = getSupabaseAdmin()
    const results: string[] = []

    // 1. Fix 'flaming' -> 'flamingo'
    const { data: flamingItems } = await supabase
      .from(INVENTORY_TABLE)
      .select('id, slug, name')
      .ilike('name', '%flaming%')
      .not('name', 'ilike', '%flamingo%')

    for (const item of flamingItems || []) {
      const newName = item.name.replace(/flaming/gi, 'flamingo')
      await supabase
        .from(INVENTORY_TABLE)
        .update({ name: newName })
        .eq('id', item.id)
      results.push(`✓ Fixed typo: ${item.slug}`)
    }

    // 2. Update flamingo prices to $100
    const { data: flamingos } = await supabase
      .from(INVENTORY_TABLE)
      .select('id, slug')
      .ilike('name', '%flamingo%')

    for (const item of flamingos || []) {
      await supabase
        .from(INVENTORY_TABLE)
        .update({ price: 100 })
        .eq('id', item.id)
      results.push(`✓ Flamingo ${item.slug} -> $100`)
    }

    // 3. Update swans to $120
    const { data: swans } = await supabase
      .from(INVENTORY_TABLE)
      .select('id, slug')
      .ilike('name', '%swan%')

    for (const item of swans || []) {
      await supabase
        .from(INVENTORY_TABLE)
        .update({ price: 120 })
        .eq('id', item.id)
      results.push(`✓ Swan ${item.slug} -> $120`)
    }

    // 4. Update dishes to $75
    const { data: dishes } = await supabase
      .from(INVENTORY_TABLE)
      .select('id, slug')
      .ilike('name', '%dish%')

    for (const item of dishes || []) {
      await supabase
        .from(INVENTORY_TABLE)
        .update({ price: 75 })
        .eq('id', item.id)
      results.push(`✓ Dish ${item.slug} -> $75`)
    }

    // 5. Update tuba ash trays to $100
    const { data: tubas } = await supabase
      .from(INVENTORY_TABLE)
      .select('id, slug')
      .contains('tags', ['tuba'])

    for (const item of tubas || []) {
      await supabase
        .from(INVENTORY_TABLE)
        .update({ price: 100 })
        .eq('id', item.id)
      results.push(`✓ Tuba ${item.slug} -> $100`)
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Fix items error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
