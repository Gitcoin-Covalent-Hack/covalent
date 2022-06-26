import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

const NftCard = ({name, description, image, symbol, balance}) => {

    const {theme, setTheme} = useTheme();

    const imgOrVideo = (url) => {
        const length = url.split(".").length;
        const ext = url.split(".")[length-1];
        if(ext === "mp4"){
            return(
                <video className="w-full h-full object-cover object-center">
                    <source src={url} type={url.split(".")[url.length-1]} />
                </video>
            )
        }
            
        return (
                <img className="w-full h-full object-cover object-center" src={url} alt="image-equilibrium" />
            )
    }

    return(
        <div className="bg-base-100 rounded grid shadow text-base mb-6 max-w-lg">
            <div className="h-60">
                {imgOrVideo(image)}
            </div>
            <div className={`grid text-center px-8 ${theme === "dark" ? "text-white" : ""}`}>
                <p className="py-2 text-xl font-bold">{name}</p>
                <p>
                    {(description && description.length) <= 120 ? description : `${description.slice(0,117)}...`}
                </p>
            </div>
    </div>
    )
}

export default NftCard;