import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMagnifyingGlass, faHouse, faHeart, faBookOpen, faEnvelope, faTelevision } from "@fortawesome/free-solid-svg-icons";
import './style/HomePageStyle.css';
import logo from '../Assets/mylogo.png';
import BannerPage from '../Components/BannerPage';
import LatestDonghuaPage from './LatestPage';
import PopularDonghuaPage from '../Components/PopularPage';
import CompleteDonghuaPage from '../Components/CompletePage';
import FooterDonghuaPage from '../Components/FooterPage';
import loadingImg from '../Assets/loading.gif';
import defaultAvatar from '../Assets/avatar/A1.png';

function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [allDonghua, setAllDonghua] = useState([]);
  const [filteredDonghua, setFilteredDonghua] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/all");
        const data = await res.json();
        setAllDonghua(data.results || []);
      } catch (err) {
        console.error("Failed to fetch combined data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);

  // Live search
  useEffect(() => {
    if (!searchQuery) {
      setFilteredDonghua([]);
      setShowSuggestions(false);
      return;
    }

    const results = allDonghua.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.link
    );

    setFilteredDonghua(results);
    setShowSuggestions(results.length > 0);
  }, [searchQuery, allDonghua]);

  const handleSelectAnime = (item) => {
    if (!item.link) return;
    navigate(`/watch?url=${encodeURIComponent(item.link)}&image=${encodeURIComponent(item.image || item.thumbnail)}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };

  if (loading) return (
    <div className='loading'>
      <img src={loadingImg} alt="Loading..." />
      <p className='loading-text'>Loading...</p>
    </div>
  );

  return (
    <header>
      <div className="homepage-header-container">
        <div className="homepage-logo-img">
          <Link to="/"><img src={logo} alt="logo" /></Link>
        </div>

        <div className="homepage-search-box">
          <input
            type="text"
            className="search"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(filteredDonghua.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          <button id="homepage-btn-search" onClick={() => handleSelectAnime(filteredDonghua[0])}>
            <FontAwesomeIcon icon={faMagnifyingGlass} className="homepage-Magnifying"/>
          </button>

          {showSuggestions && (
            <div className="homepage-search-suggestions">
              {filteredDonghua.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="homepage-search-suggestion-item"
                  onClick={() => handleSelectAnime(item)}
                >
                  <div style={{ position: "relative", display: "inline-block" }}>
                    <img
                      src={item.image || item.thumbnail} 
                      alt={item.title}
                      className="homepage-suggestion-img"
                    />
                  </div>
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="homepage-menu-text">
          <ul>
            <li><FontAwesomeIcon icon={faHouse} color="#ccc" size="lg"/><Link to="/">Home</Link></li>
            <li><FontAwesomeIcon icon={faBookOpen} color="#ccc" size="lg"/><Link to="/about">About</Link></li>
            <li><FontAwesomeIcon icon={faEnvelope} color="#ccc" size="lg"/><Link to="/contact">Comtact</Link></li>
            <li><FontAwesomeIcon icon={faHeart} color="#ccc" size="lg"/><Link to="/support">Support Us</Link></li>
            <li><FontAwesomeIcon icon={faTelevision} color="#ccc" size="lg"/><Link to="/hide">Hide ADS</Link></li>
            <li>
              {user ? (
                <div
                  className="user-avatar-container"
                  onClick={() => navigate("/profile")}
                >
                  <img
                    src={defaultAvatar || "/default-user.png"} // fallback if no avatar
                    alt={user.username}
                    className="user-avatar-circle"
                  />
                  <span className="user-avatar-username">{user.username}</span>
                </div>
              ) : (
                <Link to="/login">
                  <FontAwesomeIcon icon={faUser} color="#ccc" size="lg" /> Sign In
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>

      <div className="homepage-container-1">
        <div className="homepage-animated-text">
          <div className="homepage-animation-txt">
            💖 Welcome to DongFlix — Your ultimate world of donghua! From the fiery battles of Battle Through the Heavens ⚔️ to the mystical realms of Soul Land 💥 and Perfect World 🌏, get ready to embark on endless adventures 🌈 that will leave you inspired!
          </div>
        </div>
      </div>

      <div className="homepage-container-2">
        <div className="homepage-banner-show"><BannerPage /></div>
      </div>

      <div className="homepage-container-3">
        <div className="homepage-donghua-body-section">
          <PopularDonghuaPage data={allDonghua} />
          <LatestDonghuaPage data={allDonghua} />
          <CompleteDonghuaPage data={allDonghua} />
          <FooterDonghuaPage />
        </div>
      </div>
    </header>
  );
}

export default HomePage;
