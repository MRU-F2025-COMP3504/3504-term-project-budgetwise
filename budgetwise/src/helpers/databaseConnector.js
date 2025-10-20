import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://dtqgmkerawefgtvskxhk.supabase.co'
const supabaseKey = 'sb_secret_E1Ef5B7X5qxswkgwFo4z2Q_wzHWp6rD'
const supabase = createClient(supabaseUrl, supabaseKey)




export default supabase;
