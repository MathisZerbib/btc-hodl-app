"use client";

import { BuyMeCoffeeButton } from "@/components/buy-me-a-coffee";
import { LanguageSelector } from "@/components/language-selector";
import { useLanguage } from "@/lib/language-context";

export function Header() {
  const { t } = useLanguage();

  return (
    <header className="bg-primary text-primary-foreground py-4">
      <div className="container mx-auto flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t.title}</h1>
        <div className="flex items-center space-x-4">
          <BuyMeCoffeeButton />
          <LanguageSelector />
        </div>
      </div>
    </header>
  );
}
