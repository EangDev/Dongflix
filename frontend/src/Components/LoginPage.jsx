import React, { useState, useEffect, Select } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style/LoginPageStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faMagnifyingGlass, faHouse,
  faHeart, faBookOpen, faEnvelope, faTelevision
} from "@fortawesome/free-solid-svg-icons";
import logo from '../Assets/mylogo.png';
import loadingImg from '../Assets/loading.gif';
import FooterDonghuaPage from '../Components/FooterPage';

function LoginPage(){
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [allDonghua, setAllDonghua] = useState([]);
    const [filteredDonghua, setFilteredDonghua] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [activeTab, setActiveTab] = useState("login");

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
    
    // Login form states
    const [loginEmail, setLoginEmail] = useState("");
    const [loginPassword, setLoginPassword] = useState("");

    // Signup form states
    const [signupName, setSignupName] = useState("");
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");

    const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login:", { loginEmail, loginPassword });
    
    };

    const handleSignup = (e) => {
    e.preventDefault();
    console.log("Signup:", { signupName, signupEmail, signupPassword });
    
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
                <div className="login-header-container">
                    <div className="login-logo-img">
                        <Link to="/"><img src={logo} alt="logo" /></Link>
                    </div>

                    <div className="login-search-box">
                        <input
                        type="text"
                        className="search"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onFocus={() => setShowSuggestions(filteredDonghua.length > 0)}
                        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                        />
                        <button id="login-btn-search" onClick={() => handleSelectAnime(filteredDonghua[0])}>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className="login-Magnifying" />
                        </button>

                        {showSuggestions && (
                        <div className="login-search-suggestions">
                            {filteredDonghua.slice(0, 5).map((item, index) => (
                            <div
                                key={index}
                                className="login-search-suggestion-item"
                                onClick={() => handleSelectAnime(item)}
                            >
                                <div style={{ position: "relative", display: "inline-block" }}>
                                <img
                                    src={item.image || item.thumbnail}
                                    alt={item.title}
                                    className="login-suggestion-img"
                                />
                                </div>
                                <span>{item.title}</span>
                            </div>
                            ))}
                        </div>
                        )}
                    </div>

                    <div className="login-menu-text">
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

                <div className="login-container-1">
                    <div className="login-animated-text">
                        <div className="login-animation-txt">
                        💖 Welcome to DongFlix — Your ultimate world of donghua! From the fiery battles of Battle Through the Heavens ⚔️ to the mystical realms of Soul Land 💥 and Perfect World 🌏, get ready to embark on endless adventures 🌈 that will leave you inspired!
                        </div>
                    </div>
                </div>
                {/*--Detail of About Us--*/}
                <div className="login-detail-container">
                    <div className="auth-card">
                        <div className="auth-tabs">
                        <button
                            className={`auth-tab ${activeTab === "login" ? "active" : ""}`}
                            onClick={() => setActiveTab("login")}
                        >
                            Sign In
                        </button>
                        <button
                            className={`auth-tab ${activeTab === "signup" ? "active" : ""}`}
                            onClick={() => setActiveTab("signup")}
                        >
                            Sign Up
                        </button>
                        </div>

                        {activeTab === "login" ? (
                        <form className="auth-form" onSubmit={handleLogin}>
                            <h3 className="auth-title">Welcome Back!</h3>
                            <input
                            type="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                            />
                            <input
                            type="password"
                            placeholder="Password"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                            />
                            <button type="submit" className="auth-btn">Login</button>
                            <p className="auth-note">
                            Don’t have an account?{" "}
                            <span onClick={() => setActiveTab("signup")} className="auth-switch">Sign Up</span>
                            </p>
                        </form>
                        ) : (
                        <form className="auth-form" onSubmit={handleSignup}>
                            <h3 className="auth-title">Create Account</h3>
                            <input
                            type="text"
                            placeholder="Username"
                            value={signupName}
                            onChange={(e) => setSignupName(e.target.value)}
                            required
                            />
                            <input
                            type="email"
                            placeholder="Email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                            required
                            />
                            <input
                            type="password"
                            placeholder="Password"
                            value={signupPassword}
                            onChange={(e) => setSignupPassword(e.target.value)}
                            required
                            />
                            <button type="submit" className="auth-btn">Sign Up</button>
                            <p className="auth-note">
                            Already have an account?{" "}
                            <span onClick={() => setActiveTab("login")} className="auth-switch">Sign In</span>
                            </p>
                        </form>
                        )}
                    </div>
                </div>
            </header>
            <footer>
                <div className="login-donghua-body-section">
                    <FooterDonghuaPage />
                </div>
            </footer>
        </>
    );
}

export default LoginPage;