import React, { useState } from 'react'

export default function Login({ api, onLogin }){
  const [email, setEmail] = useState('alice@example.com')
  const [password, setPassword] = useState('password')
  const submit = async (e)=>{
    e.preventDefault()
    const body = new URLSearchParams()
    body.append('username', email)
    body.append('password', password)
    const res = await fetch(`${api}/auth/login`, { method:'POST', body })
    const data = await res.json()
    if(res.ok){ onLogin(data.access_token) } else { alert(data.detail || 'Login failed') }
  }
  return (<form onSubmit={submit}>
    <h3>Login</h3>
    <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} /><br/>
    <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} /><br/>
    <button type='submit'>Login</button>
  </form>)
}
