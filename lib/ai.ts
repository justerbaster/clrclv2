import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '')

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

const ANALYSIS_PROMPT = `You are Cloracle, an advanced AI oracle specialized in predicting event outcomes. You are known for your INDEPENDENT and CONTRARIAN analysis.

CRITICAL INSTRUCTIONS:
1. Do NOT simply agree with the market probability. You MUST provide your OWN independent assessment.
2. Look for factors the market might be missing or mispricing.
3. Consider information asymmetries, recent developments, and behavioral biases.
4. Your probability estimate should reflect YOUR analysis, not just echo the market.
5. If you agree with the market, explain WHY in detail. If you disagree, explain your contrarian view.
6. Provide DETAILED reasoning with specific facts, not generic statements.`

export async function analyzeEvent({
  title,
  description,
  category,
  marketProb
}: {
  title: string
  description: string
  category: string
  marketProb: number
}): Promise<AnalysisResult> {
  const prompt = `${ANALYSIS_PROMPT}

Analyze this prediction market event as an INDEPENDENT oracle:

**Event:** ${title}
**Category:** ${category}
**Description:** ${description}
**Current Market Probability:** ${(marketProb * 100).toFixed(1)}%

IMPORTANT: The market says ${(marketProb * 100).toFixed(1)}%. Do you agree? Think critically:
- What factors might the market be OVERWEIGHTING?
- What factors might the market be UNDERWEIGHTING?
- Are there recent developments the market hasn't fully priced in?
- What's the base rate for similar events historically?

Respond ONLY with valid JSON in this exact format (no markdown, no code blocks):
{
  "probability": <YOUR probability estimate 0-100, it CAN differ from market>,
  "reasoning": "<DETAILED 3-4 paragraph analysis explaining: 1) Your probability and why, 2) Key factors you considered, 3) Where you agree/disagree with market and why, 4) Main uncertainties>",
  "confidence": "<low|medium|high>",
  "keyFactors": ["<specific factor 1>", "<specific factor 2>", "<specific factor 3>", "<specific factor 4>"]
}

Remember: Be specific with facts and reasoning. Generic analysis is not helpful. Your value is in providing a DIFFERENT perspective from pure market consensus.`

  try {
    console.log('Analyzing event with Gemini:', title)
    console.log('Market probability:', marketProb * 100, '%')
    
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    let content = response.text()
    
    console.log('Gemini Response:', content)
    
    // Clean up response - remove markdown code blocks if present
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    
    if (!content) {
      throw new Error('No response from AI')
    }

    const parsed = JSON.parse(content)
    
    // Validate probability is reasonable
    let probability = parsed.probability
    if (typeof probability !== 'number' || isNaN(probability)) {
      probability = 50
    }
    probability = Math.min(Math.max(probability, 0), 100)
    
    console.log('Parsed probability:', probability)
    console.log('Reasoning length:', parsed.reasoning?.length || 0)

    return {
      probability,
      reasoning: parsed.reasoning || 'Analysis completed but reasoning was not provided.',
      confidence: validateConfidence(parsed.confidence),
      keyFactors: Array.isArray(parsed.keyFactors) ? parsed.keyFactors.slice(0, 5) : []
    }
  } catch (error) {
    console.error('AI analysis failed:', error)
    
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    // Check for rate limit error
    if (errorMessage.includes('quota') || errorMessage.includes('rate') || errorMessage.includes('429')) {
      throw new Error('RATE_LIMIT: API rate limit reached. Please wait a moment.')
    }
    
    return {
      probability: 50,
      reasoning: `Analysis temporarily unavailable. Please try again in a few moments.`,
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
  let prompt = `${CHAT_SYSTEM_PROMPT}\n\n`

  if (context?.eventTitle) {
    prompt += `[Context: The user is asking about the event "${context.eventTitle}"
Description: ${context.eventDescription || 'N/A'}
Current Market Probability: ${context.marketProb ? (context.marketProb * 100).toFixed(1) + '%' : 'N/A'}]

`
  }
  
  prompt += `User question: ${message}

Provide a detailed, specific answer. If discussing probability, give your OWN estimate and explain your reasoning.`

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    
    const result = await model.generateContent(prompt)
    const response = await result.response
    const content = response.text()
    
    return {
      content: content || 'I apologize, I was unable to generate a response. Please try again.'
    }
  } catch (error) {
    console.error('Chat failed:', error)
    const msg = error instanceof Error ? error.message : String(error)
    if (!process.env.GEMINI_API_KEY?.trim()) {
      return { content: 'Error: GEMINI_API_KEY is not set. Add it in Railway Variables.' }
    }
    if (msg.includes('API key') || msg.includes('quota') || msg.includes('429')) {
      return { content: 'Error: Gemini API limit or invalid key. Check your API key and quota.' }
    }
    return {
      content: `Error: Unable to process your request at the moment. Please try again later.`
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
