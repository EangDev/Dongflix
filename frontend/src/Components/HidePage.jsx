import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style/HidePageStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSketch, faWebAwesome } from "@fortawesome/free-brands-svg-icons";
import {
  faUser, faMagnifyingGlass, faHouse,
  faHeart, faBookOpen, faEnvelope, faTelevision
} from "@fortawesome/free-solid-svg-icons";
import logo from "../Assets/mylogo.png";
import loadingImg from "../Assets/loading.gif";
import defaultAvatar from "../Assets/avatar/A1.png";
import FooterDonghuaPage from "../Components/FooterPage";

function HidePage() {
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

  const [bookmarks, setBookmarks] = useState([]);
  const [recentlyWatched, setRecentlyWatched] = useState(() => {
    const saved = localStorage.getItem("recentlyWatched");
    return saved ? JSON.parse(saved) : [];
  });

  const getCleanTitle = (title) => {
    if (!title) return "";
    return title.replace(/Episode\s*\d+/i, "").trim();
  };

  //Fetch all donghua (for search)
  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/all");
        const data = await res.json();
        setAllDonghua(data.results || []);
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  // Fetch user's bookmarks
  useEffect(() => {
    if (!user) return;
    const fetchBookmarks = async () => {
      try {
        const res = await fetch(`http://127.0.0.1:8000/api/bookmarks/${user.user_id}`);
        const data = await res.json();
        setBookmarks(data);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      }
    };
    fetchBookmarks();
  }, [user]);

  // Optional: refresh when profile mounts
  useEffect(() => {
    const saved = localStorage.getItem("recentlyWatched");
    if (saved) setRecentlyWatched(JSON.parse(saved));
  }, []);

  //Search box filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredDonghua([]);
      setShowSuggestions(false);
      return;
    }
    const results = allDonghua.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) && item.link
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
      {/* --- HEADER --- */}
      <header>
        <div className="ads-header-container">
          <div className="ads-logo-img">
            <Link to="/"><img src={logo} alt="logo" /></Link>
          </div>

          {/* Search box */}
          <div className="ads-search-box">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(filteredDonghua.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <button id="ads-btn-search" onClick={() => handleSelectAnime(filteredDonghua[0])}>
              <FontAwesomeIcon icon={faMagnifyingGlass} className="ads-Magnifying" />
            </button>

            {showSuggestions && (
              <div className="ads-search-suggestions">
                {filteredDonghua.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="ads-search-suggestion-item"
                    onClick={() => handleSelectAnime(item)}
                  >
                    <img
                      src={item.image || item.thumbnail}
                      alt={item.title}
                      className="ads-suggestion-img"
                    />
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Menu */}
          <div className="ads-menu-text">
            <ul>
              <li><FontAwesomeIcon icon={faHouse} /><Link to="/">Home</Link></li>
              <li><FontAwesomeIcon icon={faBookOpen} /><Link to="/about">About</Link></li>
              <li><FontAwesomeIcon icon={faEnvelope} /><Link to="/contact">Contact</Link></li>
              <li><FontAwesomeIcon icon={faHeart} /><Link to="/support">Support Us</Link></li>
              <li><FontAwesomeIcon icon={faTelevision} /><Link to="/hide">Bookmark</Link></li>
              <li>
                {user ? (
                  <div className="user-avatar-container" onClick={() => navigate("/profile")}>
                    <img
                      src={user.avatar || defaultAvatar}
                      alt={user.username}
                      className="user-avatar-circle"
                    />
                    <span className="user-avatar-username">{user.username}</span>
                  </div>
                ) : (
                  <Link to="/login">
                    <FontAwesomeIcon icon={faUser} /> Sign In
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="ads-container-1">
          <div className="ads-animated-text">
            <div className="ads-animation-txt">
              💫 Welcome to Your Bookmarks — Save your 💖💕 favorite donghua and 🎞️🖼️ continue watching anytime! 💎💸 This free for now after the update maybe we'll put the premium package 💵💳💸💵, so that i can made some fund to develope new feature 👑👑!.
            </div>
          </div>
        </div>
      </header>

      {/* --- BOOKMARK SECTION --- */}
      <section className="bookmark-section">
        <div className="bookmark-header">
          <h2>⭐ Your Bookmarked Donghua</h2>
          <p>All the donghua you’ve saved for later are listed below.</p>
        </div>

        <div className="bookmark-container">
          {user ? (
            bookmarks.length > 0 ? (
              <div className="bookmark-grid">
                {bookmarks.map((item, index) => (
                  <div key={index} className="bookmark-favorite-item">
                    <img src={item.image || item.thumbnail} alt={item.title} />
                    <span>{getCleanTitle(item.title)}</span>
                    <div className="bookmark-button">
                      <button className="watch-btn" onClick={() => handleSelectAnime(item)}>Watch</button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bookmark-login-reminder">
                <p>No bookmarks yet. Go explore and add some donghua to your list!</p>
                <Link to="/" className="bookmark-login-btn">Browse Donghua</Link>
              </div>
            )
          ) : (
            <div className="bookmark-login-reminder">
              <p>⚠️ Please log in to view your bookmarks.</p>
              <Link to="/login" className="bookmark-login-btn">Log In</Link>
            </div>
          )}
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer>
        <FooterDonghuaPage />
      </footer>
    </>
  );
}

export default HidePage;
