import { createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';





const CoinPriceChart = () => {
    useEffect(()=> {
    const chart = createChart(document.body, { width: 400, height: 300 });
    const lingseries = chart.addAreaSeries()
    },[])
    return <div></div>

}

export default CoinPriceChart;
