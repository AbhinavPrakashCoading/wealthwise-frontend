import React, { useEffect, useState } from 'react'
import Login from './pages/Login'
import Register from './pages/Register'
import Groups from './pages/Groups'
import GroupDetail from './pages/GroupDetail'
import Wealth from './pages/Wealth'
import Integrations from './pages/Integrations'

const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'

function useToken() {
  const [token, setToken] = useState(localStorage.getItem('token') || '')
  useEffect(() => { localStorage.setItem('token', token || '') }, [token])
  return [token, setToken]
}

export default function App() {
  const [token, setToken] = useToken()
  const [view, setView] = useState('groups')
  const [currentGroup, setCurrentGroup] = useState(null)

  if (!token) {
    return (
      <div style={{maxWidth: 400, margin: '40px auto', fontFamily: 'system-ui'}}>
        <h1>WealthWise</h1>
        <Login api={API_URL} onLogin={setToken} />
        <hr/>
        <Register api={API_URL} />
      </div>
    )
  }

  return (
    <div style={{fontFamily:'system-ui', padding: 16}}>
      <header style={{display:'flex', gap:12, alignItems:'center'}}>
        <h2 style={{marginRight: 'auto'}}>WealthWise</h2>
        <button onClick={()=>setView('groups')}>Groups</button>
        <button onClick={()=>setView('wealth')}>Wealth</button>
        <button onClick={()=>setView('integrations')}>Integrations</button>
        <button onClick={()=>{ localStorage.removeItem('token'); window.location.reload() }}>Logout</button>
      </header>
      <main style={{marginTop: 16}}>
        {view==='groups' && !currentGroup && <Groups api={API_URL} token={token} onOpen={(g)=>{setCurrentGroup(g)}}/>}
        {view==='groups' && currentGroup && <GroupDetail api={API_URL} token={token} group={currentGroup} onBack={()=>setCurrentGroup(null)} />}
        {view==='wealth' && <Wealth api={API_URL} token={token} />}
        {view==='integrations' && <Integrations api={API_URL} token={token} />}
      </main>
    </div>
  )
}
