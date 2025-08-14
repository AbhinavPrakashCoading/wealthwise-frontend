import React, { useEffect, useState } from 'react'

export default function GroupDetail({ api, token, group, onBack }){
  const [expenses, setExpenses] = useState([])
  const [balances, setBalances] = useState([])
  const [form, setForm] = useState({payer_id:0, amount:0, description:'', splits:[]})
  const [members, setMembers] = useState([]) // {id,email}

  // simplistic: assume members are first 3 demo users (seed), in real app fetch from backend.
  useEffect(()=>{
    setMembers([
      {id:1, email:'alice@example.com'},
      {id:2, email:'bob@example.com'},
      {id:3, email:'carol@example.com'}
    ])
    setForm(f=>({...f, payer_id:1, splits:[{user_id:1, amount:0},{user_id:2, amount:0},{user_id:3, amount:0}]}))
  }, [group.id])

  const loadBalances = async ()=>{
    const res = await fetch(`${api}/groups/${group.id}/balances`, { headers:{ Authorization: `Bearer ${token}`}})
    const data = await res.json()
    if(res.ok) setBalances(data)
  }

  const addExpense = async (e)=>{
    e.preventDefault()
    const res = await fetch(`${api}/groups/${group.id}/expenses`, {
      method:'POST',
      headers:{'Content-Type':'application/json', Authorization:`Bearer ${token}`},
      body: JSON.stringify(form)
    })
    if(res.ok){
      alert('Added expense')
      await loadBalances()
    } else {
      const data = await res.json()
      alert(data.detail || 'Failed')
    }
  }

  useEffect(()=>{ loadBalances() }, [])

  const upiLink = (payeeVpa, payeeName, amount) => `upi://pay?pa=${encodeURIComponent(payeeVpa)}&pn=${encodeURIComponent(payeeName)}&am=${amount.toFixed(2)}&cu=INR&tn=${encodeURIComponent('WealthWise Settlement')}`

  return (<div>
    <button onClick={onBack}>← Back</button>
    <h3>{group.name}</h3>

    <section style={{marginTop:16}}>
      <h4>Add Expense</h4>
      <form onSubmit={addExpense}>
        <label>Payer:
          <select value={form.payer_id} onChange={e=>setForm({...form, payer_id: parseInt(e.target.value)})}>
            {members.map(m => <option key={m.id} value={m.id}>{m.email}</option>)}
          </select>
        </label>
        <label> Amount: <input type='number' step='0.01' value={form.amount} onChange={e=>setForm({...form, amount: parseFloat(e.target.value||0)})} /></label>
        <label> Description: <input value={form.description} onChange={e=>setForm({...form, description: e.target.value})} /></label>
        <div>
          <strong>Splits</strong>
          {form.splits.map((s, idx)=>(
            <div key={idx}>
              {members.find(m=>m.id===s.user_id)?.email || s.user_id}: 
              <input type='number' step='0.01' value={s.amount} onChange={e=>{
                const v = parseFloat(e.target.value||0)
                setForm({...form, splits: form.splits.map((ss,i)=> i===idx? {...ss, amount:v}: ss)})
              }} />
            </div>
          ))}
        </div>
        <button type='submit'>Add</button>
      </form>
    </section>

    <section style={{marginTop:16}}>
      <h4>Balances</h4>
      <ul>
        {balances.map(b => <li key={b.user_id}>
          User #{b.user_id}: {b.net>0?`is owed ₹${b.net}`: b.net<0?`owes ₹${(-b.net).toFixed(2)}`:'settled'}
          {b.net<0 && <a style={{marginLeft:8}} href={upiLink('alice@upi','Alice', -b.net)}>
            Pay via UPI
          </a>}
        </li>)}
      </ul>
    </section>
  </div>)
}
