import { useMemo, useState } from 'react'
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

const nearbyMarkets = [
  { name: 'Soweto Market', area: 'Lumumba Road, Lusaka' },
  { name: 'Lusaka City Market', area: 'City centre, Lusaka' },
  { name: 'Kamwala Market', area: 'Kamwala, Lusaka' },
]

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
  const [nearbyMapUrl, setNearbyMapUrl] = useState('')
  const [locationMessage, setLocationMessage] = useState('')
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

  function findMarketsNearMe() {
    if (!navigator.geolocation) {
      setLocationMessage('Location services are not available in this browser. Choose a Lusaka market below instead.')
      return
    }

    setLocationMessage('Finding your location…')
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        const query = encodeURIComponent(`markets near ${coords.latitude},${coords.longitude}`)
        setNearbyMapUrl(`https://www.google.com/maps/search/?api=1&query=${query}`)
        setLocationMessage('Your location is ready. Open the map to see nearby markets.')
      },
      () => {
        setNearbyMapUrl('')
        setLocationMessage('We could not access your location. Allow location access or choose a Lusaka market below.')
      },
      { timeout: 10000 },
    )
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
          <button className="login-link">Log in</button>
          <button className="sell-button"><Icon name="plus" size={17} /> Sell something</button>
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
          <div className="hero-art">
            <img className="hero-market-photo" src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Lusaka_curio_market.png" alt="A vendor at a curio market in Lusaka, Zambia" />
            <div className="hero-photo-shade" />
            <span className="hero-photo-label"><Icon name="pin" size={15} /> LUSAKA, ZAMBIA</span>
            <a className="photo-credit" href="https://commons.wikimedia.org/wiki/File:Lusaka_curio_market.png" target="_blank" rel="noreferrer">Photo: Allan Samila · CC BY-SA 4.0</a>
          </div>
        </section>

        <section className="search-section" aria-label="Search local listings">
          <div className="search-field"><Icon name="search" size={21} /><input aria-label="Search listings" placeholder="What are you looking for today?" value={search} onChange={(event) => setSearch(event.target.value)} /><kbd>⌘ K</kbd></div>
          <div className="search-divider" />
          <label className="location-field"><Icon name="pin" size={20} /><span className="sr-only">Choose a location</span><select value={district} onChange={(event) => setDistrict(event.target.value)}>{districts.map((place) => <option key={place}>{place}</option>)}</select></label>
          <button className="search-button" onClick={() => document.getElementById('listings')?.scrollIntoView({ behavior: 'smooth' })}>Find my market <Icon name="arrow" size={18} /></button>
        </section>

        <section className="nearby-markets" aria-labelledby="nearby-title">
          <div className="nearby-heading">
            <div><span className="section-kicker">MEET THE MARKETS</span><h2 id="nearby-title">Find your <em>local spot.</em></h2></div>
            <div className="nearby-actions">
              <button className="location-button" onClick={findMarketsNearMe}><Icon name="pin" size={17} /> Find markets near me</button>
              {nearbyMapUrl && <a className="nearby-map-link" href={nearbyMapUrl} target="_blank" rel="noreferrer">Open nearby map <Icon name="arrow" size={15} /></a>}
            </div>
          </div>
          {locationMessage && <p className="location-message" role="status">{locationMessage}</p>}
          <div className="market-place-grid">
            {nearbyMarkets.map((market) => (
              <article className="market-place-card" key={market.name}>
                <span className="market-place-pin"><Icon name="pin" size={18} /></span>
                <div><h3>{market.name}</h3><p>{market.area}</p></div>
                <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${market.name}, ${market.area}`)}`} target="_blank" rel="noreferrer" aria-label={`Get directions to ${market.name}`}><Icon name="arrow" size={17} /></a>
              </article>
            ))}
          </div>
          <p className="market-place-note">Popular Lusaka locations. Use your location to find markets near you anywhere in Zambia.</p>
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
          <button>Join the community <Icon name="arrow" size={17} /></button>
          <span className="banner-decoration">✳</span>
        </section>
      </main>

      <footer className="site-footer" id="how-it-works"><a className="footer-brand" href="#">yanga<span>.</span></a><span>A little closer to home. Made with care in Zambia.</span><span className="footer-location"><Icon name="pin" size={14} /> Lusaka, Zambia</span></footer>
    </div>
  )
}

export default App
