import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation, useNavigate, useParams } from './router';
import { Bell, CalendarDays, Check, ChevronRight, CircleUserRound, Compass, Home, LogOut, MessageCircle, Moon, Plus, Search, Send, Settings, Sparkles, Sun, Users, X } from 'lucide-react';
import { communities, initialSessions, people, skills, getRankedPeople } from './data';

const nav = [['/dashboard', Home, 'Home'], ['/explore', Compass, 'Explore'], ['/matches', Sparkles, 'Matches'], ['/communities', Users, 'Communities'], ['/polls', '◉', 'Polls'], ['/sessions', CalendarDays, 'Sessions'], ['/calendar', '▦', 'Calendar'], ['/chat', MessageCircle, 'Chat']];
const avatar = (p, small = false) => <span className={'avatar' + (small ? ' small' : '')} style={{ background: p.color }}>{p.initials}</span>;
const skillClass = s => skills.technical.includes(s) ? 'tech' : 'human';
const defaultProfile = { name: 'Saksham Patil', initials: 'SP', color: '#242a3d', dept: 'Computer Engineering', year: 'Third Year', bio: 'Curious learner, aspiring product builder and photography enthusiast.', teaches: ['Python', 'Photography'], learns: ['UI/UX'], rating: 4.8, sessions: 12, availability: 'Online + Offline', communities: ['Python', 'AI / ML', 'Photography'], isOnboarded: false };

function usePersisted(key, init) { const [value, setValue] = useState(() => JSON.parse(localStorage.getItem(key) || JSON.stringify(init))); useEffect(() => { localStorage.setItem(key, JSON.stringify(value)); }, [key, value]); return [value, setValue]; }

function Toast({ toast, clear }) { useEffect(() => { if (toast) { const t = setTimeout(clear, 2800); return () => clearTimeout(t); } }, [toast, clear]); return toast && <div className="toast"><Check size={16} />{toast}</div>; }
function Chip({ children, onClick, active, className = '' }) { return <button onClick={onClick} className={`chip ${active ? 'active' : ''} ${className}`}>{children}</button>; }
function SkillChip({ children }) { return <span className={`skill ${skillClass(children)}`}>{children}</span>; }
function Empty({ title, text }) { return <div className="empty"><span>◌</span><h3>{title}</h3><p>{text}</p></div>; }
function PageHead({ eyebrow, title, children }) { return <header className="page-head"><div><small className="eyebrow">{eyebrow}</small><h1>{title}</h1></div>{children}</header>; }

function SearchOverlay({ onClose }) {
  const nav = useNavigate();
  const [q, setQ] = useState('');
  const inputRef = useRef(null);
  useEffect(() => { inputRef.current?.focus(); }, []);
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const allItems = useMemo(() => [
    ...people.map(x => ({ ...x, kind: 'People', label: x.name, sub: `${x.dept} · ${x.year}`, href: `/profile/${x.id}` })),
    ...communities.map(x => ({ ...x, kind: 'Community', label: x.name, sub: `${x.members} members`, href: `/communities/${x.id}` })),
    ...skills.technical.map(s => ({ name: s, kind: 'Skill', label: s, sub: 'Technical', href: '/explore' })),
    ...skills.nonTechnical.map(s => ({ name: s, kind: 'Skill', label: s, sub: 'Non-Technical', href: '/explore' })),
  ], []);

  const results = q.trim().length > 0
    ? allItems.filter(x => x.label.toLowerCase().includes(q.toLowerCase())).slice(0, 8)
    : allItems.slice(0, 6);

  const go = (href) => { nav(href); onClose(); };

  return (
    <div className="modal-wrap" onClick={onClose} style={{ alignItems: 'flex-start', paddingTop: '14vh' }}>
      <div className="modal" style={{ width: 'min(580px,94vw)', padding: 0, overflow: 'hidden' }} onClick={e => e.stopPropagation()}>
        <div className="search-overlay-input">
          <Search size={18} />
          <input
            ref={inputRef}
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search skills, people or communities..."
          />
          <button className="modal-close" style={{ position: 'static', margin: '0 10px' }} onClick={onClose}><X size={16}/></button>
        </div>
        <div className="search-overlay-results">
          {results.length === 0 && <p style={{ padding: '20px', color: 'var(--muted)', fontSize: '12px' }}>No results found for "{q}"</p>}
          {results.map((item, i) => (
            <button key={item.label + i} className="search-overlay-item" onClick={() => go(item.href)}>
              <span className="search-overlay-kind">{item.kind}</span>
              <span className="search-overlay-label">{item.label}</span>
              <span className="search-overlay-sub">{item.sub}</span>
              <ChevronRight size={14} />
            </button>
          ))}
        </div>
        <div className="search-overlay-footer">
          <kbd>↑↓</kbd> navigate &nbsp; <kbd>↵</kbd> select &nbsp; <kbd>Esc</kbd> close
        </div>
      </div>
    </div>
  );
}


function App() {
  const [theme, setTheme] = usePersisted('sc-theme', 'light');
  const [toast, setToast] = useState('');
  const [sessions, setSessions] = usePersisted('sc-sessions', initialSessions);
  const [profile, setProfile] = usePersisted('sc-profile', defaultProfile);
  const [joined, setJoined] = usePersisted('sc-communities', ['python', 'web-development', 'photography']);
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifications, setNotifications] = usePersisted('sc-notifications', [
    { id: 1, icon: '✦', title: '94% skill match found', text: 'Priya can teach UI/UX and wants to learn Python.', time: 'Now', unread: true },
    { id: 2, icon: '✓', title: 'Python session confirmed', text: 'Today · 4:00 PM · Online', time: '2h', unread: true },
    { id: 3, icon: '◉', title: 'New community activity', text: 'Rahul shared a NumPy resource in Python.', time: 'Yesterday', unread: false }
  ]);
  useEffect(() => { document.documentElement.dataset.theme = theme; }, [theme]);
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  const openSearch = () => setSearchOpen(true);
  const appState = { theme, setTheme, toast: m => setToast(m), sessions, setSessions, joined, setJoined, notifications, setNotifications, profile, setProfile, openSearch };
  return <><Routes>
    <Route path="/" element={<Landing />} /><Route path="/login" element={<Login {...appState} />} /><Route path="/onboarding" element={<Onboarding {...appState} />} />
    <Route path="/*" element={<Shell {...appState} />} />
  </Routes>
  {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}
  <Toast toast={toast} clear={() => setToast('')} /></>;
}

function Landing() { return <div className="landing"><nav><Link className="brand" to="/">Skill<span>Connect</span><i /></Link><div><Link to="/explore">Explore campus</Link><Link className="quiet-btn" to="/login">Sign in</Link></div></nav><main className="hero"><p className="campus-dot"><i /> SANJIVANI UNIVERSITY · CAMPUS NETWORK</p><div className="hero-copy"><h1>SKILL<br/><em>CONNECT</em></h1><div><h2>Learn what you want.<br/>Share what you know.</h2><p>A campus network where students teach, learn and connect with people who share their skills.</p><section><Link className="button primary" to="/onboarding">Get started <ChevronRight size={17}/></Link><Link className="button" to="/explore">Explore skills</Link></section></div></div><div className="skill-orbit"><span className="ring ring-one"/><span className="ring ring-two"/><div className="flow"><b>Student</b><i>→</i><b>Skill</b><i>→</i><b className="match">Match</b><i>→</i><b>Session</b></div><small>LIVE · SANJIVANI CAMPUS</small></div></main><section className="landing-grid"><article><small>01 / DISCOVER</small><h3>Find your people.</h3><p>Technical and human skills, all within your campus.</p></article><article><small>02 / MATCH</small><h3>Give & get value.</h3><p>Smart matching finds complementary learners.</p></article><article><small>03 / GROW</small><h3>Learn together.</h3><p>Communities and sessions make progress social.</p></article></section><footer>SKILLCONNECT <span>— built for Sanjivani students</span><Link to="/login">Join the network →</Link></footer></div> }
function Login({ profile, setProfile }) {
  const nav = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignIn = (e) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Please enter your college email.');
      return;
    }
    if (!email.includes('@')) {
      setError('Please enter a valid college email address.');
      return;
    }
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    setError('');
    if (!profile?.isOnboarded) {
      nav('/onboarding');
    } else {
      nav('/dashboard');
    }
  };

  const handleDemoLogin = () => {
    setProfile({
      name: '',
      initials: 'SC',
      color: '#6254dc',
      dept: 'Computer Engineering',
      year: 'Third Year',
      bio: '',
      teaches: [],
      learns: [],
      rating: 5.0,
      sessions: 0,
      availability: 'Both',
      communities: ['Python', 'AI / ML'],
      isOnboarded: false
    });
    nav('/onboarding');
  };

  return (
    <div className="auth">
      <Link className="brand" to="/">Skill<span>Connect</span><i /></Link>
      <div className="auth-card">
        <small className="eyebrow">SANJIVANI UNIVERSITY CAMPUS</small>
        <h1>Welcome back.</h1>
        <p>Your learning network is waiting.</p>
        <form onSubmit={handleSignIn}>
          <label>College email
            <input
              type="email"
              value={email}
              onChange={e => { setEmail(e.target.value); setError(''); }}
              placeholder="name@sanjivani.edu.in"
            />
          </label>
          <label>Password
            <input
              type="password"
              value={password}
              onChange={e => { setPassword(e.target.value); setError(''); }}
              placeholder="••••••••"
            />
          </label>
          {error && <div className="field-error"><span>⚠</span> {error}</div>}
          <button type="submit" className="button primary full" style={{ marginTop: '14px' }}>
            Sign in <ChevronRight size={17}/>
          </button>
          <button type="button" className="text-btn" onClick={handleDemoLogin}>
            Continue as Demo Student
          </button>
        </form>
      </div>
    </div>
  );
}

function Onboarding({ profile, setProfile, toast, setNotifications }) {
  const nav = useNavigate();
  const [step, setStep] = useState(1);
  const [name, setName] = useState(profile?.isOnboarded ? (profile?.name || '') : (profile?.name && profile?.name !== defaultProfile.name ? profile.name : ''));
  const [dept, setDept] = useState(profile?.dept || 'Computer Engineering');
  const [bio, setBio] = useState(profile?.isOnboarded ? (profile?.bio || '') : (profile?.bio && profile?.bio !== defaultProfile.bio ? profile.bio : ''));
  const [teach, setTeach] = useState(profile?.isOnboarded ? (profile?.teaches || []) : []);
  const [learn, setLearn] = useState(profile?.isOnboarded ? (profile?.learns || []) : []);
  const [availability, setAvailability] = useState(profile?.availability || 'Both');
  const [error, setError] = useState('');

  const list = step === 2 ? teach : learn;
  const setList = step === 2 ? setTeach : setLearn;
  const toggle = s => {
    setError('');
    setList(list.includes(s) ? list.filter(x => x !== s) : [...list, s]);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!name.trim()) {
        setError('Please enter your full name to continue.');
        return;
      }
      setError('');
      setStep(2);
    } else if (step === 2) {
      if (teach.length === 0) {
        setError('Please select at least one skill you can teach.');
        return;
      }
      setError('');
      setStep(3);
    } else if (step === 3) {
      if (learn.length === 0) {
        setError('Please select at least one skill you want to learn.');
        return;
      }
      setError('');
      setStep(4);
    } else if (step === 4) {
      complete();
    }
  };

  const complete = () => {
    const cleanName = name.trim();
    const initials = cleanName
      ? cleanName.split(/\s+/).map(part => part[0]).join('').slice(0, 2).toUpperCase()
      : 'SC';
    const updatedProfile = {
      ...profile,
      name: cleanName,
      initials,
      dept,
      bio: bio.trim() || 'Curious learner and active campus collaborator.',
      teaches: teach,
      learns: learn,
      availability,
      isOnboarded: true
    };
    setProfile(updatedProfile);

    // Refresh notification #1 with the user's real top match
    if (setNotifications) {
      const best = getRankedPeople(updatedProfile, people)[0];
      if (best) {
        const canTeach = best.canTeachYou?.[0] || best.teaches[0];
        const wants = best.wantsFromYou?.[0] || teach[0] || 'from you';
        setNotifications(prev => [
          {
            id: 1,
            icon: '✦',
            title: `${best.match}% skill match found`,
            text: `${best.name} can teach ${canTeach} and wants to learn ${wants}.`,
            time: 'Now',
            unread: true
          },
          ...prev.filter(n => n.id !== 1)
        ]);
      }
    }
    setStep(5);
  };

  const handleEnterApp = () => {
    toast?.('Welcome to SkillConnect, ' + (name.trim().split(' ')[0] || 'Student') + '!');
    nav('/dashboard');
  };

  if (step === 5) {
    return (
      <div className="onboard done">
        <div className="complete-ring"><Check /></div>
        <small className="eyebrow">PROFILE COMPLETE</small>
        <h1>Your network is ready.</h1>
        <p>You have {teach.length} {teach.length === 1 ? 'skill' : 'skills'} to share and {learn.length} new directions to explore.</p>
        <button className="button primary" onClick={handleEnterApp}>
          Enter SkillConnect <ChevronRight size={17}/>
        </button>
      </div>
    );
  }

  const content = step === 1 ? (
    <>
      <h1>Tell us a little about you.</h1>
      <p>This helps the campus network feel personal.</p>
      <div className="two-col">
        <label>
          Full Name <span style={{ color: '#d45f5f' }}>*</span>
          <input
            value={name}
            onChange={event => { setName(event.target.value); setError(''); }}
            placeholder="e.g. Saksham Patil"
            autoFocus
          />
        </label>
        <label>Department
          <select value={dept} onChange={event => setDept(event.target.value)}>
            <option>Computer Engineering</option>
            <option>Information Technology</option>
            <option>Electronics & Telecommunication</option>
            <option>Mechanical Engineering</option>
            <option>MBA</option>
          </select>
        </label>
      </div>
      <label>Short bio
        <textarea
          value={bio}
          onChange={event => setBio(event.target.value)}
          placeholder="What are your goals or interests on campus?"
        />
      </label>
      {error && <div className="field-error"><span>⚠</span> {error}</div>}
    </>
  ) : step === 4 ? (
    <>
      <h1>When do you like to learn?</h1>
      <p>Matches will use this to find a time that works.</p>
      <div className="choice-row">
        {['Online', 'Offline', 'Both'].map((x, i) => (
          <button
            type="button"
            className={'choice ' + (availability === x ? 'selected' : '')}
            onClick={() => setAvailability(x)}
            key={x}
          >
            <span>{i === 0 ? '⌁' : i === 1 ? '⌂' : '◌'}</span>
            {x}
            <small>{i === 0 ? 'From anywhere' : i === 1 ? 'On campus' : 'Flexible'}</small>
          </button>
        ))}
      </div>
    </>
  ) : (
    <>
      <h1>{step === 2 ? 'What can you teach?' : 'What would you like to learn?'}</h1>
      <p>{step === 2 ? 'Select skills that you feel confident sharing with other students.' : 'Select skills you want to learn or get mentored in.'}</p>
      <small className="section-label">TECHNICAL</small>
      <div className="skill-pick">
        {skills.technical.map(s => (
          <Chip key={s} active={list.includes(s)} onClick={() => toggle(s)}>
            {list.includes(s) && <Check size={13}/>} {s}
          </Chip>
        ))}
      </div>
      <small className="section-label">NON-TECHNICAL</small>
      <div className="skill-pick">
        {skills.nonTechnical.map(s => (
          <Chip key={s} active={list.includes(s)} onClick={() => toggle(s)}>
            {list.includes(s) && <Check size={13}/>} {s}
          </Chip>
        ))}
      </div>
      {error && <div className="field-error"><span>⚠</span> {error}</div>}
    </>
  );

  return (
    <div className="onboard">
      <Link className="brand" to="/">Skill<span>Connect</span><i /></Link>
      <div className="steps">{[1, 2, 3, 4].map(n => <i className={n <= step ? 'current' : ''} key={n}/>)}</div>
      <main className="onboard-card">
        {content}
        <div className="onboard-actions">
          <button className="text-btn" disabled={step === 1} onClick={() => { setError(''); setStep(step - 1); }}>
            Back
          </button>
          <button className="button primary" onClick={handleNext}>
            {step === 4 ? 'Complete profile' : 'Continue'} <ChevronRight size={17}/>
          </button>
        </div>
      </main>
    </div>
  );
}

function Shell(props) { const location = useLocation(); return <div className="app-shell"><aside><Link className="brand" to="/dashboard">Skill<span>Connect</span><i /></Link><p className="mini-label">DISCOVER</p><nav>{nav.map(([to, Icon, label]) => <NavLink key={to} to={to}>{typeof Icon === 'string' ? <b className="text-icon">{Icon}</b> : <Icon size={18}/>}<span>{label}</span></NavLink>)}</nav><div className="sidebar-bottom"><NavLink to="/notifications"><Bell size={18}/><span>Notifications</span>{props.notifications.filter(n=>n.unread).length>0 && <i className="notify"/>}</NavLink><NavLink to="/profile"><CircleUserRound size={18}/><span>Profile</span></NavLink><NavLink to="/settings"><Settings size={18}/><span>Settings</span></NavLink><p><i/> SANJIVANI UNIVERSITY<br/><span>CAMPUS NETWORK</span></p></div></aside><main className="content"><Topbar {...props} path={location.pathname}/><Routes><Route path="dashboard" element={<Dashboard {...props}/>} /><Route path="explore" element={<Explore {...props}/>} /><Route path="matches" element={<Matches {...props}/>} /><Route path="communities" element={<Communities {...props}/>} /><Route path="communities/:id" element={<CommunityDetail {...props}/>} /><Route path="polls" element={<Polls {...props}/>} /><Route path="sessions" element={<Sessions {...props}/>} /><Route path="calendar" element={<Calendar {...props}/>} /><Route path="chat" element={<Chat {...props}/>} /><Route path="notifications" element={<Notifications {...props}/>} /><Route path="profile" element={<Profile {...props}/>} /><Route path="profile/:id" element={<Profile {...props}/>} /><Route path="settings" element={<SettingsPage {...props}/>} /><Route path="*" element={<Dashboard {...props}/>} /></Routes></main><nav className="mobile-nav">{nav.slice(0,5).map(([to, Icon]) => <NavLink key={to} to={to}>{typeof Icon === 'string'?Icon:<Icon size={19}/>}</NavLink>)}</nav></div> }
function Topbar({ theme, setTheme, notifications, profile, openSearch }) { const nav = useNavigate(); return <div className="topbar"><div className="mobile-brand">SC<i/></div><button className="top-search" onClick={openSearch || (()=>nav('/explore'))}><Search size={17}/><span>Search the campus...</span><kbd>⌘ K</kbd></button><div className="top-actions"><button aria-label="Toggle theme" onClick={()=>setTheme(theme==='light'?'dark':'light')} className="icon-btn">{theme==='light'?<Moon size={18}/>:<Sun size={18}/>}</button><Link to="/notifications" className="icon-btn bell"><Bell size={18}/>{notifications.some(n=>n.unread)&&<i/>}</Link><Link to="/profile">{avatar(profile, true)}</Link></div></div> }

function Dashboard({ sessions, joined, profile, openSearch }) {
  const nav = useNavigate();
  useEffect(() => {
    if (profile && profile.isOnboarded === false) {
      nav('/onboarding');
    }
  }, [profile?.isOnboarded]);
  const teaches = profile?.teaches || [];
  const learns = profile?.learns || [];
  const technical = teaches.filter(skill => skills.technical.includes(skill)).length;
  const human = teaches.length - technical;
  const rankedPeople = useMemo(() => getRankedPeople(profile, people), [profile]);
  return <div><div className="welcome"><div><p className="eyebrow">THURSDAY · AUGUST 13</p><h1>Good morning, {(profile?.name || 'Student').split(' ')[0]} <span>✦</span></h1><p>What are you learning today?</p></div><div className="network"><i/> CAMPUS NETWORK <b>● 1,842 online</b></div></div><button className="big-search" onClick={openSearch || (()=>nav('/explore'))}><Search size={20}/><span>Search skills, people or communities...</span><kbd>⌘ K</kbd></button><section className="snapshot"><div><small>YOUR SKILL SNAPSHOT</small><h2>Built to exchange.</h2><p>Your curiosity has a campus.</p></div><div><b>{teaches.length}</b><span>Can teach</span></div><div><b>{learns.length}</b><span>Want to learn</span></div><div className="meta"><span>TECHNICAL {String(technical).padStart(2,'0')}</span><span>NON-TECHNICAL {String(human).padStart(2,'0')}</span></div></section><section className="split-heading"><div><small className="eyebrow">PICKED FOR YOU</small><h2>Good people to meet.</h2></div><Link to="/matches">View all <ChevronRight size={16}/></Link></section><div className="recommend-grid">{rankedPeople.slice(0,3).map(p => <PersonCard p={p} key={p.id}/>)}</div><div className="dashboard-bottom"><section><div className="split-heading"><div><small className="eyebrow">UP NEXT</small><h2>Your upcoming session.</h2></div><Link to="/calendar">Calendar <ChevronRight size={16}/></Link></div><SessionCard session={sessions[0]}/></section><section className="popular"><small className="eyebrow">CAMPUS PULSE</small><h2>Popular right now.</h2>{[['Python',42],['UI/UX',28],['Public Speaking',24],['Photography',18]].map(([s,n])=><div key={s}><SkillChip>{s}</SkillChip><span>{n} interested</span><i style={{width:`${n*2}%`}}/></div>)}</section></div><section className="your-comms"><small className="eyebrow">YOUR COMMUNITIES</small>{communities.filter(c=>joined.includes(c.id)).map(c=><Link to={`/communities/${c.id}`} key={c.id}>{c.name}<span>{c.members} members</span><ChevronRight size={16}/></Link>)}</section></div> }
function PersonCard({ p, connect }) { 
  const teachSkill = p.canTeachYou?.[0] || p.teaches[0];
  const learnSkill = p.wantsFromYou?.[0] || p.learns[0];
  return <article className="person-card"><div className="person-top">{avatar(p)}<span className="percent">{p.match}%<small>MATCH</small></span></div><h3>{p.name}</h3><p>{p.dept} · {p.year}</p><small>CAN TEACH</small><SkillChip>{teachSkill}</SkillChip><small>WANTS TO LEARN</small><SkillChip>{learnSkill}</SkillChip><footer><Link to={`/profile/${p.id}`}>View profile</Link>{connect && <button onClick={()=>connect(p)}>Connect</button>}</footer></article>;
}
function SessionCard({ session, join }) { return <article className="session-card"><div className="session-date"><strong>{session.day}</strong><span>{session.date}</span></div><div><SkillChip>{session.skill}</SkillChip><h3>{session.skill}</h3><p>{session.teacher} · {session.time}</p><span className="session-meta">{session.mode} · {session.place} <b>{session.seats} / {session.capacity} seats</b></span></div>{join && <button className="button" onClick={()=>join(session)}>Join session</button>}</article> }
function Explore({ profile }) { const [query,setQuery]=useState(''),[tab,setTab]=useState('All'),[filters,setFilters]=useState([]); const ranked=useMemo(()=>getRankedPeople(profile, people),[profile]); const items=useMemo(()=>[...ranked.map(x=>({...x,type:'People'})),...communities.map(x=>({...x,type:'Communities'})),...skills.technical.map(name=>({name,type:'Skills',category:'Technical',members:Math.floor(Math.random()*30+16)})),...skills.nonTechnical.map(name=>({name,type:'Skills',category:'Non-Technical',members:Math.floor(Math.random()*30+10)}))].filter(x=>{const category=x.category||(x.teaches?.some(s=>skills.technical.includes(s))?'Technical':'Non-Technical');const mode=x.availability?.includes('Offline')?'Offline':'Online';return (tab==='All'||x.type===tab)&&(x.name||'').toLowerCase().includes(query.toLowerCase())&&filters.every(f=>!['Technical','Non-Technical','Online','Offline'].includes(f)||(f===category||f===mode));}),[query,tab,filters,ranked]); const toggle=f=>setFilters(filters.includes(f)?filters.filter(x=>x!==f):[...filters,f]); return <div><PageHead eyebrow="DISCOVER" title="Explore the campus."/><div className="explore-search"><Search size={20}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search skills, people or communities..."/></div><div className="tabs">{['All','Skills','People','Communities','Sessions'].map(t=><button className={tab===t?'active':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div><div className="filters">{['Technical','Non-Technical','Online','Offline','Beginner','Intermediate','Advanced'].map(f=><Chip key={f} active={filters.includes(f)} onClick={()=>toggle(f)}>{f}</Chip>)}</div><div className="explore-results">{items.map((x,i)=>x.type==='People'?<PersonCard key={x.id} p={x}/>:<article className="result-card" key={x.name+i}><span className="result-mark">{x.type==='Communities'?'◌':'✦'}</span><small>{x.type==='Skills'?(x.category||'TECHNICAL'):x.type}</small><h3>{x.name}</h3><p>{x.type==='Communities'?`${x.members} members · ${x.online} online`:`${x.members} students interested`}</p><Link to={x.type==='Communities'?`/communities/${x.id}`:'/matches'}>Explore <ChevronRight size={15}/></Link></article>)}</div>{!items.length&&<Empty title="Nothing found yet" text="Try a different skill, person or community."/>}</div> }
function Matches({ toast, profile }) { const [filter,setFilter]=useState('Best Match'),[connected,setConnected]=useState([]); const ranked = useMemo(() => getRankedPeople(profile, people), [profile]); const match=ranked.filter(p=>filter==='Best Match'||(filter==='Technical'&&p.teaches.some(s=>skills.technical.includes(s)))||(filter==='Non-Technical'&&p.teaches.some(s=>skills.nonTechnical.includes(s)))||p.availability.includes(filter)); const connect=p=>{setConnected([...connected,p.id]);toast(`Connection request sent to ${p.name.split(' ')[0]}`)}; return <div><PageHead eyebrow="SMART MATCHING" title="Your matches"><p className="subhead">People who can help you learn what you want — and learn what you know.</p></PageHead><div className="filters">{['Best Match','Technical','Non-Technical','Online','Offline'].map(f=><Chip active={filter===f} onClick={()=>setFilter(f)} key={f}>{f}</Chip>)}</div><div className="match-list">{match.map(p=><article className="match-card" key={p.id}>{avatar(p)}<div className="match-main"><h3>{p.name} <span>{p.match}% match</span></h3><p>{p.dept} · {p.year} · {p.availability}</p><div><small>CAN TEACH</small><SkillChip>{p.canTeachYou?.[0] || p.teaches[0]}</SkillChip><i>↔</i><small>WANTS TO LEARN</small><SkillChip>{p.wantsFromYou?.[0] || p.learns[0]}</SkillChip></div><p className="match-reason"><Check size={15}/> {p.matchReason || 'Complementary skills · Same campus · Similar availability'}</p></div><div className="match-actions"><Link className="button" to={`/profile/${p.id}`}>View profile</Link><button className="button primary" disabled={connected.includes(p.id)} onClick={()=>connect(p)}>{connected.includes(p.id)?'Sent': 'Connect'}</button></div></article>)}</div></div> }
function Communities({ joined, setJoined, toast }) { const toggle = c=>{const exists=joined.includes(c.id);setJoined(exists?joined.filter(x=>x!==c.id):[...joined,c.id]);toast(exists?`Left ${c.name}`:`Joined ${c.name} Community`)}; return <div><PageHead eyebrow="CAMPUS CIRCLES" title="Find your people."><p className="subhead">Learn together with students who share your interests.</p></PageHead>{['Technical','Non-Technical'].map(cat=><section className="community-section" key={cat}><h2>{cat}</h2><div className="community-grid">{communities.filter(c=>c.category===cat).map(c=><article className="community-card" key={c.id}><span className="community-symbol" style={{color:c.color}}>◌</span><small>{c.category.toUpperCase()}</small><h3>{c.name}</h3><p><b>{c.members}</b> members <i/> {c.online} online</p><div><span>Trending</span><b>{c.topic}</b></div><footer><Link to={`/communities/${c.id}`}>View <ChevronRight size={15}/></Link><button onClick={()=>toggle(c)} className={joined.includes(c.id)?'joined':''}>{joined.includes(c.id)?'Joined':'Join community'}</button></footer></article>)}</div></section>)}</div> }
function CommunityDetail({ joined, setJoined, toast, sessions }) { const {id}=useParams(), c=communities.find(x=>x.id===id)||communities[0], [tab,setTab]=useState('Overview'), isJoined=joined.includes(c.id); const toggle=()=>{setJoined(isJoined?joined.filter(x=>x!==c.id):[...joined,c.id]);toast(isJoined?`Left ${c.name}`:`Joined ${c.name} Community`)}; return <div className="community-detail"><div className="community-hero" style={{'--accent':c.color}}><Link to="/communities">← Communities</Link><small>COMMUNITY / {c.category.toUpperCase()}</small><h1>{c.name} <em>Community</em></h1><p>{c.members} members <i/> {c.online} online now</p><button className="button primary" onClick={toggle}>{isJoined?'✓ Joined':'Join community'}</button></div><div className="tabs detail-tabs">{['Overview','Discussions','Questions','Resources','Polls','Sessions','Members'].map(t=><button className={tab===t?'active':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div>{tab==='Overview'?<div className="community-layout"><section><small className="eyebrow">TRENDING DISCUSSIONS</small>{['Best Python projects for beginners?','How should I start learning NumPy?','Looking for pair programming partners.'].map((d,i)=><article className="discussion" key={d}><span>{['RK','PS','VD'][i]}</span><div><h3>{d}</h3><p>{['Rahul started a conversation','Priya shared a question','Vivek is looking for collaborators'][i]} · {i+2}h ago</p></div><b>{[24,17,9][i]} replies</b></article>)}</section><aside><small className="eyebrow">UPCOMING SESSION</small><SessionCard session={sessions[0]}/><small className="eyebrow">MEMBERS</small><div className="face-row">{people.map(p=><span key={p.id}>{avatar(p,true)}</span>)}<span>+1.2k</span></div><button className="button full">Find people in {c.name}</button></aside></div>:<Empty title={`No ${tab.toLowerCase()} to show`} text="This community space is ready for its next contribution."/>}</div> }

function Polls({ toast }) { const [votes,setVotes]=usePersisted('sc-poll',[42,35,30,28,18]), [selected,setSelected]=usePersisted('sc-poll-choice',null); const names=['Python','Web Development','Java','UI/UX','Video Editing'], max=Math.max(...votes); const vote=i=>{if(selected!==null)return; const next=[...votes];next[i]++;setVotes(next);setSelected(i);toast('Vote recorded — campus demand updated')}; return <div><PageHead eyebrow="SKILL DEMAND" title="What does campus want to learn?"><button className="button"><Plus size={16}/> Suggest a skill</button></PageHead><div className="poll-layout"><section className="poll-card"><small>OPEN POLL · 153 STUDENTS PARTICIPATING</small><h2>What skill should we learn next?</h2><p>Vote to help plan the next campus sessions.</p><div className="poll-options">{names.map((x,i)=><button onClick={()=>vote(i)} className={selected===i?'picked':''} key={x}><span>{x}</span><b>{votes[i]} votes</b><i><em style={{width:`${votes[i]/max*100}%`}}/></i>{selected===i&&<Check size={16}/>}</button>)}</div>{selected!==null&&<p className="vote-note"><Check size={15}/> Your vote will help create the next session.</p>}</section><aside className="demand-card"><small className="eyebrow">DEMAND SIGNAL</small><h2>Python</h2><p>42 students are ready to learn.</p><div className="demand-number"><b>42</b><span>interested</span></div><div className="demand-stat"><span>Session capacity</span><b>20</b></div><div className="demand-stat"><span>Required sessions</span><b>2</b></div><button className="button primary full" onClick={()=>toast('Python demand shared with mentors')}>Help host a session</button></aside></div></div> }

function Sessions({ sessions, setSessions, toast, profile }) { const [tab,setTab]=useState('Upcoming'),[form,setForm]=useState(false); const create=e=>{e.preventDefault();const f=new FormData(e.currentTarget);setSessions([...sessions,{id:Date.now(),skill:f.get('skill'),teacher:profile.name,day:'Next week',date:f.get('date')||'Aug 20',time:f.get('time')||'4:00 PM',mode:f.get('mode'),place:f.get('place')||'TBA',seats:0,capacity:Number(f.get('capacity'))||15,type:'Technical'}]);setForm(false);toast('Session added to your calendar')}; const join=s=>{setSessions(sessions.map(x=>x.id===s.id&&x.seats<x.capacity?{...x,seats:x.seats+1}:x));toast(`You're in — ${s.skill} is on your calendar`)};return <div><PageHead eyebrow="LEARN TOGETHER" title="Sessions"><button className="button primary" onClick={()=>setForm(true)}><Plus size={17}/> Create session</button></PageHead><div className="tabs">{['Upcoming','Discover','My Sessions'].map(t=><button className={tab===t?'active':''} onClick={()=>setTab(t)} key={t}>{t}</button>)}</div><div className="sessions-list">{sessions.map(s=><SessionCard session={s} join={join} key={s.id}/>)}</div>{form&&<Modal close={()=>setForm(false)} title="Create a learning session"><form className="modal-form" onSubmit={create}><label>Skill<input name="skill" required placeholder="e.g. JavaScript Basics"/></label><div className="two-col"><label>Mode<select name="mode"><option>Online</option><option>Offline</option></select></label><label>Capacity<input name="capacity" type="number" defaultValue="15"/></label></div><div className="two-col"><label>Date<input name="date" type="date"/></label><label>Time<input name="time" type="time"/></label></div><label>Location / Meeting link<input name="place" placeholder="Innovation Lab or meeting link"/></label><button className="button primary full">Create session</button></form></Modal>}</div> }
function Modal({title,children,close}) { return <div className="modal-wrap" role="dialog" aria-modal="true"><div className="modal"><button className="modal-close" onClick={close}><X size={18}/></button><h2>{title}</h2>{children}</div></div> }
function Calendar({ sessions }) { const [selected,setSelected]=useState(sessions[0]); const days=Array.from({length:31},(_,i)=>i+1); return <div><PageHead eyebrow="YOUR RHYTHM" title="August 2026"/><div className="calendar-layout"><section className="calendar-box"><header><button>‹</button><b>August 2026</b><button>›</button></header><div className="week">{['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(x=><span key={x}>{x}</span>)}</div><div className="dates">{Array.from({length:5},(_,i)=><i key={'e'+i}/>) }{days.map(d=>{const s=sessions.find(x=>x.date==='Aug '+d);return <button key={d} onClick={()=>s&&setSelected(s)} className={s?'has-session':''}>{d}{s&&<em>{s.skill.split(' ')[0]}</em>}</button>})}</div></section><aside className="upcoming-panel"><small className="eyebrow">UPCOMING</small>{sessions.map(s=><button onClick={()=>setSelected(s)} key={s.id}><span>{s.day}</span><div><b>{s.skill}</b><small>{s.time} · {s.mode}</small></div></button>)}{selected&&<div className="calendar-selected"><small>SELECTED SESSION</small><h3>{selected.skill}</h3><p>{selected.day} · {selected.time}<br/>{selected.place}</p></div>}</aside></div></div> }
function Chat({ toast, profile }) {
  const ranked = useMemo(() => getRankedPeople(profile, people), [profile]);
  const [selected, setSelected] = useState(() => ranked[0] || people[0]);

  const makeStarter = (person) => {
    const pName = person.name.split(' ')[0];
    const pTeach = person.canTeachYou?.[0] || person.teaches[0];
    const pLearn = person.wantsFromYou?.[0] || profile?.teaches?.[0] || 'skills';
    return [
      { mine: false, text: `Hey ${(profile?.name || 'there').split(' ')[0]}! I saw on SkillConnect that you want to learn ${pTeach}.`, time: '10:32 AM' },
      { mine: true, text: `Hey ${pName}! Yes! And I would love to help you with ${pLearn} if you want to trade skills.`, time: '10:34 AM' },
      { mine: false, text: `That sounds like a great trade! When are you free for a quick campus session?`, time: '10:35 AM' }
    ];
  };

  const [messages, setMessages] = useState(() => makeStarter(ranked[0] || people[0]));
  const [text, setText] = useState('');

  const switchPerson = (p) => {
    setSelected(p);
    setMessages(makeStarter(p));
  };

  const send = e => {
    e.preventDefault();
    if (!text.trim()) return;
    setMessages([...messages, { mine: true, text, time: 'Now' }]);
    setText('');
    toast('Message sent');
  };

  return (
    <div className="chat-page">
      <div className="conversations">
        <PageHead eyebrow="MESSAGES" title="Conversations"/>
        <div className="conversation-search"><Search size={15}/><input placeholder="Search conversations"/></div>
        {ranked.map(p => (
          <button className={selected.id === p.id ? 'active' : ''} onClick={() => switchPerson(p)} key={p.id}>
            {avatar(p, true)}
            <span>
              <b>{p.name}</b>
              <small>{p.canTeachYou?.[0] ? `Can teach ${p.canTeachYou[0]} (${p.match}% match)` : `${p.teaches[0]} · ${p.match}% match`}</small>
            </span>
            <i/>
          </button>
        ))}
      </div>
      <section className="chat-window">
        <header>
          {avatar(selected, true)}
          <div>
            <h3>{selected.name}</h3>
            <p><i/> Online now · {selected.match}% match</p>
          </div>
          <button className="icon-btn">•••</button>
        </header>
        <div className="messages">
          {messages.map((m, i) => (
            <div className={m.mine ? 'mine' : ''} key={i}>
              <p>{m.text}</p>
              <small>{m.time}</small>
            </div>
          ))}
        </div>
        <form onSubmit={send}>
          <button type="button" className="icon-btn">+</button>
          <input value={text} onChange={e => setText(e.target.value)} placeholder="Write a message..."/>
          <button className="send" aria-label="Send"><Send size={18}/></button>
        </form>
      </section>
    </div>
  );
}
function Notifications({ notifications, setNotifications }) { const readAll=()=>setNotifications(notifications.map(x=>({...x,unread:false}))); return <div><PageHead eyebrow="STAY IN THE LOOP" title="Notifications"><button className="button" onClick={readAll}>Mark all as read</button></PageHead><div className="notification-list">{notifications.map(n=><article className={n.unread?'unread':''} key={n.id}><span>{n.icon}</span><div><h3>{n.title}</h3><p>{n.text}</p></div><time>{n.time}</time></article>)}</div>{!notifications.length&&<Empty title="You're all caught up" text="New connections and learning activity will appear here."/>}</div> }
function Profile({ toast, profile, setProfile, joined, setJoined, setNotifications }) {
  const { id } = useParams();
  const nav = useNavigate();
  const isMe = !id || id === profile?.id;
  const p = id ? (people.find(x => x.id === id) || profile) : profile;
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState('Bio');
  const [bio, setBio] = useState(profile?.bio || '');
  const [editTeach, setEditTeach] = useState(profile?.teaches || []);
  const [editLearn, setEditLearn] = useState(profile?.learns || []);

  const openEditor = (initialTab = 'Bio') => {
    setBio(profile?.bio || '');
    setEditTeach(profile?.teaches || []);
    setEditLearn(profile?.learns || []);
    setTab(initialTab);
    setEditing(true);
  };

  const toggleTeach = (s) => {
    setEditTeach(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleLearn = (s) => {
    setEditLearn(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);
  };

  const toggleComm = (cId) => {
    if (!setJoined) return;
    const exists = (joined || []).includes(cId);
    setJoined(exists ? joined.filter(x => x !== cId) : [...(joined || []), cId]);
    const commName = communities.find(c => c.id === cId)?.name || 'Community';
    toast?.(exists ? `Left ${commName}` : `Joined ${commName}`);
  };

  const saveProfile = (e) => {
    e.preventDefault();
    if (editTeach.length === 0) {
      toast?.('Please select at least 1 teaching skill');
      return;
    }
    if (editLearn.length === 0) {
      toast?.('Please select at least 1 learning skill');
      return;
    }
    const updated = { ...profile, bio, teaches: editTeach, learns: editLearn };
    setProfile(updated);
    if (setNotifications) {
      const best = getRankedPeople(updated, people)[0];
      if (best) {
        const canTeach = best.canTeachYou?.[0] || best.teaches[0];
        const wants = best.wantsFromYou?.[0] || editTeach[0] || 'from you';
        setNotifications(prev => [
          {
            id: 1,
            icon: '✦',
            title: `${best.match}% skill match found`,
            text: `${best.name} can teach ${canTeach} and wants to learn ${wants}.`,
            time: 'Now',
            unread: true
          },
          ...prev.filter(n => n.id !== 1)
        ]);
      }
    }
    setEditing(false);
    toast?.('Profile & skills updated');
  };

  const displayCommunities = isMe
    ? communities.filter(c => (joined || []).includes(c.id)).map(c => c.name)
    : (p.communities || []);

  return (
    <div>
      <div className="profile-hero">
        <div className="profile-orb">{avatar(p)}</div>
        <div>
          <small className="eyebrow">{id ? 'CAMPUS PROFILE' : 'YOUR PROFILE'}</small>
          <h1>{p.name}</h1>
          <p>{p.dept} · {p.year}</p>
          <p>{isMe ? profile.bio : p.bio}</p>
        </div>
        <div className="profile-actions">
          {id ? (
            <>
              <button className="button primary" onClick={() => toast?.('Connection request sent')}>Connect</button>
              <Link className="button" to="/chat">Message</Link>
            </>
          ) : (
            <button className="button" onClick={() => openEditor('Bio')}>Edit profile</button>
          )}
        </div>
      </div>
      <div className="profile-grid">
        <section>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <small className="eyebrow">WHAT I CAN TEACH</small>
            {isMe && <button className="text-btn" style={{ fontSize: '10px', padding: '4px' }} onClick={() => openEditor('Can Teach')}>Edit</button>}
          </div>
          <div className="skill-line">
            {(isMe ? profile.teaches : p.teaches).map(x => <SkillChip key={x}>{x}</SkillChip>)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '18px' }}>
            <small className="eyebrow">WHAT I WANT TO LEARN</small>
            {isMe && <button className="text-btn" style={{ fontSize: '10px', padding: '4px' }} onClick={() => openEditor('Want to Learn')}>Edit</button>}
          </div>
          <div className="skill-line">
            {(isMe ? profile.learns : p.learns).map(x => <SkillChip key={x}>{x}</SkillChip>)}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '18px' }}>
            <small className="eyebrow">COMMUNITIES</small>
            {isMe && <button className="text-btn" style={{ fontSize: '10px', padding: '4px' }} onClick={() => openEditor('Communities')}>Manage</button>}
          </div>
          <div className="skill-line">
            {displayCommunities.length > 0 ? (
              displayCommunities.map(x => <Chip key={x}>{x}</Chip>)
            ) : (
              <small style={{ color: 'var(--muted)', fontSize: '11px' }}>No communities joined yet. <Link to="/communities" style={{ color: 'var(--accent)', fontWeight: 700 }}>Browse circles →</Link></small>
            )}
          </div>
        </section>
        <aside>
          <div><b>{p.rating}</b><span>Rating</span></div>
          <div><b>{p.sessions}</b><span>Sessions completed</span></div>
          <div><b>{p.availability}</b><span>Availability</span></div>
          <section className="badges">
            <small>BADGES</small>
            <p>✦ Verified Mentor</p>
            <p>◌ Active Learner</p>
            <p>✧ Campus Contributor</p>
          </section>
        </aside>
      </div>

      {editing && (
        <Modal title="Edit Profile & Preferences" close={() => setEditing(false)}>
          <div className="edit-tabs">
            {['Bio', 'Can Teach', 'Want to Learn', 'Communities'].map(t => (
              <button
                key={t}
                type="button"
                className={tab === t ? 'active' : ''}
                onClick={() => setTab(t)}
              >
                {t}
              </button>
            ))}
          </div>

          <form className="modal-form" onSubmit={saveProfile}>
            {tab === 'Bio' && (
              <label>
                Short bio
                <textarea
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  placeholder="Share a little about what you love building or learning..."
                />
              </label>
            )}

            {tab === 'Can Teach' && (
              <div>
                <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '10px' }}>
                  Select skills you can share ({editTeach.length} selected):
                </p>
                <small className="section-label" style={{ marginTop: 0 }}>TECHNICAL</small>
                <div className="edit-chips">
                  {skills.technical.map(s => (
                    <Chip key={s} active={editTeach.includes(s)} onClick={() => toggleTeach(s)}>
                      {editTeach.includes(s) && <Check size={13}/>} {s}
                    </Chip>
                  ))}
                </div>
                <small className="section-label">NON-TECHNICAL</small>
                <div className="edit-chips">
                  {skills.nonTechnical.map(s => (
                    <Chip key={s} active={editTeach.includes(s)} onClick={() => toggleTeach(s)}>
                      {editTeach.includes(s) && <Check size={13}/>} {s}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {tab === 'Want to Learn' && (
              <div>
                <p style={{ fontSize: '11px', color: 'var(--muted)', marginBottom: '10px' }}>
                  Select skills you want to learn ({editLearn.length} selected):
                </p>
                <small className="section-label" style={{ marginTop: 0 }}>TECHNICAL</small>
                <div className="edit-chips">
                  {skills.technical.map(s => (
                    <Chip key={s} active={editLearn.includes(s)} onClick={() => toggleLearn(s)}>
                      {editLearn.includes(s) && <Check size={13}/>} {s}
                    </Chip>
                  ))}
                </div>
                <small className="section-label">NON-TECHNICAL</small>
                <div className="edit-chips">
                  {skills.nonTechnical.map(s => (
                    <Chip key={s} active={editLearn.includes(s)} onClick={() => toggleLearn(s)}>
                      {editLearn.includes(s) && <Check size={13}/>} {s}
                    </Chip>
                  ))}
                </div>
              </div>
            )}

            {tab === 'Communities' && (
              <div className="comm-edit-list">
                {communities.map(c => {
                  const isJoined = (joined || []).includes(c.id);
                  return (
                    <div key={c.id} className="comm-edit-item">
                      <div>
                        <b>{c.name}</b>
                        <small>{c.members} members · {c.category}</small>
                      </div>
                      <button
                        type="button"
                        className={'button' + (isJoined ? ' primary' : '')}
                        style={{ padding: '6px 12px', fontSize: '11px' }}
                        onClick={() => toggleComm(c.id)}
                      >
                        {isJoined ? '✓ Joined' : '+ Join'}
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <button className="button primary full" style={{ marginTop: '16px' }}>Save changes</button>
          </form>
        </Modal>
      )}
    </div>
  );
}

function SettingsPage({ theme, setTheme, toast, setProfile }) { const nav = useNavigate(); const [switches,setSwitches]=useState({reminders:true,matches:true,activity:false}); const toggle=k=>setSwitches({...switches,[k]:!switches[k]});return <div><PageHead eyebrow="PREFERENCES" title="Settings"/><div className="settings"><section><small className="eyebrow">APPEARANCE</small><h3>Choose your view</h3><div className="theme-options">{[['light',Sun,'Light'],['dark',Moon,'Dark'],['system','◌','System']].map(([v,I,l])=><button className={theme===v?'selected':''} onClick={()=>setTheme(v==='system'?'light':v)} key={v}>{typeof I==='string'?I:<I size={18}/>}<span>{l}</span>{theme===v&&<Check size={16}/>}</button>)}</div></section><section><small className="eyebrow">NOTIFICATIONS</small>{[['reminders','Session reminders'],['matches','New matches'],['activity','Community activity']].map(([k,l])=><div className="setting-row" key={k}><span><b>{l}</b><small>Keep this activity on your radar</small></span><button className={'switch '+(switches[k]?'on':'')} onClick={()=>toggle(k)}><i/></button></div>)}</section><section><small className="eyebrow">PROFILE & SKILLS</small><div className="setting-row" onClick={()=>nav('/profile')} style={{cursor:'pointer'}}><span><b>Manage teaching skills</b><small>Add or remove skills you can share</small></span><ChevronRight size={18}/></div><div className="setting-row" onClick={()=>nav('/profile')} style={{cursor:'pointer'}}><span><b>Manage learning skills</b><small>Shape your next matches</small></span><ChevronRight size={18}/></div><button className="danger" onClick={()=>{ if (setProfile) setProfile(p => ({ ...p, isOnboarded: false })); toast('Signed out of the demo'); nav('/login'); }}><LogOut size={16}/> Sign out</button></section></div></div> }

export default App;
