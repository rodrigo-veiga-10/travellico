import {BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import axios from "axios";

// pages
import Home from "./pages/main/home/home";

//components
import Setup from "./pages/main/components/setup/setup";
import { useEffect } from "react";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/setup" element={<Setup />} />
        <Route path="/" element={<Home />} />
      </Routes>
      <CheckUser />
    </BrowserRouter>
  );
}

function CheckUser() {
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
        } catch (error) {
          navigate("/setup");
        }
      });
  }, [navigate]);

  return null;
}