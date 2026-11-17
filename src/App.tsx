import { useEffect, useMemo, useState } from 'react';
import { auth, api } from '@appdeploy/client';
import {
  Activity,
  ArrowUpRight,
  Bell,
  Building2,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Command,
  Compass,
  Crown,
  ExternalLink,
  Fingerprint,
  Gauge,
  Globe2,
  Layers3,
  LockKeyhole,
  LogOut,
  Menu,
  Network,
  Search,
  ShieldCheck,
  Sparkles,
  Users,
  X,
} from 'lucide-react';

type User = { userId: string; email?: string; name?: string };
type Section =
  | 'Overview'
  | 'Businesses'
  | 'Intelligence'
  | 'Governance'
  | 'Activity'
  | 'Settings';

const modules = [
  {
    name: 'PropertyOS',
    category: 'Property & facilities',
    description:
      'Property operations, tenants, maintenance, compliance and finance.',
    url: 'https://propertyos-evb7jo.v2.appdeploy.ai/',
    status: 'Existing application',
    initials: 'P',
    tone: 'gold',
  },
  {
    name: 'Atira',
    category: 'Finance & wealth',
    description:
      'Personal and business financial records, budgets, assets and investments.',
    url: 'https://greenledger-xfj1js.v2.appdeploy.ai/',
    status: 'Existing application',
    initials: 'A',
    tone: 'silver',
  },
  {
    name: 'FORGED',
    category: 'Personal development',
    description: 'Mind, body, wealth, leadership, character and purpose.',
    url: 'https://forged-y36jx3.v2.appdeploy.ai/',
    status: 'Existing application',
    initials: 'F',
    tone: 'blue',
  },
  {
    name: 'Business Mastery Academy',
    category: 'Education & capability',
    description:
      'Business education, learning pathways and specialist curriculum.',
    url: 'https://business-mastery-academy-4vpshh.v2.appdeploy.ai/',
    status: 'Existing application',
    initials: 'B',
    tone: 'gold',
  },
  {
    name: 'Quick Task',
    category: 'Errands & cleaning services',
    description:
      'Specialist service business module for errands and cleaning operations.',
    url: null,
    status: 'Integration not started',
    initials: 'Q',
    tone: 'silver',
  },
  {
    name: 'Njama Creations',
    category: 'Creative services',
    description: 'Independent creative business module within the group.',
    url: null,
    status: 'Integration not started',
    initials: 'N',
    tone: 'blue',
  },
];

const navItems: { label: Section; icon: typeof Gauge; hint: string }[] = [
  { label: 'Overview', icon: Gauge, hint: 'Group command centre' },
  { label: 'Businesses', icon: Building2, hint: 'Subsidiaries and ventures' },
  { label: 'Intelligence', icon: Sparkles, hint: 'NJAMA INTELLIGENCE' },
  {
    label: 'Governance',
    icon: ShieldCheck,
    hint: 'Authority, access and consent',
  },
  { label: 'Activity', icon: Activity, hint: 'Group audit trail' },
  { label: 'Settings', icon: Command, hint: 'Group configuration' },
];

function Mark({ small = false }: { small?: boolean }) {
  return (
    <div
      className={small ? 'brand-mark small' : 'brand-mark'}
      aria-label="NJAMA GROUP emblem"
    >
      <svg viewBox="0 0 48 48" role="img" aria-hidden="true">
        <path
          d="M10 37V11l28 26V11"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.2"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        <path
          d="M24 24l8-8"
          fill="none"
          stroke="#C8A96A"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [section, setSection] = useState<Section>('Overview');
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [errorText, setErrorText] = useState('');
  const [mobileNav, setMobileNav] = useState(false);
  const [query, setQuery] = useState('');

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const restored = await auth.getUser();
        if (!active) return;
        if (restored) {
          const response = await api.get('/api/me');
          if (!active) return;
          setUser({
            userId: response.data.userId,
            email: response.data.email,
            name: response.data.name,
          });
        }
      } catch (err) {
        if (active)
          setErrorText(
            err instanceof Error
              ? err.message
              : 'Your session could not be restored. Please retry.'
          );
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  const signIn = async () => {
    setBusy(true);
    setErrorText('');
    try {
      await auth.signInWithRedirect();
    } catch (err) {
      setErrorText(
        err instanceof Error
          ? err.message
          : 'Sign-in could not start. Please try again.'
      );
      setBusy(false);
    }
  };

  const signOut = async () => {
    setBusy(true);
    try {
      await auth.signOut();
      setUser(null);
      setSection('Overview');
    } catch (err) {
      setErrorText(
        err instanceof Error ? err.message : 'Sign-out failed. Please retry.'
      );
    } finally {
      setBusy(false);
    }
  };

  const visibleModules = useMemo(
    () =>
      modules.filter(item =>
        [item.name, item.category, item.description]
          .join(' ')
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  if (loading)
    return (
      <main className="boot-screen">
        <Mark />
        <p>Securing your group workspace…</p>
      </main>
    );

  if (!user)
    return (
      <main className="auth-screen">
        <div className="auth-panel">
          <Mark />
          <div className="eyebrow">THE GROUP OPERATING SYSTEM</div>
          <h1>
            NJAMA <span>GROUP</span>
          </h1>
          <p className="auth-copy">
            One command centre. Independent businesses. Shared intelligence
            under your authority.
          </p>
          <div className="auth-points">
            <div>
              <ShieldCheck size={17} />
              <span>Permission-led access</span>
            </div>
            <div>
              <Network size={17} />
              <span>Independent specialist businesses</span>
            </div>
            <div>
              <LockKeyhole size={17} />
              <span>Private by default</span>
            </div>
          </div>
          {errorText && (
            <div className="error-note" role="alert">
              {errorText}
            </div>
          )}
          <button
            className="primary-button full"
            onClick={signIn}
            disabled={busy}
          >
            {busy ? 'Opening secure sign-in…' : 'Sign in securely'}{' '}
            <ArrowUpRight size={17} />
          </button>
          <p className="auth-foot">
            Access is granted through your NJAMA GROUP account.
          </p>
        </div>
      </main>
    );

  const current = navItems.find(item => item.label === section)!;
  const initials = (user.name || user.email || 'Owner')
    .trim()
    .slice(0, 1)
    .toUpperCase();

  return (
    <div className="app-shell">
      {mobileNav && (
        <button
          className="mobile-scrim"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}
      <aside className={'sidebar ' + (mobileNav ? 'open' : '')}>
        <div className="brand-lockup">
          <Mark />
          <div>
            <strong>NJAMA</strong>
            <span>GROUP</span>
          </div>
          <button
            className="mobile-close"
            onClick={() => setMobileNav(false)}
            aria-label="Close menu"
          >
            <X size={18} />
          </button>
        </div>
        <div className="workspace-label">GROUP WORKSPACE</div>
        <nav className="main-nav" aria-label="Main navigation">
          {navItems.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                className={
                  'nav-item ' + (section === item.label ? 'active' : '')
                }
                onClick={() => {
                  setSection(item.label);
                  setMobileNav(false);
                }}
              >
                <Icon size={18} />
                <span>{item.label}</span>
                {section === item.label && <span className="nav-indicator" />}
              </button>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <div className="secure-state">
            <span className="secure-dot" />
            <div>
              <strong>Private workspace</strong>
              <small>Access-controlled session</small>
            </div>
          </div>
          <button className="profile-row" onClick={signOut} disabled={busy}>
            <span className="avatar">{initials}</span>
            <span className="profile-meta">
              <strong>{user.name || 'Group member'}</strong>
              <small>{user.email || 'Signed-in account'}</small>
            </span>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <button
            className="mobile-menu"
            aria-label="Open navigation"
            onClick={() => setMobileNav(true)}
          >
            <Menu size={20} />
          </button>
          <div className="breadcrumb">
            <span>NJAMA GROUP</span>
            <ChevronRight size={14} />
            <strong>{section}</strong>
          </div>
          <div className="top-actions">
            <span className="system-status">
              <i /> FOUNDATION MODE
            </span>
            <button
              className="icon-button"
              aria-label="Help and guidance"
              onClick={() => setSection('Governance')}
            >
              <CircleHelp size={18} />
            </button>
          </div>
        </header>

        <div className="content-wrap">
          <div className="page-heading">
            <div>
              <div className="eyebrow">{current.hint.toUpperCase()}</div>
              <h1>
                {section === 'Overview' ? 'The group, in one view.' : section}
              </h1>
              <p>
                {section === 'Overview'
                  ? 'A single point of command for a portfolio of independent businesses.'
                  : section === 'Businesses'
                    ? 'Each business keeps its own identity, workflows and records.'
                    : section === 'Intelligence'
                      ? 'NJAMA INTELLIGENCE works within permissions—not above them.'
                      : section === 'Governance'
                        ? 'Authority, access and consent are the foundation of the group.'
                        : section === 'Activity'
                          ? 'A transparent record of important group events.'
                          : 'Configure the group foundation and operating principles.'}
              </p>
            </div>
            <div className="date-chip">
              <Globe2 size={15} /> MULTI-ENTITY · MULTI-CURRENCY
            </div>
          </div>

          {section === 'Overview' && (
            <>
              <section className="hero-card">
                <div className="hero-copy">
                  <div className="hero-kicker">
                    <span /> THE NEXT CHAPTER
                  </div>
                  <h2>
                    Build with clarity.
                    <br />
                    <em>Operate with authority.</em>
                  </h2>
                  <p>
                    NJAMA GROUP brings your ventures into one coordinated
                    system—without forcing them into one generic business.
                  </p>
                  <button
                    className="text-button"
                    onClick={() => setSection('Businesses')}
                  >
                    Explore the group structure <ArrowUpRight size={16} />
                  </button>
                </div>
                <div className="hero-emblem">
                  <div className="orbit orbit-one" />
                  <div className="orbit orbit-two" />
                  <Mark />
                </div>
              </section>
              <section className="metric-grid">
                <div className="metric-card">
                  <span>REGISTERED BUSINESSES</span>
                  <strong>—</strong>
                  <small>Group registry not yet configured</small>
                </div>
                <div className="metric-card">
                  <span>CONNECTED SYSTEMS</span>
                  <strong>0</strong>
                  <small>Secure integrations not yet enabled</small>
                </div>
                <div className="metric-card">
                  <span>APPROVALS PENDING</span>
                  <strong>—</strong>
                  <small>No approval workflow configured</small>
                </div>
                <div className="metric-card">
                  <span>GROUP CURRENCY</span>
                  <strong>KES</strong>
                  <small>Initial reporting currency</small>
                </div>
              </section>
              <div className="section-title-row">
                <div>
                  <div className="eyebrow">THE PORTFOLIO</div>
                  <h2>Specialist businesses</h2>
                </div>
                <button
                  className="quiet-button"
                  onClick={() => setSection('Businesses')}
                >
                  View directory <ArrowUpRight size={15} />
                </button>
              </div>
              <section className="module-grid">
                {modules.slice(0, 4).map(item => (
                  <ModuleCard key={item.name} item={item} />
                ))}
              </section>
              <section className="lower-grid">
                <div className="panel intelligence-panel">
                  <div className="panel-icon">
                    <Sparkles size={18} />
                  </div>
                  <div className="eyebrow">NJAMA INTELLIGENCE</div>
                  <h3>Insight with boundaries.</h3>
                  <p>
                    Group intelligence will begin with approved summaries. It
                    will not read private records or execute payments, approvals
                    or commitments without explicit authority.
                  </p>
                  <button
                    className="text-button"
                    onClick={() => setSection('Intelligence')}
                  >
                    Explore intelligence <ArrowUpRight size={15} />
                  </button>
                </div>
                <div className="panel governance-panel">
                  <div className="panel-heading">
                    <ShieldCheck size={18} />
                    <strong>Governance first</strong>
                  </div>
                  <ul>
                    <li>
                      <CheckCircle2 size={15} /> Subsidiary independence
                      preserved
                    </li>
                    <li>
                      <CheckCircle2 size={15} /> Owner authority retained
                    </li>
                    <li>
                      <CheckCircle2 size={15} /> No live data sharing enabled
                    </li>
                    <li>
                      <CheckCircle2 size={15} /> Sandbox-first implementation
                    </li>
                  </ul>
                  <button
                    className="quiet-button"
                    onClick={() => setSection('Governance')}
                  >
                    Review controls <ChevronRight size={15} />
                  </button>
                </div>
              </section>
            </>
          )}

          {section === 'Businesses' && (
            <>
              <div className="directory-toolbar">
                <div className="search-field">
                  <Search size={17} />
                  <input
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                    placeholder="Search businesses and systems"
                  />
                  <span>{visibleModules.length} listed</span>
                </div>
                <div className="registry-note">
                  <LockKeyhole size={15} /> Registry setup awaits secure
                  database provisioning
                </div>
              </div>
              <section className="module-grid directory-grid">
                {visibleModules.map(item => (
                  <ModuleCard key={item.name} item={item} />
                ))}
              </section>
              <div className="info-banner">
                <Layers3 size={18} />
                <div>
                  <strong>Independent by design</strong>
                  <p>
                    Each subsidiary will have its own operating model,
                    permissions, identity and financial boundaries. Group-level
                    reporting will be granted—not assumed.
                  </p>
                </div>
              </div>
            </>
          )}

          {section === 'Intelligence' && (
            <div className="feature-grid">
              <div className="panel feature-main">
                <div className="feature-symbol">
                  <Sparkles size={22} />
                </div>
                <div className="eyebrow">NJAMA INTELLIGENCE</div>
                <h2>
                  One intelligence layer.
                  <br />
                  Clear boundaries.
                </h2>
                <p>
                  Intelligence will be embedded inside each specialist business
                  and operate across the group where authorised. It will
                  distinguish facts, analysis, recommendations and approved
                  actions.
                </p>
                <div className="rule-list">
                  <div>
                    <span>01</span>
                    <strong>Read only by default</strong>
                    <small>Use approved summaries and permitted fields.</small>
                  </div>
                  <div>
                    <span>02</span>
                    <strong>Purpose-limited access</strong>
                    <small>
                      Every request names the actor, business, purpose and
                      scope.
                    </small>
                  </div>
                  <div>
                    <span>03</span>
                    <strong>Human authority</strong>
                    <small>
                      Consequential actions require explicit approval and an
                      audit receipt.
                    </small>
                  </div>
                </div>
              </div>
              <div className="panel">
                <div className="eyebrow">CURRENT STATE</div>
                <h3>Not connected to live business data</h3>
                <p>
                  Intelligence adapters are intentionally disabled until group
                  identity, permissions, consent and integration contracts are
                  implemented and tested.
                </p>
                <div className="status-pill">
                  <span /> SANDBOX ONLY
                </div>
              </div>
            </div>
          )}

          {section === 'Governance' && (
            <div className="governance-layout">
              <div className="panel">
                <div className="eyebrow">AUTHORITY MODEL</div>
                <h2>Ownership stays clear.</h2>
                <p>
                  The group owner retains ultimate authority. Access is assigned
                  by business and role, not inherited automatically from group
                  membership.
                </p>
                <div className="authority-row">
                  <Crown size={19} />
                  <div>
                    <strong>Group owner</strong>
                    <small>
                      Ultimate authority over group configuration and delegated
                      permissions.
                    </small>
                  </div>
                </div>
                <div className="authority-row">
                  <Users size={19} />
                  <div>
                    <strong>Business leadership</strong>
                    <small>
                      Authority is limited to the businesses and functions
                      explicitly assigned.
                    </small>
                  </div>
                </div>
                <div className="authority-row">
                  <Fingerprint size={19} />
                  <div>
                    <strong>Individual members</strong>
                    <small>
                      Access follows least privilege, consent and the user's
                      active role.
                    </small>
                  </div>
                </div>
              </div>
              <div className="panel">
                <div className="eyebrow">SECURITY GATES</div>
                <h3>Before any connection</h3>
                <ul className="check-list">
                  <li>
                    <CheckCircle2 size={16} /> Verified identity
                  </li>
                  <li>
                    <CheckCircle2 size={16} /> Business-level membership
                  </li>
                  <li>
                    <CheckCircle2 size={16} /> Permission and consent record
                  </li>
                  <li>
                    <CheckCircle2 size={16} /> Purpose and data scope
                  </li>
                  <li>
                    <CheckCircle2 size={16} /> Audit event and revocation path
                  </li>
                </ul>
                <div className="status-pill">
                  <span /> LIVE CONNECTIONS DISABLED
                </div>
              </div>
            </div>
          )}

          {section === 'Activity' && (
            <div className="empty-panel">
              <Activity size={25} />
              <h3>No group activity recorded yet</h3>
              <p>
                The audit trail will appear after group registry and governance
                records are provisioned. No sample activity has been inserted.
              </p>
            </div>
          )}

          {section === 'Settings' && (
            <div className="feature-grid">
              <div className="panel">
                <div className="eyebrow">GROUP FOUNDATION</div>
                <h2>Core settings</h2>
                <div className="setting-row">
                  <span>Parent identity</span>
                  <strong>NJAMA GROUP</strong>
                </div>
                <div className="setting-row">
                  <span>Reporting currency</span>
                  <strong>KES · Initial</strong>
                </div>
                <div className="setting-row">
                  <span>Architecture</span>
                  <strong>Independent subsidiaries</strong>
                </div>
                <div className="setting-row">
                  <span>Intelligence mode</span>
                  <strong>Permission-aware</strong>
                </div>
              </div>
              <div className="panel">
                <div className="eyebrow">IMPLEMENTATION STATUS</div>
                <h3>Foundation shell active</h3>
                <p>
                  Persistent group registry, member roles, consent records,
                  audit events and integration adapters are the next build
                  layer. They will be enabled only after database provisioning
                  and authorization tests.
                </p>
                <div className="status-pill">
                  <span /> FOUNDATION MODE
                </div>
              </div>
            </div>
          )}

          <footer className="page-footer">
            <span>© NJAMA GROUP</span>
            <span>INDEPENDENCE · INTELLIGENCE · INTEGRITY</span>
            <span>SECURE FOUNDATION</span>
          </footer>
        </div>
      </main>
    </div>
  );
}

function ModuleCard({ item }: { item: (typeof modules)[number] }) {
  return (
    <article className="module-card">
      <div className={'module-mark ' + item.tone}>{item.initials}</div>
      <div className="module-copy">
        <div className="module-category">{item.category}</div>
        <h3>{item.name}</h3>
        <p>{item.description}</p>
        <div className="module-bottom">
          <span className={item.url ? 'connected-label' : 'pending-label'}>
            <i />
            {item.status}
          </span>
          {item.url ? (
            <a href={item.url} target="_blank" rel="noreferrer">
              Open app <ExternalLink size={14} />
            </a>
          ) : (
            <span className="not-linked">Not linked yet</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default App;
