import { CRYPTO_DB, QUERY_PATTERNS } from './constants';
import { AnalysisResult, CryptoData } from './types';

export class CryptoAnalyzer {
  private static getScoreForProfitability(crypto: string, data: CryptoData): number {
    let score = 0;
    
    // Price trend scoring
    if (data.price_trend === 'rising') score += 40;
    else if (data.price_trend === 'stable') score += 20;
    
    // Market cap scoring
    if (data.market_cap === 'high') score += 30;
    else if (data.market_cap === 'medium') score += 20;
    else score += 10;
    
    return score;
  }

  private static getSustainabilityScore(data: CryptoData): number {
    let score = data.sustainability_score * 10;
    
    // Energy use penalty
    if (data.energy_use === 'low') score += 20;
    else if (data.energy_use === 'medium') score += 10;
    
    return Math.min(score, 100);
  }

  private static detectQueryType(query: string): string[] {
    const lowerQuery = query.toLowerCase();
    const types: string[] = [];
    
    for (const [type, patterns] of Object.entries(QUERY_PATTERNS)) {
      if (patterns.some(pattern => lowerQuery.includes(pattern))) {
        types.push(type);
      }
    }
    
    return types.length > 0 ? types : ['general'];
  }

  private static getBestForProfitability(): AnalysisResult {
    let bestCrypto = '';
    let bestScore = 0;
    
    for (const [crypto, data] of Object.entries(CRYPTO_DB)) {
      const score = this.getScoreForProfitability(crypto, data);
      if (score > bestScore) {
        bestScore = score;
        bestCrypto = crypto;
      }
    }
    
    const data = CRYPTO_DB[bestCrypto];
    return {
      recommendation: bestCrypto,
      reason: `${bestCrypto} shows strong profitability potential with ${data.price_trend} price trends and ${data.market_cap} market cap. 📈`,
      score: bestScore,
      type: 'profitability'
    };
  }

  private static getBestForSustainability(): AnalysisResult {
    let bestCrypto = '';
    let bestScore = 0;
    
    for (const [crypto, data] of Object.entries(CRYPTO_DB)) {
      const score = this.getSustainabilityScore(data);
      if (score > bestScore) {
        bestScore = score;
        bestCrypto = crypto;
      }
    }
    
    const data = CRYPTO_DB[bestCrypto];
    return {
      recommendation: bestCrypto,
      reason: `${bestCrypto} is your eco-friendly choice with a sustainability score of ${data.sustainability_score}/10 and ${data.energy_use} energy usage. 🌱`,
      score: bestScore,
      type: 'sustainability'
    };
  }

  private static getBalancedRecommendation(): AnalysisResult {
    let bestCrypto = '';
    let bestScore = 0;
    
    for (const [crypto, data] of Object.entries(CRYPTO_DB)) {
      const profitScore = this.getScoreForProfitability(crypto, data);
      const sustainScore = this.getSustainabilityScore(data);
      const balancedScore = (profitScore + sustainScore) / 2;
      
      if (balancedScore > bestScore) {
        bestScore = balancedScore;
        bestCrypto = crypto;
      }
    }
    
    const data = CRYPTO_DB[bestCrypto];
    return {
      recommendation: bestCrypto,
      reason: `${bestCrypto} offers the best balance of profitability and sustainability. It's ${data.price_trend} in price with a ${data.sustainability_score}/10 sustainability score. ⚖️`,
      score: bestScore,
      type: 'general'
    };
  }

  public static analyzeQuery(query: string): string {
    const queryTypes = this.detectQueryType(query);
    
    // Handle specific crypto mentions
    const mentionedCrypto = Object.keys(CRYPTO_DB).find(crypto => 
      query.toLowerCase().includes(crypto.toLowerCase())
    );
    
    if (mentionedCrypto) {
      const data = CRYPTO_DB[mentionedCrypto];
      return `${mentionedCrypto} Analysis 📊:\n• Price Trend: ${data.price_trend} ${data.price_trend === 'rising' ? '📈' : data.price_trend === 'stable' ? '➡️' : '📉'}\n• Market Cap: ${data.market_cap}\n• Energy Use: ${data.energy_use} ${data.energy_use === 'low' ? '🟢' : data.energy_use === 'medium' ? '🟡' : '🔴'}\n• Sustainability Score: ${data.sustainability_score}/10 🌱`;
    }
    
    let result: AnalysisResult;
    
    if (queryTypes.includes('sustainability')) {
      result = this.getBestForSustainability();
    } else if (queryTypes.includes('profitability')) {
      result = this.getBestForProfitability();
    } else {
      result = this.getBalancedRecommendation();
    }
    
    return `🎯 **${result.recommendation}** is my top pick!\n\n${result.reason}\n\n💡 *Tip: Consider diversifying your portfolio across multiple coins for better risk management.*`;
  }

  public static getRandomInsight(): string {
    const insights = [
      "Did you know? Proof-of-Stake cryptocurrencies typically use 99% less energy than Bitcoin! 🌱",
      "Market cap matters! Higher market cap usually means more stability but potentially lower growth rates. 📊",
      "Always look at both price trends AND sustainability for long-term success! 🎯",
      "The crypto market is highly volatile - never invest more than you can afford to lose! ⚠️",
      "Diversification is key! Don't put all your eggs in one crypto basket. 🥚"
    ];
    
    return insights[Math.floor(Math.random() * insights.length)];
  }
}