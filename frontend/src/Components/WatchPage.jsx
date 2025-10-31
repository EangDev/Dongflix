import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import './style/WatchPageStyle.css';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faMagnifyingGlass, faHouse,
  faHeart, faBookOpen, faEnvelope, faTelevision
} from "@fortawesome/free-solid-svg-icons";
import logo from '../Assets/mylogo.png';

function WatchPage() {
  const [params] = useSearchParams();
  const initialUrl = params.get("url");
  const [animeDetails, setAnimeDetails] = useState({
    title: "",
    releaseDate: "",
    postedBy: "Dongflix",
    series: "",
  });

  const [servers, setServers] = useState({});
  const [currentServer, setCurrentServer] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [clickedEpisodes, setClickedEpisodes] = useState([]);
  const [serverCache, setServerCache] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const EPISODES_PER_PAGE = 30;
  const navigate = useNavigate();

  // --- Fetch episodes list on initial load ---
  useEffect(() => {
    if (!initialUrl) return;

    // Fetch episode list
    fetch(`http://127.0.0.1:8001/api/episodes?url=${encodeURIComponent(initialUrl)}`)
      .then(res => res.json())
      .then(data => {
        const list = data.episodes || [];
        setEpisodes(list);

        // --- 🔍 Try to detect which episode is currently playing
        const currentEp = list.findIndex(ep => initialUrl.includes(ep.url.split('/').pop()));
        if (currentEp !== -1) {
          const currentPage = Math.floor(currentEp / EPISODES_PER_PAGE) + 1;
          setPage(currentPage); // ✅ Auto-select page
        }
      })
      .catch(console.error);

    // Fetch anime details
    fetch(`http://127.0.0.1:8001/api/details?url=${encodeURIComponent(initialUrl)}`)
      .then(res => res.json())
      .then(data => setAnimeDetails(data))
      .catch(console.error);

    // Fetch default stream
    fetch(`http://127.0.0.1:8001/api/stream?url=${encodeURIComponent(initialUrl)}`)
      .then(res => res.json())
      .then(data => {
        if (data.servers) {
          setServers(data.servers);
          setCurrentServer(Object.values(data.servers)[0]);
        }
      })
      .catch(console.error);
  }, [initialUrl]);


  // --- Filter and paginate episodes ---
  const filteredEpisodes = useMemo(() => {
    return episodes.filter(ep =>
      ep.number.toString().includes(search)
    );
  }, [episodes, search]);

  const totalPages = Math.ceil(filteredEpisodes.length / EPISODES_PER_PAGE);
  const displayedEpisodes = useMemo(() => {
    const start = (page - 1) * EPISODES_PER_PAGE;
    return filteredEpisodes.slice(start, start + EPISODES_PER_PAGE);
  }, [filteredEpisodes, page]);

  // --- Handle episode click ---
  const handleEpisodeClick = async (ep) => {
    if (!ep.url) return;

    // Mark as clicked
    if (!clickedEpisodes.includes(ep.number)) {
      setClickedEpisodes(prev => [...prev, ep.number]);
    }

    // Check if we already cached this episode
    if (serverCache[ep.number]) {
      setCurrentServer(serverCache[ep.number]);
      navigate(`?url=${encodeURIComponent(ep.url)}`, { replace: true });
      return;
    }

    // Otherwise, fetch new stream data
    try {
      const res = await fetch(`http://127.0.0.1:8001/api/stream?url=${encodeURIComponent(ep.url)}`);
      const data = await res.json();
      if (data.servers) {
        const firstServer = Object.values(data.servers)[0];
        setCurrentServer(firstServer);
        setServerCache(prev => ({ ...prev, [ep.number]: firstServer }));
        navigate(`?url=${encodeURIComponent(ep.url)}`, { replace: true });
      }
    } catch (err) {
      console.error("Error fetching episode:", err);
    }
  };

  if (!currentServer) return;

  return (
    <header>
      {/* ---- HEADER ---- */}
      <div className="watchpage-header-container">
        <div className="watchpage-logo-img">
          <img src={logo} alt="logo" />
        </div>

        <div className="watchpage-search-box">
          <input type="text" className="watchpage-search" placeholder="Search..." />
          <button id="watchpage-btn-search">
            <FontAwesomeIcon icon={faMagnifyingGlass} className="watchpage-magnifying" />
          </button>
        </div>

        <div className="watchpage-menu-text">
          <ul>
            <li>
              <FontAwesomeIcon icon={faHouse} color="#ccc" size="lg" />
              <Link to="/">Home</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faBookOpen} color="#ccc" size="lg" />
              <a href="#">About Us</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faEnvelope} color="#ccc" size="lg" />
              <a href="#">Contact Us</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faHeart} color="#ccc" size="lg" />
              <a href="#">Support Us</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faTelevision} color="#ccc" size="lg" />
              <a href="#">Hide ADS</a>
            </li>
            <li>
              <FontAwesomeIcon icon={faUser} color="#ccc" size="lg" />
              <button id="watchpage-btn-signin">Sign in</button>
            </li>
          </ul>
        </div>
      </div>

      <div className="anime-detail-container">
        <div className="anime-detail-bg">
          <div className="anime-title">
            <h3>{animeDetails.title || "Loading..."}</h3>
          </div>
          <div className="anime-release-date">
            <p>
              Released on <span>{animeDetails.releaseDate}</span> . Posted by:{" "}
              <a href="">{animeDetails.postedBy}</a> . Series:{" "} 
              <a href="">{animeDetails.series}</a>
            </p>
          </div>
        </div>
      </div>

      {/* ---- WATCH PAGE ---- */}
      <div className="watch-page">
        <div className="player-section">
          <div className="player-container">
            {currentServer ? (
              <iframe
                src={currentServer}
                frameBorder="0"
                allowFullScreen
                title="Anime Player"
              />
            ) : (
              <p>Loading video...</p>
            )}
          </div>
        </div>
        
        
        {/* ---- EPISODE SIDEBAR ---- */}
        <div className="episode-sidebar">
          <h3>Available Episodes</h3>

          <div className="episode-controls">
            {/* Page selector */}
            <select
              value={page}
              onChange={e => setPage(Number(e.target.value))}
            >
              {Array.from({ length: totalPages }, (_, i) => (
                <option key={i} value={i + 1}>
                  EP {i * EPISODES_PER_PAGE + 1} - {Math.min((i + 1) * EPISODES_PER_PAGE, filteredEpisodes.length)}
                </option>
              ))}
            </select>

            {/* Search box */}
            <input
              type="text"
              placeholder="Search episode..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>

          {/* Episode list */}
          <div className="episode-list">
            {displayedEpisodes.map((ep, index) => {
              if (!ep.url) return null;
              const isActive = clickedEpisodes.includes(ep.number);
              return (
                <button
                  key={index}
                  className={`episode-item ${isActive ? "active" : ""}`}
                  onClick={() => handleEpisodeClick(ep)}
                >
                  {ep.number || index + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </header>
  );
}

export default WatchPage;
