import { useState } from "react";
//img
import backIcon from "./back.png";

export default function Setup(){

    const [contentVisible, setContentVisible] = useState(0);

    function showContent() {
      setContentVisible((prevContentVisible) => prevContentVisible + 1);
    }
    function backContent() {
      setContentVisible((prevContentVisible) => prevContentVisible - 1);
    }
    
    return(
        <>
        {contentVisible === 0 && 
            <div className="justify-center">
                <div className="justify-between mt-40">
                    <p className="text-9xl text-center">Setup</p>
                    <p className="text-3xl mt-8 text-[#a6a5a5] text-center">To begin using Travellico, you need to configure some settings</p>
                </div>
                <div className="flex justify-center">
                    <button className="bg-[#242424] w-[200px] h-[100px] mt-40 rounded-3xl text-4xl border border-stone-700" onClick={showContent}>Continue</button>
                </div>
            </div>
        }
        {contentVisible === 1 &&
            <div className="justify-center">
                <div>
                    <img src={backIcon} onClick={backContent} className="w-[90px] mt-6 ml-6 hover:cursor-pointer p-5  rounded-full" alt="" />
                </div>
                <div className="justify-between mt-20">
                    <p className="text-8xl text-center">What's your name</p>
                    <p className="text-4xl mt-8 text-[#a6a5a5] text-center">Can be changed later</p>
                </div>
                <form onSubmit={(e) => e.preventDefault()} className="flex justify-center mt-16">
                    <input type="text" className="bg-[#242424] w-[360px] h-[70px] rounded-3xl text-4xl border border-stone-700 p-3 outline-none" />
                </form>
                <div className="flex justify-center mt-20">
                    <button className="bg-[#242424] w-[200px] h-[80px] rounded-3xl text-2xl border border-stone-700" onClick={showContent}>Continue</button>
                </div>
            </div>
        }
        </>
    )
}