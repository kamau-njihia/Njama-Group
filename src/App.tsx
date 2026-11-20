import { useEffect, useMemo, useRef, useState } from 'react';
import { auth, api, invitesClient } from '@appdeploy/client';
import {
  Activity, ArrowLeft, ArrowRight, ArrowUpRight, BadgeCheck, Banknote,
  Bell, BookOpen, BriefcaseBusiness, Building2, CalendarClock, Check,
  CheckCircle2, ChevronRight, CircleHelp, ClipboardList, Coins, Compass,
  Crown, FileCheck2, FileText, Fingerprint, Gauge, Globe2, Handshake,
  Landmark, Layers3, Lightbulb, LockKeyhole, LogOut, Menu, Network,
  Plus, RefreshCw, Search, ShieldCheck, Sparkles, Target, Users, Wallet,
  X, Zap
} from 'lucide-react';

type Section = 'Overview' | 'Businesses' | 'Departments' | 'Finance' | 'People' | 'Intelligence' | 'Governance' | 'Legal & Risk' | 'Technology' | 'Activity' | 'Settings';
type User = { userId: string; email?: string; name?: string; role?: string | null };
type Item = { id: string; kind?: string; title?: string; name?: string; businessId?: string; [key: string]: any };

const navItems: { label: Section; icon: any; hint: string }[] = [
  { label: 'Overview', icon: Gauge, hint: 'Group command centre' },
  { label: 'Businesses', icon: Building2, hint: 'Independent subsidiaries and ventures' },
  { label: 'Departments', icon: Layers3, hint: 'Shared group capabilities' },
  { label: 'Finance', icon: Wallet, hint: 'Group finance and investments' },
  { label: 'People', icon: Users, hint: 'Leadership, people and access' },
  { label: 'Intelligence', icon: Sparkles, hint: 'NJAMA INTELLIGENCE' },
  { label: 'Governance', icon: ShieldCheck, hint: 'Authority, approvals and accountability' },
  { label: 'Legal & Risk', icon: FileCheck2, hint: 'Legal, compliance and risk registers' },
  { label: 'Technology', icon: Network, hint: 'Infrastructure and connected systems' },
  { label: 'Activity', icon: Activity, hint: 'Group audit trail' },
  { label: 'Settings', icon: Compass, hint: 'Group configuration' }
];

const foundingBusinesses = [
  { id: 'quick-task', name: 'Quick Task Errands & Cleaning Services', short: 'Quick Task', sector: 'Errands, cleaning and service operations', description: 'A specialist service business for errands, cleaning, workforce scheduling, customer service and quality control.', tone: 'blue' },
  { id: 'njama-creations', name: 'Njama Creations', short: 'Njama Creations', sector: 'Creative enterprise', description: 'An independent creative business with its own production, client, project and commercial workflows.', tone: 'gold' },
  { id: 'njama-property-managers', name: 'Njama Property Managers', short: 'Njama Property Managers', sector: 'Property management', description: 'A specialist property-management business with distinct operational, tenant, facilities and financial controls.', tone: 'silver' }
];

const departments = [
  ['Group Executive Office', 'Group governance, leadership, strategy and performance oversight.', 'Crown'],
  ['Finance & Investments', 'Consolidated accounting, treasury, capital allocation and investment analysis.', 'Landmark'],
  ['NJAMA INTELLIGENCE', 'Research, analysis, forecasting, risk signals and decision support.', 'Sparkles'],
  ['Technology & Innovation', 'Applications, infrastructure, cybersecurity, data and technical innovation.', 'Network'],
  ['Human Capital', 'Recruitment, development, remuneration, culture and succession.', 'Users'],
  ['Legal & Compliance', 'Corporate governance, contracts, regulatory obligations and legal risk.', 'FileCheck2'],
  ['Strategy & Expansion', 'Market research, new ventures, partnerships, acquisitions and international growth.', 'Target']
];

const systems = [
  { name: 'PropertyOS', purpose: 'Property and facilities management platform', url: 'https://propertyos-evb7jo.v2.appdeploy.ai/' },
  { name: 'Atira', purpose: 'Financial and wealth tracking application', url: 'https://greenledger-xfj1js.v2.appdeploy.ai/' },
  { name: 'FORGED', purpose: 'Personal development and performance platform', url: 'https://forged-y36jx3.v2.appdeploy.ai/' },
  { name: 'Business Mastery Academy', purpose: 'Business education and learning platform', url: 'https://business-mastery-academy-4vpshh.v2.appdeploy.ai/' }
];

const roleOptions = [
  ['admin', 'Group executive'],
  ['business_director', 'Business director'],
  ['finance_lead', 'Finance lead'],
  ['department_lead', 'Department lead'],
  ['staff', 'Staff member'],
  ['auditor', 'Auditor (read-only)']
];

function Mark({ small = false }: { small?: boolean }) {
  return <div className={small ? 'brand-mark small' : 'brand-mark'} aria-label="NJAMA GROUP emblem">
    <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
      <path d="M9 38V10l30 28V10" fill="none" stroke="currentColor" strokeWidth="3.3" strokeLinecap="square" />
      <path d="M23 24l10-10" fill="none" stroke="#D6B66E" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  </div>;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [section, setSection] = useState<Section>('Overview');
  const [loading, setLoading] = useState(true);
  const [introReady, setIntroReady] = useState(false);
  const [busy, setBusy] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [notice, setNotice] = useState('');
  const [dbReady, setDbReady] = useState(false);
  const [dbMessage, setDbMessage] = useState('Checking secure group data services…');
  const [search, setSearch] = useState('');
  const [records, setRecords] = useState<Record<string, Item[]>>({});
  const [team, setTeam] = useState<any[]>([]);
  const [teamLoaded, setTeamLoaded] = useState(false);
  const [businessName, setBusinessName] = useState('');
  const [businessSector, setBusinessSector] = useState('');
  const [businessDescription, setBusinessDescription] = useState('');
  const [txType, setTxType] = useState('Income');
  const [txAmount, setTxAmount] = useState('');
  const [txCurrency, setTxCurrency] = useState('KES');
  const [txBusiness, setTxBusiness] = useState('group');
  const [txCategory, setTxCategory] = useState('');
  const [txDescription, setTxDescription] = useState('');
  const [approvalTitle, setApprovalTitle] = useState('');
  const [approvalDescription, setApprovalDescription] = useState('');
  const [approvalBusiness, setApprovalBusiness] = useState('group');
  const [riskTitle, setRiskTitle] = useState('');
  const [riskCategory, setRiskCategory] = useState('Operational');
  const [riskSeverity, setRiskSeverity] = useState('Medium');
  const [riskMitigation, setRiskMitigation] = useState('');
  const [legalTitle, setLegalTitle] = useState('');
  const [legalCategory, setLegalCategory] = useState('Contract');
  const [legalJurisdiction, setLegalJurisdiction] = useState('Kenya');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('staff');
  const [inviteScope, setInviteScope] = useState('');
  const [inviteLink, setInviteLink] = useState('');
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [navHistory, setNavHistory] = useState<Section[]>(['Overview']);
  const [navIndex, setNavIndex] = useState(0);
  const sectionRef = useRef<Section>('Overview');
  const indexRef = useRef(0);

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const pendingCode = invitesClient.getPendingCode();
        const restored = await auth.getUser();
        if (!active) return;
        if (restored && pendingCode) {
          try {
            await api.post('/api/team/join', { code: pendingCode });
            invitesClient.clearPendingCode();
            setNotice('Your NJAMA GROUP invitation has been accepted.');
          } catch (joinError) {
            setErrorText(joinError instanceof Error ? joinError.message : 'The invitation could not be accepted. Check that you signed in with the invited email.');
          }
        }
        if (restored) {
          const response = await api.get('/api/me');
          if (!active) return;
          setUser({ userId: response.data.userId, email: response.data.email, name: response.data.name, role: response.data.role || null });
          if (response.data.role) {
            try {
              const status = await api.get('/api/bootstrap-status');
              if (!active) return;
              setDbReady(Boolean(status.data.ready));
              setDbMessage(status.data.ready ? 'Secure group data services are available.' : 'Live registers are waiting for AppDeploy database table-catalog provisioning. No sample records have been created.');
            } catch {
              setDbMessage('The group data service could not be verified. Live writes remain disabled until the service is available.');
            }
          }
        }
      } catch (err) {
        if (active) setErrorText(err instanceof Error ? err.message : 'Your secure session could not be restored. Please retry.');
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (loading) return;
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const timer = window.setTimeout(() => setIntroReady(true), reduced ? 450 : 2600);
    return () => window.clearTimeout(timer);
  }, [loading]);

  useEffect(() => {
    const state = { njamaGroup: true, section: 'Overview', index: 0 };
    window.history.pushState(state, '', window.location.pathname + '#overview');
    const onPop = (event: PopStateEvent) => {
      if (event.state && event.state.njamaGroup) {
        const next = navItems.some(item => item.label === event.state.section) ? event.state.section as Section : 'Overview';
        const nextIndex = Number.isInteger(event.state.index) ? event.state.index : 0;
        sectionRef.current = next;
        indexRef.current = nextIndex;
        setSection(next);
        setNavIndex(nextIndex);
        setMobileNav(false);
      } else {
        window.history.pushState({ njamaGroup: true, section: sectionRef.current, index: indexRef.current }, '', window.location.pathname + '#' + sectionRef.current.toLowerCase().replace(/ & /g, '-'));
      }
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigateTo = (next: Section) => {
    if (next === section) { setMobileNav(false); return; }
    const nextHistory = navHistory.slice(0, navIndex + 1).concat(next);
    const nextIndex = nextHistory.length - 1;
    setNavHistory(nextHistory);
    setNavIndex(nextIndex);
    setSection(next);
    indexRef.current = nextIndex;
    sectionRef.current = next;
    setMobileNav(false);
    window.history.pushState({ njamaGroup: true, section: next, index: nextIndex }, '', window.location.pathname + '#' + next.toLowerCase().replace(/ & /g, '-'));
  };

  const signIn = async () => {
    setBusy(true); setErrorText('');
    try { await auth.signInWithRedirect(); }
    catch (err) { setErrorText(err instanceof Error ? err.message : 'Secure sign-in could not start. Please retry.'); setBusy(false); }
  };

  const signOut = async () => {
    setBusy(true);
    try { await auth.signOut(); setUser(null); setSection('Overview'); setRecords({}); setTeam([]); }
    catch (err) { setErrorText(err instanceof Error ? err.message : 'Sign-out failed.'); }
    finally { setBusy(false); }
  };

  const loadRecords = async (kind: string) => {
    if (!dbReady) return;
    try {
      const response = await api.get('/api/records/' + kind);
      setRecords(prev => ({ ...prev, [kind]: response.data.items || [] }));
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'Could not load ' + kind + ' records.');
    }
  };

  const loadTeam = async () => {
    try {
      const response = await api.get('/api/team');
      setTeam(response.data.members || []);
      setTeamLoaded(true);
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'Team information could not be loaded.');
    }
  };

  useEffect(() => {
    if (!user || !user.role) return;
    if (section === 'Businesses') loadRecords('businesses');
    if (section === 'Finance') { loadRecords('transactions'); loadRecords('budgets'); }
    if (section === 'Governance') loadRecords('approvals');
    if (section === 'Legal & Risk') { loadRecords('risks'); loadRecords('legal'); }
    if (section === 'Activity') loadRecords('activity');
    if (section === 'People' && !teamLoaded) loadTeam();
    if (section === 'Overview' && dbReady) { loadRecords('businesses'); loadRecords('approvals'); loadRecords('transactions'); }
  }, [section, user, dbReady]);

  const createRecord = async (kind: string, payload: Record<string, any>) => {
    if (!dbReady) { setErrorText('Live records are not enabled yet. The required database catalogs must be provisioned first.'); return; }
    setBusy(true); setErrorText(''); setNotice('');
    try {
      const requestId = window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : 'njama-' + Date.now() + '-' + Math.random().toString(36).slice(2);
      await api.post('/api/records/' + kind, { ...payload, requestId });
      setNotice('Saved successfully. The change is recorded in the group audit trail.');
      await loadRecords(kind);
      if (kind === 'approvals') loadRecords('approvals');
      if (kind === 'businesses') loadRecords('businesses');
      if (kind === 'transactions') loadRecords('transactions');
      if (kind === 'risks' || kind === 'legal') { loadRecords('risks'); loadRecords('legal'); }
    } catch (err) {
      setErrorText(err instanceof Error ? err.message : 'The record could not be saved. Refresh before retrying.');
    } finally { setBusy(false); }
  };

  const decideApproval = async (item: Item, decision: 'approved' | 'rejected') => {
    setBusy(true); setErrorText(''); setNotice('');
    try {
      await api.post('/api/approvals/' + encodeURIComponent(item.id) + '/decision', { decision });
      setNotice('Approval decision recorded.');
      loadRecords('approvals');
    } catch (err) { setErrorText(err instanceof Error ? err.message : 'Decision could not be recorded.'); }
    finally { setBusy(false); }
  };

  const inviteMember = async (event: React.FormEvent) => {
    event.preventDefault(); setBusy(true); setErrorText(''); setNotice(''); setInviteLink('');
    try {
      const scopes = inviteScope ? [inviteScope] : [];
      const response = await api.post('/api/team/invite', { email: inviteEmail.trim(), role: inviteRole, scopes });
      if (!response.data.emailed && response.data.joinUrl) setInviteLink(response.data.joinUrl);
      setNotice(response.data.emailed ? 'Invitation sent by AppDeploy.' : 'Invitation created. Copy the link below and send it to the invitee.');
      setInviteEmail('');
    } catch (err) { setErrorText(err instanceof Error ? err.message : 'The invitation could not be sent.'); }
    finally { setBusy(false); }
  };

  const askIntelligence = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!question.trim()) return;
    const prompt = question.trim();
    setMessages(prev => prev.concat([{ role: 'you', text: prompt }]));
    setQuestion(''); setBusy(true); setErrorText('');
    try {
      const response = await api.post('/api/intelligence', { question: prompt });
      setMessages(prev => prev.concat([{ role: 'intelligence', text: response.data.answer || 'No response was returned.' }]));
    } catch (err) {
      setMessages(prev => prev.concat([{ role: 'intelligence', text: err instanceof Error ? err.message : 'NJAMA INTELLIGENCE is temporarily unavailable. Please retry.' }]));
    } finally { setBusy(false); }
  };

  const filteredBusinesses = useMemo(() => foundingBusinesses.filter(item => (item.name + ' ' + item.sector + ' ' + item.description).toLowerCase().includes(search.toLowerCase())), [search]);
  const current = navItems.find(item => item.label === section)!;
  const initials = (user?.name || user?.email || 'NJ').slice(0, 1).toUpperCase();
  const canManage = user?.role === 'owner' || user?.role === 'admin';
  const canFinance = canManage || user?.role === 'finance_lead';
  const dbGate = !dbReady;

  if (loading || !introReady) return <main className="boot-screen"><div className="intro-stage"><div className="intro-mark-wrap"><span className="intro-ring one" /><span className="intro-ring two" /><Mark /></div><div className="intro-wordmark"><strong>NJAMA</strong><span>GROUP</span></div><h2>Distinct in purpose. United in strength. Boundless in ambition.</h2><div className="intro-progress"><span /></div><small>Preparing your group command centre</small></div></main>;

  if (!user) return <main className="auth-screen"><div className="auth-panel"><Mark /><div className="eyebrow">THE GROUP OPERATING SYSTEM</div><h1>NJAMA <span>GROUP</span></h1><p className="auth-copy">Distinct in purpose. United in strength. Boundless in ambition.</p><div className="auth-points"><div><ShieldCheck size={17} /> Permission-led group governance</div><div><Network size={17} /> Independent specialist businesses</div><div><LockKeyhole size={17} /> Private by default</div></div>{errorText && <div className="error-note">{errorText}</div>}<button className="primary-button full" onClick={signIn} disabled={busy}>{busy ? 'Opening secure sign-in…' : 'Sign in securely'} <ArrowUpRight size={17} /></button><p className="auth-foot">Use the email address associated with your NJAMA GROUP invitation.</p></div></main>;

  if (!user.role) return <main className="auth-screen"><div className="auth-panel"><Mark /><div className="eyebrow">ACCESS CONTROL</div><h1>Access <span>pending</span></h1><p className="auth-copy">Your account is signed in, but no NJAMA GROUP role has been assigned. Ask the group owner to send you an invitation to the correct business and role.</p><button className="quiet-button" onClick={signOut}>Sign out</button></div></main>;

  const recentTransactions = records.transactions || [];
  const approvals = records.approvals || [];
  const approvalPending = approvals.filter(item => item.status === 'pending');

  return <div className="app-shell">
    {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
    <aside className={'sidebar ' + (mobileNav ? 'open' : '')}>
      <div className="brand-lockup"><Mark /><div><strong>NJAMA</strong><span>GROUP</span></div><button className="mobile-close" onClick={() => setMobileNav(false)} aria-label="Close menu"><X size={18} /></button></div>
      <div className="workspace-label">GROUP COMMAND</div>
      <nav className="main-nav">{navItems.map(item => { const Icon = item.icon; return <button key={item.label} className={'nav-item ' + (section === item.label ? 'active' : '')} onClick={() => navigateTo(item.label)}><Icon size={18} /><span>{item.label}</span>{section === item.label && <i />}</button>; })}</nav>
      <div className="sidebar-bottom"><div className="secure-state"><span className="secure-dot" /><div><strong>Private workspace</strong><small>{user.role.replace(/_/g, ' ')}</small></div></div><button className="profile-row" onClick={signOut} disabled={busy}><span className="avatar">{initials}</span><span className="profile-meta"><strong>{user.name || 'Group member'}</strong><small>{user.email || 'Signed-in account'}</small></span><LogOut size={16} /></button></div>
    </aside>
    <main className="main-area">
      <header className="topbar">
        <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><Menu size={20} /></button>
        <div className="history-controls"><button className="history-button" onClick={() => window.history.back()} disabled={navIndex === 0}><ArrowLeft size={16} /> Back</button><button className="history-button" onClick={() => window.history.forward()} disabled={navIndex >= navHistory.length - 1}>Next <ArrowRight size={16} /></button></div>
        <div className="breadcrumb"><span>NJAMA GROUP</span><ChevronRight size={14} /><strong>{section}</strong></div>
        <div className="top-actions"><span className="system-status"><i /> {dbReady ? 'DATA SERVICES READY' : 'DATA SETUP PENDING'}</span><button className="icon-button" onClick={() => navigateTo('Governance')} aria-label="Governance help"><CircleHelp size={18} /></button></div>
      </header>
      <div className="content-wrap">
        <div className="page-heading"><div><div className="eyebrow">{current.hint.toUpperCase()}</div><h1>{section === 'Overview' ? 'The group, in one view.' : section}</h1><p>{section === 'Overview' ? 'A holding company and active operating group—built around independent businesses and shared intelligence.' : current.hint + '.'}</p></div><div className="date-chip"><Globe2 size={15} /> MULTI-ENTITY · MULTI-CURRENCY</div></div>
        {errorText && <div className="error-note" role="alert">{errorText}<button onClick={() => setErrorText('')} aria-label="Dismiss error"><X size={15} /></button></div>}
        {notice && <div className="success-note" role="status">{notice}<button onClick={() => setNotice('')} aria-label="Dismiss message"><X size={15} /></button></div>}
        {dbGate && <div className="data-gate"><LockKeyhole size={18} /><div><strong>Persistent group registers are not yet active</strong><p>{dbMessage} The platform's table catalogs must be provisioned before live business, financial, legal, risk and audit records can be stored. The application will not substitute browser-only storage or invent figures.</p></div><span className="gate-pill">PROVISIONING REQUIRED</span></div>}

        {section === 'Overview' && <>
          <section className="hero-card"><div className="hero-copy"><div className="hero-kicker"><span /> NJAMA GROUP OPERATING MODEL</div><h2>Distinct in purpose.<br /><em>United in strength.</em></h2><p>One parent organisation. Independent specialist businesses. Shared capabilities. Intelligence and capital coordinated across the group.</p><div className="hero-principle">Boundless in ambition.</div><button className="text-button" onClick={() => navigateTo('Businesses')}>Explore the group structure <ArrowUpRight size={16} /></button></div><div className="hero-emblem"><div className="orbit orbit-one" /><div className="orbit orbit-two" /><Mark /></div></section>
          <section className="metric-grid"><div className="metric-card"><span>FOUNDING BUSINESSES</span><strong>3</strong><small>Defined in the group blueprint</small></div><div className="metric-card"><span>GROUP DEPARTMENTS</span><strong>7</strong><small>Shared group capabilities</small></div><div className="metric-card"><span>PENDING APPROVALS</span><strong>{dbReady ? approvalPending.length : '—'}</strong><small>{dbReady ? 'From the live approvals register' : 'Live register not provisioned'}</small></div><div className="metric-card"><span>GROUP REPORTING</span><strong>KES</strong><small>Multi-currency architecture · KES initial</small></div></section>
          <div className="section-title-row"><div><div className="eyebrow">THE PORTFOLIO</div><h2>Founding businesses</h2></div><button className="quiet-button" onClick={() => navigateTo('Businesses')}>View businesses <ArrowUpRight size={15} /></button></div>
          <section className="business-grid">{foundingBusinesses.map(item => <article className="business-card" key={item.id}><div className={'business-symbol ' + item.tone}>{item.short.slice(0,1)}</div><div className="eyebrow">{item.sector}</div><h3>{item.name}</h3><p>{item.description}</p><span className="status-pill neutral">BLUEPRINT PORTFOLIO</span></article>)}</section>
          <section className="lower-grid"><div className="panel"><div className="panel-icon"><Sparkles size={18} /></div><div className="eyebrow">NJAMA INTELLIGENCE</div><h3>One intelligence ecosystem.</h3><p>Specialist intelligence inside each business, connected to group intelligence only through approved, purpose-limited access.</p><button className="text-button" onClick={() => navigateTo('Intelligence')}>Open intelligence <ArrowUpRight size={15} /></button></div><div className="panel"><div className="panel-heading"><ShieldCheck size={18} /><strong>Group principles</strong></div><ul className="check-list"><li><CheckCircle2 size={15} /> Subsidiary independence</li><li><CheckCircle2 size={15} /> Delegated executive authority</li><li><CheckCircle2 size={15} /> Owner-reserved decisions</li><li><CheckCircle2 size={15} /> Auditable approvals</li><li><CheckCircle2 size={15} /> Confidentiality by default</li></ul></div></section>
        </>}

        {section === 'Businesses' && <><div className="section-title-row"><div><div className="eyebrow">INDEPENDENT SUBSIDIARIES</div><h2>Business portfolio</h2></div><div className="search-field"><Search size={16} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search founding businesses" /></div></div><section className="business-grid">{filteredBusinesses.map(item => <article className="business-card" key={item.id}><div className={'business-symbol ' + item.tone}>{item.short.slice(0,1)}</div><div className="eyebrow">{item.sector}</div><h3>{item.name}</h3><p>{item.description}</p><span className="status-pill neutral">BLUEPRINT PORTFOLIO</span></article>)}</section><div className="panel form-panel"><div className="eyebrow">FUTURE VENTURES</div><h3>Register an additional business</h3><p>New ventures enter the live register only after database provisioning. A business record does not itself create a legal entity or authorize trading.</p><form className="data-form" onSubmit={e => { e.preventDefault(); createRecord('businesses', { name: businessName.trim(), sector: businessSector.trim(), description: businessDescription.trim(), businessId: 'group', status: 'proposed' }); setBusinessName(''); setBusinessSector(''); setBusinessDescription(''); }}><label>Business name<input required value={businessName} onChange={e => setBusinessName(e.target.value)} placeholder="Proposed business name" /></label><label>Industry or sector<input required value={businessSector} onChange={e => setBusinessSector(e.target.value)} placeholder="Industry / sector" /></label><label className="wide">Description<textarea value={businessDescription} onChange={e => setBusinessDescription(e.target.value)} placeholder="Purpose and specialist activities" rows={3} /></label><button className="primary-button" disabled={busy || dbGate}><Plus size={16} /> Save business proposal</button></form></div>{dbReady && <RecordList title="Additional business records" items={records.businesses || []} empty="No additional businesses have been registered." />}</>}

        {section === 'Departments' && <><div className="section-title-row"><div><div className="eyebrow">SHARED GROUP CAPABILITIES</div><h2>Group departments</h2></div></div><section className="department-grid">{departments.map((item,i) => <article className="department-card" key={item[0]}><div className="department-number">0{i+1}</div><h3>{item[0]}</h3><p>{item[1]}</p><span className="status-pill neutral">GROUP FUNCTION</span></article>)}</section><div className="info-banner"><Layers3 size={19} /><div><strong>Centralized expertise. Decentralized execution.</strong><p>Group departments establish shared standards and services. Subsidiaries retain their specialist operational teams and daily decision-making within delegated authority.</p></div></div></>}

        {section === 'Finance' && <><div className="finance-intro"><div className="panel"><div className="eyebrow">GROUP FINANCIAL ARCHITECTURE</div><h2>One consolidated view. Separate books.</h2><p>Each subsidiary maintains its own records, budgets, assets, liabilities and cash flow. The parent consolidates authorized reporting and coordinates treasury and capital allocation.</p><div className="setting-row"><span>Initial group reporting currency</span><strong>KES</strong></div><div className="setting-row"><span>Transaction currencies</span><strong>Multi-currency</strong></div><div className="setting-row"><span>Intercompany accounting</span><strong>Separate counterpart entries</strong></div></div><div className="panel"><div className="eyebrow">FINANCIAL CONTROLS</div><h3>Approval before commitment</h3><ul className="check-list"><li><CheckCircle2 size={15} /> Distinct subsidiary ledgers</li><li><CheckCircle2 size={15} /> Original currency retained</li><li><CheckCircle2 size={15} /> FX conversion date recorded</li><li><CheckCircle2 size={15} /> Budget and cash-flow oversight</li><li><CheckCircle2 size={15} /> Intercompany reconciliation</li><li><CheckCircle2 size={15} /> Owner approval for reserved decisions</li></ul></div></div><div className="panel form-panel"><div className="eyebrow">FINANCIAL REGISTER</div><h3>Record a group transaction</h3><p>Record actual transactions only. Amounts are stored in their original currency; no exchange rates or balances are fabricated.</p><form className="data-form" onSubmit={e => { e.preventDefault(); createRecord('transactions', { type: txType, amount: Number(txAmount), currency: txCurrency.toUpperCase(), businessId: txBusiness, category: txCategory.trim(), description: txDescription.trim(), date: new Date().toISOString().slice(0,10) }); setTxAmount(''); setTxCategory(''); setTxDescription(''); }}><label>Transaction type<select value={txType} onChange={e => setTxType(e.target.value)}><option>Income</option><option>Expense</option><option>Investment</option><option>Intercompany</option></select></label><label>Amount<input required type="number" min="0.01" step="0.01" value={txAmount} onChange={e => setTxAmount(e.target.value)} /></label><label>Currency<input required maxLength={3} value={txCurrency} onChange={e => setTxCurrency(e.target.value.toUpperCase())} /></label><label>Business scope<select value={txBusiness} onChange={e => setTxBusiness(e.target.value)}><option value="group">Group-level</option>{foundingBusinesses.map(b => <option value={b.id} key={b.id}>{b.short}</option>)}</select></label><label>Category<input required value={txCategory} onChange={e => setTxCategory(e.target.value)} placeholder="e.g. Service revenue" /></label><label className="wide">Description<input required value={txDescription} onChange={e => setTxDescription(e.target.value)} placeholder="Transaction details and reference" /></label><button className="primary-button" disabled={busy || dbGate || !canFinance}><Plus size={16} /> Record transaction</button>{!canFinance && <small className="field-note">Finance lead, group executive or owner permission required.</small>}</form></div><RecordList title="Recent financial transactions" items={recentTransactions} empty="No financial transactions recorded. Financial totals will appear only after verified records exist." /><RecordList title="Budgets" items={records.budgets || []} empty="No budgets have been recorded." /></>}

        {section === 'People' && <><div className="people-layout"><div className="panel"><div className="eyebrow">HUMAN CAPITAL</div><h2>Build exceptional people.</h2><p>Recruitment based on competence and integrity. Development through continuous learning. Performance measured by outcomes, accountability and contribution.</p><ul className="check-list"><li><CheckCircle2 size={15} /> Recruitment and onboarding</li><li><CheckCircle2 size={15} /> Professional development</li><li><CheckCircle2 size={15} /> Performance and rewards</li><li><CheckCircle2 size={15} /> Leadership progression</li><li><CheckCircle2 size={15} /> Succession and continuity</li></ul></div><div className="panel form-panel"><div className="eyebrow">TEAM ACCESS</div><h3>Invite a group member</h3><p>Invitations are sent through AppDeploy. Roles and business scopes are enforced by the backend.</p><form className="data-form one-col" onSubmit={inviteMember}><label>Email address<input required type="email" value={inviteEmail} onChange={e => setInviteEmail(e.target.value)} placeholder="colleague@example.com" /></label><label>Role<select value={inviteRole} onChange={e => setInviteRole(e.target.value)}>{roleOptions.map(option => <option value={option[0]} key={option[0]}>{option[1]}</option>)}</select></label><label>Business scope (optional)<select value={inviteScope} onChange={e => setInviteScope(e.target.value)}><option value="">Group-wide / unrestricted</option>{foundingBusinesses.map(b => <option value={b.id} key={b.id}>{b.short}</option>)}</select></label><button className="primary-button" disabled={busy || !(user.role === 'owner' || user.role === 'admin')}><Plus size={16} /> Send invitation</button>{!(user.role === 'owner' || user.role === 'admin') && <small className="field-note">Only the owner or group executive can invite members.</small>}</form>{inviteLink && <div className="invite-link"><strong>Invitation link</strong><input readOnly value={inviteLink} /><button className="quiet-button" onClick={() => navigator.clipboard.writeText(inviteLink)}>Copy link</button></div>}</div></div><div className="panel"><div className="section-title-row"><div><div className="eyebrow">AUTHORIZED MEMBERS</div><h3>Group team</h3></div><button className="quiet-button" onClick={loadTeam}><RefreshCw size={14} /> Refresh</button></div>{team.length ? <div className="record-list">{team.map(member => <div className="record-row" key={member.userId}><div><strong>{member.name || member.email || 'Member'}</strong><small>{member.email || member.userId}</small></div><span className="status-pill neutral">{member.role}</span></div>)}</div> : <Empty text={teamLoaded ? 'No additional members have been invited.' : 'Member directory loads when you refresh or open this section.'} />}</div></>}

        {section === 'Intelligence' && <><div className="intelligence-banner"><div className="feature-symbol"><Sparkles size={22} /></div><div><div className="eyebrow">NJAMA INTELLIGENCE</div><h2>Think across the group. Act within authority.</h2><p>Ask for strategic analysis, planning, operational frameworks and decision support. This assistant does not currently read subsidiary databases or private records.</p></div></div><div className="intelligence-layout"><div className="panel chat-panel"><div className="panel-heading"><Sparkles size={18} /><strong>Group intelligence assistant</strong><span className="status-pill neutral">AI ASSISTED</span></div><div className="chat-messages">{messages.length ? messages.map((message,i) => <div className={'chat-message ' + message.role} key={i}><strong>{message.role === 'you' ? 'You' : 'NJAMA INTELLIGENCE'}</strong><p>{message.text}</p></div>) : <div className="empty-chat"><Lightbulb size={26} /><h3>What should we think through?</h3><p>Ask about strategy, financial architecture, leadership, expansion, risk or business operations.</p></div>}</div><form className="chat-form" onSubmit={askIntelligence}><textarea value={question} onChange={e => setQuestion(e.target.value)} placeholder="Ask NJAMA INTELLIGENCE…" rows={3} /><button className="primary-button" disabled={busy || !question.trim()}>{busy ? 'Thinking…' : 'Ask intelligence'} <ArrowUpRight size={16} /></button></form></div><div className="panel"><div className="eyebrow">INTELLIGENCE PRINCIPLES</div><div className="rule-list"><div><span>01</span><strong>Observe</strong><small>Use authorized and verified information.</small></div><div><span>02</span><strong>Understand</strong><small>Interpret context and distinguish evidence from assumptions.</small></div><div><span>03</span><strong>Predict</strong><small>Explore scenarios and uncertainty.</small></div><div><span>04</span><strong>Recommend</strong><small>Present options, trade-offs and priorities.</small></div><div><span>05</span><strong>Execute with authority</strong><small>Human approval is required for consequential actions.</small></div></div></div></div></>}

        {section === 'Governance' && <><div className="governance-layout"><div className="panel"><div className="eyebrow">AUTHORITY MODEL</div><h2>Ownership stays clear.</h2><p>The owner retains ultimate authority. Executives receive delegated powers. Subsidiary leaders control routine operations within approved limits.</p><div className="authority-row"><Crown size={19} /><div><strong>Group owner</strong><small>Ownership, major investments, acquisitions, borrowing, structural changes and reserved decisions.</small></div></div><div className="authority-row"><BriefcaseBusiness size={19} /><div><strong>Group executives</strong><small>Group-wide coordination, approved budgets, performance and delegated strategic decisions.</small></div></div><div className="authority-row"><Building2 size={19} /><div><strong>Business directors</strong><small>Specialist business operations, customers, teams and approved budgets.</small></div></div><div className="authority-row"><Fingerprint size={19} /><div><strong>Members and auditors</strong><small>Least-privilege access with business scope and read-only oversight where assigned.</small></div></div></div><div className="panel"><div className="eyebrow">APPROVAL WORKFLOW</div><h3>Request before commitment</h3><form className="data-form one-col" onSubmit={e => { e.preventDefault(); createRecord('approvals', { title: approvalTitle.trim(), description: approvalDescription.trim(), businessId: approvalBusiness, status: 'pending', requestedAction: 'Review and authorize the proposed commitment' }); setApprovalTitle(''); setApprovalDescription(''); }}><label>Request title<input required value={approvalTitle} onChange={e => setApprovalTitle(e.target.value)} placeholder="What requires approval?" /></label><label>Business scope<select value={approvalBusiness} onChange={e => setApprovalBusiness(e.target.value)}><option value="group">Group-level</option>{foundingBusinesses.map(b => <option value={b.id} key={b.id}>{b.short}</option>)}</select></label><label>Details<textarea required rows={3} value={approvalDescription} onChange={e => setApprovalDescription(e.target.value)} placeholder="Purpose, amount or commitment, impact and supporting context" /></label><button className="primary-button" disabled={busy || dbGate}><Plus size={16} /> Submit approval request</button></form></div></div><div className="panel"><div className="section-title-row"><div><div className="eyebrow">PENDING AND RECENT</div><h3>Approval register</h3></div><button className="quiet-button" onClick={() => loadRecords('approvals')}><RefreshCw size={14} /> Refresh</button></div>{approvals.length ? <div className="record-list">{approvals.map(item => <div className="record-row" key={item.id}><div><strong>{item.title || 'Approval request'}</strong><small>{item.description || ''} · {item.businessId || 'group'}</small></div><div className="row-actions"><span className="status-pill neutral">{item.status || 'pending'}</span>{canManage && item.status === 'pending' && <><button className="small-action" onClick={() => decideApproval(item,'approved')} disabled={busy}>Approve</button><button className="small-action danger" onClick={() => decideApproval(item,'rejected')} disabled={busy}>Reject</button></>}</div></div>)}</div> : <Empty text="No approval requests recorded." />}</div></>}

        {section === 'Legal & Risk' && <><div className="legal-grid"><div className="panel form-panel"><div className="eyebrow">RISK MANAGEMENT</div><h3>Record a risk</h3><form className="data-form one-col" onSubmit={e => { e.preventDefault(); createRecord('risks', { title: riskTitle.trim(), category: riskCategory, severity: riskSeverity, mitigation: riskMitigation.trim(), status: 'open', businessId: 'group' }); setRiskTitle(''); setRiskMitigation(''); }}><label>Risk description<input required value={riskTitle} onChange={e => setRiskTitle(e.target.value)} placeholder="Describe the risk" /></label><label>Category<select value={riskCategory} onChange={e => setRiskCategory(e.target.value)}><option>Operational</option><option>Financial</option><option>Legal</option><option>Technology</option><option>Strategic</option><option>Reputational</option></select></label><label>Severity<select value={riskSeverity} onChange={e => setRiskSeverity(e.target.value)}><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label><label>Mitigation<input value={riskMitigation} onChange={e => setRiskMitigation(e.target.value)} placeholder="Proposed controls" /></label><button className="primary-button" disabled={busy || dbGate}><Plus size={16} /> Save risk</button></form></div><div className="panel form-panel"><div className="eyebrow">LEGAL REGISTER</div><h3>Record a legal obligation</h3><form className="data-form one-col" onSubmit={e => { e.preventDefault(); createRecord('legal', { title: legalTitle.trim(), category: legalCategory, jurisdiction: legalJurisdiction, status: 'open', businessId: 'group' }); setLegalTitle(''); }}><label>Obligation or document<input required value={legalTitle} onChange={e => setLegalTitle(e.target.value)} placeholder="Contract, licence, filing or obligation" /></label><label>Category<select value={legalCategory} onChange={e => setLegalCategory(e.target.value)}><option>Contract</option><option>Licence</option><option>Regulatory filing</option><option>Tax</option><option>Employment</option><option>Data protection</option><option>Intellectual property</option></select></label><label>Jurisdiction<input required value={legalJurisdiction} onChange={e => setLegalJurisdiction(e.target.value)} /></label><button className="primary-button" disabled={busy || dbGate}><Plus size={16} /> Save legal item</button></form></div></div><RecordList title="Risk register" items={records.risks || []} empty="No risks have been recorded." /><RecordList title="Legal and compliance register" items={records.legal || []} empty="No legal obligations have been recorded." /></>}

        {section === 'Technology' && <><div className="panel"><div className="eyebrow">TECHNOLOGY STRATEGY</div><h2>Independent infrastructure. Shared standards.</h2><p>The group platform is the central governance and command layer. Each subsidiary application remains independently operated until a secure, documented integration is approved and tested.</p><div className="setting-row"><span>Parent application</span><strong>Existing NJAMA GROUP app</strong></div><div className="setting-row"><span>Authentication</span><strong>AppDeploy sign-in + platform roles</strong></div><div className="setting-row"><span>Database layer</span><strong>{dbReady ? 'Catalogs available' : 'Catalog provisioning pending'}</strong></div><div className="setting-row"><span>Cross-app data access</span><strong>Disabled by default</strong></div><div className="setting-row"><span>AI provider dependency</span><strong>Provider abstraction required for future migration</strong></div></div><div className="section-title-row"><div><div className="eyebrow">EXISTING APP ECOSYSTEM</div><h2>Separate systems · no shared data</h2></div></div><section className="system-grid">{systems.map(item => <article className="system-card" key={item.name}><div className="system-icon"><Network size={19} /></div><h3>{item.name}</h3><p>{item.purpose}</p><span className="status-pill neutral">NO DATA CONNECTION</span><a href={item.url} target="_blank" rel="noreferrer">Open application <ExternalLinkIcon /></a></article>)}</section><div className="info-banner"><ShieldCheck size={19} /><div><strong>Integration gate</strong><p>No credentials are shared between apps. Any future connection requires target-side authentication, explicit business consent, a narrow read-only contract, field allowlists, audit logging and negative permission tests.</p></div></div></>}

        {section === 'Activity' && <div className="panel"><div className="section-title-row"><div><div className="eyebrow">AUDIT AND ACCOUNTABILITY</div><h2>Group activity</h2></div><button className="quiet-button" onClick={() => loadRecords('activity')}><RefreshCw size={14} /> Refresh</button></div><RecordList title="Recent audit events" items={records.activity || []} empty="No audit events exist yet. Events will appear after persistent data catalogs are provisioned and authorized actions are recorded." /></div>}

        {section === 'Settings' && <><div className="settings-grid"><div className="panel"><div className="eyebrow">OFFICIAL IDENTITY</div><h2>NJAMA GROUP</h2><p>Distinct in purpose. United in strength. Boundless in ambition.</p><div className="palette"><i /><i /><i /><i /><i /></div><div className="setting-row"><span>Primary</span><strong>Royal Navy · #142D65</strong></div><div className="setting-row"><span>Accent</span><strong>Electric Cobalt · #356BFF</strong></div><div className="setting-row"><span>Metallic accent</span><strong>Champagne Gold · #D6B66E</strong></div></div><div className="panel"><div className="eyebrow">GROUP CONFIGURATION</div><h3>Operating principles</h3><div className="setting-row"><span>Legal model</span><strong>Holding + operating group</strong></div><div className="setting-row"><span>Subsidiaries</span><strong>Independent and accountable</strong></div><div className="setting-row"><span>Reporting currency</span><strong>KES initial · multi-currency</strong></div><div className="setting-row"><span>Decision authority</span><strong>Delegated with reserved matters</strong></div><div className="setting-row"><span>Intelligence</span><strong>Embedded + group-wide</strong></div></div></div><div className="panel"><div className="eyebrow">REQUIRED DATABASE CATALOGS</div><h3>Persistent group records</h3><p>The app is prepared to use these server-side data stores. AppDeploy must provision both catalogs before live writes are enabled.</p><div className="setting-row"><span>njama_records</span><strong>{dbReady ? 'Available' : 'Provisioning required'}</strong></div><div className="setting-row"><span>njama_audit</span><strong>{dbReady ? 'Available' : 'Provisioning required'}</strong></div><p className="field-note">The app does not silently fall back to device-only storage. Existing authentication and group settings remain intact.</p></div></>}
        <footer className="page-footer"><span>© NJAMA GROUP</span><span>DISTINCT IN PURPOSE · UNITED IN STRENGTH</span><span>BOUNDLESS IN AMBITION</span></footer>
      </div>
    </main>
  </div>;
}

function Empty({ text }: { text: string }) { return <div className="empty-panel"><ClipboardList size={23} /><p>{text}</p></div>; }
function RecordList({ title, items, empty }: { title: string; items: Item[]; empty: string }) {
  return <div className="panel record-panel"><div className="section-title-row"><h3>{title}</h3><span className="record-count">{items.length} shown</span></div>{items.length ? <div className="record-list">{items.map(item => <div className="record-row" key={item.id}><div><strong>{item.title || item.name || item.description || item.type || 'Record'}</strong><small>{[item.category,item.businessId,item.date,item.currency && (item.amount + ' ' + item.currency),item.status].filter(Boolean).join(' · ')}</small></div><span className="status-pill neutral">{item.status || item.severity || item.kind || 'RECORDED'}</span></div>)}</div> : <Empty text={empty} />}</div>;
}
function ExternalLinkIcon() { return <ArrowUpRight size={14} />; }

export default App;
