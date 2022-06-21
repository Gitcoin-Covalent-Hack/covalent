
import { useEffect, useState } from "react";

export default function Gasdata(props) {
    let valuereceivedmainnet = 0;
    let gasspentmainnet = 0;
    let valuereceivedpolygon = 0;
    let gasspentpolygon = 0;
    let valuereceivedoptimism = 0;
    let gasspentoptimism = 0;
    console.log("Successfully got mainnet data !!", props.mainnetdata.data.items);
    console.log("Successfully got polygon data !!", props.polygondata.data.items);


    props.mainnetdata.data.items.map((item, i) => {

        if (item.from_address != (props.address.toLowerCase())) {

            console.log("true")
            console.log(item.from_address, props.address.toLowerCase());
            valuereceivedmainnet += (item.value) / 10 ** 18;

        }

        if (item.from_address == (props.address.toLowerCase())) {
            gasspentmainnet += (((item.fees_paid) / 10 ** 18) * item.gas_quote_rate);
        }

    })

    props.polygondata.data.items.map((item, i) => {

        if (item.from_address != (props.address.toLowerCase())) {

            console.log("true")
            console.log(item.from_address, props.address.toLowerCase());
            valuereceivedpolygon += (item.value) / 10 ** 18;

        }

        if (item.from_address == (props.address.toLowerCase())) {
            gasspentpolygon += (((item.fees_paid) / 10 ** 18) * item.gas_quote_rate);
        }

    })

    props.optimismdata.data.items.map((item, i) => {

        if (item.from_address != (props.address.toLowerCase())) {

            console.log("true")
            console.log(item.from_address, props.address.toLowerCase());
            valuereceivedoptimism += (item.value) / 10 ** 18;

        }

        if (item.from_address == (props.address.toLowerCase())) {
            gasspentoptimism += (((item.fees_paid) / 10 ** 18) * item.gas_quote_rate);
        }

    })




    return (
        <>
            <div>
                <div style={{ border: "2px solid black" }}>

                    <h2>Mainnet</h2>
                    <h3>Receipts from EOAs:  {Number(valuereceivedmainnet)} ETH</h3>
                    <h3>Gas Fees paid till Date: ${Number(gasspentmainnet)}</h3>
                </div>

                <div style={{ border: "2px solid black" }}>

                    <h2>Polygon</h2>
                    <h3>Receipts from EOAs:  {Number(valuereceivedpolygon)} ETH</h3>
                    <h3>Gas Fees paid till Date: ${Number(gasspentpolygon)}</h3>
                </div>
                <div style={{ border: "2px solid black" }}>

                    <h2>Optimism</h2>
                    <h3>Receipts from EOAs:  {Number(valuereceivedoptimism)} ETH</h3>
                    <h3>Gas Fees paid till Date: ${Number(gasspentoptimism)}</h3>
                </div>


            </div>

        </>
    )
}


