import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  //   TrendingUpIcon,
  //   TrendingDownIcon,
} from "lucide-react";
import { formatCurrency } from "@/app/utils/btc-utils";

interface BTCInfoCardProps {
  title: string;
  value: number;
  change?: number;
  isPercentage?: boolean;
}

export function BTCInfoCard({
  title,
  value,
  change,
  isPercentage,
}: BTCInfoCardProps) {
  return (
    <Card>
      <CardHeader className="py-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formatCurrency(value)}</div>
        {change !== undefined && (
          <div className="flex items-center mt-1">
            {change >= 0 ? (
              <ArrowUpIcon className="w-4 h-4 text-green-500 mr-1" />
            ) : (
              <ArrowDownIcon className="w-4 h-4 text-red-500 mr-1" />
            )}
            <span className={change >= 0 ? "text-green-500" : "text-red-500"}>
              {change.toFixed(2)}
              {isPercentage ? "%" : ""}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
