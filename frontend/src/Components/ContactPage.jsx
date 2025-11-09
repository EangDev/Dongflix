import React, { useState, useEffect, Select } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./style/ContactPageStyle.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram, faFacebook, faYoutube } from "@fortawesome/free-brands-svg-icons";
import {
  faUser, faMagnifyingGlass, faHouse,
  faHeart, faBookOpen, faEnvelope, faTelevision
} from "@fortawesome/free-solid-svg-icons";
import logo from '../Assets/mylogo.png';
import loadingImg from '../Assets/loading.gif';
import FooterDonghuaPage from '../Components/FooterPage';
import defaultAvatar from '../Assets/avatar/A1.png';

function ContactPage(){
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [allDonghua, setAllDonghua] = useState([]);
    const [filteredDonghua, setFilteredDonghua] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showSuggestions, setShowSuggestions] = useState(false);

    {/*-------Email Sender Stuft-------*/}
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [department, setDepartment] = useState("General Support");
    const [isSending, setIsSending] = useState(false);

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
    
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });

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
                            <li><FontAwesomeIcon icon={faTelevision} color="#ccc" size="lg" /><Link to="/hide">Bookmark</Link></li>
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
                        <form
                            className="contact-form"
                            onSubmit={async (e) => {
                                e.preventDefault();
                                if (!user) {
                                alert("Please sign in before sending a message.");
                                return;
                                }
                                if (!subject || !message) {
                                alert("Please fill in both subject and message.");
                                return;
                                }

                                setIsSending(true);
                                try {
                                const res = await fetch("http://127.0.0.1:8000/api/contact", {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                    user_email: user.email,
                                    subject: `[${department}] ${subject}`,
                                    message,
                                    }),
                                });
                                const data = await res.json();

                                if (data.status === "success") {
                                    alert("Your message has been sent to support!");
                                    setSubject("");
                                    setMessage("");
                                } else {
                                    alert("Failed to send message. Try again later.");
                                }
                                } catch (err) {
                                console.error("Error sending message:", err);
                                alert("Error sending message. Please check your connection.");
                                } finally {
                                setIsSending(false);
                                }
                            }}
                            >
                            <div className="contact-form-group">
                                <label htmlFor="department">Department</label>
                                <select
                                id="department"
                                name="department"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                >
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
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                                />
                            </div>

                            <div className="contact-form-group">
                                <label htmlFor="message">Message</label>
                                <textarea
                                id="message"
                                rows="6"
                                placeholder="Type your message here..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                ></textarea>
                            </div>

                            <p className="contact-note">
                                Please keep your message clear. Basic formatting is supported.
                            </p>

                            <button type="submit" className="contact-send-btn" disabled={isSending}>
                                {isSending ? "Sending..." : "Send message"}
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
                            <button onClick={() => window.open("https://t.me/+YZzeqRMCP_oxODg1", "_blank")}>
                                <FontAwesomeIcon icon={faTelegram} /> Telegram
                            </button>
                            <button onClick={() => window.open("https://www.facebook.com/EangDev", "_blank")}>
                                < FontAwesomeIcon icon={faFacebook} /> Facebook
                            </button>
                            <button onClick={() => window.open("https://www.youtube.com/@eang3301", "_blank")} className="youtube">
                                <FontAwesomeIcon icon={faYoutube} /> YouTube
                            </button>
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