import { useRef, useState } from "react";
//img
import backIcon from "./back.png";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Setup(){

    const navigate = useNavigate();

    const [contentVisible, setContentVisible] = useState(0);
    const nameRef = useRef<HTMLInputElement>(null);

    function showContent() {
      setContentVisible((prevContentVisible) => prevContentVisible + 1);
    }
    function backContent() {
      setContentVisible((prevContentVisible) => prevContentVisible - 1);
    }
    
    function submitName() {
        const name = nameRef.current?.value;
        if (name) {
            axios.get("http://localhost:3000/user/info/exist")
            .then((res) => {
                if (res.data.message === "true") {
                    axios.post("http://localhost:3000/user/info/add", {
                        name: name
                    });
                    console.log("name", name);
                } else {
                    axios.get("http://localhost:3000/user/info/create")
                    .then((_res) => {
                        axios.post("http://localhost:3000/user/info/add", {
                            name: name
                        });
                    })
                }
            });
        }
    }

    function setupShown(){
        axios.post("http://localhost:3000/user/info/add", {
            setup: true
        })
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
                <div className="justify-between mt-40">
                    <p className="text-8xl text-center">What's your name</p>
                    <p className="text-4xl mt-8 text-[#a6a5a5] text-center">Can be changed later, in the settings</p>
                </div>
                <form onSubmit={(e) => e.preventDefault()} className="flex justify-center mt-16">
                    <input type="text" ref={nameRef} onBlur={submitName} className="bg-[#242424] w-[360px] h-[70px] rounded-3xl text-4xl border border-stone-700 p-3 outline-none" />
                </form>
                <div className="flex justify-center mt-20">
                    <button className="bg-[#242424] w-[200px] h-[80px] rounded-3xl text-2xl border border-stone-700" onClick={showContent}>Continue</button>
                </div>
            </div>
        }
        {contentVisible === 2 &&

        <div className="justify-center">
            <div>
                <img src={backIcon} onClick={backContent} className="w-[90px] mt-6 ml-6 hover:cursor-pointer p-5  rounded-full" alt="" />
            </div>
            <p className="text-8xl text-center mt-40">You're ready</p>
            <div className="flex justify-center mt-20">
                <button className="bg-[#242424] w-[200px] h-[80px] rounded-3xl text-2xl border border-stone-700" onClick={() => {setupShown(); navigate("/")}}>Continue</button>
            </div>
        </div>

        }
        </>
    )
}