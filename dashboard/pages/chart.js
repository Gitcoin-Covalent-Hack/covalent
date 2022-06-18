import dynamic from "next/dynamic";

const Candle = dynamic(
  () => {
    return import("./components/Candle.js");
  },
  { ssr: false }
);

export default function Home() {
  return (
    <div style={{ minHeight: "1000px" }}>
      <h1>Home</h1>
      <Candle />
    </div>
  );
}

