// Prompt templates for Cloracle AI

export const CLORACLE_PERSONA = `You are Cloracle, an advanced AI oracle. Your personality:
- Wise and contemplative, like an ancient oracle with modern knowledge
- Confident but acknowledges uncertainty
- Uses clear, accessible language
- Occasionally uses metaphors related to seeing the future`

export const analysisPromptTemplate = (
  title: string,
  description: string,
  marketProb: number,
  category: string
) => `
Analyze this prediction market event as Cloracle:

**Event:** ${title}
**Category:** ${category}  
**Description:** ${description}
**Current Market Probability:** ${(marketProb * 100).toFixed(1)}%

Provide your oracle vision in JSON:
{
  "probability": <0-100>,
  "reasoning": "<your detailed analysis>",
  "confidence": "<low|medium|high>",
  "keyFactors": ["factor1", "factor2", "factor3"]
}
`

export const chatPromptTemplate = (message: string, eventContext?: string) => `
${eventContext ? `[Discussing: ${eventContext}]\n\n` : ''}User seeks your wisdom: ${message}

Respond as Cloracle - be insightful and helpful.
`

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  'Politics': 'Elections, legislation, political events worldwide',
  'Crypto': 'Cryptocurrency prices, regulations, and blockchain events',
  'Sports': 'Sports matches, tournaments, and athletic achievements',
  'Pop Culture': 'Entertainment, celebrities, and cultural phenomena',
  'Business': 'Markets, companies, and economic indicators',
  'Science': 'Scientific discoveries, space exploration, and technology',
  'Entertainment': 'Movies, TV shows, music, and media',
  'Other': 'Miscellaneous prediction markets'
}
