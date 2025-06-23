#!/usr/bin/env python3
"""
CryptoBud Python ChatterBot Integration
Proprietary cryptocurrency chatbot with advanced conversation flow
"""

from chatterbot import ChatBot
from chatterbot.trainers import ChatterBotCorpusTrainer, ListTrainer
import requests
import json
import re
from datetime import datetime

class CryptoBudBot:
    def __init__(self):
        """Initialize the CryptoBud chatbot with ChatterBot"""
        self.chatbot = ChatBot(
            'CryptoBud',
            storage_adapter='chatterbot.storage.SQLStorageAdapter',
            database_uri='sqlite:///cryptobud.sqlite3',
            logic_adapters=[
                {
                    'import_path': 'chatterbot.logic.BestMatch',
                    'default_response': 'I am still learning. Could you please rephrase your question about cryptocurrency?',
                    'maximum_similarity_threshold': 0.90
                },
                {
                    'import_path': 'chatterbot.logic.MathematicalEvaluation',
                },
                {
                    'import_path': 'chatterbot.logic.TimeLogicAdapter',
                }
            ]
        )
        
        # Train the bot with crypto-specific conversations
        self.train_crypto_knowledge()
        
        # Crypto API configuration
        self.coingecko_api = "https://api.coingecko.com/api/v3"
        
    def train_crypto_knowledge(self):
        """Train the bot with cryptocurrency-specific knowledge"""
        trainer = ListTrainer(self.chatbot)
        
        # Crypto conversation training data
        crypto_conversations = [
            "Hello",
            "Hi! I'm CryptoBud, your proprietary cryptocurrency intelligence platform. How can I help you today?",
            
            "What is Bitcoin?",
            "Bitcoin is the first and largest cryptocurrency by market cap. It uses Proof of Work consensus and was created by Satoshi Nakamoto in 2009.",
            
            "What is Ethereum?",
            "Ethereum is a blockchain platform that enables smart contracts and decentralized applications. It recently transitioned to Proof of Stake consensus.",
            
            "Should I invest in crypto?",
            "Cryptocurrency investments are extremely risky and volatile. Always do your own research and never invest more than you can afford to lose. Consider consulting a financial advisor.",
            
            "What is the most sustainable crypto?",
            "Cardano and Ethereum are among the most sustainable cryptocurrencies due to their Proof of Stake consensus mechanisms, which use significantly less energy than Bitcoin's Proof of Work.",
            
            "How do I buy cryptocurrency?",
            "You can buy cryptocurrency through exchanges like Coinbase, Binance, or Kraken. Always use reputable exchanges and secure your assets in a hardware wallet.",
            
            "What is blockchain?",
            "Blockchain is a distributed ledger technology that records transactions across multiple computers in a way that makes them difficult to alter or hack.",
            
            "Thank you",
            "You're welcome! Remember to always do your own research before making any investment decisions. Stay safe in the crypto world!",
            
            "Goodbye",
            "Goodbye! Thanks for using CryptoBud. Come back anytime for the latest crypto insights and analysis!"
        ]
        
        trainer.train(crypto_conversations)
        
        # Train with general English corpus for better conversation flow
        corpus_trainer = ChatterBotCorpusTrainer(self.chatbot)
        corpus_trainer.train("chatterbot.corpus.english.greetings")
        corpus_trainer.train("chatterbot.corpus.english.conversations")
        
    def get_crypto_price(self, crypto_name):
        """Fetch real-time cryptocurrency price from CoinGecko API"""
        try:
            # Convert common names to CoinGecko IDs
            crypto_ids = {
                'bitcoin': 'bitcoin',
                'btc': 'bitcoin',
                'ethereum': 'ethereum',
                'eth': 'ethereum',
                'cardano': 'cardano',
                'ada': 'cardano',
                'solana': 'solana',
                'sol': 'solana'
            }
            
            crypto_id = crypto_ids.get(crypto_name.lower(), crypto_name.lower())
            
            url = f"{self.coingecko_api}/simple/price"
            params = {
                'ids': crypto_id,
                'vs_currencies': 'usd',
                'include_24hr_change': 'true'
            }
            
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            if crypto_id in data:
                price = data[crypto_id]['usd']
                change = data[crypto_id].get('usd_24h_change', 0)
                
                return {
                    'price': price,
                    'change_24h': change,
                    'formatted_price': f"${price:,.2f}",
                    'formatted_change': f"{change:+.2f}%"
                }
            else:
                return None
                
        except Exception as e:
            print(f"Error fetching price data: {e}")
            return None
    
    def is_crypto_price_query(self, message):
        """Check if the message is asking for cryptocurrency price"""
        price_patterns = [
            r'price of (\w+)',
            r'(\w+) price',
            r'how much is (\w+)',
            r'(\w+) cost',
            r'current (\w+) price'
        ]
        
        for pattern in price_patterns:
            match = re.search(pattern, message.lower())
            if match:
                return match.group(1)
        return None
    
    def is_crypto_related(self, message):
        """Check if the message is cryptocurrency-related"""
        crypto_keywords = [
            'bitcoin', 'btc', 'ethereum', 'eth', 'crypto', 'cryptocurrency',
            'blockchain', 'cardano', 'ada', 'solana', 'sol', 'investment',
            'trading', 'market', 'price', 'buy', 'sell', 'wallet'
        ]
        
        return any(keyword in message.lower() for keyword in crypto_keywords)
    
    def get_response(self, message):
        """Get response from the chatbot with enhanced crypto logic"""
        
        # Check for crypto price queries first
        crypto_name = self.is_crypto_price_query(message)
        if crypto_name:
            price_data = self.get_crypto_price(crypto_name)
            if price_data:
                return f"💰 {crypto_name.upper()} is currently trading at {price_data['formatted_price']} (24h change: {price_data['formatted_change']}). Remember, crypto prices are highly volatile!"
            else:
                return f"I couldn't fetch the current price for {crypto_name}. Please check the spelling or try a different cryptocurrency."
        
        # If-else logic for specific crypto queries
        message_lower = message.lower()
        
        if 'sustainable' in message_lower or 'eco' in message_lower or 'green' in message_lower:
            return "🌱 The most sustainable cryptocurrencies are those using Proof of Stake consensus like Cardano (ADA), Ethereum 2.0, and Solana. They use 99% less energy than Bitcoin!"
        
        elif 'risky' in message_lower or 'risk' in message_lower:
            return "⚠️ Cryptocurrency investments are extremely risky! Prices can fluctuate wildly, you could lose everything, and the market is largely unregulated. Never invest more than you can afford to lose!"
        
        elif 'best crypto' in message_lower or 'which crypto' in message_lower:
            return "🎯 I can't recommend specific investments, but consider factors like: technology, team, use case, market cap, and sustainability. Popular options include Bitcoin (store of value), Ethereum (smart contracts), and Cardano (sustainability). Always do your own research!"
        
        elif 'defi' in message_lower:
            return "🏦 DeFi (Decentralized Finance) refers to financial services built on blockchain technology, eliminating traditional intermediaries like banks. Examples include lending, borrowing, and trading on platforms like Uniswap and Compound."
        
        elif 'nft' in message_lower:
            return "🎨 NFTs (Non-Fungible Tokens) are unique digital assets stored on blockchain. They can represent art, collectibles, or other digital items. The market is highly speculative and volatile."
        
        # Use ChatterBot for general conversation
        response = self.chatbot.get_response(message)
        
        # Add crypto disclaimer for crypto-related queries
        if self.is_crypto_related(message):
            return f"{response}\n\n⚠️ Remember: Cryptocurrency investments are high-risk. Always do your own research!"
        
        return str(response)

def main():
    """Main function to run the CryptoBud chatbot"""
    print("🚀 CryptoBud - Proprietary Cryptocurrency Intelligence Platform")
    print("=" * 60)
    print("Welcome! I'm your AI crypto assistant with real-time data.")
    print("Ask me about prices, sustainability, or general crypto questions.")
    print("Type 'quit' to exit.\n")
    
    bot = CryptoBudBot()
    
    while True:
        try:
            user_input = input("You: ").strip()
            
            if user_input.lower() in ['quit', 'exit', 'bye']:
                print("CryptoBud: Thanks for using CryptoBud! Stay safe in the crypto world! 👋")
                break
            
            if user_input:
                response = bot.get_response(user_input)
                print(f"CryptoBud: {response}\n")
            
        except KeyboardInterrupt:
            print("\nCryptoBud: Goodbye! 👋")
            break
        except Exception as e:
            print(f"CryptoBud: Sorry, I encountered an error: {e}")

if __name__ == "__main__":
    main()