import { cryptoAPI } from './CryptoAPI';
import axios from 'axios';

export interface AIResponse {
  message: string;
  data?: any;
  sources?: string[];
  confidence?: number;
}

class CryptoBuddyAIService {
  private readonly sustainabilityData = {
    'bitcoin': { score: 3, reason: 'High energy consumption due to Proof of Work consensus', energyPerTx: '741 kWh' },
    'ethereum': { score: 8, reason: 'Transitioned to Proof of Stake, significantly reducing energy usage', energyPerTx: '0.0026 kWh' },
    'cardano': { score: 9, reason: 'Built with Proof of Stake from inception, highly energy efficient', energyPerTx: '0.0015 kWh' },
    'solana': { score: 7, reason: 'Proof of History + Proof of Stake, relatively energy efficient', energyPerTx: '0.00051 kWh' },
    'polkadot': { score: 8, reason: 'Nominated Proof of Stake consensus, low energy consumption', energyPerTx: '0.0017 kWh' },
    'chainlink': { score: 6, reason: 'Runs on Ethereum, inherits its sustainability improvements', energyPerTx: '0.0026 kWh' },
    'polygon': { score: 8, reason: 'Layer 2 solution with Proof of Stake, very energy efficient', energyPerTx: '0.00079 kWh' },
    'avalanche': { score: 7, reason: 'Avalanche consensus protocol, moderate energy usage', energyPerTx: '0.0005 kWh' }
  };

  private readonly riskDisclaimer = "\n\n⚠️ **IMPORTANT DISCLAIMER:** Cryptocurrency investments are extremely volatile and risky. Prices can fluctuate dramatically and you could lose your entire investment. This information is for educational purposes only and should not be considered financial advice. Always do your own research (DYOR) and never invest more than you can afford to lose. Consider consulting with a qualified financial advisor before making investment decisions.";

  async processQuery(query: string): Promise<AIResponse> {
    const lowerQuery = query.toLowerCase();
    
    try {
      if (this.isCryptoRelated(lowerQuery)) {
        return await this.handleCryptoQuery(lowerQuery);
      } else {
        return await this.handleGeneralQuery(query);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        message: "I'm experiencing some technical difficulties. Let me try to help you with what I know! Could you please rephrase your question or ask me something specific about cryptocurrency?",
        confidence: 0.5
      };
    }
  }

  private isCryptoRelated(query: string): boolean {
    const cryptoKeywords = [
      'bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'cryptocurrency', 'blockchain', 
      'price', 'market', 'trading', 'invest', 'buy', 'sell', 'wallet', 'mining',
      'defi', 'nft', 'altcoin', 'cardano', 'ada', 'solana', 'sol', 'polkadot', 'dot',
      'chainlink', 'link', 'polygon', 'matic', 'avalanche', 'avax', 'binance', 'bnb',
      'sustainable', 'energy', 'proof of stake', 'proof of work', 'staking',
      'market cap', 'volume', 'bull', 'bear', 'hodl', 'dca', 'portfolio'
    ];
    
    return cryptoKeywords.some(keyword => query.includes(keyword));
  }

  private async handleGeneralQuery(query: string): Promise<AIResponse> {
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium',
        {
          inputs: query,
          parameters: {
            max_length: 200,
            temperature: 0.7,
            do_sample: true
          }
        },
        {
          headers: {
            'Authorization': 'Bearer hf_demo',
            'Content-Type': 'application/json'
          },
          timeout: 10000
        }
      );

      if (response.data && response.data[0] && response.data[0].generated_text) {
        let aiResponse = response.data[0].generated_text.replace(query, '').trim();
        aiResponse = aiResponse.replace(/^[:\-\s]+/, '').trim();
        
        if (aiResponse.length < 10) {
          throw new Error('Response too short');
        }

        return {
          message: `🤖 ${aiResponse}\n\n💡 *I'm CryptoBuddy, specialized in cryptocurrency! For crypto-related questions, I can provide real-time market data and detailed analysis.*`,
          sources: ['Advanced AI Processing'],
          confidence: 0.8
        };
      } else {
        throw new Error('Invalid AI response');
      }
    } catch (error) {
      console.error('General AI query error:', error);
      return this.handleGeneralQueryFallback(query);
    }
  }

  private handleGeneralQueryFallback(query: string): AIResponse {
    const lowerQuery = query.toLowerCase();
    
    if (/^(hi|hello|hey|good morning|good afternoon|good evening)/.test(lowerQuery)) {
      return {
        message: "👋 Hello! I'm CryptoBuddy, your professional cryptocurrency intelligence platform! I can help you with real-time crypto prices, market analysis, investment insights, and general questions too. What would you like to know?",
        confidence: 0.9
      };
    }
    
    if (/how are you|how do you do/.test(lowerQuery)) {
      return {
        message: "I'm doing great, thank you for asking! 😊 I'm here and ready to help you navigate the exciting world of cryptocurrency. The markets are always moving, and I'm constantly analyzing the latest data to provide you with the best insights. How can I assist you today?",
        confidence: 0.9
      };
    }
    
    if (/what can you do|what are you|who are you|your capabilities/.test(lowerQuery)) {
      return {
        message: "🚀 I'm CryptoBuddy, your professional cryptocurrency intelligence platform! Here's what I can do:\n\n📊 **Crypto Expertise:**\n• Real-time price tracking & analysis\n• Market trends and predictions\n• Sustainability assessments\n• Investment guidance\n• Portfolio recommendations\n\n🤖 **General Intelligence:**\n• Answer general questions\n• Explain complex topics\n• Provide information on various subjects\n• Have conversations\n\n💡 **Special Features:**\n• Risk assessment and warnings\n• Educational content\n• News and market updates\n\nWhat would you like to explore?",
        confidence: 0.95
      };
    }
    
    if (/weather|temperature|rain|sunny|cloudy/.test(lowerQuery)) {
      return {
        message: "🌤️ I don't have access to real-time weather data, but I can tell you that the crypto markets are always experiencing their own kind of weather! 📈📉\n\nFor actual weather information, I'd recommend checking a weather app or website. But if you want to know about the 'market weather' - whether it's a bull or bear market - I'm your expert! 🐂🐻",
        confidence: 0.8
      };
    }
    
    if (/what time|current time|time is it/.test(lowerQuery)) {
      const currentTime = new Date().toLocaleString();
      return {
        message: `🕐 The current time is ${currentTime}.\n\n⏰ Fun fact: Cryptocurrency markets never sleep! They trade 24/7, 365 days a year. Unlike traditional stock markets, you can buy and sell crypto anytime. Would you like to check the current crypto prices?`,
        confidence: 0.9
      };
    }
    
    if (/calculate|math|plus|minus|multiply|divide|\+|\-|\*|\/|\d+/.test(lowerQuery)) {
      try {
        const mathExpression = lowerQuery.match(/[\d+\-*/\s().]+/);
        if (mathExpression) {
          const safeExpression = mathExpression[0].replace(/[^0-9+\-*/().\s]/g, '');
          if (safeExpression && /^[\d+\-*/().\s]+$/.test(safeExpression)) {
            const result = Function('"use strict"; return (' + safeExpression + ')')();
            return {
              message: `🧮 **Calculation Result:** ${safeExpression} = ${result}\n\n💰 Speaking of calculations, I can also help you calculate crypto profits, losses, and portfolio values! Just ask me about any cryptocurrency investment scenarios.`,
              confidence: 0.9
            };
          }
        }
      } catch (error) {
        // Fall through to default response
      }
    }
    
    return {
      message: `🤔 That's an interesting question! While I'm primarily specialized in cryptocurrency analysis and market data, I can try to help with general topics too.\n\n💡 **Here's what I'm best at:**\n• Cryptocurrency prices and analysis\n• Market trends and predictions\n• Investment advice and risk assessment\n• Blockchain technology explanations\n• General conversations\n\nCould you rephrase your question or ask me something about crypto? I'd love to show you my expertise! 🚀`,
      confidence: 0.6
    };
  }

  private async handleCryptoQuery(query: string): Promise<AIResponse> {
    try {
      if (this.isPriceQuery(query)) {
        return await this.handlePriceQuery(query);
      }
      
      if (this.isMarketAnalysisQuery(query)) {
        return await this.handleMarketAnalysis(query);
      }
      
      if (this.isSustainabilityQuery(query)) {
        return await this.handleSustainabilityQuery(query);
      }
      
      if (this.isInvestmentQuery(query)) {
        return await this.handleInvestmentQuery(query);
      }
      
      return await this.handleDefaultCryptoQuery(query);
      
    } catch (error) {
      console.error('Crypto query error:', error);
      return {
        message: "I'm having trouble accessing the latest market data right now. Let me provide you with some general crypto insights instead. What specific aspect of cryptocurrency would you like to learn about?" + this.riskDisclaimer,
        confidence: 0.5
      };
    }
  }

  private isPriceQuery(query: string): boolean {
    return /price|cost|worth|value|trading|current|how much/.test(query);
  }

  private isMarketAnalysisQuery(query: string): boolean {
    return /market|cap|volume|trend|analysis|performance|overview/.test(query);
  }

  private isSustainabilityQuery(query: string): boolean {
    return /sustainable|eco|green|environment|energy|carbon|climate/.test(query);
  }

  private isInvestmentQuery(query: string): boolean {
    return /invest|buy|sell|portfolio|profit|best|recommend|should i|strategy/.test(query);
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
          const change7d = coinData.market_data.price_change_percentage_7d;
          const marketCap = coinData.market_data.market_cap.usd;
          const volume = coinData.market_data.total_volume.usd;
          
          const priceAnalysis = this.getPriceAnalysis(change24h);
          const riskLevel = this.getRiskLevel(coinData.market_data.price_change_percentage_30d);
          
          return {
            message: `📊 **${coinData.name} (${coinData.symbol.toUpperCase()}) Live Analysis**\n\n` +
                    `💰 **Current Price:** ${cryptoAPI.formatPrice(price)}\n` +
                    `📈 **24h Change:** ${change24h > 0 ? '+' : ''}${change24h.toFixed(2)}%\n` +
                    `📅 **7d Change:** ${change7d > 0 ? '+' : ''}${change7d.toFixed(2)}%\n` +
                    `🏆 **Market Cap:** ${cryptoAPI.formatMarketCap(marketCap)}\n` +
                    `📊 **24h Volume:** ${cryptoAPI.formatMarketCap(volume)}\n` +
                    `🎯 **Market Rank:** #${coinData.market_cap_rank}\n\n` +
                    `📈 **Price Analysis:** ${priceAnalysis}\n` +
                    `⚠️ **Risk Level:** ${riskLevel}\n\n` +
                    `🕐 **Last Updated:** ${new Date().toLocaleTimeString()}` +
                    this.riskDisclaimer,
            data: coinData,
            sources: ['CoinGecko API - Real-time'],
            confidence: 0.95
          };
        }
      } catch (error) {
        console.error('Price query error:', error);
      }
    }
    
    const topCryptos = await cryptoAPI.getTopCryptocurrencies(8);
    const priceOverview = topCryptos.map((crypto, index) => 
      `${index + 1}. **${crypto.name}**: ${cryptoAPI.formatPrice(crypto.current_price)} (${crypto.price_change_percentage_24h > 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%)`
    ).join('\n');
    
    return {
      message: `📊 **Live Cryptocurrency Prices**\n\n${priceOverview}\n\n💡 *Ask me about a specific cryptocurrency for detailed analysis!*\n🔄 *Data updates every few minutes*` + this.riskDisclaimer,
      data: topCryptos,
      sources: ['CoinGecko API - Real-time'],
      confidence: 0.9
    };
  }

  private async handleMarketAnalysis(query: string): Promise<AIResponse> {
    const [globalData, topCryptos, trendingCoins] = await Promise.all([
      cryptoAPI.getGlobalMarketData(),
      cryptoAPI.getTopCryptocurrencies(15),
      cryptoAPI.getTrendingCryptocurrencies()
    ]);
    
    const totalMarketCap = globalData.data.total_market_cap.usd;
    const marketCapChange = globalData.data.market_cap_change_percentage_24h_usd;
    const btcDominance = globalData.data.market_cap_percentage.btc;
    const ethDominance = globalData.data.market_cap_percentage.eth;
    
    const gainers = topCryptos.filter(c => c.price_change_percentage_24h > 0);
    const losers = topCryptos.filter(c => c.price_change_percentage_24h < 0);
    const bigMovers = topCryptos.filter(c => Math.abs(c.price_change_percentage_24h) > 5);
    
    const marketSentiment = this.getDetailedMarketSentiment(marketCapChange, btcDominance, gainers.length, losers.length);
    
    return {
      message: `🌍 **Comprehensive Crypto Market Analysis**\n\n` +
              `💰 **Total Market Cap:** ${cryptoAPI.formatMarketCap(totalMarketCap)}\n` +
              `📊 **24h Change:** ${marketCapChange > 0 ? '+' : ''}${marketCapChange.toFixed(2)}%\n` +
              `₿ **Bitcoin Dominance:** ${btcDominance.toFixed(1)}%\n` +
              `⟠ **Ethereum Dominance:** ${ethDominance.toFixed(1)}%\n\n` +
              `📈 **Market Activity:**\n` +
              `• ${gainers.length} coins gaining (${((gainers.length/topCryptos.length)*100).toFixed(0)}%)\n` +
              `• ${losers.length} coins declining (${((losers.length/topCryptos.length)*100).toFixed(0)}%)\n` +
              `• ${bigMovers.length} coins with major moves (>5%)\n\n` +
              `🔥 **Top Trending:** ${trendingCoins.slice(0, 3).map(c => c.name).join(', ')}\n\n` +
              `${marketSentiment}\n\n` +
              `🕐 **Analysis Time:** ${new Date().toLocaleString()}` +
              this.riskDisclaimer,
      data: { globalData, topCryptos, trendingCoins },
      sources: ['CoinGecko API - Real-time', 'Market Analysis Engine'],
      confidence: 0.92
    };
  }

  private async handleSustainabilityQuery(query: string): Promise<AIResponse> {
    const cryptoName = this.extractCryptoName(query);
    
    if (cryptoName) {
      const sustainabilityInfo = this.sustainabilityData[cryptoName.toLowerCase()];
      if (sustainabilityInfo) {
        try {
          const searchResults = await cryptoAPI.searchCryptocurrency(cryptoName);
          if (searchResults.length > 0) {
            const coinData = await cryptoAPI.getCryptocurrencyData(searchResults[0].id);
            
            return {
              message: `🌱 **${coinData.name} Sustainability Deep Dive**\n\n` +
                      `♻️ **Sustainability Score:** ${sustainabilityInfo.score}/10\n` +
                      `⚡ **Energy per Transaction:** ${sustainabilityInfo.energyPerTx}\n` +
                      `📝 **Environmental Analysis:** ${sustainabilityInfo.reason}\n` +
                      `💰 **Current Price:** ${cryptoAPI.formatPrice(coinData.market_data.current_price.usd)}\n` +
                      `🏆 **Market Cap:** ${cryptoAPI.formatMarketCap(coinData.market_data.market_cap.usd)}\n\n` +
                      `${this.getSustainabilityRecommendations(sustainabilityInfo.score)}\n\n` +
                      `🌍 **Environmental Impact Comparison:**\n` +
                      `• Bitcoin: 741 kWh per transaction\n` +
                      `• ${coinData.name}: ${sustainabilityInfo.energyPerTx} per transaction\n` +
                      `• Traditional banking: ~263 kWh per transaction` +
                      this.riskDisclaimer,
              confidence: 0.9
            };
          }
        } catch (error) {
          console.error('Sustainability query error:', error);
        }
      }
    }
    
    const sustainableCoins = Object.entries(this.sustainabilityData)
      .sort(([,a], [,b]) => b.score - a.score)
      .slice(0, 6)
      .map(([coin, data], index) => 
        `${index + 1}. **${coin.charAt(0).toUpperCase() + coin.slice(1)}** - ${data.score}/10 (${data.energyPerTx})`
      ).join('\n');
    
    return {
      message: `🌱 **Most Sustainable Cryptocurrencies (2024)**\n\n${sustainableCoins}\n\n` +
              `💡 **Sustainability Factors:**\n` +
              `• **Consensus Mechanism:** Proof of Stake > Proof of Work\n` +
              `• **Energy Efficiency:** Lower kWh per transaction\n` +
              `• **Carbon Footprint:** Renewable energy usage\n` +
              `• **Network Optimization:** Efficient blockchain design\n` +
              `• **Scalability:** Layer 2 solutions and sharding\n\n` +
              `🌍 **Why It Matters:**\n` +
              `Traditional banking uses ~263 kWh per transaction, while modern PoS cryptocurrencies use less than 0.01 kWh. Choose eco-friendly options for a sustainable financial future!` +
              this.riskDisclaimer,
      confidence: 0.95
    };
  }

  private async handleInvestmentQuery(query: string): Promise<AIResponse> {
    const [topCryptos, globalData] = await Promise.all([
      cryptoAPI.getTopCryptocurrencies(20),
      cryptoAPI.getGlobalMarketData()
    ]);
    
    const marketTrend = globalData.data.market_cap_change_percentage_24h_usd > 0 ? 'bullish' : 'bearish';
    const strongPerformers = topCryptos.filter(c => c.price_change_percentage_24h > 5);
    const stableCoins = topCryptos.filter(c => Math.abs(c.price_change_percentage_24h) < 2);
    const highVolume = topCryptos.filter(c => c.total_volume > 1000000000);
    
    const volatileCoins = topCryptos.filter(c => Math.abs(c.price_change_percentage_24h) > 10);
    const marketCapTiers = {
      large: topCryptos.filter(c => c.market_cap > 10000000000),
      mid: topCryptos.filter(c => c.market_cap > 1000000000 && c.market_cap <= 10000000000),
      small: topCryptos.filter(c => c.market_cap <= 1000000000)
    };
    
    return {
      message: `💼 **Professional Investment Analysis & Strategy**\n\n` +
              `📊 **Current Market Conditions:**\n` +
              `• Sentiment: ${marketTrend.charAt(0).toUpperCase() + marketTrend.slice(1)} (${globalData.data.market_cap_change_percentage_24h_usd.toFixed(2)}%)\n` +
              `• Bitcoin Dominance: ${globalData.data.market_cap_percentage.btc.toFixed(1)}%\n` +
              `• Active Cryptocurrencies: ${globalData.data.active_cryptocurrencies.toLocaleString()}\n\n` +
              `🚀 **Strong Performers Today:**\n${strongPerformers.slice(0, 4).map(c => 
                `• ${c.name}: +${c.price_change_percentage_24h.toFixed(2)}% (${cryptoAPI.formatPrice(c.current_price)})`).join('\n')}\n\n` +
              `⚖️ **Stable Options (Low Volatility):**\n${stableCoins.slice(0, 3).map(c => 
                `• ${c.name}: ${c.price_change_percentage_24h.toFixed(2)}% (${cryptoAPI.formatMarketCap(c.market_cap)} cap)`).join('\n')}\n\n` +
              `💰 **High Liquidity (>$1B Volume):**\n${highVolume.slice(0, 3).map(c => 
                `• ${c.name}: ${cryptoAPI.formatMarketCap(c.total_volume)} volume`).join('\n')}\n\n` +
              `📈 **Investment Strategy Framework:**\n` +
              `• **Large Cap (>$10B):** ${marketCapTiers.large.length} options - Lower risk, steady growth\n` +
              `• **Mid Cap ($1B-$10B):** ${marketCapTiers.mid.length} options - Balanced risk/reward\n` +
              `• **Small Cap (<$1B):** ${marketCapTiers.small.length} options - Higher risk, potential high returns\n\n` +
              `💡 **Professional Investment Tips:**\n` +
              `• **Dollar-Cost Averaging (DCA):** Invest fixed amounts regularly\n` +
              `• **Portfolio Allocation:** 60% large cap, 30% mid cap, 10% small cap\n` +
              `• **Risk Management:** Never invest more than 5-10% of net worth\n` +
              `• **Diversification:** Spread across different blockchain ecosystems\n` +
              `• **Research:** Understand technology, team, and use cases\n` +
              `• **Time Horizon:** Crypto is best for long-term (3-5 years) investing\n\n` +
              `⚠️ **Current Risk Factors:**\n` +
              `• ${volatileCoins.length} coins showing high volatility (>10% moves)\n` +
              `• Regulatory uncertainty in various jurisdictions\n` +
              `• Market correlation with traditional assets during stress\n\n` +
              `🕐 **Analysis Time:** ${new Date().toLocaleString()}` +
              this.riskDisclaimer,
      data: { topCryptos, globalData, analysis: { strongPerformers, stableCoins, marketCapTiers } },
      sources: ['CoinGecko API', 'Professional Market Analysis', 'Risk Assessment Engine'],
      confidence: 0.88
    };
  }

  private async handleDefaultCryptoQuery(query: string): Promise<AIResponse> {
    const [topCryptos, globalData, trending] = await Promise.all([
      cryptoAPI.getTopCryptocurrencies(8),
      cryptoAPI.getGlobalMarketData(),
      cryptoAPI.getTrendingCryptocurrencies()
    ]);
    
    return {
      message: `🚀 **CryptoBuddy - Your Professional Crypto Intelligence Platform**\n\n` +
              `I'm here to help you navigate the cryptocurrency world with real-time data and expert analysis!\n\n` +
              `📊 **Current Market Snapshot:**\n` +
              `• Total Market Cap: ${cryptoAPI.formatMarketCap(globalData.data.total_market_cap.usd)}\n` +
              `• 24h Change: ${globalData.data.market_cap_change_percentage_24h_usd > 0 ? '+' : ''}${globalData.data.market_cap_change_percentage_24h_usd.toFixed(2)}%\n` +
              `• Bitcoin Dominance: ${globalData.data.market_cap_percentage.btc.toFixed(1)}%\n` +
              `• Trending: ${trending.slice(0, 3).map(c => c.name).join(', ')}\n\n` +
              `💡 **What I can help you with:**\n` +
              `• **Live Prices:** "What's Bitcoin's price?" or "ETH price analysis"\n` +
              `• **Market Analysis:** "Market overview" or "crypto market trends"\n` +
              `• **Investment Advice:** "Should I invest in Solana?" or "Best crypto to buy"\n` +
              `• **Sustainability:** "Most eco-friendly crypto" or "Cardano sustainability"\n` +
              `• **Comparisons:** "Bitcoin vs Ethereum" or "Compare ADA and SOL"\n` +
              `• **Education:** "What is DeFi?" or "Explain blockchain"\n` +
              `• **General Questions:** I can chat about anything!\n\n` +
              `🔥 **Popular Right Now:**\n${topCryptos.slice(0, 4).map((crypto, index) => 
                `${index + 1}. ${crypto.name}: ${cryptoAPI.formatPrice(crypto.current_price)} (${crypto.price_change_percentage_24h > 0 ? '+' : ''}${crypto.price_change_percentage_24h.toFixed(2)}%)`
              ).join('\n')}\n\n` +
              `What would you like to explore? 🌟` +
              this.riskDisclaimer,
      data: { topCryptos, globalData, trending },
      sources: ['CoinGecko API - Real-time'],
      confidence: 0.9
    };
  }

  private extractCryptoName(query: string): string | null {
    const cryptoNames = ['bitcoin', 'ethereum', 'cardano', 'solana', 'polkadot', 'chainlink', 'polygon', 'avalanche', 'binance', 'ripple', 'dogecoin', 'litecoin', 'btc', 'eth', 'ada', 'sol', 'dot', 'link', 'matic', 'avax', 'bnb', 'xrp', 'doge', 'ltc'];
    return cryptoNames.find(name => query.toLowerCase().includes(name)) || null;
  }

  private getPriceAnalysis(change24h: number): string {
    if (change24h > 10) {
      return `🚀 **Extremely bullish!** Massive gains suggest strong momentum and FOMO buying.`;
    } else if (change24h > 5) {
      return `📈 **Very bullish!** Strong upward movement with significant buying pressure.`;
    } else if (change24h > 2) {
      return `✅ **Bullish trend.** Healthy gains indicating positive sentiment.`;
    } else if (change24h > 0) {
      return `📊 **Slightly positive.** Minor gains, market showing stability.`;
    } else if (change24h > -2) {
      return `📉 **Minor correction.** Small decline, normal market fluctuation.`;
    } else if (change24h > -5) {
      return `⚠️ **Bearish pressure.** Notable decline, consider waiting for support.`;
    } else if (change24h > -10) {
      return `🔻 **Strong bearish.** Significant selling pressure, high risk period.`;
    } else {
      return `💥 **Extreme bearish!** Major crash conditions, extreme caution advised.`;
    }
  }

  private getRiskLevel(change30d: number): string {
    const absChange = Math.abs(change30d);
    if (absChange > 50) return "🔴 **EXTREME RISK** - Highly volatile";
    if (absChange > 30) return "🟠 **HIGH RISK** - Very volatile";
    if (absChange > 15) return "🟡 **MEDIUM RISK** - Moderately volatile";
    if (absChange > 5) return "🟢 **LOW-MEDIUM RISK** - Relatively stable";
    return "🔵 **LOW RISK** - Very stable";
  }

  private getDetailedMarketSentiment(marketCapChange: number, btcDominance: number, gainersCount: number, losersCount: number): string {
    let sentiment = '';
    
    if (marketCapChange > 5) {
      sentiment += `🚀 **EXTREMELY BULLISH MARKET** - Massive capital inflow, euphoric conditions\n`;
    } else if (marketCapChange > 2) {
      sentiment += `📈 **STRONG BULL MARKET** - Significant buying pressure across the board\n`;
    } else if (marketCapChange > 0) {
      sentiment += `✅ **MODERATELY BULLISH** - Positive momentum with steady growth\n`;
    } else if (marketCapChange > -2) {
      sentiment += `⚖️ **NEUTRAL MARKET** - Mixed signals, consolidation phase\n`;
    } else if (marketCapChange > -5) {
      sentiment += `📉 **BEARISH PRESSURE** - Selling dominates, risk-off sentiment\n`;
    } else {
      sentiment += `🔻 **STRONG BEAR MARKET** - Heavy selling, fear dominates\n`;
    }
    
    if (btcDominance > 60) {
      sentiment += `₿ **Bitcoin flight to safety** - Investors seeking stability in BTC\n`;
    } else if (btcDominance > 45) {
      sentiment += `⚖️ **Balanced market** - Healthy distribution between BTC and alts\n`;
    } else {
      sentiment += `🌟 **ALT SEASON ACTIVE** - Altcoins outperforming Bitcoin\n`;
    }
    
    const totalCoins = gainersCount + losersCount;
    const gainersPercentage = (gainersCount / totalCoins) * 100;
    
    if (gainersPercentage > 70) {
      sentiment += `📊 **Broad market rally** - ${gainersPercentage.toFixed(0)}% of coins gaining`;
    } else if (gainersPercentage > 50) {
      sentiment += `📊 **Mixed but positive** - ${gainersPercentage.toFixed(0)}% of coins gaining`;
    } else if (gainersPercentage > 30) {
      sentiment += `📊 **Mixed market** - ${gainersPercentage.toFixed(0)}% of coins gaining`;
    } else {
      sentiment += `📊 **Broad market decline** - Only ${gainersPercentage.toFixed(0)}% of coins gaining`;
    }
    
    return sentiment;
  }

  private getSustainabilityRecommendations(score: number): string {
    if (score >= 8) {
      return `✅ **EXCELLENT CHOICE** for eco-conscious investors! This cryptocurrency demonstrates outstanding environmental responsibility with minimal energy consumption.`;
    } else if (score >= 6) {
      return `👍 **GOOD SUSTAINABILITY** profile. A solid choice for environmentally aware investors seeking balance.`;
    } else if (score >= 4) {
      return `⚠️ **MODERATE IMPACT.** Consider the environmental trade-offs against potential returns.`;
    } else {
      return `🚨 **HIGH ENVIRONMENTAL IMPACT.** Consider more sustainable alternatives if environmental factors are important to you.`;
    }
  }
}

export const aiService = new CryptoBuddyAIService();