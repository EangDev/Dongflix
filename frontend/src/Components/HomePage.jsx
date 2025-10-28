import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faUser, faMagnifyingGlass, faHouse,   
faComments, faBook, faEnvelope,
faScroll
} from "@fortawesome/free-solid-svg-icons";
import './style/HomePageStyle.css';
import logo from '../Assets/mylogo.png';
import BannerPage from '../Components/BannerPage';

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
              <FontAwesomeIcon icon={faHouse} color="#ccc" size="2px"/>
              <a href="#">Home</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faScroll} color="#ccc" size="2px"/>
              <a href="#">About Us</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faComment} color="#ccc" size="2px"/>
              <a href="#">Contact Us</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faBook} color="#ccc" size="2px"/>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faComments} color="#ccc" size="2px"/>
              <a href="#">FQA</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faUser} color="#ccc" size="2px"/>
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
    </header>
  );
}

export default HomePage;
