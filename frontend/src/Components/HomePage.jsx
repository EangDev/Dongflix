import React, { useState } from "react";
import './style/HomePageStyle.css';
import logo from '../Assets/loading.gif';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery) return;
    // Navigate or fetch API with searchQuery
    console.log("Searching for:", searchQuery);
  };

  return(
    <div className="Header">
        <header>
            <div className="logoImg">
                <img src={logo} alt="" />
            </div>
        </header>
    </div>
  );
}

export default HomePage;
