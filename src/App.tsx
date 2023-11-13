import {BrowserRouter, Routes, Route } from "react-router-dom";

// pages
import Home from "./pages/main/home/home";

export default function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        
        <Route path="/" element={
          <>
          <Home/>
          </>
        }/>

      </Routes>
    </BrowserRouter>
    </>
  )
}