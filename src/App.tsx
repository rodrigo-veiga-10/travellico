import {BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";
import { listen } from '@tauri-apps/api/event'

// pages
import Home from "./pages/main/home/home";
import Settings from "./pages/config/settings/settings";

//components
import Setup from "./pages/main/components/setup/setup";
import ProjectCreation from "./pages/main/components/project/projectCreation";
import { useEffect, useState } from "react";

export default function App() {
  
  const [userChecked, setUserChecked] = useState(false);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup" element={<Setup />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/project/create" element={<ProjectCreation/>}/>
        <Route path="/" element={<Home />} />
      </Routes>
      {!userChecked && <CheckUser setUserChecked={setUserChecked} />}
      <UseSettingsListener />
    </BrowserRouter>
  );
}


function CheckUser({ setUserChecked }: any) {
  let navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:3000/user/info/data")
      .then((res) => {
        try {
          const data = JSON.parse(res.data.message);
          if (data.setup === true) {
            navigate("/");
          } else {
            navigate("/setup");
          }
          console.log("res", data);
          setUserChecked(true);
        } catch (error) {
          navigate("/setup");
          setUserChecked(true);
        }
      });
  }, [navigate]);

  return null;
}

function UseSettingsListener() {
  let navigate = useNavigate();

  useEffect(() => {
    listen("settings", _event => {
      navigate("/settings");
    })
  }, [navigate]);
  return null;
}
