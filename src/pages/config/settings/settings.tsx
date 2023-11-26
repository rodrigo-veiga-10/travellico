import { useState } from "react";
import backIcon from "./back.png"
import { useNavigate } from "react-router-dom";
import ChangeName from "./changeName";

export default function Settings(){
    const navigate = useNavigate();
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

   

    function backHome() {
        navigate("/");
    }

    return(
      <div className="flex flex-col h-screen bg-zinc-900 text-white">
          <div className="py-4 px-6 lg:px-8 xl:px-10 2xl:px-12 flex justify-between items-center relative w-full">
              <img src={backIcon} alt="Back" onClick={backHome} className="h-14 cursor-pointer" />
              <p className="text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl mx-auto  pt-2 font-light">
                  Settings
              </p>
          </div>
      
          <div className="flex flex-grow overflow-hidden">
              <div className="flex flex-col bg-zinc-800 p-5 lg:p-6 xl:p-7 2xl:p-8 w-64 lg:w-72 xl:w-80 2xl:w-96 rounded-2xl text-xl">
                  <button
                      className="py-2 px-4 w-full text-white" 
                      onClick={() => setSelectedOption('changeName')}
                  >
                      Change Name
                  </button>
                  {/* Other buttons */}
              </div>
      
              <div className="flex justify-end flex-1">
                  {selectedOption === 'changeName' && (
                     <ChangeName /> 
                  )}
              </div>
          </div>
      </div>
    )
}