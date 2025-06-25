import { cryptoAPI } from './CryptoAPI';
import axios from 'axios';

export interface AIResponse {
  message: string;
  data?: any;
  sources?: string[];
  confidence?: number;
}

class CryptoBudAIService {
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

  // If-else logic for conversation flow
  private readonly conversationPatterns = {
    greetings: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
    farewells: ['bye', 'goodbye', 'see you', 'farewell', 'take care'],
    thanks: ['thank you', 'thanks', 'appreciate', 'grateful'],
    help: ['help', 'assist', 'support', 'guide'],
    capabilities: ['what can you do', 'your features', 'abilities', 'functions']
  };

  // Enhanced AI models for different use cases
  private readonly aiModels = {
    conversational: 'microsoft/DialoGPT-medium',
    general: 'microsoft/DialoGPT-large',
    creative: 'gpt2',
    fallback: 'distilbert-base-uncased-finetuned-sst-2-english'
  };

  async processQuery(query: string): Promise<AIResponse> {
    const lowerQuery = query.toLowerCase();
    
    try {
      // If-else conversation flow logic
      if (this.matchesPattern(lowerQuery, this.conversationPatterns.greetings)) {
        return this.handleGreeting();
      } else if (this.matchesPattern(lowerQuery, this.conversationPatterns.farewells)) {
        return this.handleFarewell();
      } else if (this.matchesPattern(lowerQuery, this.conversationPatterns.thanks)) {
        return this.handleThanks();
      } else if (this.matchesPattern(lowerQuery, this.conversationPatterns.help)) {
        return this.handleHelpRequest();
      } else if (this.matchesPattern(lowerQuery, this.conversationPatterns.capabilities)) {
        return this.handleCapabilitiesQuery();
      } else if (this.isCryptoRelated(lowerQuery)) {
        return await this.handleCryptoQuery(lowerQuery);
      } else {
        // Enhanced general query handling with multiple AI models
        return await this.handleGeneralQueryWithAI(query);
      }
    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        message: "I'm experiencing some technical difficulties. Let me try to help you with what I know! Could you please rephrase your question or ask me something specific about cryptocurrency?",
        confidence: 0.5
      };
    }
  }

  private matchesPattern(query: string, patterns: string[]): boolean {
    return patterns.some(pattern => query.includes(pattern));
  }

  private handleGreeting(): AIResponse {
    const greetings = [
      "👋 Hello! I'm CryptoBud, your proprietary cryptocurrency intelligence platform! I'm here to help you navigate the crypto world with real-time data and expert analysis. What would you like to explore today?",
      "🚀 Hey there! Welcome to CryptoBud! I can provide you with live crypto prices, market analysis, investment insights, and answer any questions you have. How can I assist you?",
      "✨ Hi! I'm CryptoBud, your advanced AI crypto assistant. I'm equipped with real-time market data and can help with everything from price analysis to investment strategies. What interests you most?"
    ];
    
    return {
      message: greetings[Math.floor(Math.random() * greetings.length)],
      confidence: 0.95
    };
  }

  private handleFarewell(): AIResponse {
    const farewells = [
      "👋 Goodbye! Thanks for using CryptoBud. Remember to always do your own research before making any investment decisions. Come back anytime for the latest crypto insights!",
      "🌟 Take care! I hope our conversation was helpful. Keep an eye on the markets and invest wisely. CryptoBud is here whenever you need crypto intelligence!",
      "💫 See you later! Stay informed, stay safe, and remember - never invest more than you can afford to lose. CryptoBud will be here when you return!"
    ];
    
    return {
      message: farewells[Math.floor(Math.random() * farewells.length)],
      confidence: 0.95
    };
  }

  private handleThanks(): AIResponse {
    const responses = [
      "🙏 You're very welcome! I'm glad I could help. CryptoBud is always here to provide you with the latest crypto insights and analysis. Feel free to ask me anything else!",
      "😊 My pleasure! That's what I'm here for. If you have any more questions about cryptocurrency or need market analysis, just let me know!",
      "✨ Happy to help! CryptoBud's mission is to make crypto investing more informed and accessible. Don't hesitate to reach out with more questions!"
    ];
    
    return {
      message: responses[Math.floor(Math.random() * responses.length)],
      confidence: 0.95
    };
  }

  private handleHelpRequest(): AIResponse {
    return {
      message: `🆘 **CryptoBud Help Center**\n\nI'm here to assist you with:\n\n📊 **Crypto Analysis:**\n• Real-time prices and market data\n• Technical analysis and trends\n• Market cap and volume information\n\n💰 **Investment Guidance:**\n• Portfolio recommendations\n• Risk assessments\n• Profit/loss calculations\n\n🌱 **Sustainability Insights:**\n• Energy consumption analysis\n• Eco-friendly crypto rankings\n• Environmental impact scores\n\n🤖 **General Assistance:**\n• Answer questions on any topic\n• Explain complex concepts\n• Provide educational content\n• Have natural conversations\n\n💡 **How to use me:**\n• Ask specific questions like "What's Bitcoin's price?"\n• Request comparisons like "Compare ETH vs ADA"\n• Seek advice like "Should I invest in Solana?"\n• Ask general questions like "What's the weather like?"\n• Or just chat naturally!\n\nWhat would you like help with specifically?`,
      confidence: 0.95
    };
  }

  private handleCapabilitiesQuery(): AIResponse {
    return {
      message: `🚀 **CryptoBud Capabilities Overview**\n\nI'm a proprietary AI-powered cryptocurrency intelligence platform with advanced features:\n\n🧠 **AI Decision-Making:**\n• Pattern recognition in market data\n• Sentiment analysis of queries\n• Risk assessment algorithms\n• Predictive modeling for trends\n• General conversation abilities\n\n📊 **Real-Time Data Processing:**\n• Live price feeds from CoinGecko API\n• Market cap and volume analysis\n• Technical indicator calculations\n• News sentiment integration\n\n🌱 **Sustainability Analysis:**\n• Energy consumption tracking\n• Environmental impact scoring\n• Eco-friendly investment recommendations\n\n💼 **Investment Intelligence:**\n• Portfolio optimization suggestions\n• Risk-reward analysis\n• Market timing insights\n• Diversification strategies\n\n🗣️ **Natural Language Processing:**\n• Understanding complex queries\n• Context-aware responses\n• Multi-intent recognition\n• Conversation flow management\n• General knowledge Q&A\n\n🤖 **General AI Assistant:**\n• Answer questions on any topic\n• Help with calculations and problem-solving\n• Provide explanations and educational content\n• Engage in natural conversations\n\nI combine if-else logic with advanced AI to provide accurate, helpful responses tailored to your needs!`,
      confidence: 0.95
    };
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

  private async handleGeneralQueryWithAI(query: string): Promise<AIResponse> {
    // Try multiple AI approaches for better coverage
    const approaches = [
      () => this.tryHuggingFaceAPI(query),
      () => this.tryOpenAICompatibleAPI(query),
      () => this.handleSpecialCases(query),
      () => this.generateSmartFallback(query)
    ];

    for (const approach of approaches) {
      try {
        const result = await approach();
        if (result && result.message.length > 10) {
          return result;
        }
      } catch (error) {
        console.log('Trying next AI approach...');
        continue;
      }
    }

    // Final fallback
    return this.generateIntelligentFallback(query);
  }

  private async tryHuggingFaceAPI(query: string): Promise<AIResponse> {
    const models = [
      'microsoft/DialoGPT-medium',
      'microsoft/DialoGPT-large',
      'facebook/blenderbot-400M-distill'
    ];

    for (const model of models) {
      try {
        const response = await axios.post(
          `https://api-inference.huggingface.co/models/${model}`,
          {
            inputs: query,
            parameters: {
              max_length: 200,
              temperature: 0.7,
              do_sample: true,
              pad_token_id: 50256
            }
          },
          {
            headers: {
              'Authorization': 'Bearer hf_demo',
              'Content-Type': 'application/json'
            },
            timeout: 15000
          }
        );

        if (response.data && response.data[0] && response.data[0].generated_text) {
          let aiResponse = response.data[0].generated_text.replace(query, '').trim();
          aiResponse = aiResponse.replace(/^[:\-\s]+/, '').trim();
          
          if (aiResponse.length > 10 && !aiResponse.includes('undefined')) {
            return {
              message: `🤖 ${aiResponse}\n\n💡 *I'm CryptoBud, specialized in cryptocurrency! For crypto-related questions, I can provide real-time market data and detailed analysis.*`,
              sources: [`Hugging Face ${model}`],
              confidence: 0.8
            };
          }
        }
      } catch (error) {
        console.log(`Model ${model} failed, trying next...`);
        continue;
      }
    }

    throw new Error('All Hugging Face models failed');
  }

  private async tryOpenAICompatibleAPI(query: string): Promise<AIResponse> {
    // Try free OpenAI-compatible APIs
    const apis = [
      {
        url: 'https://api.deepseek.com/v1/chat/completions',
        key: 'demo'
      }
    ];

    for (const api of apis) {
      try {
        const response = await axios.post(
          api.url,
          {
            model: 'deepseek-chat',
            messages: [
              {
                role: 'system',
                content: 'You are a helpful AI assistant. Provide concise, accurate, and friendly responses.'
              },
              {
                role: 'user',
                content: query
              }
            ],
            max_tokens: 150,
            temperature: 0.7
          },
          {
            headers: {
              'Authorization': `Bearer ${api.key}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000
          }
        );

        if (response.data?.choices?.[0]?.message?.content) {
          return {
            message: `🤖 ${response.data.choices[0].message.content}\n\n💡 *I'm CryptoBud, specialized in cryptocurrency! For crypto-related questions, I can provide real-time market data and detailed analysis.*`,
            sources: ['DeepSeek AI'],
            confidence: 0.85
          };
        }
      } catch (error) {
        console.log('OpenAI-compatible API failed, trying next...');
        continue;
      }
    }

    throw new Error('All OpenAI-compatible APIs failed');
  }

  private handleSpecialCases(query: string): AIResponse {
    const lowerQuery = query.toLowerCase();
    
    // Math calculations
    if (/calculate|math|plus|minus|multiply|divide|\+|\-|\*|\/|\d+/.test(lowerQuery)) {
      try {
        const mathExpression = lowerQuery.match(/[\d+\-*/\s().]+/);
        if (mathExpression) {
          const safeExpression = mathExpression[0].replace(/[^0-9+\-*/().\s]/g, '');
          if (safeExpression && /^[\d+\-*/().\s]+$/.test(safeExpression)) {
            const result = Function('"use strict"; return (' + safeExpression + ')')();
            return {
              message: `🧮 **Calculation Result:** ${safeExpression} = ${result}\n\n💰 Speaking of calculations, I can also help you calculate crypto profits, losses, and portfolio values! Just ask me about any cryptocurrency investment scenarios.`,
              confidence: 0.95
            };
          }
        }
      } catch (error) {
        // Fall through to other methods
      }
    }

    // Time queries
    if (/what time|current time|time is it/.test(lowerQuery)) {
      const currentTime = new Date().toLocaleString();
      return {
        message: `🕐 The current time is ${currentTime}.\n\n⏰ Fun fact: Cryptocurrency markets never sleep! They trade 24/7, 365 days a year. Unlike traditional stock markets, you can buy and sell crypto anytime. Would you like to check the current crypto prices?`,
        confidence: 0.9
      };
    }

    // Weather queries
    if (/weather|temperature|rain|sunny|cloudy/.test(lowerQuery)) {
      return {
        message: "🌤️ I don't have access to real-time weather data, but I can tell you that the crypto markets are always experiencing their own kind of weather! 📈📉\n\nFor actual weather information, I'd recommend checking a weather app or website. But if you want to know about the 'market weather' - whether it's a bull or bear market - I'm your expert! 🐂🐻",
        confidence: 0.8
      };
    }

    // Programming questions
    if (/code|programming|javascript|python|html|css/.test(lowerQuery)) {
      return {
        message: "💻 I can help with basic programming concepts! While I'm primarily specialized in cryptocurrency analysis, I have knowledge of various programming languages and concepts.\n\n🚀 **What I can help with:**\n• JavaScript, Python, HTML, CSS basics\n• General programming concepts\n• Code explanations\n• Algorithm discussions\n\nFor advanced programming help, I'd recommend specialized coding platforms. But feel free to ask me anything, and I'll do my best to help!\n\n💡 *Did you know? Many cryptocurrencies are built using different programming languages - Bitcoin uses C++, Ethereum uses Solidity for smart contracts!*",
        confidence: 0.7
      };
    }

    throw new Error('No special case matched');
  }

  private generateSmartFallback(query: string): AIResponse {
    const keywords = query.toLowerCase().split(' ').filter(word => word.length > 3);
    const responses = [
      `That's an interesting question about ${keywords[0] || 'that topic'}! While I'm primarily specialized in cryptocurrency analysis, I'll do my best to help.`,
      `I understand you're asking about ${keywords.slice(0, 2).join(' and ') || 'that subject'}. Let me share what I know and see how I can assist you.`,
      `Great question! While my expertise is in cryptocurrency and blockchain technology, I can certainly try to help with ${keywords[0] || 'your question'}.`
    ];

    const baseResponse = responses[Math.floor(Math.random() * responses.length)];
    
    return {
      message: `🤔 ${baseResponse}\n\n💡 **Here's what I'm best at:**\n• Cryptocurrency prices and analysis\n• Market trends and predictions\n• Investment advice and risk assessment\n• Blockchain technology explanations\n• General conversations and Q&A\n\nCould you provide more details about what you'd like to know? I'm here to help! 🚀`,
      confidence: 0.6
    };
  }

  private generateIntelligentFallback(query: string): AIResponse {
    const queryLength = query.split(' ').length;
    const hasQuestion = query.includes('?');
    
    let response = "🤖 I'm CryptoBud, your advanced AI assistant! ";
    
    if (queryLength < 3) {
      response += "I'd love to help you with that. Could you provide a bit more detail about what you're looking for?";
    } else if (hasQuestion) {
      response += "That's a thoughtful question! While I specialize in cryptocurrency analysis, I'm equipped to help with a wide range of topics.";
    } else {
      response += "I understand what you're getting at. Let me see how I can best assist you with that.";
    }

    response += "\n\n💡 **I can help you with:**\n";
    response += "• Cryptocurrency analysis and market data\n";
    response += "• Investment strategies and risk assessment\n";
    response += "• General questions and conversations\n";
    response += "• Calculations and problem-solving\n";
    response += "• Educational content and explanations\n\n";
    response += "What specific aspect would you like to explore? I'm here to provide the best assistance possible! 🌟";

    return {
      message: response,
      confidence: 0.7
    };
  }

  private async handleCryptoQuery(query: string): Promise<AIResponse> {
    try {
      if (this.isPriceQuery(query)) {
        return await this.handlePriceQuery(query);
      } else if (this.isMarketAnalysisQuery(query)) {
        return await this.handleMarketAnalysis(query);
      } else if (this.isSustainabilityQuery(query)) {
        return await this.handleSustainabilityQuery(query);
      } else if (this.isInvestmentQuery(query)) {
        return await this.handleInvestmentQuery(query);
      } else {
        return await this.handleDefaultCryptoQuery(query);
      }
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
      message: `🚀 **CryptoBud - Your Proprietary Crypto Intelligence Platform**\n\n` +
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

export const aiService = new CryptoBudAIService();