import { createClient } from '@supabase/supabase-js';
import { type NextApiRequest, type NextApiResponse } from 'next';

// This API simulates a future, more complex booking form submission.
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const { customer, pet, booking, selected_sitter_ids, selected_addon_ids } = req.body;

  if (!customer || !pet || !booking || !selected_sitter_ids?.length) {
    return res.status(400).json({ message: 'Invalid request body.' });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // 1. Find or create the customer
    let customerId: string;
    const { data: existingCustomer } = await supabaseAdmin
      .from('customers')
      .select('id')
      .eq('email', customer.email)
      .single();

    if (existingCustomer) {
      customerId = existingCustomer.id;
    } else {
      const { data: newCustomer, error: customerError } = await supabaseAdmin
        .from('customers')
        .insert({ name: customer.name, email: customer.email })
        .select('id')
        .single();
      if (customerError) throw new Error(`Customer creation failed: ${customerError.message}`);
      customerId = newCustomer!.id;
    }

    // 2. Create the pet record
    const { data: newPet, error: petError } = await supabaseAdmin
      .from('pets')
      .insert({ ...pet, customer_id: customerId })
      .select('id')
      .single();
    if (petError) throw new Error(`Pet creation failed: ${petError.message}`);
    const petId = newPet!.id;

    // 3. Create the booking request
    const { data: newBooking, error: bookingError } = await supabaseAdmin
      .from('booking_requests')
      .insert({ ...booking, customer_id: customerId })
      .select('id')
      .single();
    if (bookingError) throw new Error(`Booking request creation failed: ${bookingError.message}`);
    const bookingId = newBooking!.id;

    // 4. Link the pet to the booking
    const { error: bookingPetError } = await supabaseAdmin
      .from('booking_pets')
      .insert({ booking_request_id: bookingId, pet_id: petId });
    if (bookingPetError) throw new Error(`Booking-pet link failed: ${bookingPetError.message}`);

    // 5. Link the selected sitters to the booking
    const recipientData = selected_sitter_ids.map((sitterId: string) => ({
      booking_request_id: bookingId,
      sitter_id: sitterId,
    }));
    const { error: recipientError } = await supabaseAdmin
      .from('booking_sitter_recipients')
      .insert(recipientData);
    if (recipientError) throw new Error(`Booking-sitter link failed: ${recipientError.message}`);

    // 6. Link selected add-ons to the booking (if any)
    if (selected_addon_ids && selected_addon_ids.length > 0) {
        const addonData = selected_addon_ids.map((addonId: string) => ({
            booking_request_id: bookingId,
            sitter_addon_id: addonId,
        }));
        const { error: addonError } = await supabaseAdmin
            .from('booking_addons')
            .insert(addonData);
        if (addonError) throw new Error(`Booking-addon link failed: ${addonError.message}`);
    }

    res.status(200).json({ message: 'Test booking created successfully!', bookingId });

  } catch (e: any) {
    res.status(500).json({ message: e.message });
  }
}