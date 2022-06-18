
import { useEffect, useState } from "react";

export default function Gasdata(props) {
    let valuereceived = 0;
    let index;
    console.log("Successfully got data !!", props.data.data.items);
    console.log("address", props.address);

    props.data.data.items.map((item, i) => {

        if (item.from_address != props.address) {
            console.log("true");
            valuereceived += (item.value) / 10 ** 18;
            console.log("valuereceived", item.value);

        }


    })

    // props.data.from_address === props.address ? (
    //     valuereceived += props.data.value
    // ) : (

    //     valuereceived += 0
    // )
    // index++;
    // console.log("from address", props.data.from_address);
    // if (props.data.from_address === props.address) {
    //     valuereceived += props.data.value;
    // }
    // console.log("valuereceived", valuereceived);

    return (
        <>
            <div>
                <h2>{Number(valuereceived)}</h2>


            </div>




        </>
    )
}


