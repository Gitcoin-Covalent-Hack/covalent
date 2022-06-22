import moment from "moment";
import { createChart } from 'lightweight-charts';
import { useEffect, useRef, useState } from 'react';
import { COVALENT_KEY } from "../constants";
import API from "../utils/API";


const tokenAddresses = {
    BNB: "0xB8c77482e45F1F44dE1745F52C74426C631bDD52", 
    LINK: "0x514910771AF9Ca656af840dff83E8264EcF986CA", 
    MATIC: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", 
    DAI: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
    UNI: "0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984", 
    GRT: "0xc944E90C64B2c07662A292be6244BDf05Cda44a7"
}


console.log(process.env.NEXT_PUBLIC_COVALENT_KEY)

const CoinPriceChart = () => {
  const [tokenPrice, setTokenPrice] = useState();
  const [tokenChart, setTokenChart] = useState(tokenAddresses.DAI)


console.log('this'+' '+tokenAddresses.BNB)
//https://api.covalenthq.com/v1/pricing/historical_by_addresses_v2/1/USD/0xB8c77482e45F1F44dE1745F52C74426C631bDD52/?quote-currency=USD&format=JSON&from=2022-01-01&to=2022-06-01&key=ckey_13efa795783c4edd9b5991290d7

// Get todays date
let date = new Date;
let today =  moment((date)).format("YYYY-MM-DD")
console.log(today)

//Get date 12 months ago
let threeMA = new Date;
threeMA.setMonth(date.getMonth() - 12);
let threeMonthsAgo =  moment((threeMA)).format("YYYY-MM-DD")
console.log(threeMonthsAgo)



  const fetchTokenPrice = async () => {
    let response = await API.get(`/pricing/historical_by_addresses_v2/1/USD/${tokenChart}/?&from=${threeMonthsAgo}&to=${today}&prices-at-asc=true&key=${COVALENT_KEY}`);
    let price = response.data.data[0];
    setTokenPrice(price);
};

  useEffect(() => {
    void fetchTokenPrice();
  }, []);

 
  var chartData = tokenPrice?.prices?.map(item => ({ time: item.date, value: item.price }));
  console.log(chartData)
  
  const elRef = useRef(null);
  const chartRef = useRef(null);
  
  useEffect(()=> {
      if (elRef.current != null && chartData?.lenght > 300) {
          chartRef.current?.remove();
          const container = elRef.current
          const chart = createChart(container, { width: '600', height: '400', layout:{background: '#ccc', textColor: '#ffff'}});
          chartRef.current = chart;
          const lineSeries = chartRef.current.addAreaSeries();
           //lineSeries.setData(chartData);
            
            }
            return () => {
                chartRef.current?.remove();
                chartRef.current = null;
            }
        },[])
    return <div className='justify-center' ref={elRef} id='container'></div>
}

export default CoinPriceChart;
