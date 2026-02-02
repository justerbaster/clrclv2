import { NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

// Category detection based on keywords
function detectCategory(title: string, description: string): string {
  const text = `${title} ${description}`.toLowerCase()
  
  // Politics keywords
  if (text.match(/trump|biden|election|president|congress|senate|democrat|republican|vote|governor|mayor|political|government|white house|scotus|supreme court|gop|dnc|primary|cabinet|impeach|legislation|bill signing|executive order|midterm|poll|approval rating/)) {
    return 'Politics'
  }
  
  // Crypto keywords
  if (text.match(/bitcoin|btc|ethereum|eth|crypto|solana|sol|token|blockchain|defi|nft|binance|coinbase|altcoin|memecoin|doge|xrp|cardano|polygon|avalanche|arbitrum|optimism|uniswap|airdrop|halving|staking|web3|dao/)) {
    return 'Crypto'
  }
  
  // Sports keywords
  if (text.match(/nfl|nba|mlb|nhl|soccer|football|basketball|baseball|hockey|tennis|golf|ufc|mma|boxing|championship|playoff|super bowl|world cup|olympics|match|score|win|lose|league|premier|champions|finals|mvp|draft|trade|injury|coach|quarterback|touchdown|goal|point/)) {
    return 'Sports'
  }
  
  // Pop Culture keywords
  if (text.match(/movie|film|oscar|grammy|emmy|tony|celebrity|kardashian|music|album|concert|tv show|netflix|disney|marvel|dc|twitter|tiktok|instagram|youtube|influencer|viral|streaming|spotify|billboard|release|premiere|award show|red carpet|scandal|dating|breakup|wedding/)) {
    return 'Pop Culture'
  }
  
  // Business keywords
  if (text.match(/stock|market|company|ceo|ipo|earnings|revenue|merger|acquisition|startup|tech|apple|google|microsoft|amazon|tesla|nvidia|meta|ai company|layoff|hiring|profit|loss|share|investor|wall street|nasdaq|dow|s&p|fed|interest rate|inflation|gdp|recession|economy|trade war|tariff/)) {
    return 'Business'
  }
  
  // Science keywords
  if (text.match(/nasa|spacex|rocket|space|mars|moon|asteroid|climate|vaccine|virus|covid|pandemic|research|study|scientist|discovery|ai|artificial intelligence|quantum|physics|biology|chemistry|medical|fda|drug|trial|breakthrough|experiment|satellite|telescope|genome|crispr/)) {
    return 'Science'
  }
  
  return 'Other'
}

export async function POST() {
  try {
    // Get all events
    const events = await prisma.event.findMany()
    
    let updated = 0
    const categoryCount: Record<string, number> = {}
    
    for (const event of events) {
      const newCategory = detectCategory(event.title, event.description)
      
      // Count categories
      categoryCount[newCategory] = (categoryCount[newCategory] || 0) + 1
      
      // Update if category changed
      if (event.category !== newCategory) {
        await prisma.event.update({
          where: { id: event.id },
          data: { category: newCategory }
        })
        updated++
      }
    }
    
    return NextResponse.json({
      message: `Reclassified ${updated} events`,
      total: events.length,
      updated,
      categories: categoryCount
    })
  } catch (error) {
    console.error('Reclassify error:', error)
    return NextResponse.json(
      { error: 'Failed to reclassify events' },
      { status: 500 }
    )
  }
}

export async function GET() {
  // Show current category distribution
  const events = await prisma.event.findMany()
  const categoryCount: Record<string, number> = {}
  
  for (const event of events) {
    categoryCount[event.category] = (categoryCount[event.category] || 0) + 1
  }
  
  return NextResponse.json({ categories: categoryCount, total: events.length })
}
