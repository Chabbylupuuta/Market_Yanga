import { useMemo, useState, type FormEvent } from 'react'
import './App.css'

type Category = 'All listings' | 'Farm produce' | 'Livestock' | 'Goods' | 'Services' | 'Jobs'

type Listing = {
  id: number
  title: string
  category: Exclude<Category, 'All listings'>
  price: string
  unit?: string
  location: string
  seller: string
  phone: string
  image: string
  imageAlt: string
  badge?: string
  badgeType?: 'verified' | 'fresh'
}

const categories: { label: Category; symbol: string }[] = [
  { label: 'All listings', symbol: '✳' },
  { label: 'Farm produce', symbol: '◉' },
  { label: 'Livestock', symbol: '♧' },
  { label: 'Goods', symbol: '▣' },
  { label: 'Services', symbol: '✦' },
  { label: 'Jobs', symbol: '↗' },
]

const listings: Listing[] = [
  {
    id: 1,
    title: 'Fresh white maize',
    category: 'Farm produce',
    price: 'K 3,200',
    unit: 'per 50 kg bag',
    location: 'Chongwe, Lusaka Province',
    seller: 'Mwape Family Farm',
    phone: '+260 97 123 4567',
    image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Sunlit golden maize growing on a farm',
    badge: 'Verified seller',
    badgeType: 'verified',
  },
  {
    id: 2,
    title: 'Healthy village chickens',
    category: 'Livestock',
    price: 'K 180',
    unit: 'each',
    location: 'Kanyama, Lusaka',
    seller: 'Chanda Poultry',
    phone: '+260 96 234 5678',
    image: 'https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Free-range chickens in a sunny farmyard',
    badge: 'Ready today',
    badgeType: 'fresh',
  },
  {
    id: 3,
    title: 'Handwoven market basket',
    category: 'Goods',
    price: 'K 250',
    location: 'Kabwata, Lusaka',
    seller: 'Thandiwe Crafts',
    phone: '+260 95 345 6789',
    image: 'https://images.unsplash.com/photo-1590736969955-71cc94901144?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Handwoven natural fibre basket',
    badge: 'Verified seller',
    badgeType: 'verified',
  },
  {
    id: 4,
    title: 'Tomatoes, freshly picked',
    category: 'Farm produce',
    price: 'K 80',
    unit: 'per 10 kg bucket',
    location: 'Kafue, Lusaka Province',
    seller: 'Green Valley Gardens',
    phone: '+260 97 456 7890',
    image: 'https://images.unsplash.com/photo-1546094096-0df4bcaaa337?auto=format&fit=crop&w=900&q=80',
    imageAlt: 'Fresh ripe red tomatoes at harvest',
    badge: 'Picked this morning',
    badgeType: 'fresh',
  },
]

const districts = ['Everywhere', 'Lusaka', 'Chongwe', 'Kafue', 'Kanyama', 'Kabwata']

function Icon({
  name,
  size = 20,
}: {
  name: 'search' | 'pin' | 'heart' | 'phone' | 'message' | 'arrow' | 'close' | 'check' | 'menu' | 'plus'
  size?: number
}) {
  const common = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true as const,
  }

  switch (name) {
    case 'search':
      return <svg {...common}><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.2 4.2" /></svg>
    case 'pin':
      return <svg {...common}><path d="M20 10c0 5-8 12-8 12S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
    case 'heart':
      return <svg {...common}><path d="M20.8 8.8c0 5.2-8.8 11-8.8 11s-8.8-5.8-8.8-11a4.8 4.8 0 0 1 8.8-2.7 4.8 4.8 0 0 1 8.8 2.7Z" /></svg>
    case 'phone':
      return <svg {...common}><path d="M21 16.4v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 1.1 3.6 2 2 0 0 1 3.1 1.4h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 3a2 2 0 0 1-.5 2.1L7 9.5a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c1 .3 2 .6 3 .7a2 2 0 0 1 1.6 2Z" /></svg>
    case 'message':
      return <svg {...common}><path d="M21 11.5a8.4 8.4 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.4 8.4 0 0 1-3.8-.9L3 21l1.9-5.7a8.4 8.4 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.4 8.4 0 0 1 3.8-.9h.5a8.5 8.5 0 0 1 8 8Z" /></svg>
    case 'arrow':
      return <svg {...common}><path d="M5 12h14M13 6l6 6-6 6" /></svg>
    case 'close':
      return <svg {...common}><path d="m18 6-12 12M6 6l12 12" /></svg>
    case 'check':
      return <svg {...common}><path d="m5 12 4 4L19 6" /></svg>
    case 'menu':
      return <svg {...common}><path d="M4 7h16M4 12h16M4 17h16" /></svg>
    case 'plus':
      return <svg {...common}><path d="M12 5v14M5 12h14" /></svg>
  }
}

function App() {
  const [activeCategory, setActiveCategory] = useState<Category>('All listings')
  const [search, setSearch] = useState('')
  const [district, setDistrict] = useState('Everywhere')
  const [favorites, setFavorites] = useState<number[]>([])
  const [loginOpen, setLoginOpen] = useState(false)
  const [phone, setPhone] = useState('')
  const [loginMessage, setLoginMessage] = useState('')
  const [menuOpen, setMenuOpen] = useState(false)

  const filteredListings = useMemo(() => {
    const query = search.trim().toLowerCase()
    return listings.filter((listing) => {
      const matchesCategory = activeCategory === 'All listings' || listing.category === activeCategory
      const matchesDistrict = district === 'Everywhere' || listing.location.toLowerCase().includes(district.toLowerCase())
      const matchesSearch = !query || [listing.title, listing.category, listing.location, listing.seller].some((value) => value.toLowerCase().includes(query))
      return matchesCategory && matchesDistrict && matchesSearch
    })
  }, [activeCategory, district, search])

  function toggleFavorite(id: number) {
    setFavorites((current) => current.includes(id) ? current.filter((favorite) => favorite !== id) : [...current, id])
  }

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setLoginMessage('Thanks! Phone verification will be available when account sign-in is connected.')
  }

  return (
    <div className="app-shell">
      <div className="flag-stripe" aria-hidden="true"><span /><span /><span /></div>
      <header className="site-header">
        <a className="brand" href="#" aria-label="Yanga Market home">
          <span className="brand-mark"><span className="brand-sun">✳</span><span className="brand-eagle">Y</span></span>
          <span className="brand-copy"><strong>yanga</strong><small>YOUR LOCAL MARKET</small></span>
        </a>
        <button className="mobile-menu" aria-label="Toggle navigation" onClick={() => setMenuOpen(!menuOpen)}><Icon name="menu" /></button>
        <nav className={menuOpen ? 'main-nav is-open' : 'main-nav'} aria-label="Main navigation">
          <a className="nav-active" href="#market" onClick={() => setMenuOpen(false)}>Explore</a>
          <a href="#how-it-works" onClick={() => setMenuOpen(false)}>How it works</a>
          <a href="#community" onClick={() => setMenuOpen(false)}>Our community</a>
        </nav>
        <div className="header-actions">
          <button className="login-link" onClick={() => { setLoginOpen(true); setLoginMessage('') }}>Log in</button>
          <button className="sell-button" onClick={() => { setLoginOpen(true); setLoginMessage('') }}><Icon name="plus" size={17} /> Sell something</button>
        </div>
      </header>

      <main>
        <section className="hero-section" id="market">
          <div className="hero-copy">
            <div className="eyebrow"><span className="eyebrow-dot" /> GOOD THINGS GROW LOCALLY</div>
            <h1>Your people.<br />Your place. <em>Your market.</em></h1>
            <p className="hero-description">Find fresh produce, local goods, trusted services and new opportunities — right here in Zambia.</p>
            <div className="hero-proof">
              <div className="avatar-stack" aria-hidden="true"><span>👩🏿</span><span>👨🏾</span><span>👩🏽</span><span>+</span></div>
              <p><strong>Made for our communities</strong><br /><span>Connecting neighbours, one listing at a time.</span></p>
            </div>
          </div>
          <div className="hero-art" role="img" aria-label="A colourful illustration of a Zambian local market">
            <div className="art-sun" />
            <div className="art-hill art-hill-back" />
            <div className="art-hill art-hill-front" />
            <div className="art-market-card"><span className="art-card-icon">🌽</span><span><strong>Fresh from nearby</strong><small>Good things, close to home</small></span><span className="art-check"><Icon name="check" size={15} /></span></div>
            <div className="art-market-stall"><div className="stall-roof"><i /><i /><i /><i /><i /></div><div className="stall-awning" /><div className="stall-counter"><span>🍅</span><span>🥬</span><span>🍌</span><span>🌶️</span></div><div className="stall-legs" /></div>
            <div className="art-leaf leaf-one">✦</div><div className="art-leaf leaf-two">✳</div>
            <div className="art-tag">LUSAKA<br /><strong>& BEYOND</strong></div>
          </div>
        </section>

        <section className="search-section" aria-label="Search local listings">
          <div className="search-field"><Icon name="search" size={21} /><input aria-label="Search listings" placeholder="What are you looking for today?" value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></div>
          <div className="search-divider" />
          <label className="location-field"><Icon name="pin" size={20} /><span className="sr-only">Choose a location</span><select value={district} onChange={(event) => setDistrict(event.target.value)}>{districts.map((place) => <option key={place}>{place}</option>)}</select></label>
          <button className="search-button" onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}>Find my market <Icon name="arrow" size={18} /></button>
        </section>

        <section className="market-section" id="listings">
          <div className="section-heading">
            <div><span className="section-kicker">A LITTLE CLOSER TO HOME</span><h2>Made around <em>here.</em></h2></div>
            <a className="see-all" href="#listings">See all listings <Icon name="arrow" size={17} /></a>
          </div>
          <div className="category-row" role="tablist" aria-label="Filter by category">
            {categories.map((category) => <button key={category.label} role="tab" aria-selected={activeCategory === category.label} className={activeCategory === category.label ? 'category-chip selected' : 'category-chip'} onClick={() => setActiveCategory(category.label)}><span>{category.symbol}</span>{category.label}</button>)}
          </div>

          <div className="listing-grid">
            {filteredListings.map((listing) => (
              <article className="listing-card" key={listing.id}>
                <div className="listing-photo">
                  <img src={listing.image} alt={listing.imageAlt} loading="lazy" />
                  {listing.badge && <span className={`listing-badge ${listing.badgeType === 'verified' ? 'verified-badge' : ''}`}>{listing.badgeType === 'verified' && <span className="verified-tick">✓</span>}{listing.badge}</span>}
                  <button className={favorites.includes(listing.id) ? 'favorite-button is-favorite' : 'favorite-button'} aria-label={favorites.includes(listing.id) ? `Remove ${listing.title} from saved listings` : `Save ${listing.title}`} aria-pressed={favorites.includes(listing.id)} onClick={() => toggleFavorite(listing.id)}><Icon name="heart" size={19} /></button>
                </div>
                <div className="listing-details">
                  <span className="listing-category">{listing.category}</span>
                  <h3>{listing.title}</h3>
                  <p className="listing-price">{listing.price}{listing.unit && <span> / {listing.unit.replace('per ', '')}</span>}</p>
                  <div className="listing-location"><Icon name="pin" size={14} />{listing.location}</div>
                  <div className="seller-row"><span className="seller-avatar">{listing.seller.charAt(0)}</span><span className="seller-name">{listing.seller}</span><div className="contact-actions"><a className="contact-icon" href={`tel:${listing.phone.replaceAll(' ', '')}`} aria-label={`Call ${listing.seller}`}><Icon name="phone" size={16} /></a><a className="contact-icon whatsapp-icon" href={`https://wa.me/${listing.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" aria-label={`Message ${listing.seller} on WhatsApp`}><Icon name="message" size={16} /></a></div></div>
                </div>
              </article>
            ))}
            {filteredListings.length === 0 && <div className="empty-state"><span>🔎</span><h3>No listings found just yet</h3><p>Try a different search or explore another location.</p><button onClick={() => { setSearch(''); setDistrict('Everywhere'); setActiveCategory('All listings') }}>Clear filters</button></div>}
          </div>
          <div className="more-listings"><span>Showing {filteredListings.length} of {listings.length} local listings</span><button onClick={() => { setSearch(''); setDistrict('Everywhere'); setActiveCategory('All listings') }}>Explore all listings <Icon name="arrow" size={17} /></button></div>
        </section>

        <section className="community-banner" id="community">
          <div className="community-icon">🌱</div>
          <div><span className="section-kicker">GROW SOMETHING GOOD</span><h2>Your next customer is closer than you think.</h2><p>Put your products, skills or next big idea in front of your neighbours.</p></div>
          <button onClick={() => { setLoginOpen(true); setLoginMessage('') }}>Join the community <Icon name="arrow" size={17} /></button>
          <span className="banner-decoration">✳</span>
        </section>
      </main>

      <footer className="site-footer" id="how-it-works"><a className="footer-brand" href="#">yanga<span>.</span></a><span>A little closer to home. Made with care in Zambia.</span><span className="footer-location"><Icon name="pin" size={14} /> Lusaka, Zambia</span></footer>

      {loginOpen && <div className="modal-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setLoginOpen(false) }}>
        <section className="login-modal" role="dialog" aria-modal="true" aria-labelledby="login-title">
          <button className="modal-close" aria-label="Close sign-in dialog" onClick={() => setLoginOpen(false)}><Icon name="close" /></button>
          <div className="login-illustration"><div className="login-sun" /><span className="login-plant">🌿</span><span className="login-basket">🧺</span><div className="login-note">YOUR LOCAL MARKET</div></div>
          <div className="login-content">
            <a className="brand login-brand" href="#"><span className="brand-mark"><span className="brand-sun">✳</span><span className="brand-eagle">Y</span></span><span className="brand-copy"><strong>yanga</strong><small>YOUR LOCAL MARKET</small></span></a>
            <span className="section-kicker">GOOD TO HAVE YOU HERE</span>
            <h2 id="login-title">Welcome to<br /><em>your market.</em></h2>
            <p className="login-intro">Sign in with your Zambian phone number to save listings and connect with your community.</p>
            <form onSubmit={handleLogin}>
              <label htmlFor="phone-number">Phone number</label>
              <div className="phone-input"><span className="country-code"><span className="zambia-flag" aria-label="Zambian flag"><i /><i /><i /></span>+260</span><input id="phone-number" type="tel" inputMode="numeric" autoComplete="tel-national" placeholder="97 123 4567" value={phone} onChange={(event) => { setPhone(event.target.value); setLoginMessage('') }} required pattern="[0-9 ]{9,12}" title="Enter your Zambian phone number, for example 97 123 4567" /></div>
              <button className="login-submit" type="submit">Continue with phone <Icon name="arrow" size={18} /></button>
            </form>
            {loginMessage && <p className="login-message" role="status">{loginMessage}</p>}
            <p className="login-terms">By continuing, you agree to our <a href="#how-it-works">Terms</a> and <a href="#how-it-works">Privacy Policy</a>.</p>
            <div className="login-safe"><span><Icon name="check" size={14} /></span>Your number stays private. Connect only when you choose.</div>
          </div>
        </section>
      </div>}
    </div>
  )
}

export default App
