import React, { useState, useEffect } from "react";
import "../Components/style/profile.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faMagnifyingGlass, faHouse, faHeart, faBookOpen, faEnvelope, faTelevision } from "@fortawesome/free-solid-svg-icons";
import logo from '../Assets/mylogo.png';
import FooterDonghuaPage from './FooterPage';
import loadingImg from '../Assets/loading.gif';
import defaultAvatar from '../Assets/avatar/A1.png';

function Profile(){
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
    
    const getCleanTitle = (title) => {
        if (!title) return "";
        return title.replace(/Episode\s*\d+/i, "").trim();
    };

    const handleLogout = () => {
        localStorage.removeItem("user");
        setUser(null);
        setBookmarks([]);
        navigate("/login");
    };

     // Fetch bookmarks from backend
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

        if (!bookmarks.some(b => b.link === item.link)) {
            const updatedBookmarks = [...bookmarks, item];
            setBookmarks(updatedBookmarks);
            localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
        }
    };

    if (loading) return (
        <div className='loading'>
            <img src={loadingImg} alt="Loading..." />
            <p className='loading-text'>Loading...</p>
        </div>
    );

    return(
        <>
            <header>
                <div className="profile-header-container">
                    <div className="profile-logo-img">
                        <Link to="/"><img src={logo} alt="logo" /></Link>
                    </div>

                    <div className="profile-search-box">
                    <input
                        type="text"
                        className="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowSuggestions(filteredDonghua.length > 0)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    />
                    <button id="edit-profile-btn-search" onClick={() => handleSelectAnime(filteredDonghua[0])}>
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="edit-profile-Magnifying"/>
                    </button>

                    {showSuggestions && (
                        <div className="profile-search-suggestions">
                        {filteredDonghua.slice(0, 5).map((item, index) => (
                            <div
                            key={index}
                            className="profile-search-suggestion-item"
                            onClick={() => handleSelectAnime(item)}
                            >
                            <div style={{ position: "relative", display: "inline-block" }}>
                                <img
                                src={item.image || item.thumbnail} 
                                alt={item.title}
                                className="profile-suggestion-img"
                                />
                            </div> 
                            <span>{item.title}</span>
                            </div>
                        ))}
                        </div>
                    )}
                    </div>

                    <div className="profile-menu-text">
                        <ul>
                            <li><FontAwesomeIcon icon={faHouse} color="#ccc" size="lg"/><Link to="/">Home</Link></li>
                            <li><FontAwesomeIcon icon={faBookOpen} color="#ccc" size="lg"/><Link to="/about">About</Link></li>
                            <li><FontAwesomeIcon icon={faEnvelope} color="#ccc" size="lg"/><Link to="/contact">Comtact</Link></li>
                            <li><FontAwesomeIcon icon={faHeart} color="#ccc" size="lg"/><Link to="/support">Support Us</Link></li>
                            <li><FontAwesomeIcon icon={faTelevision} color="#ccc" size="lg"/><Link to="/hide">Bookmark</Link></li>
                            <li>
                            {user ? (
                                <div
                                className="user-avatar-container"
                                onClick={() => navigate("/profile")}
                                >
                                <img
                                    src={user?.avatar || defaultAvatar}
                                    alt={user?.username || "Guest"}
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

                <div className="profile-container-1">
                    <div className="profile-animated-text">
                        <div className="profile-animation-txt">
                            💖 Welcome to DongFlix — Your ultimate world of donghua! From the fiery battles of Battle Through the Heavens ⚔️ to the mystical realms of Soul Land 💥 and Perfect World 🌏, get ready to embark on endless adventures 🌈 that will leave you inspired!
                        </div>
                    </div>
                </div>
                <div className="profile-container-2">
                    <div className="profile-avatar-section">
                        <img
                            src={user?.avatar || defaultAvatar}
                            alt={user?.username || "Guest"}
                            className="profile-avatar-img"
                        />
                        <h2 className="profile-username">{user?.username || "Guest"}</h2>
                        <p className="profile-email">{user?.email || "your@email.com"}</p>
                        <button 
                            className="profile-edit-btn"
                            onClick={() => navigate("/edit-profile")}
                        >
                            Edit Profile
                        </button> 
                        <button
                            className="profile-logout-btn"
                            onClick={handleLogout}
                        >
                            Log Out
                        </button>
                    </div>

                    <div className="profile-info-section">
                        <div className="profile-section">
                            <h3>Bookmarks</h3>
                            <div className="profile-favorites">
                                {bookmarks.length > 0 ? bookmarks.map((item, index) => (
                                    <div key={index} className="profile-favorite-item">
                                        <img src={item.image || item.thumbnail} alt={item.title} className="profile-favorite-img"/>
                                        <span>{getCleanTitle(item.title)}</span>
                                        <button className="watch-btn" onClick={() => handleSelectAnime(item)}>Watch</button>
                                    </div>
                                )) : <p>No bookmarks yet</p>}
                            </div>
                        </div>
                    </div>
                </div>
            </header>                                                                                                   
            <footer>
                <div className="profile-footer-container">
                    <div className="profile-footer-header">
                        <FooterDonghuaPage />
                    </div>
                </div>
            </footer>
        </>
    );
}

export default Profile;