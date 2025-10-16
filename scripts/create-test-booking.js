require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');

// This script creates a test booking request by calling the /api/booking-v2 endpoint.

async function createTestBooking() {
  console.log('🚀 Starting test booking creation...');

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // 1. Fetch specific sitters from the seed data.
  console.log('🔍 Finding sitters to notify...');
  const { data: sitters, error: sitterError } = await supabaseAdmin
    .from('users')
    .select('id, sitters!inner(id)')
    .in('email', ['sitter1@mailinator.com', 'sitter2@mailinator.com']);

  if (sitterError) {
    console.error('❌ Error fetching sitters:', sitterError.message);
    return;
  }
  if (!sitters || sitters.length === 0) {
    console.error('❌ Could not find the seeded sitters. Please re-seed the database.');
    return;
  }
  const selected_sitter_ids = sitters.map(s => s.sitters.id);
  console.log(`✅ Found ${selected_sitter_ids.length} sitter(s) to notify.`);

  // 2. Fetch up to 2 add-ons associated with the first sitter found.
  console.log('🔍 Finding add-ons to include...');
  const { data: addons, error: addonError } = await supabaseAdmin
    .from('sitter_addons')
    .select('id')
    .eq('sitter_id', selected_sitter_ids[0])
    .limit(2);
  
  if (addonError) {
    console.error('❌ Error fetching add-ons:', addonError.message);
    return;
  }
  const selected_addon_ids = addons ? addons.map(a => a.id) : [];
  if (selected_addon_ids.length > 0) {
    console.log(`✅ Found ${selected_addon_ids.length} add-on(s) to include.`);
  } else {
    console.log('ℹ️ No add-ons found for the selected sitter. Proceeding without them.');
  }

  // 3. Define the test data payload.
  const testPayload = {
    customer: {
      name: `Test Customer ${Date.now()}`,
      email: `test.customer.${Date.now()}@example.com`,
    },
    pet: {
      name: 'Buddy',
      breed: 'Test Dog',
      age: 3,
      notes: 'Loves to play fetch.'
    },
    booking: {
      start_date: '2025-12-01',
      end_date: '2025-12-05',
      county: 'County One'
    },
    selected_sitter_ids,
    selected_addon_ids,
  };

  console.log('📦 Sending booking request payload:', JSON.stringify(testPayload, null, 2));

  // 4. Call the new API endpoint.
  try {
    const response = await fetch('http://localhost:3000/api/booking-v2', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testPayload),
    });

    const result = await response.json();
    if (!response.ok) throw new Error(result.message);

    console.log('✅ Success! API Response:', result);

  } catch (error) {
    console.error('❌ Error calling API endpoint:', error.message);
  }
}

createTestBooking();