import { NextResponse } from "next/server"
import { getSupabaseAdmin, INVENTORY_TABLE } from "@/lib/server/supabase-admin"

export async function POST() {
  try {
    const supabase = getSupabaseAdmin()
    const results: string[] = []

    // Find items with yoda, ET, or UFO in the name
    const { data: alienItems } = await supabase
      .from(INVENTORY_TABLE)
      .select('id, slug, name, tags')
      .or('name.ilike.%yoda%,name.ilike.%et%,name.ilike.%ufo%')

    results.push(`Found ${alienItems?.length || 0} alien items`)

    for (const item of alienItems || []) {
      const existingTags = item.tags || []
      if (!existingTags.includes('alien')) {
        const newTags = [...existingTags, 'alien']
        await supabase
          .from(INVENTORY_TABLE)
          .update({ tags: newTags })
          .eq('id', item.id)
        results.push(`✓ Added 'alien' tag to ${item.slug}`)
      } else {
        results.push(`- ${item.slug} already has 'alien' tag`)
      }
    }

    // Mark item 133 as sold
    const { data: item133 } = await supabase
      .from(INVENTORY_TABLE)
      .select('id, slug')
      .eq('inventory_number', 133)
      .single()

    if (item133) {
      await supabase
        .from(INVENTORY_TABLE)
        .update({
          status: 'active',
          sold_at: new Date().toISOString()
        })
        .eq('id', item133.id)
      results.push(`✓ Marked item 133 (${item133.slug}) as sold`)
    } else {
      results.push(`✗ Item 133 not found`)
    }

    return NextResponse.json({ success: true, results })
  } catch (error) {
    console.error('Update aliens error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
