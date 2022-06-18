import { useEffect, useState } from "react";
import Gasdata from "../components/Gasdata";
export default function GasCalculator() {
  const [address, setaddress] = useState("");
  const [data, setdata] = useState(null);
  const [isLoading, setLoading] = useState(false);
  const [nooftx, setnooftx] = useState(null);

  let val;
  const getdata = async (client) => {
    setLoading(true);
    fetch(
      `https://api.covalenthq.com/v1/1/address/` +
        `${client}` +
        `/transactions_v2/?quote-currency=USD&format=JSON&block-signed-at-asc=false&no-logs=true&key=ckey_1d7288b1bd29481ba9c8415d038`
    )
      .then((res) => res.json())
      .then((data) => {
        setdata(data);
        setLoading(false);
        console.log("data", data);
        setnooftx(data.length);
      })
      .catch((err) => {
        setLoading(false);
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

      {!isLoading && data && (
        <div>
          {/* {data?.data?.items.map((item) => {
            return <Gasdata data={item} address={address} />;
          })} */}
          {<Gasdata data={data} address={address} />}
        </div>
      )}
    </>
  );
}
