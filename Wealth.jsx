import React, { useEffect, useState } from 'react'

export default function Wealth({ api, token }){
  const [summary, setSummary] = useState(null)
  const load = async ()=>{
    const res = await fetch(`${api}/wealth/summary`, { headers:{ Authorization: `Bearer ${token}`}})
    const data = await res.json()
    if(res.ok) setSummary(data)
  }
  useEffect(()=>{ load() }, [])

  if(!summary) return <div>Loading...</div>

  return (<div>
    <h3>Wealth Dashboard</h3>
    <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:12}}>
      <Card title='Stocks' value={summary.totals.stock} />
      <Card title='Mutual Funds' value={summary.totals.mutual_fund} />
      <Card title='Bank' value={summary.totals.bank} />
      <Card title='FDs' value={summary.totals.fd} />
    </div>
    <h4 style={{marginTop:16}}>Holdings</h4>
    <table border='1' cellPadding='6'>
      <thead><tr><th>Type</th><th>Name</th><th>Qty</th><th>Value (₹)</th></tr></thead>
      <tbody>
        {summary.holdings.map(h => <tr key={h.id}><td>{h.type}</td><td>{h.name}</td><td>{h.quantity}</td><td>{h.value}</td></tr>)}
      </tbody>
    </table>
  </div>)
}

function Card({ title, value }){
  return <div style={{padding:12, border:'1px solid #ddd', borderRadius:8}}>
    <div style={{fontSize:12, opacity:.7}}>{title}</div>
    <div style={{fontSize:22, fontWeight:700}}>₹{Number(value||0).toLocaleString()}</div>
  </div>
}
