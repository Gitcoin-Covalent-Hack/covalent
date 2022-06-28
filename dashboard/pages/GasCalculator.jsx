import { useState } from "react";
import Gasdata from "../components/Gasdata";
export default function GasCalculator() {
  const [address, setaddress] = useState("");
  const [mainnetdata, setmainnetdata] = useState(null);
  const [polygondata, setpolygondata] = useState(null);
  const [optimismdata, setoptimismdata] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [nooftx, setnooftx] = useState(null);

  const getdata = async (client) => {
    setLoading(true);
    fetch(
      `https://api.covalenthq.com/v1/1/address/` +
        `${client}` +
        `/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=true&key=ckey_1d7288b1bd29481ba9c8415d038`
    )
      .then((res) => res.json())
      .then((data) => {
        setmainnetdata(data);
        setLoading(false);
        console.log("mainnetdata", mainnetdata);
        setnooftx(mainnetdata.length);
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(
      `https://api.covalenthq.com/v1/137/address/` +
        `${client}` +
        `/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=true&key=ckey_1d7288b1bd29481ba9c8415d038`
    )
      .then((res) => res.json())
      .then((data) => {
        setpolygondata(data);
        console.log("polygon data", polygondata);
        setnooftx(polygondata.length);
      })
      .catch((err) => {
        console.log(err);
      });

    fetch(
      `https://api.covalenthq.com/v1/10/address/` +
        `${client}` +
        `/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=true&key=ckey_1d7288b1bd29481ba9c8415d038`
    )
      .then((res) => res.json())
      .then((data) => {
        setoptimismdata(data);
        console.log("optimism data", optimismdata);
        setnooftx(optimismdata.length);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <h1>Gas Guzzler</h1>
      <input
        placeholder="Enter your address"
        value={address}
        onChange={(e) => setaddress(e.target.value)}
      />

      <button
        onClick={() => {
          console.log(address);
          getdata(address);
        }}
      >
        Click
      </button>
      {isLoading ? <p>Loading...</p> : null}

      {!isLoading && mainnetdata && polygondata && optimismdata && (
        <div>
          {
            <Gasdata
              polygondata={polygondata}
              mainnetdata={mainnetdata}
              optimismdata={optimismdata}
              address={address}
            />
          }
        </div>
      )}
    </>
  );
}
