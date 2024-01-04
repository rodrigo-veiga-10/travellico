import { ask } from "@tauri-apps/api/dialog";
import axios from "axios";
import { useEffect, useRef, useState} from "react";
import { useNavigate } from "react-router-dom";

export default function ProjectView() {
  const navigate = useNavigate();
  const Rename = useRef<HTMLInputElement>(null);
  const [IDBeingUsed, setIDBeingUsed] = useState("")
  let RenameCaller = 0;

  const goToProjectCreation = () => {
    navigate("project/create")
  };

  async function RenameIt(){
    console.log("called");
        
    if (Rename.current?.value === undefined || Rename.current.value === "") {
        alert("Empty names are not allowed. 😑");
    } else {
        try {
            const response = await axios.post("http://localhost:3000/project/rename", {
                id: IDBeingUsed,
                name: Rename.current?.value,
            });

            console.log(response);

            const message = response.data.message;

            if (message === "File renamed with success") {
                window.location.reload();
            } else {
                alert("There was an error renaming the file. Please restart the app and try again. If it doesn't work, contact the developer.");
            }
        } catch (error) {
            console.error("An error occurred during the request:", error);
            alert("An error occurred. Please check the console for details.");
        }
    }
  }

  function ShowProjects(){
    axios.post("http://localhost:3000/project/data" , {
      option: ""
    })
    .then((res) => {
      const projects = res.data.message
      for (let index = 0; index < projects.length; index++) {
        const project = projects[index];
        const project_html = document.createElement("div");
        project_html.className = "m-2 p-5 h-40 w-80 bg-gradient-to-b from-blue-950 to-blue-700 border-[#5c5c5c] border-4 rounded-xl items-center justify-center flex relative";

        // Create the parent container
        const threeDotsContainer = document.createElement("div");
        threeDotsContainer.className = "flex flex-col absolute top-0 right-0 p-2 cursor-pointer"

        // Create each dot
        for (let i = 0; i < 3; i++) {
          const dot = document.createElement("div");
          
          dot.className = "w-1 h-1 bg-gray-300 rounded-full mb-[3px]"

          threeDotsContainer.appendChild(dot);
        }
        const popUp = () => {
          const container = document.createElement("div")
          container.className = "absolute right-0 mt-2 w-40 bg-blue-950 border border-blue-900 rounded-md shadow-md mx-2"
          
          const renameHTML = document.createElement("button")
          renameHTML.className = "block w-full px-4 py-2 text-left hover:bg-blue-900"
          renameHTML.innerHTML = "Rename"
          renameHTML.onclick = async () => {
            const renameDialog = document.getElementById("rename_prompt") as HTMLDialogElement;
            RenameCaller += 1
            setIDBeingUsed(project_html.id)
        
            if (RenameCaller % 2 !== 0 || RenameCaller >= 2) {
                console.log(RenameCaller)
                console.log("called 2")
                renameDialog.showModal();
            }else{
              alert("Something is not good 😅")
            }
        };
        

          const deleteHTML = document.createElement("button")
          deleteHTML.className = "block w-full px-4 py-2 text-left hover:text-red-400 hover:bg-blue-900"
          deleteHTML.innerHTML = "Delete"
          deleteHTML.onclick = async () => {
            await ask(`Are you sure you want to delete ${name_formatted[0]}`)
            .then((res) => {
              if (res === true) {
                axios.post("http://localhost:3000/project/delete", {
                  id: project_html.id
                })
                .then((res) => {
                  const message = res.data.message;
                  if (message === "File deleted successfully") {
                    window.location.reload();
                  } else {
                    alert("There was an error deleting the file. Please restart the app and try again. If it doesn't work, contact the dev");
                  }
                });
              }
            });
          
          }
          
          container.appendChild(renameHTML)
          container.appendChild(deleteHTML)

          container.id = "changeProjectPopUp"
          return container
        }

        threeDotsContainer.onclick = () => {
          const popUpElement = project_html.querySelector("#changeProjectPopUp");

          if (popUpElement) {
            // Pop-up exists, remove it
            project_html.removeChild(popUpElement);
          } else {
            // Pop-up doesn't exist, append it
            const popUP = popUp();
            project_html.appendChild(popUP);
          }


        }

        // Append the container to the document body or any other desired location
       project_html.appendChild(threeDotsContainer)


        const name_project = document.createElement("p");
        name_project.className = "text-2xl text-white";


        const name: string = project.name
        const name_formatted = name.split(".")
        name_project.innerHTML = `${name_formatted[0]}`;
        name_project.className = "relative text-2xl cursor-pointer"

        name_project.onclick = () => {
          let id = project_html.id
          navigate(`/project/edit`, { state: { project_id: id } });
        }

        // Append name_project to project_html
        project_html.appendChild(name_project);

        const id_formatted = project.id.toString()


        project_html.id = id_formatted


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
              <div className="m-2 p-5 h-40 w-72 border-[#5c5c5c] border-4 rounded-xl items-center justify-center flex relative" onClick={goToProjectCreation}>
                <p className="text-8xl mb-5 text-[#5c5c5c]">+</p>
              </div>
            </div>
        </div>

          <dialog id="rename_prompt" className="modal">
            <div className="p-10 bg-slate-900 text-gray-400 text-2xl flex-col text-center items-center">
              <h3 className="font-bold">Rename your project</h3>
              <p className="py-4 text-lg">Write the new name in the box below</p>
              <form onSubmit={(e) => e.preventDefault()} className="flex items-center mr-5">
                <input
                  type="text"
                  ref={Rename}
                  className="bg-slate-800 w-full md:w-[360px] h-[50px] rounded-2xl text-xl border border-slate-600 p-3 outline-none text-stone-300 ml-6"
                />
              </form>
              <button
                className="bg-slate-800 rounded-xl p-3 px-10 mt-7"
                onClick={() => {
                  const renamePrompt = document.getElementById('rename_prompt') as HTMLDialogElement;
                  RenameCaller = RenameCaller + 2;
                  RenameIt()
                  renamePrompt.close();
                }}
              >
                Confirm
              </button>
            </div>
          </dialog>

      </>
  );
}
