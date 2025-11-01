import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./Components/HomePage";
import WatchPage from "./Components/WatchPage";
import AboutPage from "./Components/AboutPage";
import ContactPage from "./Components/ContactPage";
import SupportPage from "./Components/SupportPage";

function App(){
  return(
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/watch" element={<WatchPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/support" element={<SupportPage />} />
      </Routes>
    </Router>
  )
}

export default App