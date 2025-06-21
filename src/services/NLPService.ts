// Natural Language Processing utilities for better query understanding
export class NLPService {
  private static readonly CRYPTO_SYNONYMS = {
    'bitcoin': ['btc', 'bitcoin', 'bit coin'],
    'ethereum': ['eth', 'ethereum', 'ether'],
    'cardano': ['ada', 'cardano'],
    'solana': ['sol', 'solana'],
    'polkadot': ['dot', 'polkadot'],
    'chainlink': ['link', 'chainlink'],
    'polygon': ['matic', 'polygon'],
    'avalanche': ['avax', 'avalanche'],
    'binance': ['bnb', 'binance coin', 'binance'],
    'ripple': ['xrp', 'ripple'],
    'dogecoin': ['doge', 'dogecoin'],
    'litecoin': ['ltc', 'litecoin']
  };

  private static readonly INTENT_PATTERNS = {
    price: [
      /what.*price/i,
      /how much.*cost/i,
      /current.*value/i,
      /price.*of/i,
      /worth.*of/i,
      /trading.*at/i
    ],
    investment: [
      /should.*invest/i,
      /buy.*or.*sell/i,
      /good.*investment/i,
      /recommend/i,
      /best.*to.*buy/i,
      /portfolio/i
    ],
    comparison: [
      /compare/i,
      /vs|versus/i,
      /better.*than/i,
      /difference.*between/i,
      /which.*is.*better/i
    ],
    sustainability: [
      /sustainable/i,
      /eco.*friendly/i,
      /green/i,
      /environment/i,
      /energy.*consumption/i,
      /carbon.*footprint/i
    ],
    market: [
      /market.*analysis/i,
      /market.*overview/i,
      /market.*trend/i,
      /bull.*market/i,
      /bear.*market/i
    ],
    news: [
      /latest.*news/i,
      /recent.*updates/i,
      /what.*happening/i,
      /current.*events/i
    ],
    education: [
      /what.*is/i,
      /how.*does/i,
      /explain/i,
      /learn.*about/i,
      /understand/i
    ]
  };

  private static readonly SENTIMENT_WORDS = {
    positive: ['good', 'great', 'excellent', 'amazing', 'bullish', 'up', 'rise', 'gain', 'profit', 'buy'],
    negative: ['bad', 'terrible', 'awful', 'bearish', 'down', 'fall', 'loss', 'crash', 'sell', 'avoid'],
    neutral: ['okay', 'fine', 'stable', 'steady', 'hold', 'wait', 'consider']
  };

  static extractCryptoNames(query: string): string[] {
    const lowerQuery = query.toLowerCase();
    const foundCryptos: string[] = [];

    for (const [crypto, synonyms] of Object.entries(this.CRYPTO_SYNONYMS)) {
      if (synonyms.some(synonym => lowerQuery.includes(synonym))) {
        foundCryptos.push(crypto);
      }
    }

    return foundCryptos;
  }

  static detectIntent(query: string): string[] {
    const intents: string[] = [];

    for (const [intent, patterns] of Object.entries(this.INTENT_PATTERNS)) {
      if (patterns.some(pattern => pattern.test(query))) {
        intents.push(intent);
      }
    }

    return intents.length > 0 ? intents : ['general'];
  }

  static analyzeSentiment(query: string): 'positive' | 'negative' | 'neutral' {
    const lowerQuery = query.toLowerCase();
    let positiveScore = 0;
    let negativeScore = 0;

    // Count positive words
    this.SENTIMENT_WORDS.positive.forEach(word => {
      if (lowerQuery.includes(word)) positiveScore++;
    });

    // Count negative words
    this.SENTIMENT_WORDS.negative.forEach(word => {
      if (lowerQuery.includes(word)) negativeScore++;
    });

    if (positiveScore > negativeScore) return 'positive';
    if (negativeScore > positiveScore) return 'negative';
    return 'neutral';
  }

  static extractNumbers(query: string): number[] {
    const numberPattern = /\b\d+(?:\.\d+)?\b/g;
    const matches = query.match(numberPattern);
    return matches ? matches.map(Number) : [];
  }

  static extractTimeframe(query: string): string | null {
    const timeframes = {
      '1h': /1\s*hour|1h|hourly/i,
      '24h': /24\s*hour|24h|daily|today/i,
      '7d': /7\s*day|7d|week|weekly/i,
      '30d': /30\s*day|30d|month|monthly/i,
      '1y': /1\s*year|1y|year|yearly|annual/i
    };

    for (const [timeframe, pattern] of Object.entries(timeframes)) {
      if (pattern.test(query)) {
        return timeframe;
      }
    }

    return null;
  }

  static normalizeQuery(query: string): string {
    return query
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .replace(/\s+/g, ' ') // Normalize whitespace
      .trim();
  }

  static extractKeywords(query: string): string[] {
    const normalized = this.normalizeQuery(query);
    const words = normalized.split(' ');
    
    // Remove common stop words
    const stopWords = ['the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but', 'in', 'with', 'to', 'for', 'of', 'as', 'by'];
    
    return words.filter(word => 
      word.length > 2 && 
      !stopWords.includes(word)
    );
  }

  static isQuestion(query: string): boolean {
    const questionWords = ['what', 'when', 'where', 'who', 'why', 'how', 'which', 'should', 'can', 'will', 'is', 'are', 'do', 'does'];
    const lowerQuery = query.toLowerCase();
    
    return questionWords.some(word => lowerQuery.startsWith(word)) || query.includes('?');
  }

  static getQueryComplexity(query: string): 'simple' | 'medium' | 'complex' {
    const words = query.split(' ').length;
    const cryptos = this.extractCryptoNames(query).length;
    const intents = this.detectIntent(query).length;

    if (words < 5 && cryptos <= 1 && intents <= 1) return 'simple';
    if (words < 15 && cryptos <= 2 && intents <= 2) return 'medium';
    return 'complex';
  }

  static generateSuggestions(query: string): string[] {
    const cryptos = this.extractCryptoNames(query);
    const intents = this.detectIntent(query);
    const suggestions: string[] = [];

    if (cryptos.length > 0) {
      const crypto = cryptos[0];
      suggestions.push(
        `What's the current price of ${crypto}?`,
        `Is ${crypto} a good investment?`,
        `${crypto} sustainability analysis`
      );
    }

    if (intents.includes('comparison') && cryptos.length >= 2) {
      suggestions.push(`Compare ${cryptos[0]} vs ${cryptos[1]} in detail`);
    }

    if (intents.includes('investment')) {
      suggestions.push(
        'Best cryptocurrencies to invest in 2024',
        'Crypto portfolio diversification strategy',
        'Risk assessment for crypto investments'
      );
    }

    return suggestions.slice(0, 3); // Return top 3 suggestions
  }
}