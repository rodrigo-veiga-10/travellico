import { useNavigate } from "react-router-dom"
import BackIcon from "./back.png"


export default function Back(){
    const navigate = useNavigate()


    const GoHome = () => {
        //change to other route
        navigate("/")
    }
    return(
        <div>
            <img src={BackIcon} onClick={GoHome} className="w-[90px] mt-6 ml-6 hover:cursor-pointer p-5  rounded-full" alt="" />
        </div>
    )
}