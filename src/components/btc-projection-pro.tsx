"use client";

import { useState, useEffect, useRef } from "react";
import { useAnimationControls } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BTCInfoCard } from "./btc-info-card";
import { ProjectionForm } from "./projection-form";
import { ProjectionResults } from "./projection-results";
import {
  fetchBTCData,
  calculateProjection,
  GROWTH_RATES,
  calculateVolatility,
  formatCurrency,
} from "@/app/utils/btc-utils";
import { useLanguage } from "@/lib/language-context";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { AreaChart } from "recharts";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Area,
} from "recharts";
import { BTCData } from "../app/utils/btc-data-interface";

type ProjectionType = "veryBullish" | "bullish" | "bearish" | "veryBearish";

export function BTCProjectionPro() {
  const chartRef = useRef<HTMLDivElement>(null);
  const controls = useAnimationControls();
  const { t, language } = useLanguage();
  const [projections, setProjections] = useState<{ [key: string]: number }>({});
  const [projectionType, setProjectionType] =
    useState<ProjectionType>("bullish");
  const [btcData, setBtcData] = useState<BTCData | null>(null);
  const [volatility, setVolatility] = useState<number | null>(null);
  const [scrollToChart, setScrollToChart] = useState(false);

  useEffect(() => {
    async function initializeBTCData() {
      try {
        const data = await fetchBTCData();
        setBtcData(data);
        setVolatility(calculateVolatility(data.historicalPrices));
      } catch (error) {
        console.error("Failed to fetch BTC data:", error);
      }
    }
    initializeBTCData();
  }, []);

  useEffect(() => {
    if (scrollToChart && chartRef.current) {
      chartRef.current.scrollIntoView({ behavior: "smooth" });
      setScrollToChart(false);
    }
  }, [scrollToChart, projections]);

  function onSubmit(values: { btcAmount: number; futurePrice: number }) {
    if (values.btcAmount <= 0) {
      return;
    }

    const newProjections: { [key: string]: number } = {
      current: values.btcAmount * values.futurePrice,
    };

    Object.entries(GROWTH_RATES[projectionType]).forEach(([year, rate]) => {
      const projectedPrice = calculateProjection(
        values.futurePrice,
        rate,
        parseInt(year)
      );
      newProjections[`${year}yr`] = values.btcAmount * projectedPrice;
    });

    setProjections(newProjections);
    setScrollToChart(true);

    controls.start({
      y: 0,
      transition: { duration: 0.5, ease: "easeInOut" },
    });
  }

  return (
    <Card className="w-full mx-auto relative">
      <CardHeader>
        <CardTitle className="text-3xl font-bold text-center">
          {t.title}
        </CardTitle>
        <CardDescription className="text-center">
          {t.description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {btcData && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <BTCInfoCard
              title={t.currentPrice}
              value={btcData.price}
              change={btcData.change24h}
              isPercentage
            />
            <BTCInfoCard title={t.marketCap} value={btcData.marketCap} />
            <BTCInfoCard title={t.volume24h} value={btcData.volume24h} />
            <BTCInfoCard
              title={t.change7d}
              value={btcData.change7d}
              change={btcData.change7d}
              isPercentage
            />
          </div>
        )}

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{t.priceHistory}</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                price: {
                  label: t.currentPrice,
                  color: "hsl(var(--chart-1))",
                },
              }}
              className="h-[200px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={
                    btcData?.historicalPrices.map((price, index) => ({
                      name: index,
                      price,
                    })) || []
                  }
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => formatCurrency(value)} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Area
                    type="monotone"
                    dataKey="price"
                    stroke="var(--color-price)"
                    fill="var(--color-price)"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <Button
            onClick={() => setProjectionType("veryBullish")}
            variant={projectionType === "veryBullish" ? "default" : "outline"}
          >
            {t.veryBullish}
          </Button>
          <Button
            onClick={() => setProjectionType("bullish")}
            variant={projectionType === "bullish" ? "default" : "outline"}
          >
            {t.bullish}
          </Button>
          <Button
            onClick={() => setProjectionType("bearish")}
            variant={projectionType === "bearish" ? "default" : "outline"}
          >
            {t.bearish}
          </Button>
          <Button
            onClick={() => setProjectionType("veryBearish")}
            variant={projectionType === "veryBearish" ? "default" : "outline"}
          >
            {t.veryBearish}
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">{t.projectionScenario}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {projectionType === "veryBullish" && t.veryBullishScenario}
              {projectionType === "bullish" && t.bullishScenario}
              {projectionType === "bearish" && t.bearishScenario}
              {projectionType === "veryBearish" && t.veryBearishScenario}
            </p>
          </CardContent>
        </Card>

        <ProjectionForm
          btcData={btcData}
          language={language}
          onSubmit={onSubmit}
        />

        {volatility !== null && (
          <Card className="mt-4">
            <CardHeader>
              <CardTitle className="text-lg">{t.volatility}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {(volatility * 100).toFixed(2)}%
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {t.volatilityExplanation}
              </p>
            </CardContent>
          </Card>
        )}

        {Object.keys(projections).length > 0 && (
          <div ref={chartRef}>
            <ProjectionResults
              projections={projections}
              language={language}
              controls={controls}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
