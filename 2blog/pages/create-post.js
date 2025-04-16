// pages/create-post.js
import { useState } from 'react'
import { v4 as uuid } from 'uuid'
import { useRouter } from 'next/router'
import dynamic from 'next/dynamic'
import "easymde/dist/easymde.min.css"
import { supabase } from '../api'

const SimpleMDE = dynamic(() => import('react-simplemde-editor'), { ssr: false })
const initialState = { title: '', content: '' }

function CreatePost() {
  const [post, setPost] = useState(initialState)
  const { title, content } = post
  const router = useRouter()
  function onChange(e) {
    setPost(() => ({ ...post, [e.target.name]: e.target.value }))
  }
  async function createNewPost() {
    if (!title || !content) return
    const user = await supabase.auth.getUser()
    // const { data: { user } } = await supabase.auth.getUser()
    console.log(user,'0909');
    if (!user) {
      // 用户未登录，处理错误
      console.error('用户未登录')
      return
    }
    const id = uuid()
    post.id = id
    // const { data } = await supabase
    //   .from('posts')
    //   .insert([
    //       { title, content, user_id: user.id, user_email: user.email }
    //   ])
    //   .single()
    // router.push(`/posts/${data.id}`)

    try {
      const { data, error } = await supabase
        .from('posts')
        .insert([
          { title, content, user_id: user.id, user_email: user.email }
        ])
        .single()
        
      if (error) throw error
      router.push(`/posts/${data.id}`)
    } catch (error) {
      console.error('创建文章失败:', error.message)
    }
  }
  return (
    <div>
      <h1 className="text-3xl font-semibold tracking-wide mt-6">Create new post</h1>
      <input
        onChange={onChange}
        name="title"
        placeholder="Title"
        value={post.title}
        className="border-b pb-2 text-lg my-4 focus:outline-none w-full font-light text-gray-500 placeholder-gray-500 y-2"
      /> 
      <SimpleMDE
        value={post.content}
        onChange={value => setPost({ ...post, content: value })}
      />
      <button
        type="button"
        className="mb-4 bg-green-600 text-white font-semibold px-8 py-2 rounded-lg"
        onClick={createNewPost}
      >Create Post</button>
    </div>
  )
}

export default CreatePost