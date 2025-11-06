import React, { useState, useEffect } from "react";
import "./style/HidePageStyle.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faMagnifyingGlass, faHouse,
  faHeart, faBookOpen, faEnvelope, faTelevision, faCreditCard, faQrcode, faMoneyBill
} from "@fortawesome/free-solid-svg-icons";
import logo from "../Assets/mylogo.png";
import FooterDonghuaPage from "./FooterPage";
import loadingImg from "../Assets/loading.gif";
import defaultAvatar from "../Assets/avatar/A1.png";

function HidePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [allDonghua, setAllDonghua] = useState([]);
  const [filteredDonghua, setFilteredDonghua] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // 🧹 Reset Premium (for developer testing)
  const handleResetPremium = () => {
    if (!user) {
      alert("No user logged in to reset.");
      return;
    }
    const resetUser = {
      ...user,
      hasPremium: false,
      adsHidden: false,
      premiumType: null,
    };
    setUser(resetUser);
    localStorage.setItem("user", JSON.stringify(resetUser));
    alert("✅ Premium reset for testing.");
  };

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

  // search filter
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

  // Handle Buy click
  const handleBuyPackage = (duration, price) => {
    if (!user) {
      alert("Please sign in to purchase a package!");
      navigate("/login");
      return;
    }
    setSelectedPlan({ duration, price });
    setShowPaymentModal(true);
  };

  // Handle payment confirmation
  const handlePayment = async (method) => {
    setShowPaymentModal(false);
    setTimeout(async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/user/premium", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: user.user_id, // assuming you stored id from login
            duration: selectedPlan.duration,
            price: selectedPlan.price,
            payment_method: method,
          }),
        });

        const data = await response.json();

        if (response.ok) {
          alert(`✅ Payment successful via ${method}!`);
          const updatedUser = {
            ...user,
            hasPremium: true,
            adsHidden: true,
            premiumType: selectedPlan.duration,
            premiumStart: new Date().toISOString(),
            paymentMethod: method,
          };
          setUser(updatedUser);
          localStorage.setItem("user", JSON.stringify(updatedUser));
        } else {
          alert(`❌ Payment failed: ${data.detail}`);
        }
      } catch (err) {
        console.error("Payment error:", err);
        alert("Something went wrong. Please try again later.");
      }
    }, 800);
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
        <div className="ads-header-container">
          <div className="ads-logo-img">
            <Link to="/">
              <img src={logo} alt="logo" />
            </Link>
          </div>

          {/* Search Box */}
          <div className="ads-search-box">
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
              id="ads-btn-search"
              onClick={() => handleSelectAnime(filteredDonghua[0])}
            >
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
              <li><FontAwesomeIcon icon={faHouse} color="#ccc" size="lg" /><Link to="/">Home</Link></li>
              <li><FontAwesomeIcon icon={faBookOpen} color="#ccc" size="lg" /><Link to="/about">About</Link></li>
              <li><FontAwesomeIcon icon={faEnvelope} color="#ccc" size="lg" /><Link to="/contact">Contact</Link></li>
              <li><FontAwesomeIcon icon={faHeart} color="#ccc" size="lg" /><Link to="/support">Support Us</Link></li>
              <li><FontAwesomeIcon icon={faTelevision} color="#ccc" size="lg" /><Link to="/hide">Hide ADS</Link></li>
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

        {/* Moving Text */}
        <div className="ads-container-1">
          <div className="ads-animated-text">
            <div className="ads-animation-txt">
              💖 Welcome to DongFlix — Your ultimate world of donghua! From the fiery battles of
              Battle Through the Heavens ⚔️ to the mystical realms of Soul Land 💥 and Perfect
              World 🌏, enjoy endless adventures 🌈!
            </div>
          </div>
        </div>
      </header>
      
      {/* Hide Ads Section */}
      <div className="hide-ads-component">
        <div className="hide-ads-header">
          <h2>🚫 Hide Ads Mode</h2>
          <p>Enjoy uninterrupted donghua streaming with our ad-free premium plans below.</p>
        </div>

        <div className="hide-ads-content">
          {user?.hasPremium ? (
            <div className="hide-ads-confirm">
              <p>✨ You have activated the <b>{user.premiumType}</b> Plan! Enjoy 💖</p>
            </div>
          ) : (
            <>
              <div className="hide-ads-plans">
                <div className="ads-plan-card">
                  <h3>1 Month</h3>
                  <p className="plan-price">$2.99</p>
                  <button onClick={() => handleBuyPackage("1-Month", 2.99)}>Buy Now</button>
                </div>
                <div className="ads-plan-card">
                  <h3>3 Months</h3>
                  <p className="plan-price">$6.99</p>
                  <button onClick={() => handleBuyPackage("3-Month", 6.99)}>Buy Now</button>
                </div>
                <div className="ads-plan-card popular-plan">
                  <h3>Lifetime</h3>
                  <p className="plan-price">$19.99</p>
                  <button onClick={() => handleBuyPackage("Lifetime", 19.99)}>Buy Now</button>
                  <span className="popular-badge">★ Most Popular</span>
                </div>
              </div>
              <div className="hide-ads-warning">
                <p>⚠️ You currently see ads. Purchase a package to remove them and support DongFlix 💎</p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal">
          <div className="payment-modal-content">
            <h3>💳 Choose Payment Method</h3>
            <p>
              You’re buying the <b>{selectedPlan.duration}</b> plan for <b>${selectedPlan.price}</b>
            </p>

            <div className="payment-methods">
              <button onClick={() => handlePayment("Credit Card")}>
                <FontAwesomeIcon icon={faCreditCard} /> Credit / Debit Card
              </button>
              <button onClick={() => handlePayment("PayPal")}>
                <FontAwesomeIcon icon={faMoneyBill} /> PayPal
              </button>
              <button onClick={() => handlePayment("QR / ABA / TrueMoney")}>
                <FontAwesomeIcon icon={faQrcode} /> QR Payment
              </button>
            </div>

            <button
              className="cancel-payment"
              onClick={() => setShowPaymentModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal">
          <div className="payment-modal-content">
            <h3>💳 Choose Payment Method</h3>
            <p>
              You’re buying the <b>{selectedPlan.duration}</b> plan for <b>${selectedPlan.price}</b>
            </p>

            <div className="payment-methods">
              <button onClick={() => handlePayment("Credit Card")}>
                <FontAwesomeIcon icon={faCreditCard} /> Credit / Debit Card
              </button>
              <button onClick={() => handlePayment("PayPal")}>
                <FontAwesomeIcon icon={faMoneyBill} /> PayPal
              </button>
              <button onClick={() => handlePayment("QR / ABA / TrueMoney")}>
                <FontAwesomeIcon icon={faQrcode} /> QR Payment
              </button>
            </div>

            <button
              className="cancel-payment"
              onClick={() => setShowPaymentModal(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* 👨‍💻 Developer Button (Hidden from users, show when testing) */}
            {user && (
              <button
                onClick={handleResetPremium}
                style={{
                  marginTop: "30px",
                  padding: "10px 20px",
                  borderRadius: "12px",
                  background: "#444",
                  color: "white",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                🔄 Reset Premium (Dev Only)
              </button>
            )}
      <footer>
        <FooterDonghuaPage />
      </footer>
    </>
  );
}

export default HidePage;
