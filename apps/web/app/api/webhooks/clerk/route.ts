/* eslint-disable turbo/no-undeclared-env-vars */
import { headers } from 'next/headers';
import { NextRequest, NextResponse } from 'next/server';
import { Webhook } from 'svix';
import { getSupabaseClient } from '@docshot/database';

function getWebhookSecret() {
  const webhookSecret = process.env.CLERK_WEBHOOK_SECRET;
  if (!webhookSecret) {
    throw new Error('Missing CLERK_WEBHOOK_SECRET environment variable');
  }
  return webhookSecret;
}

export async function POST(req: NextRequest) {
  // Get the headers
  const headerPayload = headers();
  const svix_id = headerPayload.get('svix-id');
  const svix_timestamp = headerPayload.get('svix-timestamp');
  const svix_signature = headerPayload.get('svix-signature');

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response('Error occurred -- no svix headers', {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.text();
  const body = JSON.parse(payload);

  // Create a new Svix instance with your secret.
  const wh = new Webhook(getWebhookSecret());

  let evt: any;

  // Verify the payload with the headers
  try {
    evt = wh.verify(payload, {
      'svix-id': svix_id,
      'svix-timestamp': svix_timestamp,
      'svix-signature': svix_signature,
    }) as any;
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error occurred', {
      status: 400,
    });
  }

  // Handle the webhook
  const supabase = getSupabaseClient();
  const { type, data: clerkUser } = evt;

  try {
    switch (type) {
      case 'user.created':
        console.log('User created:', clerkUser.id);

        // Sync user to our database
        await supabase.upsertUser({
          id: clerkUser.id,
          emailAddresses: clerkUser.email_addresses,
          firstName: clerkUser.first_name,
          lastName: clerkUser.last_name,
          imageUrl: clerkUser.image_url,
        });

        console.log('User synced to database successfully');
        break;

      case 'user.updated':
        console.log('User updated:', clerkUser.id);

        // Update user in our database
        await supabase.upsertUser({
          id: clerkUser.id,
          emailAddresses: clerkUser.email_addresses,
          firstName: clerkUser.first_name,
          lastName: clerkUser.last_name,
          imageUrl: clerkUser.image_url,
        });

        console.log('User updated in database successfully');
        break;

      case 'user.deleted':
        console.log('User deleted:', clerkUser.id);

        // Delete user from our database
        await supabase.withUserContext(clerkUser.id, async (client) => {
          await client.from('users').delete().eq('clerk_user_id', clerkUser.id);
        });

        console.log('User deleted from database successfully');
        break;

      default:
        console.log('Unhandled webhook type:', type);
    }

    return NextResponse.json({ message: 'Webhook processed successfully' });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return NextResponse.json({ error: 'Failed to process webhook' }, { status: 500 });
  }
}
