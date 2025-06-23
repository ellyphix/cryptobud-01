#!/usr/bin/env python3
"""
CryptoBud Advanced Crypto Analysis Module
Proprietary cryptocurrency analysis with if-else decision logic
"""

import requests
import json
from datetime import datetime, timedelta
import statistics

class CryptoAnalyzer:
    def __init__(self):
        """Initialize the crypto analyzer with API endpoints"""
        self.coingecko_api = "https://api.coingecko.com/api/v3"
        self.sustainability_scores = {
            'bitcoin': {'score': 3, 'energy_per_tx': '741 kWh', 'consensus': 'Proof of Work'},
            'ethereum': {'score': 8, 'energy_per_tx': '0.0026 kWh', 'consensus': 'Proof of Stake'},
            'cardano': {'score': 9, 'energy_per_tx': '0.0015 kWh', 'consensus': 'Proof of Stake'},
            'solana': {'score': 7, 'energy_per_tx': '0.00051 kWh', 'consensus': 'Proof of History + PoS'},
            'polkadot': {'score': 8, 'energy_per_tx': '0.0017 kWh', 'consensus': 'Nominated Proof of Stake'},
            'polygon': {'score': 8, 'energy_per_tx': '0.00079 kWh', 'consensus': 'Proof of Stake'}
        }
    
    def analyze_price_trend(self, crypto_id, days=7):
        """Analyze price trend using if-else logic"""
        try:
            url = f"{self.coingecko_api}/coins/{crypto_id}/market_chart"
            params = {'vs_currency': 'usd', 'days': days}
            
            response = requests.get(url, params=params, timeout=10)
            data = response.json()
            
            prices = [price[1] for price in data['prices']]
            
            if len(prices) < 2:
                return "insufficient_data"
            
            # Calculate trend using if-else logic
            start_price = prices[0]
            end_price = prices[-1]
            change_percent = ((end_price - start_price) / start_price) * 100
            
            # Volatility analysis
            price_changes = []
            for i in range(1, len(prices)):
                change = ((prices[i] - prices[i-1]) / prices[i-1]) * 100
                price_changes.append(abs(change))
            
            volatility = statistics.mean(price_changes) if price_changes else 0
            
            # If-else decision logic for trend classification
            if change_percent > 10:
                trend = "strongly_bullish"
            elif change_percent > 3:
                trend = "bullish"
            elif change_percent > -3:
                trend = "sideways"
            elif change_percent > -10:
                trend = "bearish"
            else:
                trend = "strongly_bearish"
            
            # Risk assessment using if-else logic
            if volatility > 15:
                risk_level = "very_high"
            elif volatility > 10:
                risk_level = "high"
            elif volatility > 5:
                risk_level = "medium"
            else:
                risk_level = "low"
            
            return {
                'trend': trend,
                'change_percent': round(change_percent, 2),
                'volatility': round(volatility, 2),
                'risk_level': risk_level,
                'start_price': round(start_price, 2),
                'end_price': round(end_price, 2)
            }
            
        except Exception as e:
            print(f"Error analyzing price trend: {e}")
            return None
    
    def get_investment_recommendation(self, crypto_id):
        """Generate investment recommendation using if-else decision logic"""
        try:
            # Get current market data
            url = f"{self.coingecko_api}/coins/{crypto_id}"
            response = requests.get(url, timeout=10)
            data = response.json()
            
            # Extract key metrics
            market_cap_rank = data.get('market_cap_rank', 999)
            price_change_24h = data['market_data']['price_change_percentage_24h']
            price_change_7d = data['market_data']['price_change_percentage_7d']
            price_change_30d = data['market_data']['price_change_percentage_30d']
            market_cap = data['market_data']['market_cap']['usd']
            
            # Get trend analysis
            trend_analysis = self.analyze_price_trend(crypto_id)
            
            if not trend_analysis:
                return "Unable to analyze - insufficient data"
            
            # If-else decision logic for investment recommendation
            recommendation_score = 0
            reasons = []
            
            # Market cap ranking factor
            if market_cap_rank <= 10:
                recommendation_score += 3
                reasons.append("Top 10 cryptocurrency by market cap")
            elif market_cap_rank <= 50:
                recommendation_score += 2
                reasons.append("Established cryptocurrency (top 50)")
            elif market_cap_rank <= 100:
                recommendation_score += 1
                reasons.append("Mid-cap cryptocurrency")
            else:
                recommendation_score -= 1
                reasons.append("Small-cap cryptocurrency (higher risk)")
            
            # Price trend factor
            if trend_analysis['trend'] == "strongly_bullish":
                recommendation_score += 2
                reasons.append("Strong upward price momentum")
            elif trend_analysis['trend'] == "bullish":
                recommendation_score += 1
                reasons.append("Positive price trend")
            elif trend_analysis['trend'] == "strongly_bearish":
                recommendation_score -= 2
                reasons.append("Strong downward price trend")
            elif trend_analysis['trend'] == "bearish":
                recommendation_score -= 1
                reasons.append("Negative price trend")
            
            # Volatility factor
            if trend_analysis['risk_level'] == "very_high":
                recommendation_score -= 2
                reasons.append("Very high volatility (extreme risk)")
            elif trend_analysis['risk_level'] == "high":
                recommendation_score -= 1
                reasons.append("High volatility")
            elif trend_analysis['risk_level'] == "low":
                recommendation_score += 1
                reasons.append("Low volatility (more stable)")
            
            # Sustainability factor
            sustainability = self.sustainability_scores.get(crypto_id, {'score': 5})
            if sustainability['score'] >= 8:
                recommendation_score += 1
                reasons.append("Highly sustainable (eco-friendly)")
            elif sustainability['score'] <= 3:
                recommendation_score -= 1
                reasons.append("Low sustainability score")
            
            # Final recommendation using if-else logic
            if recommendation_score >= 4:
                recommendation = "STRONG BUY"
                risk_warning = "Consider for long-term investment"
            elif recommendation_score >= 2:
                recommendation = "BUY"
                risk_warning = "Good investment potential with moderate risk"
            elif recommendation_score >= 0:
                recommendation = "HOLD/NEUTRAL"
                risk_warning = "Mixed signals - proceed with caution"
            elif recommendation_score >= -2:
                recommendation = "WEAK SELL"
                risk_warning = "High risk - consider reducing position"
            else:
                recommendation = "STRONG SELL"
                risk_warning = "Very high risk - avoid or exit position"
            
            return {
                'recommendation': recommendation,
                'score': recommendation_score,
                'reasons': reasons,
                'risk_warning': risk_warning,
                'trend_analysis': trend_analysis,
                'sustainability': sustainability,
                'market_cap_rank': market_cap_rank
            }
            
        except Exception as e:
            print(f"Error generating recommendation: {e}")
            return None
    
    def compare_cryptocurrencies(self, crypto1_id, crypto2_id):
        """Compare two cryptocurrencies using if-else logic"""
        try:
            rec1 = self.get_investment_recommendation(crypto1_id)
            rec2 = self.get_investment_recommendation(crypto2_id)
            
            if not rec1 or not rec2:
                return "Unable to compare - insufficient data"
            
            comparison = {
                'crypto1': {'id': crypto1_id, 'data': rec1},
                'crypto2': {'id': crypto2_id, 'data': rec2}
            }
            
            # Determine winner using if-else logic
            if rec1['score'] > rec2['score']:
                comparison['winner'] = crypto1_id
                comparison['reason'] = f"{crypto1_id} has a higher recommendation score ({rec1['score']} vs {rec2['score']})"
            elif rec2['score'] > rec1['score']:
                comparison['winner'] = crypto2_id
                comparison['reason'] = f"{crypto2_id} has a higher recommendation score ({rec2['score']} vs {rec1['score']})"
            else:
                comparison['winner'] = "tie"
                comparison['reason'] = "Both cryptocurrencies have similar recommendation scores"
            
            return comparison
            
        except Exception as e:
            print(f"Error comparing cryptocurrencies: {e}")
            return None

def main():
    """Main function to demonstrate the crypto analyzer"""
    print("🔍 CryptoBud Advanced Crypto Analyzer")
    print("=" * 50)
    
    analyzer = CryptoAnalyzer()
    
    # Example analysis
    cryptos_to_analyze = ['bitcoin', 'ethereum', 'cardano', 'solana']
    
    for crypto in cryptos_to_analyze:
        print(f"\n📊 Analyzing {crypto.upper()}:")
        print("-" * 30)
        
        recommendation = analyzer.get_investment_recommendation(crypto)
        
        if recommendation:
            print(f"Recommendation: {recommendation['recommendation']}")
            print(f"Score: {recommendation['score']}/10")
            print(f"Market Cap Rank: #{recommendation['market_cap_rank']}")
            print(f"Trend: {recommendation['trend_analysis']['trend']}")
            print(f"Risk Level: {recommendation['trend_analysis']['risk_level']}")
            print(f"Sustainability Score: {recommendation['sustainability']['score']}/10")
            print(f"Risk Warning: {recommendation['risk_warning']}")
            print("Key Factors:")
            for reason in recommendation['reasons']:
                print(f"  • {reason}")
        else:
            print("Unable to analyze this cryptocurrency")
    
    # Example comparison
    print(f"\n🆚 Comparing Bitcoin vs Ethereum:")
    print("-" * 40)
    
    comparison = analyzer.compare_cryptocurrencies('bitcoin', 'ethereum')
    if comparison:
        print(f"Winner: {comparison['winner'].upper()}")
        print(f"Reason: {comparison['reason']}")

if __name__ == "__main__":
    main()