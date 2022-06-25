import React from "react";
import Image from "next/image";
import { useTheme } from "next-themes";

const NftCard = ({name, description, image, symbol, balance}) => {

    const {theme, setTheme} = useTheme();

    return(
        <div className="bg-base-100 rounded grid shadow text-base mb-6">
            <div className="h-60">
                <img className="w-full h-full object-cover object-center" src={image} alt="image-equilibrium" />
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