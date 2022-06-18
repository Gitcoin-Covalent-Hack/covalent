
import { useEffect, useState } from "react";

export default function Gasdata(props) {
    let valuereceived = 0;
    let gasspent = 0;
    console.log("Successfully got data !!", props.data.data.items);

    props.data.data.items.map((item, i) => {

        if (item.from_address != (props.address.toLowerCase())) {

            console.log("true")
            console.log(item.from_address, props.address.toLowerCase());
            valuereceived += (item.value) / 10 ** 18;

        }

        if (item.from_address == (props.address.toLowerCase())) {
            gasspent += (((item.fees_paid) / 10 ** 18) * item.gas_quote_rate);
        }

    })

    return (
        <>
            <div>
                <h2>Receipts from EOAs:  {Number(valuereceived)} ETH</h2>
                <h2>Gas Fees paid till Date: ${Number(gasspent)}</h2>
            </div>

        </>
    )
}


