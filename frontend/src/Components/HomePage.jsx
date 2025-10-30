import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMagnifyingGlass, faHouse, faHeart, faBookOpen, faEnvelope, faTelevision } from "@fortawesome/free-solid-svg-icons";
import './style/HomePageStyle.css';
import logo from '../Assets/mylogo.png';
import BannerPage from '../Components/BannerPage';
import LatestDonghuaPage from './LatestPage';
import PopularDonghuaPage from '../Components/PopularPage';
import CompleteDonghuaPage from '../Components/CompletePage';
import loadingImg from '../Assets/loading.gif';

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [allDonghua, setAllDonghua] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const lucifer = await fetch("http://127.0.0.1:8001/lucifer").then(res => res.json());
        const kisskh = await fetch("http://127.0.0.1:8000/api/animate").then(res => res.json());

        // Add category manually if missing
        const luciferData = (lucifer.data || []).map(item => ({ ...item, category: "latest" }));
        const kisskhData = (kisskh.results || []).map(item => ({ ...item, category: "popular" }));
        const kisskhComData = (kisskh.results || []).map(item => ({ ...item, category: "completed" }));

        const merged = [...luciferData, ...kisskhData, ...kisskhComData];
        setAllDonghua(merged);
      } catch (err) {
        console.error("Failed to fetch merged data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  const handleSearch = () => {
    if (!searchQuery) return;
    console.log("Searching for:", searchQuery);
  };

  if (loading) return (
    <div className='loading'>
        <img src={loadingImg} alt="Loading..." />
        <p className='loading-text'>Loading...</p>
    </div>
  );

  return (
    <header>
      <div className="header-container">
        <div className="logo-img">
          <img src={logo} alt="logo" />
        </div>
        <div className="search-box">
          <input type="text" className="search" placeholder="Search..." />
          <button id="btn-search" onClick={handleSearch}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="Magnifying"/>
          </button>
        </div>
        <div className="menu-text">
          <ul>
            <li>
              <FontAwesomeIcon icon={faHouse} color="#ccc" size="lg"/>
              <Link to="/">Home</Link>
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
          <div className="animation-txt">Welcome to DongFlix ^_____^ ...</div>
        </div>
      </div>

      <div className="container-2">
        <div className="banner-show">
          <BannerPage />
        </div>
      </div>

      <div className="container-3">
        <div className="donghua-body-section">
          <PopularDonghuaPage data={allDonghua} />
          <LatestDonghuaPage data={allDonghua} />
          <CompleteDonghuaPage data={allDonghua} />
        </div>
      </div>
    </header>
  );
}

export default HomePage;
