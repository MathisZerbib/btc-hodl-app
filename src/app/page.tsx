import { BTCProjectionPro } from "@/components/btc-projection-pro";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { LanguageProvider } from "@/lib/language-context";

export default function Home() {
  return (
    <LanguageProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-grow container mx-auto py-8">
          <BTCProjectionPro />
        </main>
        <Footer />
      </div>
    </LanguageProvider>
  );
}
