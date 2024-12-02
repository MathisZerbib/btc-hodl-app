import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  formatCurrency,
  formatCurrencyWithKorMorB,
  getValueColor,
} from "@/app/utils/btc-utils";
import { translations, Language } from "@/app/utils/translations";
import { motion, AnimationControls } from "framer-motion";

interface ProjectionResultsProps {
  projections: { [key: string]: number };
  language: Language;
  controls: AnimationControls;
}

export function ProjectionResults({
  projections,
  language,
  controls,
}: ProjectionResultsProps) {
  const t = translations[language];

  const chartData = Object.entries(projections).map(([key, value]) => ({
    name: key === "current" ? t.current : key,
    value: value,
  }));

  return (
    <motion.div animate={controls} className="mt-8 space-y-4">
      <h3 className="text-2xl font-semibold text-center">
        {t.projectedValues}
      </h3>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(projections).map(([key, value]) => (
            <Card key={key}>
              <CardHeader className="py-4">
                <CardTitle className="text-lg">
                  {key === "current" ? t.current : `${key} ${t.projection}`}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p
                  className={`text-2xl font-bold ${getValueColor(
                    value,
                    projections.current
                  )}`}
                >
                  {formatCurrency(value)}
                </p>
                {key !== "current" && (
                  <p
                    className={`text-sm mt-1 ${getValueColor(
                      value,
                      projections.current
                    )}`}
                  >
                    {value >= projections.current ? t.gain : t.loss}:{" "}
                    {formatCurrency(Math.abs(value - projections.current))} (
                    {((value / projections.current - 1) * 100).toFixed(2)}%)
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
        <ChartContainer
          config={{
            value: {
              label: t.value,
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px] lg:h-[400px] w-full lg:w-3/4"
        >
          <ResponsiveContainer className="w-1/2 h-full">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis
                tickFormatter={(value) => formatCurrencyWithKorMorB(value)}
              />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              <Line
                type="monotone"
                dataKey="value"
                stroke="green"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartContainer>
      </div>
    </motion.div>
  );
}
