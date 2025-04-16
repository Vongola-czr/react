
import React,{ useEffect, useState } from 'react'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { supabase } from '../api'
export default function Profile() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    // 监听登录状态变化
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  if (user) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Signed in: {user.email}</p>
        <button onClick={() => supabase.auth.signOut()}>Sign out</button>
      </div>
    )
  }
  return (
    <div style={{ padding: '2rem' }}>
      <Auth
        supabaseClient={supabase}
        appearance={{ theme: ThemeSupa }}
        providers={['github', 'google']} // 可选，支持 OAuth 登录
        theme="default"
      />
    </div>
  )
}

// NEXT_PUBLIC_SUPABASE_URL=https://kjimypxnywfjxfjgvsfm.supabase.co
// NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqaW15cHhueXdmanhmamd2c2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NjE0ODEsImV4cCI6MjA2MDMzNzQ4MX0.iWk0ut0GNJNJHUlwFHNhV2hAAebDZ5AI2mXxMEQWY9Q
// import { createClient } from '@supabase/supabase-js'
// import { Auth } from '@supabase/auth-ui-react'
// import { ThemeSupa } from '@supabase/auth-ui-shared'

// // 创建supabase客户端
// const supabase = createClient(
//   'https://kjimypxnywfjxfjgvsfm.supabase.co',
//   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtqaW15cHhueXdmanhmamd2c2ZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ3NjE0ODEsImV4cCI6MjA2MDMzNzQ4MX0.iWk0ut0GNJNJHUlwFHNhV2hAAebDZ5AI2mXxMEQWY9Q'
// )

// function Profile() {
//   return (
//     <Auth
//       supabaseClient={supabase}
//       appearance={{ theme: ThemeSupa }}
//       providers={['google', 'facebook', 'twitter']} // 支持OAuth登录
//     />
//   )
// }

// export default Profile // 默认导出

