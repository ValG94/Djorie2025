import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://hgxcixjkfrothzbrejkt.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

if (!supabaseServiceKey) {
  console.error('SUPABASE_SERVICE_KEY environment variable is required');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  try {
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'blankcontact1@gmail.com',
      password: 'Test1234*',
      email_confirm: true,
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      return;
    }

    console.log('✅ Auth user created:', authData.user.id);

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert([
        {
          email: 'blankcontact1@gmail.com',
          name: 'Administrateur',
          role: 'admin',
        },
      ])
      .select();

    if (userError) {
      console.error('Error creating user record:', userError);
      return;
    }

    console.log('✅ User record created:', userData);
    console.log('\n🎉 Admin user successfully created!');
    console.log('Email: blankcontact1@gmail.com');
    console.log('Password: Test1234*');
    console.log('\nYou can now login at /admin/login');
  } catch (error) {
    console.error('Unexpected error:', error);
  }
}

createAdminUser();
