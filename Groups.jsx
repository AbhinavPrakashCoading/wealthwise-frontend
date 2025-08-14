import React, { useEffect, useState } from 'react'

export default function Groups({ api, token, onOpen }){
  const [groups, setGroups] = useState([])
  const [name, setName] = useState('Goa Trip')

  const load = async ()=>{
    const res = await fetch(`${api}/groups`, { headers: { Authorization: `Bearer ${token}`}})
    const data = await res.json()
    if(res.ok) setGroups(data)
  }
  useEffect(()=>{ load() }, [])

  const create = async (e)=>{
    e.preventDefault()
    const res = await fetch(`${api}/groups`, { method:'POST', headers:{'Content-Type':'application/json', Authorization: `Bearer ${token}`}, body: JSON.stringify({name}) })
    if(res.ok){ await load() }
  }

  return (<div>
    <h3>Your Groups</h3>
    <ul>
      {groups.map(g => <li key={g.id}><button onClick={()=>onOpen(g)}>{g.name}</button></li>)}
    </ul>
    <form onSubmit={create}>
      <input value={name} onChange={e=>setName(e.target.value)} placeholder='Group name' />
      <button type='submit'>Create Group</button>
    </form>
  </div>)
}
