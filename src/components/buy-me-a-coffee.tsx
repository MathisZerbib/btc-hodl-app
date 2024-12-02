"use client";

import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Coffee,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DialogTitle } from "@radix-ui/react-dialog";
import { useLanguage } from "@/lib/language-context";

interface Address {
  coin: string;
  address: string;
}

interface Joke {
  setup: string;
  delivery: string;
}

export function BuyMeCoffeeButton() {
  const { t } = useLanguage();
  const [copiedAddress, setCopiedAddress] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [joke, setJoke] = useState<Joke | null>(null);
  const [isLoadingJoke, setIsLoadingJoke] = useState(false);
  const [amount, setAmount] = useState<number | string>(1);
  const [customAmount, setCustomAmount] = useState<number | string>("");
  const [showCustomInput, setShowCustomInput] = useState(false);

  const addresses: Address[] = [
    { coin: "BTC", address: "bc1q545wg6n8ccwmcqcxh2msk68ncfme76vs3rkx7k" },
    { coin: "ETH", address: "0x06051210F46c786E5DB199a85068a2F249C08dbA" },
    { coin: "SOL", address: "bc1qyyervejpxctdzrjjrsl6lxg2wpqh5n93v5k0kz" },
  ];

  useEffect(() => {
    if (showThankYou) {
      const timer = setTimeout(() => setShowThankYou(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showThankYou]);

  useEffect(() => {
    fetchJoke();
  }, []);

  const fetchJoke = async () => {
    setIsLoadingJoke(true);
    try {
      const response = await fetch(
        "https://v2.jokeapi.dev/joke/Programming?type=twopart"
      );
      const data = await response.json();
      setJoke({ setup: data.setup, delivery: data.delivery });
    } catch (error) {
      console.error("Error fetching joke:", error);
      setJoke(null);
    }
    setIsLoadingJoke(false);
  };

  const copyToClipboard = (address: string) => {
    navigator.clipboard.writeText(address);
    setCopiedAddress(address);
    setTimeout(() => setCopiedAddress(""), 2000);
  };

  const nextAddress = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % addresses.length);
  };

  const prevAddress = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + addresses.length) % addresses.length
    );
  };

  const generateQRCodeValue = (
    address: string,
    amount: number | string,
    coin: string
  ) => {
    const label = encodeURIComponent("Donation");
    const message = encodeURIComponent("Thank you for your support!");

    switch (coin) {
      case "BTC":
        const btcAmount =
          amount === "" ? "" : (Number(amount) / 50000).toFixed(8); // Assuming 1 BTC = $50,000
        return `bitcoin:${address}?amount=${btcAmount}&label=${label}&message=${message}`;
      case "ETH":
        const ethAmount =
          amount === "" ? "" : (Number(amount) / 3000).toFixed(18); // Assuming 1 ETH = $3,000
        return `ethereum:${address}@1?value=${ethAmount}&gas=21000&label=${label}&message=${message}`;
      case "SOL":
        const solAmount = amount === "" ? "" : (Number(amount) / 50).toFixed(9); // Assuming 1 SOL = $50
        return `solana:${address}?amount=${solAmount}&label=${label}&message=${message}`;
      default:
        return "";
    }
  };

  const handleCustomAmount = () => {
    setAmount(customAmount);
    setShowCustomInput(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="group relative overflow-hidden bg-white hover:bg-gray-100 transition-colors border-black"
        >
          <span className="relative flex items-center text-black">
            <Coffee className="mr-2 h-4 w-4" />
            {t.buyMeCoffee.supportMyWork}
          </span>
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px] bg-white p-0 overflow-hidden border-2 border-black">
        <div className="bg-gray-100 p-4">
          <DialogTitle className="text-2xl font-bold text-center text-black p-4">
            {t.buyMeCoffee.dialogTitle}
          </DialogTitle>
        </div>
        <div className="p-6 relative">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={prevAddress}
              className="hover:bg-gray-100 text-black"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <div className="flex-1 flex justify-center items-center space-x-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center"
                >
                  <span className="font-bold mb-2 text-lg text-black">
                    {addresses[currentIndex].coin}
                  </span>
                  <div className="bg-white p-2 rounded-lg border-2 border-black">
                    <QRCodeSVG
                      value={generateQRCodeValue(
                        addresses[currentIndex].address,
                        amount,
                        addresses[currentIndex].coin
                      )}
                      size={180}
                      level="H"
                      bgColor="#ffffff"
                      fgColor="#000000"
                    />
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <Button
              variant="ghost"
              onClick={nextAddress}
              className="hover:bg-gray-100 text-black"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
          </div>
          <div className="mt-4 bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between w-full mb-2 items-center">
              <span className="font-bold text-black">
                {t.buyMeCoffee.address}:
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => copyToClipboard(addresses[currentIndex].address)}
                className="hover:bg-white text-black"
              >
                {copiedAddress === addresses[currentIndex].address ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            <span className="font-mono text-sm break-all text-gray-600">
              {addresses[currentIndex].address}
            </span>
          </div>
          <div className="mt-4">
            <div className="flex justify-between mb-2 space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setAmount(1);
                  setShowCustomInput(false);
                }}
                className={`w-full ${
                  amount === 1 ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                $1
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAmount(5);
                  setShowCustomInput(false);
                }}
                className={`w-full ${
                  amount === 5 ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                $5
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setAmount(10);
                  setShowCustomInput(false);
                }}
                className={`w-full ${
                  amount === 10 ? "bg-black text-white" : "bg-white text-black"
                }`}
              >
                $10
              </Button>
            </div>
            <div className="flex justify-between mb-2 space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowCustomInput(true)}
                className={`w-full ${
                  showCustomInput
                    ? "bg-black text-white"
                    : "bg-white text-black"
                }`}
              >
                Custom
              </Button>
              {showCustomInput && (
                <input
                  type="number"
                  placeholder="Enter amount"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="w-full border border-black rounded px-2 py-1"
                  onBlur={handleCustomAmount}
                />
              )}
            </div>
          </div>
          <Button
            className="w-full mt-4 bg-black text-white hover:bg-gray-800"
            onClick={() => {
              setShowThankYou(true);
              setIsOpen(false);
            }}
          >
            {t.buyMeCoffee.donationButton}
          </Button>
          <div className="mt-4 p-4 bg-gray-100 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-black">{t.buyMeCoffee.devJoke}</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchJoke}
                disabled={isLoadingJoke}
                className="hover:bg-white text-black"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isLoadingJoke ? "animate-spin" : ""}`}
                />
              </Button>
            </div>
            {joke ? (
              <div className="text-sm text-gray-600">
                <p className="mb-2">{joke.setup}</p>
                <p className="font-bold">{joke.delivery}</p>
              </div>
            ) : (
              <p className="text-sm text-gray-600">
                {t.buyMeCoffee.loadingJoke}
              </p>
            )}
          </div>
        </div>
      </DialogContent>
      <AnimatePresence>
        {showThankYou && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 right-4 bg-black text-white p-4 rounded-lg shadow-lg"
          >
            {t.buyMeCoffee.thankYou}
          </motion.div>
        )}
      </AnimatePresence>
    </Dialog>
  );
}
