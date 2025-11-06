import React, { useState, useEffect } from "react";
import "./style/Editprofile.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faMagnifyingGlass,
  faHouse,
  faHeart,
  faBookOpen,
  faEnvelope,
  faTelevision,
} from "@fortawesome/free-solid-svg-icons";
import logo from "../Assets/mylogo.png";
import FooterDonghuaPage from "./FooterPage";
import loadingImg from "../Assets/loading.gif";
import defaultAvatar from "../Assets/avatar/A1.png";

function Editprofile() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [allDonghua, setAllDonghua] = useState([]);
  const [filteredDonghua, setFilteredDonghua] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [showAvatarGrid, setShowAvatarGrid] = useState(false);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Fetch all donghua
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

  // Search filter
  useEffect(() => {
    if (!searchQuery) {
      setFilteredDonghua([]);
      setShowSuggestions(false);
      return;
    }

    const results = allDonghua.filter(
      (item) =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        item.link
    );

    setFilteredDonghua(results);
    setShowSuggestions(results.length > 0);
  }, [searchQuery, allDonghua]);

  // Navigate to donghua
  const handleSelectAnime = (item) => {
    if (!item.link) return;
    navigate(
      `/watch?url=${encodeURIComponent(item.link)}&image=${encodeURIComponent(
        item.image || item.thumbnail
      )}`
    );
    setSearchQuery("");
    setShowSuggestions(false);
  };

  if (loading)
    return (
      <div className="loading">
        <img src={loadingImg} alt="Loading..." />
        <p className="loading-text">Loading...</p>
      </div>
    );

  return (
    <>
      <header>
        <div className="edit-profile-header-container">
          <div className="edit-profile-logo-img">
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
          </div>

          <div className="edit-profile-search-box">
            <input
              type="text"
              className="search"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setShowSuggestions(filteredDonghua.length > 0)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            />
            <button
              id="edit-profile-btn-search"
              onClick={() => handleSelectAnime(filteredDonghua[0])}
            >
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="edit-profile-Magnifying"
              />
            </button>

            {showSuggestions && (
              <div className="edit-profile-search-suggestions">
                {filteredDonghua.slice(0, 5).map((item, index) => (
                  <div
                    key={index}
                    className="edit-profile-search-suggestion-item"
                    onClick={() => handleSelectAnime(item)}
                  >
                    <img
                      src={item.image || item.thumbnail}
                      alt={item.title}
                      className="edit-profile-suggestion-img"
                    />
                    <span>{item.title}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="edit-profile-menu-text">
            <ul>
              <li>
                <FontAwesomeIcon icon={faHouse} color="#ccc" size="lg" />
                <Link to="/">Home</Link>
              </li>
              <li>
                <FontAwesomeIcon icon={faBookOpen} color="#ccc" size="lg" />
                <Link to="/about">About</Link>
              </li>
              <li>
                <FontAwesomeIcon icon={faEnvelope} color="#ccc" size="lg" />
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <FontAwesomeIcon icon={faHeart} color="#ccc" size="lg" />
                <Link to="/support">Support Us</Link>
              </li>
              <li>
                <FontAwesomeIcon icon={faTelevision} color="#ccc" size="lg" />
                <Link to="/hide">Hide ADS</Link>
              </li>
              <li>
                {user ? (
                  <div
                    className="user-avatar-container"
                    onClick={() => navigate("/profile")}
                  >
                    <img
                      src={user.avatar || defaultAvatar}
                      alt={user.username}
                      className="user-avatar-circle"
                    />
                    <span className="user-avatar-username">
                      {user.username}
                    </span>
                  </div>
                ) : (
                  <Link to="/login">
                    <FontAwesomeIcon icon={faUser} color="#ccc" size="lg" />{" "}
                    Sign In
                  </Link>
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="edit-profile-container-1">
          <div className="edit-profile-animated-text">
            <div className="edit-profile-animation-txt">
              💖 Welcome to DongFlix — Your ultimate world of donghua! From the
              fiery battles of Battle Through the Heavens ⚔️ to the mystical
              realms of Soul Land 💥 and Perfect World 🌏, get ready for endless
              adventures 🌈!
            </div>
          </div>
        </div>
      </header>

       {/* Avatar Section should be outside the header */}
        <div className="edit-profile-container-2">
        <h3>Choose Your Avatar</h3>

        {/* Big Avatar */}
        <div
            className="big-avatar-container"
            onClick={() => setShowAvatarGrid(!showAvatarGrid)}
        >
            <img
            src={user?.avatar || defaultAvatar}
            alt={user?.username || "User"}
            className="big-avatar-img"
            />
            <p>Click to change or upload new avatar</p>
        </div>

        {/* Upload Custom Avatar */}
        <div className="upload-avatar">
            <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    const updatedUser = { ...user, avatar: reader.result };
                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser));
                };
                reader.readAsDataURL(file);
                }
            }}
            />
        </div>

        {/* Avatar Grid */}
        {showAvatarGrid && (
            <div className="avatar-grid">
            {["A1.png", "A2.png", "A3.png", "A4.png", "A5.png"].map(
                (avatarName, index) => {
                const avatarPath = require(`../Assets/avatar/${avatarName}`);
                return (
                    <div
                    key={index}
                    className="avatar-item"
                    onClick={() => {
                        const updatedUser = { ...user, avatar: avatarPath };
                        setUser(updatedUser);
                        localStorage.setItem("user", JSON.stringify(updatedUser));
                        setShowAvatarGrid(false);
                    }}
                    >
                    <img
                        src={avatarPath}
                        alt={avatarName}
                        className="avatar-img"
                    />
                    </div>
                );
                }
            )}
            </div>
        )}
        </div>

      <footer>
        <FooterDonghuaPage />
      </footer>
    </>
  );
}

export default Editprofile;
