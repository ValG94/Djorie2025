import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY

console.log('🔧 Connexion à Supabase...')
console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
})

async function createAdminUser() {
  try {
    console.log('\n📝 Création de l\'utilisateur admin...')

    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: 'blankcontact1@gmail.com',
      password: 'admin123',
      email_confirm: true,
      user_metadata: {
        name: 'Administrateur Principal'
      }
    })

    if (authError) {
      console.error('❌ Erreur lors de la création dans auth.users:', authError)
      return
    }

    console.log('✅ Utilisateur créé dans auth.users:', authData.user.id)

    console.log('\n📝 Création de l\'entrée dans public.users...')

    const { data: userData, error: userError } = await supabase
      .from('users')
      .insert({
        id: authData.user.id,
        email: 'blankcontact1@gmail.com',
        name: 'Administrateur Principal',
        role: 'admin'
      })
      .select()

    if (userError) {
      console.error('❌ Erreur lors de la création dans public.users:', userError)
      return
    }

    console.log('✅ Entrée créée dans public.users')
    console.log('\n🎉 SUCCÈS ! Utilisateur admin créé:')
    console.log('   Email: blankcontact1@gmail.com')
    console.log('   Password: admin123')
    console.log('   ID:', authData.user.id)

  } catch (error) {
    console.error('❌ Erreur:', error)
  }
}

createAdminUser()
