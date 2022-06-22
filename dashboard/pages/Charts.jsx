import dynamic from "next/dynamic";

const CoinPriceChart = dynamic(
  () => {
    return import("../components/CoinPriceChart.js");
  },
  { ssr: false }
);

export default function Chart() {
  return (
    <main className="flex-col self-center">
      <h1>Coin Price Chart</h1>
      <CoinPriceChart />
    </main>
  );
}
