// Polymarket CLOB API Client
// Docs: https://docs.polymarket.com/

export interface PolymarketMarket {
  condition_id: string
  question_id: string
  tokens: {
    token_id: string
    outcome: string
    price: number
  }[]
  minimum_order_size: string
  minimum_tick_size: string
  description: string
  category: string
  end_date_iso: string
  game_start_time: string | null
  question: string
  market_slug: string
  min_incentive_size: string
  max_incentive_spread: string
  active: boolean
  closed: boolean
  seconds_delay: number
  icon: string
  fpmm: string
  accepting_orders: boolean
  accepting_order_timestamp: string | null
  rewards: {
    min_size: number
    max_spread: number
    event_start_date: string | null
    event_end_date: string | null
    in_game_multiplier: number
  }
  is_50_50_outcome: boolean
  neg_risk: boolean
  neg_risk_market_id: string
  neg_risk_request_id: string
  notification_enabled: boolean
  enable_order_book: boolean
  volume_num_min: number
  volume_num_max: number
}

export interface PolymarketEvent {
  id: string
  slug: string
  title: string
  description: string
  category: string
  imageUrl: string | null
  marketProb: number
  volume: number | null
  endDate: Date | null
}

const CLOB_API_BASE = 'https://clob.polymarket.com'
const GAMMA_API_BASE = 'https://gamma-api.polymarket.com'

// Category mapping from Polymarket
const CATEGORY_MAP: Record<string, string> = {
  'politics': 'Politics',
  'crypto': 'Crypto',
  'sports': 'Sports',
  'pop-culture': 'Pop Culture',
  'business': 'Business',
  'science': 'Science',
  'entertainment': 'Entertainment',
  'other': 'Other'
}

export async function fetchMarkets(limit = 50, offset = 0): Promise<PolymarketMarket[]> {
  try {
    const response = await fetch(
      `${CLOB_API_BASE}/markets?limit=${limit}&offset=${offset}&active=true`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 } // Cache for 5 minutes
      }
    )
    
    if (!response.ok) {
      throw new Error(`Polymarket API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch Polymarket markets:', error)
    return []
  }
}

// Alternative: Fetch from Gamma API (more structured data)
interface GammaEvent {
  id: string
  slug: string
  title: string
  description: string
  category: string
  image: string
  volume: number
  volume24hr: number
  liquidity: number
  commentCount: number
  startDate: string
  endDate: string
  closed: boolean
  active: boolean
  archived: boolean
  new: boolean
  featured: boolean
  restricted: boolean
  createdAt: string
  updatedAt: string
  markets: GammaMarket[]
}

interface GammaMarket {
  id: string
  question: string
  description: string
  conditionId: string
  slug: string
  resolutionSource: string
  endDate: string
  liquidity: number
  volume: number
  volume24hr: number
  clobTokenIds: string
  outcomes: string
  outcomePrices: string
  active: boolean
  closed: boolean
  createdAt: string
  updatedAt: string
  groupItemTitle: string
  groupItemThreshold: string
  acceptingOrders: boolean
  negRisk: boolean
}

export async function fetchGammaEvents(limit = 50, offset = 0): Promise<GammaEvent[]> {
  try {
    const response = await fetch(
      `${GAMMA_API_BASE}/events?limit=${limit}&offset=${offset}&active=true&closed=false&archived=false`,
      {
        headers: {
          'Accept': 'application/json',
        },
        next: { revalidate: 300 }
      }
    )
    
    if (!response.ok) {
      throw new Error(`Gamma API error: ${response.status}`)
    }
    
    const data = await response.json()
    return data
  } catch (error) {
    console.error('Failed to fetch Gamma events:', error)
    return []
  }
}

export function transformGammaEvent(event: GammaEvent): PolymarketEvent | null {
  // Get the primary market (first one or the one with highest volume)
  const primaryMarket = event.markets?.sort((a, b) => (b.volume || 0) - (a.volume || 0))[0]
  
  if (!primaryMarket) return null
  
  // Parse outcome prices to get probability
  let marketProb = 0.5
  try {
    const prices = JSON.parse(primaryMarket.outcomePrices || '[]')
    if (prices.length >= 1) {
      marketProb = parseFloat(prices[0]) || 0.5
    }
  } catch {
    // Default to 0.5 if parsing fails
  }
  
  const title = event.title || primaryMarket.question
  const description = event.description || primaryMarket.description || ''
  
  return {
    id: primaryMarket.conditionId || event.id,
    slug: event.slug || primaryMarket.slug,
    title,
    description,
    category: normalizeCategory(event.category, title, description),
    imageUrl: event.image || null,
    marketProb: Math.min(Math.max(marketProb, 0), 1), // Clamp between 0 and 1
    volume: event.volume || null,
    endDate: primaryMarket.endDate ? new Date(primaryMarket.endDate) : null
  }
}

function normalizeCategory(category: string | null | undefined, title?: string, description?: string): string {
  // If category is provided, try to map it
  if (category) {
    const normalized = category.toLowerCase().replace(/\s+/g, '-')
    if (CATEGORY_MAP[normalized]) {
      return CATEGORY_MAP[normalized]
    }
  }
  
  // Auto-detect category from title and description
  const text = `${title || ''} ${description || ''}`.toLowerCase()
  
  // Politics keywords
  if (text.match(/trump|biden|election|president|congress|senate|democrat|republican|vote|governor|mayor|political|government|white house|scotus|supreme court/)) {
    return 'Politics'
  }
  
  // Crypto keywords
  if (text.match(/bitcoin|btc|ethereum|eth|crypto|solana|sol|token|blockchain|defi|nft|binance|coinbase|altcoin|memecoin|doge/)) {
    return 'Crypto'
  }
  
  // Sports keywords
  if (text.match(/nfl|nba|mlb|nhl|soccer|football|basketball|baseball|hockey|tennis|golf|ufc|boxing|championship|playoff|super bowl|world cup|olympics|match|game|team|player|coach/)) {
    return 'Sports'
  }
  
  // Pop Culture keywords
  if (text.match(/movie|film|oscar|grammy|emmy|celebrity|kardashian|music|album|concert|tv show|netflix|disney|marvel|twitter|tiktok|instagram|youtube|influencer|viral/)) {
    return 'Pop Culture'
  }
  
  // Business keywords
  if (text.match(/stock|market|company|ceo|ipo|earnings|revenue|merger|acquisition|startup|tech|apple|google|microsoft|amazon|tesla|nvidia|ai company|layoff|hiring/)) {
    return 'Business'
  }
  
  // Science keywords
  if (text.match(/nasa|spacex|rocket|space|mars|moon|climate|vaccine|virus|covid|research|study|scientist|discovery|ai|artificial intelligence|quantum|physics/)) {
    return 'Science'
  }
  
  return 'Other'
}

export async function fetchAllEvents(): Promise<PolymarketEvent[]> {
  const gammaEvents = await fetchGammaEvents(100, 0)
  
  const events: PolymarketEvent[] = []
  
  for (const event of gammaEvents) {
    const transformed = transformGammaEvent(event)
    if (transformed) {
      events.push(transformed)
    }
  }
  
  return events
}

// Get categories available in Polymarket
export function getCategories(): string[] {
  return Object.values(CATEGORY_MAP)
}
