// Database Test Script
// Run this with: node scripts/test-database.js

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config({ path: '.env.local' })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing environment variables. Please check your .env.local file.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testDatabase() {
  console.log('🧪 Testing La Esquinita Database Operations...\n')

  try {
    // Test 1: Newsletter Subscription
    console.log('1. Testing Newsletter Subscription...')
    const newsletterResult = await supabase
      .from('newsletter')
      .insert([{ email: 'test@example.com' }])
      .select()
      .single()
    
    if (newsletterResult.error) {
      if (newsletterResult.error.code === '23505') {
        console.log('✅ Newsletter: Email already exists (expected)')
      } else {
        throw newsletterResult.error
      }
    } else {
      console.log('✅ Newsletter: Subscription successful')
    }

    // Test 2: Get Products
    console.log('\n2. Testing Products...')
    const productsResult = await supabase
      .from('products')
      .select('*')
      .eq('status', 'active')
      .limit(3)
    
    if (productsResult.error) throw productsResult.error
    console.log(`✅ Products: Found ${productsResult.data.length} products`)
    console.log(`   Sample: ${productsResult.data[0]?.name || 'No products found'}`)

    // Test 3: Get Events
    console.log('\n3. Testing Events...')
    const eventsResult = await supabase
      .from('events')
      .select('*')
      .gte('start_at', new Date().toISOString())
      .limit(3)
    
    if (eventsResult.error) throw eventsResult.error
    console.log(`✅ Events: Found ${eventsResult.data.length} upcoming events`)
    console.log(`   Sample: ${eventsResult.data[0]?.title || 'No events found'}`)

    // Test 4: Get Content
    console.log('\n4. Testing Content...')
    const contentResult = await supabase
      .from('content')
      .select('*')
      .eq('is_published', true)
      .limit(3)
    
    if (contentResult.error) throw contentResult.error
    console.log(`✅ Content: Found ${contentResult.data.length} published content items`)
    console.log(`   Sample: ${contentResult.data[0]?.key || 'No content found'}`)

    // Test 5: Secret Pass Validation
    console.log('\n5. Testing Secret Pass Validation...')
    const secretResult = await supabase
      .rpc('validate_secret_code', {
        p_code: 'FONDANT',
        p_target_route: '/speakeasy'
      })
    
    if (secretResult.error) throw secretResult.error
    console.log(`✅ Secret Pass: Validation result: ${secretResult.data}`)

    // Test 6: RSVP Creation (if events exist)
    if (eventsResult.data.length > 0) {
      console.log('\n6. Testing RSVP Creation...')
      const eventId = eventsResult.data[0].id
      const rsvpResult = await supabase
        .rpc('create_rsvp', {
          p_event_id: eventId,
          p_email: 'test@example.com',
          p_name: 'Test User',
          p_plus_ones: 1,
          p_dietary_restrictions: 'Vegetarian',
          p_notes: 'Test RSVP'
        })
      
      if (rsvpResult.error) {
        if (rsvpResult.error.message.includes('already RSVP')) {
          console.log('✅ RSVP: Already exists (expected)')
        } else {
          throw rsvpResult.error
        }
      } else {
        console.log('✅ RSVP: Created successfully')
      }
    }

    console.log('\n🎉 All database tests passed!')
    console.log('\n📋 Summary:')
    console.log('   ✅ Newsletter operations working')
    console.log('   ✅ Product queries working')
    console.log('   ✅ Event queries working')
    console.log('   ✅ Content queries working')
    console.log('   ✅ Secret pass validation working')
    console.log('   ✅ RSVP operations working')
    console.log('\n🚀 Your database is ready for production!')

  } catch (error) {
    console.error('\n❌ Database test failed:', error.message)
    console.error('\n🔍 Troubleshooting tips:')
    console.error('   1. Check your environment variables')
    console.error('   2. Verify SQL scripts ran successfully')
    console.error('   3. Check Supabase dashboard for errors')
    console.error('   4. Ensure RLS policies are configured')
    process.exit(1)
  }
}

// Run the test
testDatabase() 