import React, { useState } from 'react'

export default function Register({ api }){
  const [email, setEmail] = useState('newuser@example.com')
  const [password, setPassword] = useState('password')
  const [name, setName] = useState('New User')
  const [upi, setUpi] = useState('new@upi')
  const submit = async (e)=>{
    e.preventDefault()
    const res = await fetch(`${api}/auth/register`, { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({email, password, full_name: name, upi_id: upi}) })
    const data = await res.json()
    if(res.ok){ alert('Registered. Now login above.')} else { alert(data.detail || 'Failed') }
  }
  return (<form onSubmit={submit}>
    <h3>Register</h3>
    <input placeholder='email' value={email} onChange={e=>setEmail(e.target.value)} /><br/>
    <input placeholder='password' type='password' value={password} onChange={e=>setPassword(e.target.value)} /><br/>
    <input placeholder='full name' value={name} onChange={e=>setName(e.target.value)} /><br/>
    <input placeholder='UPI ID (optional)' value={upi} onChange={e=>setUpi(e.target.value)} /><br/>
    <button type='submit'>Create Account</button>
  </form>)
}
