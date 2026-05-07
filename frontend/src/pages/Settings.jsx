import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useSim }  from '../context/SimContext';
import { showToast } from '../components/Toast';

const AVATAR_COLORS = ['#7C6EFA','#34D399','#F59E0B','#F87171','#60A5FA','#A78BFA','#EC4899'];

export default function Settings() {
  const { user, update, logout } = useAuth();
  const { resetSims } = useSim();
  const [tab, setTab] = useState('account');
  const [form, setForm] = useState({
    name:`${user?.name||''} ${user?.lname||''}`.trim(),
    email:user?.email||'',
    city:user?.city||'',
    role:user?.role||'',
    college:user?.college||'',
    degree:user?.degree||'',
    branch:user?.branch||'',
    gradyear:user?.gradyear||'',
    skills:(user?.skills||[]).join(', ')
  });

  const inp = { background:'var(--s2)', border:'1px solid var(--border2)', borderRadius:8, padding:'9px 12px', color:'var(--text)', fontSize:14, outline:'none', width:220, maxWidth:'100%' };
  const sel = { ...inp, cursor:'pointer' };
  const navItem = (t) => ({ padding:'10px 14px', borderRadius:8, fontSize:13, fontWeight:500, cursor:'pointer', display:'flex', alignItems:'center', gap:8, color:tab===t?'var(--accent)':'var(--muted2)', background:tab===t?'rgba(124,110,250,.12)':'transparent' });
  const row = { display:'flex', alignItems:'center', justifyContent:'space-between', padding:'14px 0', borderBottom:'1px solid var(--border)', gap:12, flexWrap:'wrap' };

  const save = () => {
    const parts = form.name.trim().split(' ');
    update({
      name:parts[0], lname:parts.slice(1).join(' '),
      email:form.email, city:form.city, role:form.role,
      college:form.college, degree:form.degree, branch:form.branch,
      gradyear:form.gradyear,
      skills:form.skills.split(',').map(s=>s.trim()).filter(Boolean)
    });
    showToast('✅ Settings saved!');
  };

  const Toggle = ({ val, onToggle }) => (
    <button onClick={onToggle} style={{width:44,height:24,borderRadius:12,border:'none',cursor:'pointer',position:'relative',background:val?'var(--accent)':'var(--s3)',flexShrink:0}}>
      <div style={{position:'absolute',top:3,width:18,height:18,borderRadius:'50%',background:'#fff',transition:'left .2s',left:val?23:3}}/>
    </button>
  );

  return (
    <div style={{padding:'28px 32px',overflowY:'auto',flex:1}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:22,fontWeight:800}}>⚙️ Settings</h1>
      </div>
      <div style={{display:'grid',gridTemplateColumns:'200px 1fr',gap:24}}>

        {/* Nav */}
        <div style={{background:'var(--s1)',border:'1px solid var(--border)',borderRadius:14,padding:8,height:'fit-content'}}>
          {[['account','👤 Account'],['education','🎓 Education'],['notifications','🔔 Notifications'],['privacy','🔒 Privacy'],['danger','⚠️ Danger Zone']].map(([t,l])=>(
            <div key={t} style={{
              ...navItem(t),
              color:t==='danger'&&tab!==t?'var(--rose)':tab===t?'var(--accent)':'var(--muted2)'
            }} onClick={()=>setTab(t)}>{l}</div>
          ))}
        </div>

        {/* Panel */}
        <div style={{background:'var(--s1)',border:'1px solid var(--border)',borderRadius:14,padding:28}}>

          {/* Account */}
          {tab==='account'&&<>
            <div style={{fontSize:18,fontWeight:800,marginBottom:6}}>Account Settings</div>
            <div style={{fontSize:13,color:'var(--muted2)',marginBottom:28}}>Manage your credentials and preferences</div>
            {[
              ['Full Name','text',form.name,v=>setForm({...form,name:v})],
              ['Email','email',form.email,v=>setForm({...form,email:v})],
              ['City','text',form.city,v=>setForm({...form,city:v})]
            ].map(([l,t,v,s])=>(
              <div key={l} style={row}>
                <div><div style={{fontSize:14,fontWeight:600}}>{l}</div></div>
                <input style={inp} type={t} value={v} onChange={e=>s(e.target.value)}/>
              </div>
            ))}
            <div style={row}>
              <div><div style={{fontSize:14,fontWeight:600}}>Target Role</div></div>
              <select style={sel} value={form.role} onChange={e=>setForm({...form,role:e.target.value})}>
                {['Software Developer','Data Scientist','Finance Analyst','UI/UX Designer','DevOps Engineer','Product Manager','AI Engineer'].map(r=>(
                  <option key={r}>{r}</option>
                ))}
              </select>
            </div>
            <div style={{marginTop:16}}>
              <div style={{fontSize:14,fontWeight:600,marginBottom:12}}>Avatar Color</div>
              <div style={{display:'flex',alignItems:'center',gap:16,flexWrap:'wrap'}}>
                <div style={{
                  width:56,height:56,borderRadius:'50%',
                  background:(user?.avatarColor||'#7C6EFA')+'33',
                  color:user?.avatarColor||'#7C6EFA',
                  display:'flex',alignItems:'center',justifyContent:'center',
                  fontSize:20,fontWeight:800
                }}>
                  {((user?.name||'?')[0]+((user?.lname||'')[0]||'')).toUpperCase()}
                </div>
                <div style={{display:'flex',gap:8,flexWrap:'wrap'}}>
                  {AVATAR_COLORS.map(c=>(
                    <div key={c} onClick={()=>update({avatarColor:c})} style={{
                      width:28,height:28,borderRadius:'50%',background:c,cursor:'pointer',
                      border:user?.avatarColor===c?'2px solid #fff':'2px solid transparent',
                      transform:user?.avatarColor===c?'scale(1.15)':'scale(1)',
                      transition:'all .15s'
                    }}/>
                  ))}
                </div>
              </div>
            </div>
            <button onClick={save} style={{marginTop:24,padding:'10px 28px',background:'var(--accent)',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer'}}>
              Save Changes
            </button>
          </>}

          {/* Education */}
          {tab==='education'&&<>
            <div style={{fontSize:18,fontWeight:800,marginBottom:6}}>Education</div>
            <div style={{fontSize:13,color:'var(--muted2)',marginBottom:28}}>Your academic background</div>
            {[
              ['College',form.college,v=>setForm({...form,college:v})],
              ['Branch',form.branch,v=>setForm({...form,branch:v})],
              ['Skills',form.skills,v=>setForm({...form,skills:v})]
            ].map(([l,v,s])=>(
              <div key={l} style={row}>
                <div><div style={{fontSize:14,fontWeight:600}}>{l}</div></div>
                <input style={inp} value={v} onChange={e=>s(e.target.value)}/>
              </div>
            ))}
            <div style={row}>
              <div><div style={{fontSize:14,fontWeight:600}}>Degree</div></div>
              <select style={sel} value={form.degree} onChange={e=>setForm({...form,degree:e.target.value})}>
                {['','B.Tech / B.E.','B.Sc','BCA','MCA','M.Tech','MBA','B.Com','Other'].map(d=>(
                  <option key={d}>{d}</option>
                ))}
              </select>
            </div>
            <div style={row}>
              <div><div style={{fontSize:14,fontWeight:600}}>Graduation Year</div></div>
              <input
                type="number"
                min="1990"
                max="2035"
                placeholder="e.g. 2025"
                style={inp}
                value={form.gradyear}
                onChange={e=>setForm({...form,gradyear:e.target.value})}
              />
            </div>
            <button onClick={save} style={{marginTop:24,padding:'10px 28px',background:'var(--accent)',color:'#fff',border:'none',borderRadius:8,fontSize:14,fontWeight:700,cursor:'pointer'}}>
              Save Education
            </button>
          </>}

          {/* Notifications */}
          {tab==='notifications'&&<>
            <div style={{fontSize:18,fontWeight:800,marginBottom:6}}>Notifications</div>
            <div style={{fontSize:13,color:'var(--muted2)',marginBottom:28}}>Control how SimWork contacts you</div>
            {[
              ['Email Notifications','email'],
              ['Browser Notifications','browser'],
              ['Weekly Progress Report','weekly']
            ].map(([l,k])=>(
              <div key={k} style={row}>
                <div><div style={{fontSize:14,fontWeight:600}}>{l}</div></div>
                <Toggle
                  val={user?.notifications?.[k]??true}
                  onToggle={()=>update({notifications:{...user?.notifications,[k]:!(user?.notifications?.[k]??true)}})}
                />
              </div>
            ))}
          </>}

          {/* Privacy */}
          {tab==='privacy'&&<>
            <div style={{fontSize:18,fontWeight:800,marginBottom:6}}>Privacy</div>
            <div style={{fontSize:13,color:'var(--muted2)',marginBottom:28}}>Control your visibility</div>
            {[
              ['Public Profile','publicProfile'],
              ['Show Education','showEducation'],
              ['Show on Leaderboard','showOnLeaderboard']
            ].map(([l,k])=>(
              <div key={k} style={row}>
                <div><div style={{fontSize:14,fontWeight:600}}>{l}</div></div>
                <Toggle
                  val={user?.privacy?.[k]??true}
                  onToggle={()=>update({privacy:{...user?.privacy,[k]:!(user?.privacy?.[k]??true)}})}
                />
              </div>
            ))}
          </>}

          {/* Danger Zone */}
          {tab==='danger'&&<>
            <div style={{fontSize:18,fontWeight:800,marginBottom:6,color:'var(--rose)'}}>Danger Zone</div>
            <div style={{fontSize:13,color:'var(--muted2)',marginBottom:28}}>Irreversible actions.</div>
            <div style={row}>
              <div>
                <div style={{fontSize:14,fontWeight:600}}>Reset All Progress</div>
                <div style={{fontSize:12,color:'var(--muted2)'}}>Clear XP, simulations, certificates</div>
              </div>
              <button onClick={()=>{
                if(confirm('Reset all progress?')){
                  update({xp:0,certs:[]});
                  resetSims();
                  showToast('Progress reset');
                }
              }} style={{padding:'10px 20px',background:'rgba(248,113,113,.1)',color:'var(--rose)',border:'1px solid rgba(248,113,113,.2)',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>
                Reset Progress
              </button>
            </div>
            <div style={row}>
              <div><div style={{fontSize:14,fontWeight:600}}>Sign Out</div></div>
              <button onClick={logout} style={{padding:'10px 20px',background:'rgba(248,113,113,.1)',color:'var(--rose)',border:'1px solid rgba(248,113,113,.2)',borderRadius:8,fontSize:13,fontWeight:600,cursor:'pointer'}}>
                Sign Out
              </button>
            </div>
          </>}

        </div>
      </div>
    </div>
  );
}