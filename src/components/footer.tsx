"use client";

import { useLanguage } from "@/lib/language-context";
import { BuyMeCoffeeButton } from "@/components/buy-me-a-coffee";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-secondary text-secondary-foreground py-4 mt-8">
      <div className="container mx-auto text-center">
        <div className="flex justify-center items-center space-x-4 p-4">
          <BuyMeCoffeeButton />
        </div>

        <p dangerouslySetInnerHTML={{ __html: t.footer.copy }} />
        <p className="mt-2 text-sm">{t.footer.disclaimer}</p>
      </div>
    </footer>
  );
}
