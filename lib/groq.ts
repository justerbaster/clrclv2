import Groq from 'groq-sdk'

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
})

export interface AnalysisResult {
  probability: number
  reasoning: string
  confidence: 'low' | 'medium' | 'high'
  keyFactors: string[]
}

export interface ChatResponse {
  content: string
  relatedEventId?: string
}

const ANALYSIS_SYSTEM_PROMPT = `You are Cloracle, an advanced AI oracle specialized in predicting event outcomes. You are known for your INDEPENDENT and CONTRARIAN analysis.

CRITICAL INSTRUCTIONS:
1. Do NOT simply agree with the market probability. You MUST provide your OWN independent assessment.
2. Look for factors the market might be missing or mispricing.
3. Consider information asymmetries, recent developments, and behavioral biases.
4. Your probability estimate should reflect YOUR analysis, not just echo the market.
5. If you agree with the market, explain WHY in detail. If you disagree, explain your contrarian view.
6. Provide DETAILED reasoning with specific facts, not generic statements.

Always respond in valid JSON format.`

export async function analyzeEvent(
  title: string,
  description: string,
  marketProb: number,
  category: string
): Promise<AnalysisResult> {
  const prompt = `Analyze this prediction market event as an INDEPENDENT oracle:

**Event:** ${title}
**Category:** ${category}
**Description:** ${description}
**Current Market Probability:** ${(marketProb * 100).toFixed(1)}%

IMPORTANT: The market says ${(marketProb * 100).toFixed(1)}%. Do you agree? Think critically:
- What factors might the market be OVERWEIGHTING?
- What factors might the market be UNDERWEIGHTING?
- Are there recent developments the market hasn't fully priced in?
- What's the base rate for similar events historically?

Provide your INDEPENDENT analysis in this JSON format:
{
  "probability": <YOUR probability estimate 0-100, it CAN differ from market>,
  "reasoning": "<DETAILED 3-4 paragraph analysis explaining: 1) Your probability and why, 2) Key factors you considered, 3) Where you agree/disagree with market and why, 4) Main uncertainties>",
  "confidence": "<low|medium|high>",
  "keyFactors": ["<specific factor 1>", "<specific factor 2>", "<specific factor 3>", "<specific factor 4>"]
}

Remember: Be specific with facts and reasoning. Generic analysis is not helpful. Your value is in providing a DIFFERENT perspective from pure market consensus.`

  try {
    console.log('Analyzing event:', title)
    console.log('Market probability:', marketProb * 100, '%')
    
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: ANALYSIS_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.9, // Higher temperature for more varied responses
      max_tokens: 2000, // More tokens for detailed analysis
      response_format: { type: 'json_object' }
    })

    const content = completion.choices[0]?.message?.content
    console.log('AI Response:', content)
    
    if (!content) {
      throw new Error('No response from AI')
    }

    const result = JSON.parse(content)
    
    // Validate probability is reasonable
    let probability = result.probability
    if (typeof probability !== 'number' || isNaN(probability)) {
      probability = 50
    }
    probability = Math.min(Math.max(probability, 0), 100)
    
    console.log('Parsed probability:', probability)
    console.log('Reasoning length:', result.reasoning?.length || 0)

    return {
      probability,
      reasoning: result.reasoning || 'Analysis completed but reasoning was not provided.',
      confidence: validateConfidence(result.confidence),
      keyFactors: Array.isArray(result.keyFactors) ? result.keyFactors.slice(0, 5) : []
    }
  } catch (error) {
    console.error('AI analysis failed:', error)
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Check for rate limit error
    if (errorMessage.includes('rate_limit') || errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
      throw new Error('RATE_LIMIT: API rate limit reached. Please wait a moment before trying again.')
    }
    
    // Return an error response that's clearly different from market
    return {
      probability: 50, // Neutral, not copying market
      reasoning: `Analysis temporarily unavailable. The AI service is experiencing high demand. Please try again in a few moments.`,
      confidence: 'low',
      keyFactors: ['Analysis pending - please retry']
    }
  }
}

const CHAT_SYSTEM_PROMPT = `You are Cloracle, an AI oracle that helps users understand prediction markets and event probabilities.

You provide DETAILED, SPECIFIC analysis - not generic advice. When asked about events:
1. Give specific probability estimates with clear reasoning
2. Cite relevant historical precedents or data points
3. Identify key factors and how they influence the outcome
4. Discuss what could change your estimate
5. Be willing to disagree with market consensus and explain why

Be conversational but substantive. Users want INSIGHT, not platitudes.`

export async function chat(
  message: string,
  context?: { eventTitle?: string; eventDescription?: string; marketProb?: number }
): Promise<ChatResponse> {
  let prompt = message

  if (context?.eventTitle) {
    prompt = `[Context: The user is asking about the event "${context.eventTitle}"
Description: ${context.eventDescription || 'N/A'}
Current Market Probability: ${context.marketProb ? (context.marketProb * 100).toFixed(1) + '%' : 'N/A'}]

User question: ${message}

Provide a detailed, specific answer. If discussing probability, give your OWN estimate and explain your reasoning.`
  }

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: CHAT_SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8,
      max_tokens: 1500
    })

    const content = completion.choices[0]?.message?.content
    
    return {
      content: content || 'I apologize, I was unable to generate a response. Please try again.'
    }
  } catch (error) {
    console.error('Chat failed:', error)
    return {
      content: `Error: ${error instanceof Error ? error.message : 'Unknown error'}. Please ensure GROQ_API_KEY is configured correctly in .env file.`
    }
  }
}

function validateConfidence(value: string): 'low' | 'medium' | 'high' {
  const normalized = (value || '').toLowerCase()
  if (normalized === 'low' || normalized === 'medium' || normalized === 'high') {
    return normalized
  }
  return 'medium'
}

export { groq }
