import axios from "axios";
import { useRef, useState } from "react";

interface Options {
    uppercase: boolean;
    lowercase: boolean;
    vowels: boolean;
    consonants: boolean;
  }



export default function ChangeName(){

    const nameRef = useRef<HTMLInputElement>(null);

    const [options, setOptions] = useState<Options>({
        uppercase: false,
        lowercase: false,
        vowels: false,
        consonants: false
    });

    function handleCheckboxChange(option: keyof Options) {

    
    setOptions((prevOptions) => {

        
            const newOptions = {
            ...prevOptions,
            [option]: !prevOptions[option],
            };
            
            if (option === "uppercase") {
                newOptions.lowercase = false;
            }
            
            if (option === "lowercase") {
                newOptions.uppercase = false;
            }
            
            if (option === "vowels") {
                newOptions.consonants = false;
            }
            
            if (option === "consonants") {
                newOptions.vowels = false;
            }
            
            return newOptions;
        });
    }

function showName() {
    const name = nameRef.current ? nameRef.current.value : '';

    if (nameRef.current) {
        let modifiedName = name;

        if (options.uppercase) {
            modifiedName = modifiedName.toUpperCase();
        }

        if (options.lowercase) {
            modifiedName = modifiedName.toLowerCase();
        }

        if (options.vowels) {
            modifiedName = modifiedName.replace(/[bcdfghjklmnpqrstvwxyz\u0080-\uFFFF]/gi, '');
        }

        if (options.consonants) {
            modifiedName = modifiedName.replace(/[aeiou]/gi, '');
        }

        nameRef.current.value = modifiedName;
    }

    const showParagraph = document.getElementById("show_name");
    const pastParagraph = document.getElementById("past_name");

    axios.get("http://localhost:3000/user/info/data")
        .then((res) => {
            const data = JSON.parse(res.data.message);
            const pastName = data.name;

            if (showParagraph && pastParagraph) {
                pastParagraph.innerHTML = "Your name is: " + pastName;
                showParagraph.innerHTML = "Your new name is: " + name;
            }
        });
}

function submitName() {
    const name = nameRef.current?.value;
    const showParagraph = document.getElementById("show_name");
    const pastParagraph = document.getElementById("past_name");

    if (name) {
        axios.get("http://localhost:3000/user/info/exist")
            .then((res) => {
                if (res.data.message === "true") {
                    axios.post("http://localhost:3000/user/info/add", {
                        name: name
                    });
                    updateParagraphs(showParagraph, pastParagraph);
                } else {
                    axios.get("http://localhost:3000/user/info/create")
                        .then((_res) => {
                            axios.post("http://localhost:3000/user/info/add", {
                                name: name
                            });
                            updateParagraphs(showParagraph, pastParagraph);
                        });
                }
            });
    }
}

function updateParagraphs(showParagraph: HTMLElement | null, pastParagraph: HTMLElement | null) {
    if (showParagraph && pastParagraph) {
        pastParagraph.innerHTML = "";
        showParagraph.innerHTML = "<span class='text-green-500 text-2xl'>Saved</span>";
    }
}

    return(
        <div className="flex">
            <div className="flex justify-center flex-col text-center pb-16 pr-40">

                <h2 className="text-7xl">Change Name</h2>
                <p className="mt-2 text-zinc-500 pb-5">Just type your new name...</p>
                
                <form
                className="mt-4"
                onSubmit={(e) => e.preventDefault()}  
                >
                <input 
                    type="text"
                    ref={nameRef}
                    onChange={showName}
                    className="bg-zinc-800 text-white w-[360px] lg:w-[400px] xl:[440px] 2xl:[480px] rounded-full py-3 px-4 outline-none border border-zinc-700 text-xl" 
                />
                
                <button
                    type="submit"
                    onClick={submitName}
                    className="bg-zinc-800 text-white rounded-xl py-3 px-4 mt-5 w-[80px] border border-zinc-700 ml-1" 
                >
                    Save  
                </button>
                
                </form>
                
                
            </div>
        
            <div className="flex flex-col bg-zinc-800 p-5 lg:p-6 xl:p-7 2xl:p-8 w-64 lg:w-72 xl:w-[340px] 2xl:w-96 rounded-2xl text-xl">
                
                <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" onChange={() => handleCheckboxChange("uppercase")} checked={options.uppercase} value="" className="sr-only peer"/>
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">UPPERCASE</span>
                </label>
                
                <label className="relative inline-flex items-center cursor-pointer mt-5">
                    <input type="checkbox" onChange={() => handleCheckboxChange("lowercase")} checked={options.lowercase} value="" className="sr-only peer"/>
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">lowercase</span>
                </label>

                <label className="relative inline-flex items-center cursor-pointer mt-5">
                    <input type="checkbox" onChange={() => handleCheckboxChange("vowels")} checked={options.vowels} value="" className="sr-only peer"/>
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Just vowels</span>
                </label>

                <label className="relative inline-flex items-center cursor-pointer mt-5">
                    <input type="checkbox" onChange={() => handleCheckboxChange("consonants")} checked={options.consonants} value="" className="sr-only peer"/>
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    <span className="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Just consonants</span>
                </label>

                <div className="fixed bottom-16 justify-center flex-col w-72 h-80 border border-gray-600 rounded-xl pt-3 text-center">
                  <h1 className="text-2xl">Changes</h1>
                  <div className="flex flex-col justify-center h-64">
                    <p id="past_name" className="text-lg text-red-600"></p>
                    <p id="show_name" className="text-lg text-lime-600"></p>
                  </div>
                </div>
            </div>
        </div>
    )
}