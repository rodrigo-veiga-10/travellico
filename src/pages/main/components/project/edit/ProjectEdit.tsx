import { useLocation } from "react-router-dom";
import Back from "../../../../../components/Back";
import axios from "axios";
import { useEffect } from "react";

export default function ProjectEdit(){
    
    const { state } = useLocation();
    const project_id: number = state?.project_id;
    const project_id_api = project_id.toString()

    function ShowData(){
        axios.post("http://localhost:3000/project/data", {
            option: project_id_api
        })
        .then((res) => {
            HandleDataFile(res)
            HandleDataOSM(res)
        })

        function HandleDataFile(res: any){
            const message = res.data.message
            //data of the file
            const name_of_project = message.project_name
            const from = message.from.name
            const to = message.to.name

            const name_project_html: HTMLElement | any = document.getElementById("name_of_project")
            const from_html: HTMLElement | any = document.getElementById("from_project")
            const to_html: HTMLElement | any = document.getElementById("to_project")

            name_project_html.innerHTML = `Name of project: ${name_of_project}`
            from_html.innerHTML = `From: ${from}`
            to_html.innerHTML = `To: ${to}`

        }
        function HandleDataOSM(res: any) {
            const message = res.data.message;
        
            const from_html: HTMLElement | any = document.getElementById("from_OSM");
            const to_html:  HTMLElement | any = document.getElementById("to_OSM");
        
            GetDataOSM(message.from)
                .then((osm_data) => {
                    console.log(osm_data)
                    const name = osm_data.name
                    const type = osm_data.addresstype
                    const city = osm_data.address.city
                    const country = osm_data.address.country

                    if(city === undefined){
                        from_html.innerHTML = `${name} is a ${type}`
                    }else{
                        from_html.innerHTML = `${name} is a ${type}, located in ${city}, ${country}`
                    }
                });
        
            GetDataOSM(message.to)
                .then((osm_data) => {
                    const name = osm_data.name
                    const type = osm_data.addresstype
                    const city = osm_data.address.city
                    const country = osm_data.address.country

                    if(city === undefined){
                        to_html.innerHTML = `${name} is a ${type}`
                    }else{
                        to_html.innerHTML = `${name} is a ${type}, located in ${city}, ${country}`
                    }
                });
        
            async function GetDataOSM(data: any): Promise<any> {
                const id = data.id;
                const osm_type = data.osm_type;
        
                try {
                    const response = await axios.get(`https://nominatim.openstreetmap.org/lookup?osm_ids=${osm_type}${id}&format=json&extratags=1`);
                    return response.data[0];
                } catch (error) {
                    console.error("Error fetching OSM data:", error);
                    throw error;
                }
            }
        }
        
    }
    useEffect(() => {
        ShowData()
    });
    return (
    <>
        <Back/>
        <div className="flex justify-center">
            <h1 className="text-6xl">Simple View</h1>
        </div>
        <div className="flex items-center justify-center m-14">
            <div className="flex-col text-center p-4">
                <h2 id="name_of_project" className="text-3xl"></h2>
                <h2 id="from_project" className="text-3xl pt-5"></h2>
                <h2 id="to_project" className="text-3xl pt-5"></h2>
            </div>
        </div>
        <div className="flex items-center justify-center">
            <div className="flex-col p-20 bg-slate-900 w-fit text-center">
                <h2 id="from_OSM"  className="text-3xl"></h2>
                <h2 id="to_OSM"  className="text-3xl pt-5"></h2>
            </div>
        </div>
    </>
    )
}