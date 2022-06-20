import * as React from "react";
import {
    StockChartComponent,
    StockChartSeriesCollectionDirective,
    StockChartSeriesDirective,
    Inject,
    DateTime,
    Tooltip,
    RangeTooltip,
    Crosshair,
    LineSeries,
    SplineSeries,
    CandleSeries,
    HiloOpenCloseSeries,
    HiloSeries,
    RangeAreaSeries,
    Trendlines,
} from "@syncfusion/ej2-react-charts";
import {
    EmaIndicator,
    RsiIndicator,
    BollingerBands,
    TmaIndicator,
    MomentumIndicator,
    SmaIndicator,
    AtrIndicator,
    AccumulationDistributionIndicator,
    MacdIndicator,
    StochasticIndicator,
    Export,
} from "@syncfusion/ej2-react-charts";
import { chartData } from "./indicator-data";
import { SampleBase } from "./sample-base";

export let tooltipRender = (args) => {
    if (args.text.split("<br/>")[4]) {
        let target = parseInt(args.text.split("<br/>")[4].split("<b>")[1].split("</b>")[0]);
        let value = (target / 100000000).toFixed(1) + "B";
        args.text = args.text.replace(args.text.split("<br/>")[4].split("<b>")[1].split("</b>")[0], value);
    }
};

export default function Sample() {
    return (
        <div className="control-pane">
            <div className="control-section">
                <StockChartComponent
                    id="stockchartdefault"
                    primaryXAxis={{
                        valueType: "DateTime",
                        majorGridLines: { width: 0 },
                        majorTickLines: { color: "transparent" },
                        crosshairTooltip: { enable: true },
                    }}
                    primaryYAxis={{
                        labelFormat: "n0",
                        lineStyle: { width: 0 },
                        rangePadding: "None",
                        majorTickLines: { width: 0 },
                    }}
                    chartArea={{ border: { width: 0 } }}
                    tooltip={{ enable: true, shared: true }}
                    tooltipRender={tooltipRender}
                    crosshair={{ enable: true }}
                    title="Coin Chart"
                >
                    <Inject
                        services={[
                            DateTime,
                            Tooltip,
                            RangeTooltip,
                            Crosshair,
                            LineSeries,
                            SplineSeries,
                            CandleSeries,
                            HiloOpenCloseSeries,
                            HiloSeries,
                            RangeAreaSeries,
                            Trendlines,
                            EmaIndicator,
                            RsiIndicator,
                            BollingerBands,
                            TmaIndicator,
                            MomentumIndicator,
                            SmaIndicator,
                            AtrIndicator,
                            Export,
                            AccumulationDistributionIndicator,
                            MacdIndicator,
                            StochasticIndicator,
                        ]}
                    />
                    <StockChartSeriesCollectionDirective>
                        <StockChartSeriesDirective
                            dataSource={chartData}
                            xName="x"
                            type="Candle"
                            animation={{ enable: true }}
                        ></StockChartSeriesDirective>
                    </StockChartSeriesCollectionDirective>
                </StockChartComponent>
            </div>
        </div>
    );
}
