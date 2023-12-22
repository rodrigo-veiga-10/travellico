import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectView() {
  const navigate = useNavigate();

  const goToProjectCreation = () => {
    navigate("project/create")
  };

  function ShowProjects(){
    axios.post("http://localhost:3000/project/data" , {
      option: ""
    })
    .then((res) => {
      const projects = res.data.message
      for (let index = 0; index < projects.length; index++) {
        const project = projects[index];
        const project_html = document.createElement("div");
        project_html.className = " m-2 p-5 h-40 w-72 bg-gradient-to-b from-blue-950 to-blue-700 border-[#5c5c5c] border-4 rounded-xl items-center justify-center flex";

        const name_project = document.createElement("p");
        name_project.className = "text-2xl text-white";

        const name: string = project.name
        const name_formatted = name.split(".")
        name_project.innerHTML = `${name_formatted[0]}`;

        // Append name_project to project_html
        project_html.appendChild(name_project);

        const main_div = document.getElementById("project_div");

        // Check if a project with the same name already exists in main_div
        const existingProjects = main_div?.getElementsByClassName("p-5");
        let projectExists = false;

        if (existingProjects) {
          for (const existingProject of existingProjects) {
            if (existingProject) {
              const existingNameElement = existingProject.querySelector(".text-2xl");
              
              if (existingNameElement) {
                const existingName = existingNameElement.innerHTML;
        
                if (existingName === name_formatted[0]) {
                  // A project with the same name already exists
                  projectExists = true;
                  break;
                }
              }
            }
          }
        }
        

        if (!projectExists) {
            // Append project_html to main_div only if it doesn't already exist
            main_div?.appendChild(project_html);
        } else {
            console.log("Project already exists in main_div");
        }


      }
    })
  }
  useEffect(() => {
    ShowProjects()
  });

  return (
      <>
        <div className="p-14">
            <h3 className="text-center text-5xl">Projects</h3>
            <div className="flex mt-10" id="project_div">
              <div className="m-2 p-5 h-40 w-72 border-[#5c5c5c] border-4 rounded-xl items-center justify-center flex" onClick={goToProjectCreation}>
                <p className="text-8xl mb-5 text-[#5c5c5c]">+</p>
              </div>
            </div>
        </div>
      </>
  );
}
