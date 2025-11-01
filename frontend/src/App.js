import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import DetailPage from "./Components/DetailPage";
import WatchPage from "./Components/WatchPage";
import AboutPage from "./Components/AboutPage";
function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/detail/:id" element={<DetailPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/watch" element={<WatchPage />} />
      </Routes>
    </Router>
  )
}

export default App