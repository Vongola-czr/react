
// 'use client'
// import React,{ useEffect, useState } from 'react'
// import { Auth } from '@supabase/auth-ui-react'
// import { ThemeSupa } from '@supabase/auth-ui-shared'
// import { supabase } from '../api'
// export default function Profile() {
//   const [user, setUser] = useState({})

//   useEffect(() => {
//     const getUser = async () => {
//       const {
//         data: { user },
//       } = await supabase.auth.getUser()
//       setUser(user)
//     }

//     getUser()

//     // 监听登录状态变化
//     const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
//       setUser(session?.user || null)
//     })

//     return () => {
//       authListener.subscription.unsubscribe()
//     }
//   }, [])

//   if (user) {
//     return (
//       <div style={{ padding: '2rem' }}>
//         <p>Signed in: {user.email}</p>
//         <button onClick={() => supabase.auth.signOut()}>Sign out</button>
//       </div>
//     )
//   }
//   return (
//     <div style={{ padding: '2rem' }}>
//       <Auth
//         supabaseClient={supabase}
//         appearance={{ theme: ThemeSupa }}
//         providers={['github', 'google']} // 可选，支持 OAuth 登录
//         theme="default"
//       />
//     </div>
//   )
// }

'use client'
import React, { useEffect, useState } from 'react'
import { supabase } from '../api'

export default function Profile() {
  const [user, setUser] = useState(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true) // 切换登录/注册
  const [error, setError] = useState(null)

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser()
      setUser(user)
    }

    getUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  const handleAuth = async (e) => {
    e.preventDefault()
    setError(null)

    if (isLogin) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) setError(error.message)
      else setUser(data.user)
    } else {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      if (error) setError(error.message)
      else setUser(data.user)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  if (user) {
    return (
      <div style={{ padding: '2rem' }}>
        <p>Signed in as: {user.email}</p>
        <button onClick={handleLogout}>Sign out</button>
      </div>
    )
  }

  return (
    <div style={{ padding: '2rem' }}>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      <form onSubmit={handleAuth}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          required
          onChange={(e) => setEmail(e.target.value)}
        />
        <br />
        <input
          type="password"
          placeholder="Password"
          value={password}
          required
          onChange={(e) => setPassword(e.target.value)}
        />
        <br />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button onClick={() => setIsLogin(!isLogin)} style={{ marginTop: '1rem' }}>
        {isLogin ? 'Go to Register' : 'Go to Login'}
      </button>
    </div>
  )
}
