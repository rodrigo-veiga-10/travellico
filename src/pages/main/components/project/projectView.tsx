import { useNavigate } from "react-router-dom";

export default function ProjectView() {
  const navigate = useNavigate();

  const goToProjectCreation = () => {
    navigate("project/creation")
  };

  return (
      <>
        <div className="p-14">
            <h3 className="text-center text-5xl">Projects</h3>
            <div className="p-5 h-40 w-72 border-[#5c5c5c] border-4 rounded-xl items-center justify-center flex" onClick={goToProjectCreation}>
            <p className="text-8xl mb-5 text-[#5c5c5c]">+</p>
            </div>
        </div>
      </>
  );
}
