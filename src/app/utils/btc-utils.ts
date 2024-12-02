import { BTCData } from "./btc-data-interface";

export function formatCurrency(value: number): string {
    // if last digits are 00 then make it only one 0 after the decimal point
    const decimalDigits = value % 1 === 0 ? 0 : 2;
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: decimalDigits,
        maximumFractionDigits: decimalDigits
    }).format(value);
}



export function formatCurrencyShort(value: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(value);
}



export function formatCurrencyWithKorMorB(value: number): string {
    if (value >= 1_000_000_000) {
        return `${(value / 1_000_000_000).toFixed(2)}B`;
    }
    if (value >= 1_000_000) {
        return `${(value / 1_000_000).toFixed(2)}M`;
    }
    if (value >= 1_000) {
        return `${(value / 1_000).toFixed(2)}K`;
    }
    return value.toString();
}

export function calculateProjection(initialPrice: number, growthRate: number, years: number): number {
    return initialPrice * Math.pow(1 + growthRate, years);
}

export function calculateVolatility(prices: number[]): number {
    const returns = prices.slice(1).map((price, index) => Math.log(price / prices[index]));
    const avgReturn = returns.reduce((sum, ret) => sum + ret, 0) / returns.length;
    const squaredDiffs = returns.map(ret => Math.pow(ret - avgReturn, 2));
    const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / squaredDiffs.length;
    return Math.sqrt(variance * 365); // Annualized volatility
}

export const GROWTH_RATES = {
    veryBullish: { 3: 0.50, 5: 0.45, 10: 0.40 },
    bullish: { 3: 0.35, 5: 0.30, 10: 0.25 },
    bearish: { 3: -0.15, 5: -0.10, 10: 0.05 },
    veryBearish: { 3: -0.25, 5: -0.20, 10: -0.10 },
};



export async function fetchBTCData(): Promise<BTCData> {
    try {
        const [currentData, historicalData] = await Promise.all([
            fetch('https://api.coingecko.com/api/v3/coins/bitcoin').then(res => res.json()),
            fetch('https://api.coingecko.com/api/v3/coins/bitcoin/market_chart?vs_currency=usd&days=30').then(res => res.json())
        ]);

        return {
            price: currentData.market_data.current_price.usd,
            marketCap: currentData.market_data.market_cap.usd,
            volume24h: currentData.market_data.total_volume.usd,
            change24h: currentData.market_data.price_change_percentage_24h,
            change7d: currentData.market_data.price_change_percentage_7d,
            historicalPrices: historicalData.prices.map((price: number[]) => price[1])
        };
    } catch (error) {
        console.error('Error fetching BTC data:', error);
        throw new Error('Failed to fetch BTC data');
    }
}

export function getValueColor(value: number, baseValue: number): string {
    if (value > baseValue) return "text-green-600";
    if (value < baseValue) return "text-red-600";
    return "text-gray-600";
}

