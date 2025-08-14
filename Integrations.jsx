import React, { useState } from 'react'

export default function Integrations({ api, token }){
  const [msg, setMsg] = useState('')

  const connect = async (provider)=>{
    const res = await fetch(`${api}/integrations/connect`, { method:'POST', headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`}, body: JSON.stringify({provider}) })
    const data = await res.json()
    if(res.ok) setMsg(`${provider} connected`) 
    else setMsg(data.detail || 'Failed')
  }

  return (<div>
    <h3>Integrations</h3>
    <p>Connect your providers (placeholders, ready to swap with real APIs).</p>
    <button onClick={()=>connect('zerodha')}>Connect Zerodha</button>{' '}
    <button onClick={()=>connect('aa')}>Connect Account Aggregator</button>
    <p>{msg}</p>
  </div>)
}
