import dynamic from "next/dynamic";

const CoinPriceChart = dynamic(
  () => {
    return import("../components/CoinPriceChart.js");
  },
  { ssr: false }
);

export default function Chart() {
  return (
    <div style={{ minHeight: "1000px" }}>
      <h1>Coin Price Chart</h1>
      {/* <CoinPriceChart /> */}
    </div>
  );
}
