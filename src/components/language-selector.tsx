import { Button } from "@/components/ui/button";
import { useLanguage } from "@/lib/language-context";

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <Button
      onClick={() => setLanguage(language === "en" ? "fr" : "en")}
      variant="outline"
      size="sm"
      className="text-black"
    >
      {language === "en" ? "FR" : "EN"}
    </Button>
  );
}
