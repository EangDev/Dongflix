import React, { useState, useEffect, Select } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style/ContactPageStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faMagnifyingGlass, faHouse,
  faHeart, faBookOpen, faEnvelope, faTelevision
} from "@fortawesome/free-solid-svg-icons";
import logo from '../Assets/mylogo.png';
import loadingImg from '../Assets/loading.gif';
import FooterDonghuaPage from '../Components/FooterPage';

function ContactPage(){
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
                <div className="contact-header-container">
                    <div className="contact-logo-img">
                        <Link to="/"><img src={logo} alt="logo" /></Link>
                    </div>

                    <div className="contact-search-box">
                        <input
                        type="text"
                        className="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowSuggestions(filteredDonghua.length > 0)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        />
                        <button id="contact-btn-search" onClick={() => handleSelectAnime(filteredDonghua[0])}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="contact-Magnifying" />
                        </button>

                        {showSuggestions && (
                        <div className="contact-search-suggestions">
                            {filteredDonghua.slice(0, 5).map((item, index) => (
                            <div
                                key={index}
                                className="contact-search-suggestion-item"
                                onClick={() => handleSelectAnime(item)}
                            >
                                <div style={{ position: "relative", display: "inline-block" }}>
                                <img
                                    src={item.image || item.thumbnail}
                                    alt={item.title}
                                    className="contact-suggestion-img"
                                />
                                </div>
                                <span>{item.title}</span>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>

                    <div className="contact-menu-text">
                        <ul>
                            <li><FontAwesomeIcon icon={faHouse} color="#ccc" size="lg" /><Link to="/">Home</Link></li>
                            <li><FontAwesomeIcon icon={faBookOpen} color="#ccc" size="lg" /><Link to="/about">About</Link></li>
                            <li><FontAwesomeIcon icon={faEnvelope} color="#ccc" size="lg" /><Link to="/contact">Contact</Link></li>
                            <li><FontAwesomeIcon icon={faHeart} color="#ccc" size="lg" /><Link to="/support">Support Us</Link></li>
                            <li><FontAwesomeIcon icon={faTelevision} color="#ccc" size="lg" /><Link to="/hide">Hide ADS</Link></li>
                            <li><FontAwesomeIcon icon={faUser} color="#ccc" size="lg" /><Link to="/login">Sign In</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="contact-container-1">
                    <div className="contact-animated-text">
                        <div className="contact-animation-txt">
                        💖 Welcome to DongFlix — Your ultimate world of donghua! From the fiery battles of Battle Through the Heavens ⚔️ to the mystical realms of Soul Land 💥 and Perfect World 🌏, get ready to embark on endless adventures 🌈 that will leave you inspired!
                        </div>
                    </div>
                </div>
                {/*--Detail of About Us--*/}
                <div className="contact-detail-container">
                    {/* Left Section: Contact Form */}
                    <div className="contact-detail-left">
                        <h2>Contact & Support</h2>
                        <p className="contact-subtext">Send us a message — we'll response as soon as possible.</p>

                        <form className="contact-form">
                            <div className="contact-form-group">
                                <label htmlFor="department">Department</label>
                                <select id="department" name="department">
                                    <option>General Support</option>
                                    <option>Technical Support</option>
                                    <option>Billing</option>
                                </select>
                            </div>

                            <div className="contact-form-group">
                                <label htmlFor="subject">Subject</label>
                                <input
                                id="subject"
                                type="text"
                                placeholder="How can we help?"
                                />
                            </div>

                            <div className="contact-form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                id="message"
                                rows="6"
                                placeholder="Type your message here..."
                                ></textarea>
                            </div>

                            <p className="contact-note">
                                Please keep your message clear. Basic formatting is supported.
                            </p>

                            <button type="submit" className="contact-send-btn">
                                Send message
                            </button>
                        </form>
                    </div>

                    {/* Right Section: Notes & Contact Info */}
                    <div className="contact-detail-right">
                        <div className="contact-notes">
                            <h3>Notes</h3>
                            <ul> 
                                <li>Your account email will be used as Reply-To.</li>
                                <li>Please avoid sending sensitive information.</li>
                            </ul>
                        </div>

                        <div className="contact-other-ways">
                            <h3>Other ways to reach us</h3>
                            <button>Telegram</button>
                            <button>Facebook</button>
                            <button>YouTube</button>
                            <button>Instagram</button>
                        </div>

                        <div className="contact-public-email">
                            <h3>Contact by emails</h3>
                            <button>eangdev.gamedev@gmail.com</button>
                        </div>
                    </div>
                </div>
            </header>
            <footer>
                <div className="contact-donghua-body-section">
                    <FooterDonghuaPage />
                </div>
            </footer>
        </>
    );
}

export default ContactPage;