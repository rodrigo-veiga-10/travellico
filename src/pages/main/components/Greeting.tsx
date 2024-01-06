import axios from "axios"

export default function Greeting(){
    function GreetingShow(){
        
        axios.get("http://localhost:3000/user/info/data")
        .then((res) => {
            const data = JSON.parse(res.data.message);
            const name = data.name
            const paragraph = document.getElementById("greeting")
            if(paragraph){
                paragraph.innerHTML = `Hello, ${name}`;
            }
        })
    }
    GreetingShow()
    return(
        <h1 className="text-7xl text-center pt-10 text-stone-300" id="greeting"></h1>
    )
}