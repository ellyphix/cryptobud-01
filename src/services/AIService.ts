import { cryptoAPI } from './CryptoAPI';

export interface AIResponse {
  message: string;
  data?: any;
  sources?: string[];
  confidence?: number;
}

class AIAssistantService {
  private readonly sustainabilityData = {
    'bitcoin': { score: 3, reason: 'High energy consumption due to Proof of Work consensus' },
    'ethereum': { score: 8, reason: 'Transitioned to Proof of Stake, significantly reducing energy usage' },
    'cardano': { score: 9, reason: 'Built with Proof of Stake from inception, highly energy efficient' },
    'solana': { score: 7, reason: 'Proof of History + Proof of Stake, relatively energy efficient' },
    'polkadot': { score: 8, reason: 'Nominated Proof of Stake consensus, low energy consumption' },
    'chainlink': { score: 6, reason: 'Runs on Ethereum, inherits its sustainability improvements' },
    'polygon': { score: 8, reason: 'Layer 2 solution with Proof of Stake, very energy efficient' },
    'avalanche': { score: 7, reason: 'Avalanche consensus protocol, moderate energy usage' }
  };

  async processQuery(query: string): Promise<AIResponse> {
    const lowerQuery = query.toLowerCase();
    
    try {
      // Price and market data queries
      if (this.isPriceQuery(lowerQuery)) {
        return await this.handlePriceQuery(lowerQuery);
      }
      
      // Market analysis queries
      if (this.isMarketAnalysisQuery(lowerQuery)) {
        return await this.handleMarketAnalysis(lowerQuery);
      }
      
      // Sustainability queries
      if (this.isSustainabilityQuery(lowerQuery)) {
        return await this.handleSustainabilityQuery(lowerQuery);
      }
      
      // Investment advice queries
      if (this.isInvestmentQuery(lowerQuery)) {
        return await this.handleInvestmentQuery(lowerQuery);
      }
      
      // Comparison queries
      if (this.isComparisonQuery(lowerQuery)) {
        return await this.handleComparisonQuery(lowerQuery);
      }
      
      // Technical analysis queries
      if (this.isTechnicalQuery(lowerQuery)) {
        return await this.handleTechnicalQuery(lowerQuery);
      }
      
      // News and trends queries
      if (this.isNewsQuery(lowerQuery)) {
        return await this.handleNewsQuery(lowerQuery);
      }
      
      // General crypto education
      if (this.isEducationalQuery(lowerQuery)) {
        return await this.handleEducationalQuery(lowerQuery);
      }
      
      // Default response with market overview
      return await this.handleGeneralQuery(lowerQuery);
      
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        message: "I'm experiencing some technical difficulties accessing real-time data. Let me provide you with some general crypto insights instead. What specific aspect of cryptocurrency would you like to learn about?",
        confidence: 0.5
      };
    }
  }

  private isPriceQuery(query: string): boolean {
    return /price|cost|worth|value|trading|current/.test(query);
  }

  private isMarketAnalysisQuery(query: string): boolean {
    return /market|cap|volume|trend|analysis|performance/.test(query);
  }

  private isSustainabilityQuery(query: string): boolean {
    return /sustainable|eco|green|environment|energy|carbon|climate/.test(query);
  }

  private isInvestmentQuery(query: string): boolean {
    return /invest|buy|sell|portfolio|profit|best|recommend|should i/.test(query);
  }

  private isComparisonQuery(query: string): boolean {
    return /compare|vs|versus|difference|better|which/.test(query);
  }

  private isTechnicalQuery(query: string): boolean {
    return /technical|chart|support|resistance|rsi|macd|fibonacci/.test(query);
  }

  private isNewsQuery(query: string): boolean {
    return /news|latest|update|happening|recent|today/.test(query);
  }

  private isEducationalQuery(query: string): boolean {
    return /what is|how does|explain|learn|understand|blockchain|defi|nft/.test(query);
  }

  private async handlePriceQuery(query: string): Promise<AIResponse> {
    const cryptoName = this.extractCryptoName(query);
    
    if (cryptoName) {
      try {
        const searchResults = await cryptoAPI.searchCryptocurrency(cryptoName);
        if (searchResults.length > 0) {
          const coinId = searchResults[0].id;
          const coinData = await cryptoAPI.getCryptocurrencyData(coinId);
          
          const price = coinData.market_data.current_price.usd;
          const change24h = coinData.market_data.price_change_percentage_24h;
          const marketCap = coinData.market_data.market_cap.usd;
          
          return {
            message: `📊 **${coinData.name} (${coinData.symbol.toUpperCase()}) Price Analysis**\n\n` +
                    `💰 **Current Price:** ${cryptoAPI.formatPrice(price)}\n` +
                    `📈 **24h Change:** ${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%\n` +
                    `🏆 **Market Cap:** ${cryptoAPI.formatMarketCap(marketCap)}\n` +
                    `📊 **Market Rank:** #${coinData.market_cap_rank}\n\n` +
                    `${this.getPriceAnalysis(change24h)}`,
            data: coinData,
            sources: ['CoinGecko API'],
            confidence: 0.95
          };
        }
      } catch (error) {
        console.error('Price query error:', error);
      }
    }
    
    // Fallback to general market overview
    const topCryptos = await cryptoAPI.getTopCryptocurrencies(5);
    const priceOverview = topCryptos.map(crypto => 
      `• **${crypto.name}**: ${cryptoAPI.formatPrice(crypto.current_price)} (${crypto.price_change_percentage_24h > 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%)`
    ).join('\n');
    
    return {
      message: `📊 **Top Cryptocurrency Prices**\n\n${priceOverview}\n\n💡 *Tip: Ask me about a specific cryptocurrency for detailed analysis!*`,
      data: topCryptos,
      sources: ['CoinGecko API'],
      confidence: 0.9
    };
  }

  private async handleMarketAnalysis(query: string): Promise<AIResponse> {
    const globalData = await cryptoAPI.getGlobalMarketData();
    const topCryptos = await cryptoAPI.getTopCryptocurrencies(10);
    
    const totalMarketCap = globalData.data.total_market_cap.usd;
    const marketCapChange = globalData.data.market_cap_change_percentage_24h_usd;
    const btcDominance = globalData.data.market_cap_percentage.btc;
    
    const gainers = topCryptos.filter(c => c.price_change_percentage_24h > 0).length;
    const losers = topCryptos.filter(c => c.price_change_percentage_24h < 0).length;
    
    return {
      message: `🌍 **Global Crypto Market Analysis**\n\n` +
              `💰 **Total Market Cap:** ${cryptoAPI.formatMarketCap(totalMarketCap)}\n` +
              `📊 **24h Change:** ${marketCapChange > 0 ? '+' : ''}${marketCapChange.toFixed(2)}%\n` +
              `₿ **Bitcoin Dominance:** ${btcDominance.toFixed(1)}%\n\n` +
              `📈 **Market Sentiment:**\n` +
              `• ${gainers} coins gaining\n` +
              `• ${losers} coins declining\n\n` +
              `${this.getMarketSentiment(marketCapChange, btcDominance)}`,
      data: { globalData, topCryptos },
      sources: ['CoinGecko API'],
      confidence: 0.9
    };
  }

  private async handleSustainabilityQuery(query: string): Promise<AIResponse> {
    const cryptoName = this.extractCryptoName(query);
    
    if (cryptoName) {
      const sustainabilityInfo = this.sustainabilityData[cryptoName.toLowerCase()];
      if (sustainabilityInfo) {
        return {
          message: `🌱 **${cryptoName.charAt(0).toUpperCase() + cryptoName.slice(1)} Sustainability Analysis**\n\n` +
                  `♻️ **Sustainability Score:** ${sustainabilityInfo.score}/10\n` +
                  `📝 **Analysis:** ${sustainabilityInfo.reason}\n\n` +
                  `${this.getSustainabilityRecommendations(sustainabilityInfo.score)}`,
          confidence: 0.85
        };
      }
    }
    
    // General sustainability ranking
    const sustainableCoins = Object.entries(this.sustainabilityData)
      .sort(([,a], [,b]) => b.score - a.score)
      .slice(0, 5)
      .map(([coin, data], index) => 
        `${index + 1}. **${coin.charAt(0).toUpperCase() + coin.slice(1)}** - ${data.score}/10`
      ).join('\n');
    
    return {
      message: `🌱 **Most Sustainable Cryptocurrencies**\n\n${sustainableCoins}\n\n` +
              `💡 **Key Factors:**\n` +
              `• Consensus mechanism (PoS > PoW)\n` +
              `• Energy efficiency\n` +
              `• Carbon footprint\n` +
              `• Network optimization\n\n` +
              `🌍 *Choose eco-friendly options for a sustainable crypto future!*`,
      confidence: 0.9
    };
  }

  private async handleInvestmentQuery(query: string): Promise<AIResponse> {
    const topCryptos = await cryptoAPI.getTopCryptocurrencies(10);
    const globalData = await cryptoAPI.getGlobalMarketData();
    
    // Analyze market conditions
    const marketTrend = globalData.data.market_cap_change_percentage_24h_usd > 0 ? 'bullish' : 'bearish';
    const strongPerformers = topCryptos.filter(c => c.price_change_percentage_24h > 5);
    const stableCoins = topCryptos.filter(c => Math.abs(c.price_change_percentage_24h) < 2);
    
    return {
      message: `💼 **Investment Analysis & Recommendations**\n\n` +
              `📊 **Current Market:** ${marketTrend.charAt(0).toUpperCase() + marketTrend.slice(1)} sentiment\n\n` +
              `🚀 **Strong Performers (24h):**\n${strongPerformers.slice(0, 3).map(c => 
                `• ${c.name}: +${c.price_change_percentage_24h.toFixed(2)}%`).join('\n')}\n\n` +
              `⚖️ **Stable Options:**\n${stableCoins.slice(0, 3).map(c => 
                `• ${c.name}: ${c.price_change_percentage_24h.toFixed(2)}%`).join('\n')}\n\n` +
              `💡 **Investment Strategy Tips:**\n` +
              `• Diversify across different cryptocurrencies\n` +
              `• Consider dollar-cost averaging (DCA)\n` +
              `• Only invest what you can afford to lose\n` +
              `• Research fundamentals, not just price movements\n` +
              `• Consider both growth potential and sustainability\n\n` +
              `⚠️ **Risk Warning:** Cryptocurrency investments are highly volatile and risky. This is educational content, not financial advice.`,
      data: { topCryptos, globalData },
      sources: ['CoinGecko API', 'Market Analysis'],
      confidence: 0.8
    };
  }

  private async handleComparisonQuery(query: string): Promise<AIResponse> {
    const cryptoNames = this.extractMultipleCryptoNames(query);
    
    if (cryptoNames.length >= 2) {
      try {
        const comparisons = await Promise.all(
          cryptoNames.slice(0, 3).map(async name => {
            const searchResults = await cryptoAPI.searchCryptocurrency(name);
            if (searchResults.length > 0) {
              return await cryptoAPI.getCryptocurrencyData(searchResults[0].id);
            }
            return null;
          })
        );
        
        const validComparisons = comparisons.filter(c => c !== null);
        
        if (validComparisons.length >= 2) {
          const comparisonText = validComparisons.map(coin => {
            const price = coin.market_data.current_price.usd;
            const marketCap = coin.market_data.market_cap.usd;
            const change24h = coin.market_data.price_change_percentage_24h;
            
            return `**${coin.name} (${coin.symbol.toUpperCase()})**\n` +
                   `• Price: ${cryptoAPI.formatPrice(price)}\n` +
                   `• Market Cap: ${cryptoAPI.formatMarketCap(marketCap)}\n` +
                   `• 24h Change: ${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%\n` +
                   `• Rank: #${coin.market_cap_rank}`;
          }).join('\n\n');
          
          return {
            message: `⚖️ **Cryptocurrency Comparison**\n\n${comparisonText}\n\n${this.getComparisonInsights(validComparisons)}`,
            data: validComparisons,
            sources: ['CoinGecko API'],
            confidence: 0.9
          };
        }
      } catch (error) {
        console.error('Comparison query error:', error);
      }
    }
    
    return {
      message: `⚖️ **Cryptocurrency Comparison**\n\nI can help you compare different cryptocurrencies! Try asking:\n• "Compare Bitcoin vs Ethereum"\n• "Bitcoin vs Cardano vs Solana"\n• "Which is better, ETH or ADA?"\n\nI'll provide detailed analysis including price, market cap, performance, and sustainability factors.`,
      confidence: 0.7
    };
  }

  private async handleTechnicalQuery(query: string): Promise<AIResponse> {
    return {
      message: `📈 **Technical Analysis Insights**\n\n` +
              `🔍 **Key Technical Indicators to Watch:**\n` +
              `• **RSI (Relative Strength Index):** Measures overbought/oversold conditions\n` +
              `• **MACD:** Shows trend changes and momentum\n` +
              `• **Support/Resistance:** Key price levels to monitor\n` +
              `• **Volume:** Confirms price movements\n\n` +
              `📊 **Current Market Technicals:**\n` +
              `• Bitcoin showing consolidation patterns\n` +
              `• Altcoins following BTC correlation\n` +
              `• Volume indicates institutional interest\n\n` +
              `💡 **Pro Tips:**\n` +
              `• Combine multiple indicators for better signals\n` +
              `• Consider fundamental analysis alongside technicals\n` +
              `• Use proper risk management strategies\n\n` +
              `📚 *For detailed charts and real-time technical analysis, I recommend using TradingView or similar platforms.*`,
      confidence: 0.8
    };
  }

  private async handleNewsQuery(query: string): Promise<AIResponse> {
    const news = await cryptoAPI.getCryptoNews();
    const globalData = await cryptoAPI.getGlobalMarketData();
    
    const newsText = news.map((article, index) => 
      `${index + 1}. **${article.title}**\n   ${article.description}\n   *${article.source} - ${new Date(article.publishedAt).toLocaleDateString()}*`
    ).join('\n\n');
    
    return {
      message: `📰 **Latest Crypto News & Updates**\n\n${newsText}\n\n` +
              `📊 **Market Snapshot:**\n` +
              `• Total Market Cap: ${cryptoAPI.formatMarketCap(globalData.data.total_market_cap.usd)}\n` +
              `• 24h Change: ${globalData.data.market_cap_change_percentage_24h_usd.toFixed(2)}%\n\n` +
              `💡 *Stay informed with the latest developments in the crypto space!*`,
      data: { news, globalData },
      sources: ['Crypto News APIs', 'CoinGecko'],
      confidence: 0.85
    };
  }

  private async handleEducationalQuery(query: string): Promise<AIResponse> {
    const educationalTopics = {
      'blockchain': `🔗 **Blockchain Technology**\n\nA blockchain is a distributed ledger that maintains a continuously growing list of records (blocks) linked using cryptography. Each block contains a hash of the previous block, timestamp, and transaction data.\n\n**Key Features:**\n• Decentralization\n• Immutability\n• Transparency\n• Security through cryptography`,
      
      'defi': `🏦 **Decentralized Finance (DeFi)**\n\nDeFi refers to financial services built on blockchain networks, primarily Ethereum. It aims to recreate traditional financial systems without intermediaries.\n\n**Popular DeFi Applications:**\n• Lending & Borrowing (Aave, Compound)\n• Decentralized Exchanges (Uniswap, SushiSwap)\n• Yield Farming\n• Liquidity Mining`,
      
      'nft': `🎨 **Non-Fungible Tokens (NFTs)**\n\nNFTs are unique digital assets that represent ownership of specific items or content on the blockchain.\n\n**Use Cases:**\n• Digital Art\n• Gaming Assets\n• Virtual Real Estate\n• Collectibles\n• Identity Verification`,
      
      'mining': `⛏️ **Cryptocurrency Mining**\n\nMining is the process of validating transactions and adding them to the blockchain while earning rewards.\n\n**Types:**\n• Proof of Work (Bitcoin)\n• Proof of Stake (Ethereum 2.0)\n• Other consensus mechanisms`
    };
    
    const topic = Object.keys(educationalTopics).find(key => query.includes(key));
    
    if (topic) {
      return {
        message: educationalTopics[topic],
        confidence: 0.9
      };
    }
    
    return {
      message: `🎓 **Crypto Education Hub**\n\nI can explain various cryptocurrency concepts! Ask me about:\n\n` +
              `🔗 **Blockchain Technology**\n🏦 **DeFi (Decentralized Finance)**\n🎨 **NFTs (Non-Fungible Tokens)**\n⛏️ **Mining & Consensus**\n💰 **Trading Strategies**\n🔒 **Security & Wallets**\n\n` +
              `Just ask: "What is blockchain?" or "Explain DeFi" and I'll provide detailed explanations!`,
      confidence: 0.8
    };
  }

  private async handleGeneralQuery(query: string): Promise<AIResponse> {
    const topCryptos = await cryptoAPI.getTopCryptocurrencies(5);
    const globalData = await cryptoAPI.getGlobalMarketData();
    
    return {
      message: `👋 **Welcome to CryptoBuddy!**\n\nI'm your AI-powered cryptocurrency assistant. I can help you with:\n\n` +
              `📊 **Real-time market data and analysis**\n💰 **Price tracking and predictions**\n🌱 **Sustainability assessments**\n💼 **Investment guidance**\n⚖️ **Cryptocurrency comparisons**\n📰 **Latest crypto news**\n🎓 **Educational content**\n\n` +
              `**Current Market Overview:**\n` +
              `• Total Market Cap: ${cryptoAPI.formatMarketCap(globalData.data.total_market_cap.usd)}\n` +
              `• Bitcoin Dominance: ${globalData.data.market_cap_percentage.btc.toFixed(1)}%\n` +
              `• Market Trend: ${globalData.data.market_cap_change_percentage_24h_usd > 0 ? '📈 Bullish' : '📉 Bearish'}\n\n` +
              `💡 **Try asking me:**\n` +
              `• "What's the price of Bitcoin?"\n` +
              `• "Which crypto is most sustainable?"\n` +
              `• "Compare Ethereum vs Cardano"\n` +
              `• "Should I invest in crypto?"\n` +
              `• "Latest crypto news"`,
      data: { topCryptos, globalData },
      sources: ['CoinGecko API'],
      confidence: 0.9
    };
  }

  private extractCryptoName(query: string): string | null {
    const cryptoNames = ['bitcoin', 'ethereum', 'cardano', 'solana', 'polkadot', 'chainlink', 'polygon', 'avalanche', 'btc', 'eth', 'ada', 'sol', 'dot', 'link', 'matic', 'avax'];
    return cryptoNames.find(name => query.toLowerCase().includes(name)) || null;
  }

  private extractMultipleCryptoNames(query: string): string[] {
    const cryptoNames = ['bitcoin', 'ethereum', 'cardano', 'solana', 'polkadot', 'chainlink', 'polygon', 'avalanche'];
    return cryptoNames.filter(name => query.toLowerCase().includes(name));
  }

  private getPriceAnalysis(change24h: number): string {
    if (change24h > 5) {
      return `🚀 **Strong bullish momentum!** This significant gain suggests positive market sentiment and potential continued upward movement.`;
    } else if (change24h > 0) {
      return `📈 **Positive trend.** Moderate gains indicate healthy growth and market confidence.`;
    } else if (change24h > -5) {
      return `📉 **Minor correction.** Small declines are normal in volatile markets and may present buying opportunities.`;
    } else {
      return `⚠️ **Significant decline.** Consider waiting for market stabilization before making investment decisions.`;
    }
  }

  private getMarketSentiment(marketCapChange: number, btcDominance: number): string {
    let sentiment = '';
    
    if (marketCapChange > 2) {
      sentiment += `🚀 **Strong bullish market** with significant capital inflow.\n`;
    } else if (marketCapChange > 0) {
      sentiment += `📈 **Moderately bullish** with positive momentum.\n`;
    } else if (marketCapChange > -2) {
      sentiment += `⚖️ **Neutral market** with mixed signals.\n`;
    } else {
      sentiment += `📉 **Bearish sentiment** with capital outflow.\n`;
    }
    
    if (btcDominance > 50) {
      sentiment += `₿ **Bitcoin dominance is high**, suggesting flight to safety or altcoin weakness.`;
    } else {
      sentiment += `🌟 **Altcoin season potential** with lower Bitcoin dominance.`;
    }
    
    return sentiment;
  }

  private getSustainabilityRecommendations(score: number): string {
    if (score >= 8) {
      return `✅ **Excellent choice for eco-conscious investors!** This cryptocurrency demonstrates strong environmental responsibility.`;
    } else if (score >= 6) {
      return `👍 **Good sustainability profile.** A solid choice for environmentally aware investors.`;
    } else if (score >= 4) {
      return `⚠️ **Moderate environmental impact.** Consider the trade-offs between returns and sustainability.`;
    } else {
      return `🚨 **High environmental impact.** Consider more sustainable alternatives if environmental factors are important to you.`;
    }
  }

  private getComparisonInsights(coins: any[]): string {
    const insights = [];
    
    // Market cap comparison
    const largestCap = coins.reduce((prev, current) => 
      prev.market_data.market_cap.usd > current.market_data.market_cap.usd ? prev : current
    );
    insights.push(`🏆 **${largestCap.name}** has the largest market cap, indicating higher stability and adoption.`);
    
    // Performance comparison
    const bestPerformer = coins.reduce((prev, current) => 
      prev.market_data.price_change_percentage_24h > current.market_data.price_change_percentage_24h ? prev : current
    );
    insights.push(`📈 **${bestPerformer.name}** is the top 24h performer with ${bestPerformer.market_data.price_change_percentage_24h.toFixed(2)}% gains.`);
    
    return `\n💡 **Key Insights:**\n• ${insights.join('\n• ')}`;
  }
}

export const aiService = new AIAssistantService();