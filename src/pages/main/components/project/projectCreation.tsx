import axios from "axios"
import Back from "../../../../components/Back";
import { useEffect, useRef, useState } from "react";
import arrow from "./arrow.png"
import { useNavigate } from "react-router-dom";

export default function ProjectCreation(){
    const navigate = useNavigate()
    const NameRef = useRef<HTMLInputElement>(null);
    const FirstCityRef = useRef<HTMLInputElement>(null);
    const SecondCityRef = useRef<HTMLInputElement>(null);
    const FirstCityAdvancedRef = useRef<HTMLInputElement>(null);
    const SecondCityAdvancedRef = useRef<HTMLInputElement>(null);
    const [advancedAreas, setAdvancedAreas] = useState<string[]>([]);
    const Coordinates_from: number[]  = []
    const Coordinates_to: number[]  = []
    
    //all the info is here
    const [From, setFrom] = useState({
        id: "",
        osm_type: "",
        name: "",
        lat: "",
        lon: ""
     });
     
     const [To, setTo] = useState({
        id: "",
        osm_type: "",
        name: "",
        lat: "",
        lon: ""
     });



    function toggleAdvancedArea(location: string): void {
        setAdvancedAreas((prevAreas: string[]) => {
            if (prevAreas.includes(location)) {
                // If location is already in the array, remove it
                return prevAreas.filter(area => area !== location);
            } else {
                // If location is not in the array, add it
                return [...prevAreas, location];
            }
        });
    }
    

    function FirstProject(){
        const name = NameRef.current?.value;
        axios.get("http://localhost:3000/project/exist_env")
        .then((res) => {
            //check if the project environment exists
            if (res.data.project_env_exist === "false"){

                //project env doesnt exist, so call the route to create it
                axios.get("http://localhost:3000/project/create_env")
                .then((res) => {
                    if (res.data.project_env_created === "true"){
                        console.log("project env created successfully")
                        
                    axios.post("http://localhost:3000/project/add", {
                    project_name: name,
                    data: {
                        "from": {
                            "id": From.id,
                            "osm_type": From.osm_type,
                            "name": From.name.trim(),
                            "latitude": From.lat,
                            "longitude": From.lon
                        },
                        "to": {
                            "id": To.id,
                            "osm_type": To.osm_type,
                            "name": To.name.trim(),
                            "latitude": To.lat,
                            "longitude": To.lon
                        }
                    }
                })
            .then((res) => {
                const messages = {
                    "good" : "Added with success",
                    "already exists": "Already exists",
                    "error": "An error occurred"
                }
                if(res.data.message === messages["already exists"]){
                    alert(`Project already exists. Try another name`)
                    return "already exists"
                } else if(res.data.message === messages.error){
                    alert(`Ocurred an error adding the project info, try another name. If doens't work, show the error to the dev. ERROR ADDING PROJECT INFO in PROJECT CREATION.tsx`)
                    return "error"
                }else{
                    navigate("/")
                }
            })

                    }
                })
            } else{
                axios.post("http://localhost:3000/project/add", {
                    project_name: name,
                    data: {
                        "from": {
                            "id": From.id,
                            "osm_type": From.osm_type,
                            "name": From.name.trim(),
                            "latitude": From.lat,
                            "longitude": From.lon
                        },
                        "to": {
                            "id": To.id,
                            "osm_type": To.osm_type,
                            "name": To.name.trim(),
                            "latitude": To.lat,
                            "longitude": To.lon
                        }
                    }
                })
            .then((res) => {
                const messages = {
                    "good" : "Added with success",
                    "already exists": "Already exists",
                    "error": "An error occurred"
                }
                if(res.data.message === messages["already exists"]){
                    alert(`Project already exists. Try another name`)
                } else if(res.data.message === messages.error){
                    alert(`Ocurred an error adding the project info, try another name. If doens't work, show the error to the dev. ERROR ADDING PROJECT INFO in PROJECT CREATION.tsx`)
                }else{
                    navigate("/")
                }
            })
            }
        })
    }

    function Search(location: string) {


        let ref: React.RefObject<HTMLInputElement> | null = null;


        const locations: Record<string, React.RefObject<HTMLInputElement>> = {
            "from": FirstCityRef,
            "to": SecondCityRef
        };
    
        for (let key in locations) {
            if (location === key) {
                ref = locations[key];
                break;
            }
        }

        const container = document.getElementById(`container_${location}_list`)

         let checkInput = () => {
             if(!(ref?.current?.value.trim())) {
               container?.classList.add('hidden');
             } else {
               container?.classList.remove('hidden');
             }
           }

        let url = ""
        
        if(location === "from"){
            if (Object.keys(Coordinates_from).length === 0){
                url = `https://photon.komoot.io/api/?q=${ref?.current?.value}`;
            }else{
                url = `https://photon.komoot.io/api/?q=${ref?.current?.value}&lat=${Coordinates_from[0]}&lon=${Coordinates_from[1]}`;
            }
        }else{
            if (Object.keys(Coordinates_to).length === 0){
                url = `https://photon.komoot.io/api/?q=${ref?.current?.value}`;
            }else{
                url = `https://photon.komoot.io/api/?q=${ref?.current?.value}&lat=${Coordinates_to[0]}&lon=${Coordinates_to[1]}`;
            }
        }

        axios.get(url)
        .then((res) => {
            let api_results = res.data.features
            
            let results: any[] = []

            for (let objects = 0; objects < api_results.length; objects++) {
                const object = api_results[objects];

                results.push(object)
            }
            checkInput()
            HandleResults(results)

        })
        function HandleResults(data: any[] ): void {
            

            //verify if has anything has undefined in the strinbg

            let filtered_results = []

            for (let object = 0; object < data.length; object++) {
                const result = data[object];
                const name = result.properties.name

                if(!(name === "undefined") || !(name ===" undefined")){
                    filtered_results.push(result)
                }
            }
            

            const list = document.getElementById(`${location}_list`)

            while (list?.firstChild) {
                list.removeChild(list.firstChild);
            }

            function HandleOnClick(result: any, result_html: any){
                if(ref){
                    if(ref.current){
                        let result_html_formated: string[] = result_html.innerHTML.split("-")
                 
                        ref.current.value = result_html_formated[0] 
                 
                        container?.classList.add('hidden')
                    }
                }
                if(location === "from"){
                    setFrom({
                        id: result.properties.osm_id,
                        osm_type: result.properties.osm_type,
                        name: result.properties.name,
                        lat: result.geometry.coordinates[1],
                        lon: result.geometry.coordinates[0]
                    })
                }else if (location === "to"){
                    setTo({
                        id: result.properties.osm_id,
                        osm_type: result.properties.osm_type,
                        name: result.properties.name,
                        lat: result.geometry.coordinates[1],
                        lon: result.geometry.coordinates[0]
                    })
                }
             }
             

            for (let results = 0; results < filtered_results.length; results++) {
                

                const result = filtered_results[results];
                const result_html = document.createElement("li")
                result_html.className = "bg-zinc-700 border-gray-400 border rounded-lg p-2"
                result_html.onclick = () => HandleOnClick(result, result_html)
                
                if (result.properties.city) {
                    result_html.innerHTML = `${result.properties.name}, ${result.properties.city}, ${result.properties.country} - ${result.properties.osm_value}`;
                } else if (result.properties.state) {
                    result_html.innerHTML = `${result.properties.name}, ${result.properties.state}, ${result.properties.country} - ${result.properties.osm_value}`;
                } else {
                    result_html.innerHTML = `${result.properties.name}, ${result.properties.country} - ${result.properties.osm_value}`;
                }
                

                
                if(!(result_html.innerHTML == "undefined")){
                    list?.appendChild(result_html)
                }
            }

            if (!(list?.innerHTML.trim() == "")) {
                container?.classList.remove("hidden")
            }




        }


    }

    function AdvancedSearch(location: string){
        let ref: React.RefObject<HTMLInputElement> | null = null;


        const locations: Record<string, React.RefObject<HTMLInputElement>> = {
            "from": FirstCityAdvancedRef,
            "to": SecondCityAdvancedRef
        };
    
        for (let key in locations) {
            if (location === key) {
                ref = locations[key];
                break;
            }
        }

        const container = document.getElementById(`container_${location}_advanced_list`)

         let checkInput = () => {
             if(!(ref?.current?.value.trim())) {
               container?.classList.add('hidden');
             } else {
               container?.classList.remove('hidden');
             }
           }

        
        const url = `https://photon.komoot.io/api/?q=${ref?.current?.value}`

        axios.get(url)
        .then((res) => {
            const filtered_results: object[] = []

            const PlaceValues: string[] = ["city", "town", "historic", "administrative", "village", "country"]
            for (let object = 0; object < res.data.features.length; object++) {
                const place = res.data.features[object];

                if(PlaceValues.includes(place.properties.osm_value)){
                    filtered_results.push(place)
                }  
            }
            checkInput()
            HandleAdvancedResults(filtered_results)
        })


        function HandleAdvancedResults(data: any[]){
            const list = document.getElementById(`${location}_advanced_list`);

            while (list?.firstChild) {
                list.removeChild(list.firstChild);
            }

            for (let result of data) {
    
                const resultElement = document.createElement("li");
                resultElement.className = "bg-zinc-700 border-gray-400 border rounded-lg p-2";
                resultElement.onclick = () => {
                  if (ref?.current) {
                    ref.current.value = `${result.properties.name}, ${result.properties.country} - ${result.properties.osm_value}`
                    if(location === "from"){
                        Coordinates_from[0] = result.geometry.coordinates[1]
                        Coordinates_from[1] = result.geometry.coordinates[0]
                    }else{
                        Coordinates_to[0] = result.geometry.coordinates[1]
                        Coordinates_to[1] = result.geometry.coordinates[0]
                    }
                  }
                  container?.classList.add('hidden')
                };
                resultElement.innerHTML = `${result.properties.name}, ${result.properties.country} - ${result.properties.osm_value}`

                if(!(resultElement.innerHTML == "undefined")){
                    list?.appendChild(resultElement)
                }

            }
            if (!(list?.innerHTML.trim() == "")) {
                container?.classList.remove("hidden")
            }

    }

        
    }

    function validateForm() {
        const empty = "";
       
        const invalid: {
            name: string;
            from: string;
            to: string;
            [key: string]: string | undefined;
        } = {
            name: "",
            from: "",
            to: ""
        };
       
        const ValidationError = [
            { ref: NameRef, field: "name", message: "empty" },
            { ref: FirstCityRef, field: "from", message: "empty" },
            { ref: SecondCityRef, field: "to", message: "empty" }
        ];
       
        ValidationError.forEach(({ ref, field, message }) => {
            if (ref?.current?.value === empty) {
                invalid[field] = message;
            } else{
                invalid[field] = ref.current?.value
            }
        });
        
        let pass_validation = 0
       
        for (let key in invalid) {
       
            const paragraph_guess: HTMLInputElement | null = document.getElementById(key + "_paragraph") as HTMLInputElement;
       
            if (invalid[key] == "empty"){
                paragraph_guess.style.outlineColor = "red"
            } else{
                paragraph_guess.style.outlineColor = ""
                pass_validation += 1
            }
        }
       
        const KeysNumber: number = Object.keys(invalid).length 
        if (pass_validation == KeysNumber){
            return true;
        } else {
            return false;
        }
       }
       

    const [Create, setCreate] = useState(0)

    useEffect(() => {
        if (From.name !== "" && To.name !== "") {
          FirstProject();
        }
       }, [Create]);
       


    
    

    return(
        <>
        <Back/>
        <div className="flex flex-col justify-center items-center">
            <h1 className="text-6xl font-light">Create a Project</h1>
        </div>
        <div className="p-10">
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center mt-16">
                <p className="text-2xl pb-1 px-5">Name</p>
                <input type="text" autoFocus ref={NameRef}  className=" bg-zinc-800 w-full md:w-[360px] h-[50px] rounded-2xl text-xl border border-stone-600 p-3 outline-none text-stone-300"  id="name_paragraph"/>
                <p className="text-xl pb-1 pl-1 text-stone-500">.json</p>
            </form>
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center mt-16">
                <p className="text-2xl pb-1 px-5">From</p>
                <input type="text" autoFocus ref={FirstCityRef} onChange={() => Search("from")} id="from_paragraph"  className=" bg-zinc-800 w-full md:w-[360px] h-[50px] rounded-2xl text-xl border border-stone-600 p-3 outline-none text-stone-300" />
                <p className="text-xl pb-1 pl-3 text-stone-500">Beginning location</p>
                <img src={arrow} alt="" onClick={() => toggleAdvancedArea("from")}  className="h-12 w-12 p-2 opacity-80" />
            </form>
            <div className="hidden" id="container_from_list">
                <ul className=" relative p-2 left-[89px] w-[365px] text-center bg-zinc-800 rounded-xl" id="from_list">
                </ul>
            </div>
            {advancedAreas.includes("from") && (
                <>
            <div className="mt-3 relative  left-[50px] w-[450px] text-center bg-zinc-900 rounded-xl p-2 border-cyan-900 border border-3" >
                <p className="text-gray-400">In advanced search, specifying a location filters results in the box above. <br />
                    For example, entering "Paris" shows Disney - Paris instead of Paris - Orlando.
                    </p>
            </div>
            <div className="mt-3  relative  left-[75px] w-[400px] text-center bg-zinc-800 rounded-xl p-4" >
                <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
                    <p className="pb-1 pr-3 text-xl ">Place</p>
                    <input type="text" ref={FirstCityAdvancedRef} onChange={() => AdvancedSearch("from")}  className=" bg-zinc-800 w-full md:w-[360px] h-[40px] rounded-2xl text-lg border border-stone-600 p-3 outline-none text-stone-300" />
                </form>
            </div>
            <div className="hidden" id="container_from_advanced_list">
                <ul className=" relative p-2 left-[89px] w-[365px] text-center bg-zinc-800 rounded-xl" id="from_advanced_list">
                </ul>
            </div>
        </>
            )}
            <form onSubmit={(e) => e.preventDefault()} className="flex items-center mt-16 ml-1">
                <p className="text-2xl pb-1 px-5">To</p>
                <input type="text" ref={SecondCityRef} onChange={() => Search("to")} id="to_paragraph"  className=" bg-zinc-800 w-full md:w-[360px] h-[50px] rounded-2xl text-xl border border-stone-600 p-3 outline-none text-stone-300 ml-6" />
                <p className="text-xl pb-1 pl-3 text-stone-500">Travel location</p>
                <img src={arrow} alt="" onClick={() => toggleAdvancedArea("to")}  className="h-12 w-12 p-2 opacity-80" />
            </form>
            <div className="hidden" id="container_to_list">
                <ul className=" relative p-2 left-[89px] w-[365px] text-center bg-zinc-800 rounded-xl" id="to_list">
                </ul>
            </div>
            {advancedAreas.includes("to") && (
                <>
            <div className="mt-3 relative  left-[50px] w-[450px] text-center bg-zinc-900 rounded-xl p-2 border-cyan-900 border border-3" >
                <p className="text-gray-400">In advanced search, specifying a location filters results in the box above. <br />
                    For example, entering "Paris" shows Disney - Paris instead of Paris - Orlando.
                    </p>
            </div>
            <div className="mt-3  relative  left-[75px] w-[400px] text-center bg-zinc-800 rounded-xl p-4" >
                <form onSubmit={(e) => e.preventDefault()} className="flex items-center">
                    <p className="pb-1 pr-3 text-xl ">Place</p>
                    <input type="text" ref={SecondCityAdvancedRef} onChange={() => AdvancedSearch("to")}  className=" bg-zinc-800 w-full md:w-[360px] h-[40px] rounded-2xl text-lg border border-stone-600 p-3 outline-none text-stone-300" />
                </form>
            </div>
            <div className="hidden" id="container_to_advanced_list">
                <ul className=" relative p-2 left-[89px] w-[365px] text-center bg-zinc-800 rounded-xl" id="to_advanced_list">
                </ul>
            </div>
        </>
            )}
        </div>
        <div className="flex justify-center mt-52">
            <button
                type="submit"
                onClick={() => [validateForm(), setCreate(Create + 1)]}
                className="bg-zinc-800 text-white rounded-xl py-3 mt-5 w-full md:w-24 border border-zinc-700" 
            >Create</button>
        </div>


        </>
    )
}
