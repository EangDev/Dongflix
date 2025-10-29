import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMagnifyingGlass, faHouse,   
faHeart, faBookOpen, faEnvelope, faTelevision
} from "@fortawesome/free-solid-svg-icons";
import './style/HomePageStyle.css';
import logo from '../Assets/mylogo.png';
import BannerPage from '../Components/BannerPage';
import LatestDonghuaPage from './LatestPage';
import PopularDonghuaPage from '../Components/PopularPage';
import CompleteDonghuaPage from '../Components/CompletePage';


function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery) return;
    // Navigate or fetch API with searchQuery
    console.log("Searching for:", searchQuery);
  };

  return(
    <header>
      <div className="header-container">
        <div className="logo-img">
          <img src={logo} alt="logo" />
        </div>
        <div className="search-box">
          <input type="text" className="search" placeholder="Search..."/>
          <button id="btn-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="Magnifying"/>
          </button>
        </div>
        <div className="menu-text">
          <ul>
            <li>
              <FontAwesomeIcon icon={faHouse} color="#ccc" size="lg"/>
              <a href="#">Home</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faBookOpen} color="#ccc" size="lg"/>
              <a href="#">About Us</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faEnvelope} color="#ccc" size="lg"/>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faHeart} color="#ccc" size="lg"/>
              <a href="#">Support Us</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faTelevision} color="#ccc" size="lg"/>
              <a href="#">Hide ADS</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faUser} color="#ccc" size="lg"/>
              <button id="btn-signin">Sign in</button>
            </li>
          </ul>
        </div>
      </div>
      <div className="container-1">
        <div className="animated-text">
          <div className="animation-txt">Welcome to DongFlix ^_____^ where worlds collide and legends rise!
          Watch (●'◡'●)💕Renegade Immortal, 💀Perfect World, 🤩Battle Through the Heavens, etc.
          Sit back🍜 relax🥱😴 and enjoy your Donghua adventure!⚔️</div>
        </div>
      </div>
      <div className="container-2">
        <div className="banner-show">
          <BannerPage />
        </div>
      </div>
      <div className="container-3">
        <div className="donghua-body-section">
          <PopularDonghuaPage />
          <LatestDonghuaPage />
          <CompleteDonghuaPage />
        </div>
      </div>
    </header>
  );
}

export default HomePage;
