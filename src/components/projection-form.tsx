import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { translations, Language } from "@/app/utils/translations";
import { formatCurrency } from "@/app/utils/btc-utils";
import { BTCData } from "@/app/utils/btc-data-interface";

const formSchema = z.object({
  btcAmount: z
    .string()
    .refine((val) => {
      const num = parseFloat(val.replace(",", "."));
      return !isNaN(num) && num > 0;
    }, "Please enter a valid positive number")
    .transform((val) => parseFloat(val.replace(",", "."))),
  futurePrice: z.number().positive().min(1, "Minimum price is $1"),
});

interface ProjectionFormProps {
  btcData: BTCData | null;
  language: Language;
  onSubmit: (values: z.infer<typeof formSchema>) => void;
}

export function ProjectionForm({
  btcData,
  language,
  onSubmit,
}: ProjectionFormProps) {
  const t = translations[language];
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      btcAmount: 0,
      futurePrice: btcData ? btcData.price : 0,
    },
  });

  useEffect(() => {
    if (btcData) {
      form.setValue("futurePrice", btcData.price);
    }
  }, [btcData, form]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="btcAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.btcAmount}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.00000001"
                  {...field}
                  onChange={(e) => {
                    const value = e.target.value.replace(",", ".");
                    if (value === "" || /^\d*\.?\d*$/.test(value)) {
                      field.onChange(value);
                    }
                  }}
                />
              </FormControl>
              <FormDescription>{t.enterBTCAmount}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="futurePrice"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t.startingPrice}</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step="0.01"
                  {...field}
                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                {t.currentBTCPrice}{" "}
                {btcData ? formatCurrency(btcData.price) : "Loading..."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          {t.calculate}
        </Button>
      </form>
    </Form>
  );
}
