import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment, faUser, faMagnifyingGlass, faHouse,   
faComments, faBook, faEnvelope
} from "@fortawesome/free-solid-svg-icons";
import './style/HomePageStyle.css';
import logo from '../Assets/mylogo.png';

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
            <FontAwesomeIcon icon={faMagnifyingGlass} className="Magnifying" color="white" size="3px"/>
          </button>
        </div>
        <div className="menu-text">
          <ul>
            <li>
              <FontAwesomeIcon icon={faHouse} color="white" size="2px"/>
              <a href="#">Home</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faUser} color="white" size="2px"/>
              <a href="#">About Us</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faComment} color="white" size="2px"/>
              <a href="#">Contact Us</a>
            </li>
            <li className="fixing-policy">
              <FontAwesomeIcon icon={faBook} color="white" size="2px"/>
              <a href="#">Privacy Policy</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faComments} color="white" size="2px"/>
              <a href="#">FQA</a>
            </li>
            <li className="fixing-request">
              <FontAwesomeIcon icon={faEnvelope} color="white" size="2px"/>
              <a href="#">Request Drama</a>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}

export default HomePage;
