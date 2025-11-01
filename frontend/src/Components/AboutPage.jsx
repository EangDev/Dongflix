import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style/AboutPageStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faMagnifyingGlass, faHouse,
  faHeart, faBookOpen, faEnvelope, faTelevision
} from "@fortawesome/free-solid-svg-icons";
import logo from '../Assets/mylogo.png';
import loadingImg from '../Assets/loading.gif';
import FooterDonghuaPage from '../Components/FooterPage';

function AboutPage() {
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

  return (
    <>
        <header>
            <div className="about-header-container">
                <div className="about-logo-img">
                    <Link to="/"><img src={logo} alt="logo" /></Link>
                </div>

                <div className="about-search-box">
                    <input
                    type="text"
                    className="search"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setShowSuggestions(filteredDonghua.length > 0)}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    <button id="about-btn-search" onClick={() => handleSelectAnime(filteredDonghua[0])}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="about-Magnifying" />
                    </button>

                    {showSuggestions && (
                    <div className="about-search-suggestions">
                        {filteredDonghua.slice(0, 5).map((item, index) => (
                        <div
                            key={index}
                            className="about-search-suggestion-item"
                            onClick={() => handleSelectAnime(item)}
                        >
                            <div style={{ position: "relative", display: "inline-block" }}>
                            <img
                                src={item.image || item.thumbnail}
                                alt={item.title}
                                className="about-suggestion-img"
                            />
                            </div>
                            <span>{item.title}</span>
                        </div>
                        ))}
                    </div>
                    )}
                </div>

                <div className="about-menu-text">
                    <ul>
                        <li><FontAwesomeIcon icon={faHouse} color="#ccc" size="lg" /><Link to="/">Home</Link></li>
                        <li><FontAwesomeIcon icon={faBookOpen} color="#ccc" size="lg" /><Link to="/about">About</Link></li>
                        <li><FontAwesomeIcon icon={faEnvelope} color="#ccc" size="lg" /><Link to="/contact">Contact</Link></li>
                        <li><FontAwesomeIcon icon={faHeart} color="#ccc" size="lg" /><Link to="/support">Support Us</Link></li>
                        <li><FontAwesomeIcon icon={faTelevision} color="#ccc" size="lg" /><Link to="/hide">Hide Ads</Link></li>
                        <li><FontAwesomeIcon icon={faUser} color="#ccc" size="lg" /><button id="about-btn-signin">Sign in</button></li>
                    </ul>
                </div>
            </div>

            <div className="about-container-1">
                <div className="about-animated-text">
                    <div className="about-animation-txt">
                    💖 Welcome to DongFlix — Your ultimate world of donghua! From the fiery battles of Battle Through the Heavens ⚔️ to the mystical realms of Soul Land 💥 and Perfect World 🌏, get ready to embark on endless adventures 🌈 that will leave you inspired!
                    </div>
                </div>
            </div>
            {/*--Detail of About Us--*/}
            <div className="about-detail-container">
                <div className="about-detail-header">
                    {/*Left: Detail*/}
                    <h3 className="about-title">About Us</h3>
                    <h4>DONGFLIX</h4>
                    <p>Welcome to DongFlix — your ultimate gateway into the vibrant world of Donghua (Chinese animation)! 🌟
                    Here, imagination knows no limits, and every story unfolds with breathtaking art, powerful emotion, and epic adventures.</p>
                    <p>At DongFlix, we believe that Donghua deserves the spotlight — from legendary tales like Battle Through the Heavens ⚡ and Soul Land 🌌 to hidden gems waiting to be discovered. Our mission is simple: to bring fans closer to the magic of Chinese animation with high-quality streaming, smooth performance, and zero hassle.</p>
                    <p>💖 Whether you’re a long-time Donghua lover or just starting your journey, we’re here to make every moment unforgettable.
                    📺 Sit back, explore, and dive deep into worlds filled with heroes, spirits, and timeless legends — only on DongFlix.</p>
                    <p>✨ DongFlix — Where Legends Come Alive. ✨</p>
                    <p>All of the Videos here belong to Respected Studios. And the Story to Respected Authors/Writers. We are only providing Translation for you to enjoy.</p>
                    <p>We hope you enjoy our Donghua Anime/Chinese Anime as much as we enjoy offering them to you. If you have any questions or comments, please don’t hesitate to contact us.</p>
                    <p>Sincerely,</p>
                    <p>[Dongflix] </p>
                </div>
                {/*Right: Logo*/}
                <div className="about-detail-logo">
                    <img src={logo} alt="logo" />
                    <p className="about-logo-text">
                        DongFlix — Your gateway to amazing Donghua adventures! 🎬✨
                    </p>
                    <p className="about-detail-sincerely">
                        We are grateful to <span>Anime4i</span> for their API, which powers our website and helps us bring you the latest Donghua content seamlessly.
                    </p>
                </div>
            </div>
        </header>
        <footer>
            <div className="about-donghua-body-section">
                <FooterDonghuaPage />
            </div>
        </footer>
    </>
  );
}

export default AboutPage;
