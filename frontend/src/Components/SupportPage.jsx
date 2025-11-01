import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style/SupportPageStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faMagnifyingGlass, faHouse,
  faHeart, faBookOpen, faEnvelope, faTelevision
} from "@fortawesome/free-solid-svg-icons";
import logo from '../Assets/mylogo.png';
import loadingImg from '../Assets/loading.gif';
import FooterDonghuaPage from '../Components/FooterPage';

function SupportPage(){

    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [allDonghua, setAllDonghua] = useState([]);
    const [filteredDonghua, setFilteredDonghua] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuggestions, setShowSuggestions] = useState(false);
    
    {/*--this is for fetch the combined api from the backend--*/}
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
    
    {/*--this effect is for searching method--*/}
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
    
    if (loading) {
        return (
          <div className="loading">
            <img src={loadingImg} alt="Loading..." />
            <p className="loading-text">Loading...</p>
          </div>
        );
        }
    return(
        <>
            <header>
                <div className="support-header-container">
                    <div className="support-logo-img">
                        <Link to="/"><img src={logo} alt="logo" /></Link>
                    </div>

                    <div className="support-search-box">
                        <input
                        type="text"
                        className="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowSuggestions(filteredDonghua.length > 0)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        />
                        <button id="support-btn-search" onClick={() => handleSelectAnime(filteredDonghua[0])}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="support-Magnifying" />
                        </button>

                        {showSuggestions && (
                        <div className="support-search-suggestions">
                            {filteredDonghua.slice(0, 5).map((item, index) => (
                            <div
                                key={index}
                                className="support-search-suggestion-item"
                                onClick={() => handleSelectAnime(item)}
                            >
                                <div style={{ position: "relative", display: "inline-block" }}>
                                <img
                                    src={item.image || item.thumbnail}
                                    alt={item.title}
                                    className="support-suggestion-img"
                                />
                                </div>
                                <span>{item.title}</span>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>

                    <div className="support-menu-text">
                        <ul>
                            <li><FontAwesomeIcon icon={faHouse} color="#ccc" size="lg" /><Link to="/">Home</Link></li>
                            <li><FontAwesomeIcon icon={faBookOpen} color="#ccc" size="lg" /><Link to="/about">About</Link></li>
                            <li><FontAwesomeIcon icon={faEnvelope} color="#ccc" size="lg" /><Link to="/contact">Contact</Link></li>
                            <li><FontAwesomeIcon icon={faHeart} color="#ccc" size="lg" /><a href="/support">Support Us</a></li>
                            <li><FontAwesomeIcon icon={faTelevision} color="#ccc" size="lg" /><Link to="/hide">Hide ADS</Link></li>
                            <li><FontAwesomeIcon icon={faUser} color="#ccc" size="lg" /><button id="support-btn-signin">Sign in</button></li>
                        </ul>
                    </div>
                </div>

                <div className="support-container-1">
                    <div className="support-animated-text">
                        <div className="support-animation-txt">
                        💖 Welcome to DongFlix — Your ultimate world of donghua! From the fiery battles of Battle Through the Heavens ⚔️ to the mystical realms of Soul Land 💥 and Perfect World 🌏, get ready to embark on endless adventures 🌈 that will leave you inspired!
                        </div>
                    </div>
                </div>
                {/*--Detail of About Us--*/}
                <div className="support-detail-container">
                    <div className="support-detail-header">
                        <h3 className="support-title">Support Us 💖</h3>
                        <p className="support-desc">
                        Love what we're doing at <strong>DongFlix</strong>? ☕  
                        Your support helps keep the site alive, improve performance, and bring
                        you the best donghua content without interruptions.  
                        Every coffee you buy helps us grow and continue our journey 💪
                        </p>

                        <div className="support-coffee-card">
                        <img
                            src={logo}
                            alt="DongFlix Support Logo"
                            className="support-coffee-logo"
                        />
                        <h4>Buy us a coffee!</h4>
                        <p>Click below to support us on Buy Me a Coffee ☕</p>

                        <a
                            href="https://buymeacoffee.com/dongflix"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="support-donate-btn"
                        >
                            ☕ Support DongFlix on Buy Me a Coffee
                        </a>

                        <p className="support-thankyou">Thank you for keeping DongFlix strong 💖</p>
                        </div>
                    </div>
                </div>
            </header>
            <footer>
                <div className="support-donghua-body-section">
                    <FooterDonghuaPage />
                </div>
            </footer>
        </>
    );
}

export default SupportPage;