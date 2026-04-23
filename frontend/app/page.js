"use client";
import { useState, useEffect, useRef } from 'react';
import { useNews } from '@/hooks/useNews';
import { formatDistanceToNow } from 'date-fns';

const TABS = ['All', 'FDA', 'Clinical Trials', 'Biotech', 'Regulations', 'Research', 'Pharmacology', 'ET Pharma'];
const mapTabToCategory = (tab) => {
  if(tab === 'All') return '';
  if(tab === 'FDA') return 'fda';
  if(tab === 'Clinical Trials') return 'clinical-trials';
  if(tab === 'ET Pharma') return 'et-pharma';
  return tab.toLowerCase();
};

function ArticleTag({ category }) {
  if (!category || !category.length) return <span className="tag">News</span>;
  return <span className="tag">{category[0].replace("-", " ").toUpperCase()}</span>;
}

function ArticleTagHero({ category }) {
  if (!category || !category.length) return <span className="tag-hero">News</span>;
  return <span className="tag-hero">{category[0].replace("-", " ").toUpperCase()}</span>;
}

function RelativeTime({ dateString }) {
  if (!dateString) return null;
  return <span>{formatDistanceToNow(new Date(dateString), { addSuffix: true })}</span>;
}

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('All');
  const [contactOpen, setContactOpen] = useState(false);
  const { data, isLoading } = useNews({ category: mapTabToCategory(activeTab), page: 1 });
  
  const [cmdOpen, setCmdOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCmdOpen(true);
      }
      if (e.key === 'Escape') setCmdOpen(false);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (cmdOpen && inputRef.current) {
      setTimeout(() => inputRef.current.focus(), 50);
    }
  }, [cmdOpen]);

  const [toastOpen, setToastOpen] = useState(false);
  const [email, setEmail] = useState('');
  const handleSubscribe = () => {
    if(!email || !email.includes('@')) return;
    setToastOpen(true);
    setTimeout(() => setToastOpen(false), 4000);
    setEmail('');
  };

  const articles = data?.data || [];
  const heroArt = articles[0];
  const leftColArts = articles.slice(1, 4);
  const rightColArts = articles.slice(4, 5);
  const secondRowArts = articles.slice(5, 9);
  const bottomArts = articles.slice(9);

  const filteredArticles = articles.filter(a => 
    a.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    a.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className={`toast ${toastOpen ? 'show' : ''}`}>
        <b>Subscription confirmed!</b>
        Daily Digest will arrive in your inbox tomorrow morning.
      </div>

      <div className={`cmd-overlay ${cmdOpen ? 'open' : ''}`} onClick={(e) => { if(e.target === e.currentTarget) setCmdOpen(false); }}>
        <div className="cmd-box">
          <div className="cmd-input-wrap">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{color:'#6b4c3b', flexShrink:0}}>
              <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
            </svg>
            <input 
              ref={inputRef}
              className="cmd-input" 
              placeholder="Search articles, topics, drugs…" 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
            />
            <span style={{fontFamily:'var(--font-crimson), serif', fontSize:'11px', color:'#6b4c3b', background:'rgba(200,184,154,0.2)', padding:'2px 7px', borderRadius:'2px'}}>ESC</span>
          </div>
          <div className="scroll-area" style={{maxHeight:'300px'}}>
            {filteredArticles.map(a => (
              <a key={a._id} href={a.url} target="_blank" rel="noreferrer" className="cmd-item" onClick={() => setCmdOpen(false)} style={{textDecoration:'none'}}>
                <div className="cmd-item-icon">📰</div>
                <div>
                  <div className="cmd-item-title">{a.title}</div>
                  <div className="cmd-item-sub">{a.source} · <RelativeTime dateString={a.publishedAt} /></div>
                </div>
              </a>
            ))}
          </div>
          <div className="cmd-footer">
            <span><span className="cmd-kbd">↑↓</span> navigate</span>
            <span><span className="cmd-kbd">↵</span> open</span>
            <span><span className="cmd-kbd">ESC</span> close</span>
            <span style={{marginLeft:'auto', fontStyle:'italic'}}>Pharma Khabri Search</span>
          </div>
        </div>
      </div>

      <div className={`contact-overlay ${contactOpen ? 'open' : ''}`} onClick={(e) => { if(e.target === e.currentTarget) setContactOpen(false); }}>
        <div className="contact-card">
          <button className="contact-close" onClick={() => setContactOpen(false)}>×</button>
          <div className="contact-left">
            <div className="contact-photo-wrap">
              <img src="/profile.png" alt="Nikhil Kumar" style={{width: '100%', height: '100%', objectFit: 'cover'}} />
              <div className="contact-badge-floating">
                🎓 NIPER Mohali - M.S Pharm
              </div>
            </div>
            <div style={{marginTop: '24px', textAlign: 'center'}}>
              <a href="https://nikhilkumar7.netlify.app/" target="_blank" rel="noreferrer" style={{color: '#00ffcc', textDecoration: 'none', fontFamily: 'var(--font-crimson), serif', fontSize: '15px', borderBottom: '1px solid rgba(0,255,204,0.3)', paddingBottom: '2px', transition: 'border-color 0.2s'}}>
                View Portfolio ↗
              </a>
            </div>
          </div>
          <div className="contact-right">
            <h2>Pharmacologist. AI<br/>Enthusiast.</h2>
            <p>
              I&apos;m a graduate researcher at the <b>National Institute of Pharmaceutical Education and Research (NIPER)</b>, perusing M.S (Pharm.) in Pharmacology & Regulatory Toxicology. Beyond the lab, I build AI agents, automate data workflows, and translate complex research into actionable insights.
            </p>
            <p>
              My work sits at the intersection of <b>pharmaceutical intelligence, AI automation, and data analytics</b> — driven by a product mindset shaped through competitive consulting.
            </p>
            <div className="contact-badges">
              <span className="contact-badge">🤖 AI Agents</span>
              <span className="contact-badge">💊 Pharmacology</span>
              <span className="contact-badge">📊 Data Analytics</span>
              <span className="contact-badge">🔬 Drug Discovery</span>
              <span className="contact-badge">⚡ Automation</span>
              <span className="contact-badge">🏛 Regulatory Affairs</span>
              <span className="contact-badge">🧬 HEOR</span>
              <span className="contact-badge">🎯 Product Management</span>
            </div>
          </div>
        </div>
      </div>

      <div className="ticker-wrap">
        <div className="ticker-label">Breaking</div>
        <div style={{overflow:'hidden', flex:1}}>
          <div className="ticker-track">
            {articles.slice(0, 5).map(a => <span key={a._id}>{a.title}</span>)}
            {articles.slice(0, 5).map(a => <span key={a._id + '-dup'}>{a.title}</span>)}
            {articles.slice(0, 5).map(a => <span key={a._id + '-dup2'}>{a.title}</span>)}
            {articles.slice(0, 5).map(a => <span key={a._id + '-dup3'}>{a.title}</span>)}
          </div>
        </div>
      </div>

      <header className="masthead fade-in">
        <div className="masthead-top-rule">
          <div className="line"></div>
          <div style={{width:'6px', height:'6px', background:'var(--rule)', borderRadius:'50%', margin:'0 8px', flexShrink:0}}></div>
          <div className="line"></div>
        </div>
        <div className="masthead-meta">
          <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
          <span style={{fontStyle:'italic', color:'var(--accent)', letterSpacing:'1px'}}>दवा की दुनिया की ख़बर</span>
          <span>Vol. CXLVIII No. 102</span>
        </div>
        <div className="masthead-name">Pharma ख़बरी</div>
        <div className="masthead-tagline">India&apos;s Journal of Pharmaceutical & Biotech Intelligence</div>
        
        <div className="masthead-bottom">
          <nav className="nav-tabs">
            {TABS.map(tab => (
              <button key={tab} className={`nav-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab}
              </button>
            ))}
            <button className="nav-tab" onClick={() => setContactOpen(true)} style={{color: 'var(--accent)'}}>
              CONTACT
            </button>
          </nav>
          <div style={{display:'flex', gap:'8px', alignItems:'center'}}>
            <div className="nav-search" data-tip="Press ⌘K">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              <input placeholder="Search…" onFocus={() => setCmdOpen(true)} readOnly/>
            </div>
            <button onClick={() => setCmdOpen(true)} style={{background:'var(--glass)', border:'0.5px solid var(--glass-border)', borderRadius:'2px', padding:'5px 10px', fontFamily:"var(--font-crimson), serif", fontSize:'11px', cursor:'pointer', color:'var(--ink3)', letterSpacing:'1px', backdropFilter:'blur(6px)'}}>⌘K</button>
          </div>
        </div>
      </header>

      <main className="main">
        {isLoading ? (
           <div style={{padding: '40px 0'}}>
              <div className="skeleton" style={{width: '100%', height: '400px', marginBottom: '20px'}}></div>
              <div className="skeleton" style={{width: '100%', height: '200px'}}></div>
           </div>
        ) : (
          <>
            <div className="section-label fade-in stagger-1">Top Stories</div>
            <div className="hero-grid fade-in stagger-2">
              <div className="hero-col-left">
                {leftColArts.map((a, i) => (
                  <div key={a._id}>
                    <article className="art-small" onClick={() => window.open(a.url, '_blank')}>
                      <ArticleTag category={a.category} />
                      <h3>{a.title}</h3>
                      {i === 0 && <div className="sep"></div>}
                      <p className="line-clamp-3">{a.aiSummary || a.description}</p>
                      <div className="byline"><span>{a.source}</span> · <RelativeTime dateString={a.publishedAt} /></div>
                    </article>
                    {i < leftColArts.length - 1 && <div className="sep-thick"></div>}
                  </div>
                ))}
              </div>

              <div className="col-divider"></div>

              <div className="hero-col-center">
                {heroArt && (
                  <article className="art-hero border-beam" onClick={() => window.open(heroArt.url, '_blank')}>
                    {heroArt.image && <img src={heroArt.image} alt={heroArt.title} />}
                    <ArticleTagHero category={heroArt.category} />
                    <h2>{heroArt.title}</h2>
                    <p>{heroArt.aiSummary || heroArt.description}</p>
                    <div className="sep"></div>
                    <div className="byline">
                      <span className="badge">{heroArt.source}</span>
                      <span>·</span>
                      <b><RelativeTime dateString={heroArt.publishedAt} /></b>
                    </div>
                  </article>
                )}
              </div>

              <div className="col-divider"></div>

              <div className="hero-col-right">
                <div>
                  <div className="section-label" style={{fontSize:'9px', marginBottom:'10px'}}>Market Pulse</div>
                  <div className="trending-box" style={{padding:'10px 14px'}}>
                    <div className="scroll-area" style={{maxHeight:'180px'}}>
                      <div className="market-row"><div><div className="market-name">Pfizer (PFE)</div><div className="market-sub">NYSE</div></div><div className="market-val up">$28.42 <span style={{fontSize:'11px'}}>+1.2%</span></div></div>
                      <div className="market-row"><div><div className="market-name">J&J (JNJ)</div><div className="market-sub">NYSE</div></div><div className="market-val dn">$152.10 <span style={{fontSize:'11px'}}>−0.4%</span></div></div>
                      <div className="market-row"><div><div className="market-name">Moderna (MRNA)</div><div className="market-sub">NASDAQ</div></div><div className="market-val up">$64.88 <span style={{fontSize:'11px'}}>+3.7%</span></div></div>
                      <div className="market-row"><div><div className="market-name">Novo Nordisk (NVO)</div><div className="market-sub">NYSE</div></div><div className="market-val up">$98.20 <span style={{fontSize:'11px'}}>+0.9%</span></div></div>
                      <div className="market-row"><div><div className="market-name">Replimune (REPL)</div><div className="market-sub">NASDAQ</div></div><div className="market-val dn">$4.62 <span style={{fontSize:'11px'}}>−18.3%</span></div></div>
                    </div>
                  </div>
                </div>
                <div className="sep-thick"></div>
                {rightColArts.map(a => (
                  <article key={a._id} className="art-small" onClick={() => window.open(a.url, '_blank')}>
                    <ArticleTag category={a.category} />
                    <h3>{a.title}</h3>
                    <p className="line-clamp-4">{a.aiSummary || a.description}</p>
                    <div className="byline"><span>{a.source}</span> · <RelativeTime dateString={a.publishedAt} /></div>
                  </article>
                ))}
              </div>
            </div>

            {secondRowArts.length > 0 && (
              <>
                <div className="section-label fade-in stagger-3">In Depth</div>
                <div className="second-grid fade-in stagger-3">
                  {secondRowArts.map(a => (
                    <div key={a._id} className="second-col">
                      <article className="art-card" onClick={() => window.open(a.url, '_blank')}>
                        {a.image && <img src={a.image} alt={a.title}/>}
                        <ArticleTag category={a.category} />
                        <h3>{a.title}</h3>
                        <p className="line-clamp-3">{a.aiSummary || a.description}</p>
                        <div className="byline" style={{marginTop:'8px', fontFamily:'var(--font-crimson), serif', fontSize:'11px', color:'var(--ink3)', fontStyle:'italic'}}>
                          {a.source} · <RelativeTime dateString={a.publishedAt} />
                        </div>
                      </article>
                    </div>
                  ))}
                </div>
              </>
            )}

            <div className="bottom-grid fade-in stagger-4">
              <div className="bottom-left">
                <div className="section-label">More Headlines</div>
                <div className="scroll-area" style={{maxHeight:'340px'}}>
                  {bottomArts.map(a => (
                    <article key={a._id} className="art-small" onClick={() => window.open(a.url, '_blank')} style={{paddingBottom:'14px', borderBottom:'0.5px solid var(--rule-light)', marginBottom:'14px'}}>
                      <ArticleTag category={a.category} />
                      <h3>{a.title}</h3>
                      <p className="line-clamp-2">{a.aiSummary || a.description}</p>
                      <div className="byline"><span>{a.source}</span> · <RelativeTime dateString={a.publishedAt} /></div>
                    </article>
                  ))}
                </div>
              </div>

              <div style={{background:'var(--rule)', margin:'0 24px'}}></div>

              <div className="bottom-right">
                <div className="section-label">Trending Now</div>
                <div className="trending-box scroll-area" style={{maxHeight:'220px', padding:'10px 14px', marginBottom:'20px'}}>
                  {articles.slice(0, 5).map((a, i) => (
                    <div key={a._id} className="trending-item" onClick={() => window.open(a.url, '_blank')}>
                      <div className="trending-num">0{i + 1}</div>
                      <div className="trending-title">{a.title}</div>
                    </div>
                  ))}
                </div>

                <div className="digest-box">
                  <h3>Daily Digest</h3>
                  <p>Top 10 pharma headlines delivered to your inbox every morning — curated by our editorial team.</p>
                  <input 
                    className="digest-input" 
                    type="email" 
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                  <button className="digest-btn" onClick={handleSubscribe}>Subscribe Free</button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <footer>
        <div className="f-copy">Developed by Nikhil Kumar</div>
        <div className="f-name">Pharma Khabri</div>
        <div className="f-links">
          <a href="#">About</a>
          <a href="#">Archive</a>
          <a href="#">Advertise</a>
          <a href="#">Privacy</a>
          <a href="#">Contact</a>
        </div>
      </footer>
    </>
  );
}