import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import './style/WatchPageStyle.css';
import FooterDonghuaPage from '../Components/FooterPage';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser, faMagnifyingGlass, faHouse,
  faHeart, faBookOpen, faEnvelope, faTelevision
} from "@fortawesome/free-solid-svg-icons";
import logo from '../Assets/mylogo.png';
import loadingImg from '../Assets/loading.gif';
import defaultAvatar from '../Assets/avatar/A1.png';

function WatchPage() {
  const [params] = useSearchParams();
  const initialUrl = params.get("url");
  const initialImage = params.get("image");
  const [titleDetails, settitleDetails] = useState({
    title: "",
    releaseDate: "",
    postedBy: "Dongflix",
    series: "",
    image: initialImage || "",
    description: ""
  });

  const [servers, setServers] = useState({});
  const [currentServer, setCurrentServer] = useState(null);
  const [episodes, setEpisodes] = useState([]);
  const [serverCache, setServerCache] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const [showFullDescription, setShowFullDescription] = useState(false);

  const EPISODES_PER_PAGE = 30;
  const navigate = useNavigate();

  const descriptionPreview = titleDetails.description?.slice(0, 200);
  const fullDescription = titleDetails.description;
  
  const [savedRecentlyWatched, setSavedRecentlyWatched] = useState(false);

  const [clickedEpisodes, setClickedEpisodes] = useState(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const userId = savedUser?.user_id || "guest";
    const saved = localStorage.getItem(`watchedEpisodes_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  const handleEpisodeClick = async (ep) => {
    if (!ep.url) return;

    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) {
        alert("Please login to watch.");
        navigate("/login");
        return;
    }

    const userId = savedUser.user_id;

    // Update clicked episodes locally
    if (!clickedEpisodes.includes(ep.number)) {
      const updated = [...clickedEpisodes, ep.number];
      setClickedEpisodes(updated);
    }

    // Call API to store in DB
    try {
        await fetch("http://127.0.0.1:8000/api/recently-watched/add", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                user_id: userId,
                title: titleDetails.title,
                link: initialUrl,
                image: titleDetails.image,
                episode_number: ep.number
            }),
        });
    } catch (err) {
        console.error("Failed to add recently watched:", err);
    }

    // Check cache
    if (serverCache[ep.number]) {
        setCurrentServer(serverCache[ep.number]);
        navigate(`?url=${encodeURIComponent(ep.url)}`, { replace: true });
        return;
    }

    // Fetch new stream data
    try {
        const res = await fetch(`http://127.0.0.1:8000/api/stream?url=${encodeURIComponent(ep.url)}`);
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

  // Add state for bookmarks
  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem("bookmarks");
    return saved ? JSON.parse(saved) : [];
  });

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  // Optional helper to check if bookmarked
  const isBookmarked = (anime) => bookmarks.some(b => b.link === anime.link);
  
  const currentAnime = {
    title: titleDetails.title,
    link: initialUrl,
    image: titleDetails.image,
  };

  const toggleBookmark = async () => {
    if (!user) {
      alert("Please sign in to bookmark this donghua.");
      navigate("/login");
      return;
    }

    if (isBookmarked(currentAnime)) {
      await removeBookmark(currentAnime);
    } else {
      await addBookmark(currentAnime);
    }
  };

  // Add a bookmark
  const addBookmark = async (anime) => {
    if (!user) {
      alert("Please login to add bookmarks.");
      navigate("/login");
      return;
    }

    // Prevent duplicate
    if (bookmarks.some(b => b.link === anime.link)) return;

    try {
      const res = await fetch("http://127.0.0.1:8000/api/bookmarks/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.user_id,
          title: anime.title,
          link: anime.link,
          image: anime.image,
        }),
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        const updatedBookmarks = [...bookmarks, anime];
        setBookmarks(updatedBookmarks);
        localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      } else {
        alert(data.detail || "Failed to add bookmark.");
      }
    } catch (err) {
      console.error(err);
      alert("Error adding bookmark.");
    }
  };

  const removeBookmark = async (anime) => {
    if (!user) return alert("Please login to remove bookmarks.");

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/bookmarks/remove?user_id=${user.user_id}&link=${encodeURIComponent(anime.link)}`, {
        method: "DELETE"
      });

      const data = await res.json();
      if (res.ok && data.status === "success") {
        const updatedBookmarks = bookmarks.filter(b => b.link !== anime.link);
        setBookmarks(updatedBookmarks);
        localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
      } else {
        alert(data.detail || "Failed to remove bookmark.");
      }
    } catch (err) {
      console.error(err);
      alert("Error removing bookmark.");
    }
  };

  useEffect(() => {
    if (!titleDetails.title || savedRecentlyWatched) return;
    setSavedRecentlyWatched(true);

    const saveRecentlyWatched = async () => {
      const savedUser = JSON.parse(localStorage.getItem("user"));
      if (!savedUser) return;

      try {
        await fetch("http://127.0.0.1:8000/api/recently-watched/add", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            user_id: savedUser.user_id,
            title: titleDetails.title,
            link: initialUrl,
            image: titleDetails.image,
            episode_number: null
          }),
        });
      } catch (err) {
        console.error("Failed to add recently watched:", err);
      }
    };

    saveRecentlyWatched();
  }, [titleDetails, initialUrl, savedRecentlyWatched]);

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    const userId = savedUser?.user_id || "guest";
    const saved = localStorage.getItem(`watchedEpisodes_${userId}`);
    setClickedEpisodes(saved ? JSON.parse(saved) : []);
  }, [user]);

  //BOOKMARK Effect
  useEffect(() => {
    if (!user) return;
    fetch(`http://127.0.0.1:8000/api/bookmarks/${user.user_id}`)
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(b => ({
          link: b.link,
          title: b.title,
          image: b.image
        }));
        setBookmarks(formatted);
        localStorage.setItem("bookmarks", JSON.stringify(formatted));
      })
      .catch(console.error);
  }, [user]);

  // --- Fetch episodes list on initial load ---
  useEffect(() => {
    if (!initialUrl) return;

    // Fetch episode list
    fetch(`http://127.0.0.1:8000/api/episodes?url=${encodeURIComponent(initialUrl)}`)
      .then(res => res.json())
      .then(data => {
        const list = data.episodes || [];
        setEpisodes(list);

        // ---Try to detect which episode is currently playing
        const currentEp = list.findIndex(ep => initialUrl.includes(ep.url.split('/').pop()));
        if (currentEp !== -1) {
          const currentPage = Math.floor(currentEp / EPISODES_PER_PAGE) + 1;
          setPage(currentPage);
        }
      })
      .catch(console.error);

    // Fetch title details
    fetch(`http://127.0.0.1:8000/api/details?url=${encodeURIComponent(initialUrl)}`)
      .then(res => res.json())
      .then(data => {
        if (data.url === initialUrl || data.title) {
          settitleDetails(prev => ({
            ...prev,
            ...data,
            image: data.image || prev.image
          }));
        }
      })
      .catch(console.error);

    // Fetch default stream
    fetch(`http://127.0.0.1:8000/api/stream?url=${encodeURIComponent(initialUrl)}`)
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

  if (!currentServer) return (
    <div className="loading">
        <img src={loadingImg} alt="Loading..." />
        <p className="loading-text">Loading...</p>
    </div>
  );

  return (
    <>
      <header>
      {/* ---- HEADER ---- */}
      <div className="watchpage-header-container">
        <div className="watchpage-logo-img">
          <Link to="/"><img src={logo} alt="logo" /></Link>
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
              <Link to="/about">About Us</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faEnvelope} color="#ccc" size="lg" />
              <Link to="/contact">Contact Us</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faHeart} color="#ccc" size="lg" />
              <Link to="/support">Support Us</Link>
            </li>
            <li>
              <FontAwesomeIcon icon={faTelevision} color="#ccc" size="lg" />
              <Link to="/hide">Bookmark</Link>
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

      <div className="watchpage-container-1">
        <div className="watchpage-animated-text">
          <div className="watchpage-animation-txt">💖 Welcome to DongFlix — Your ultimate world of donghua! From the fiery battles of Battle Through the Heavens ⚔️ to the mystical realms of Soul Land 💥 and Perfect World 🌏, get ready to embark on endless adventures 🌈 that will leave you inspired!</div>
        </div>
      </div>

      {/*----TITLE HEADER----*/}
      <div className="title-detail-container">
        <div className="title-detail-bg">
          <div className="title-title">
            <h3>{titleDetails.title || "Loading..."}</h3>
          </div>
          <div className="title-release-date">
            <p>
              Released on <span>{titleDetails.releaseDate}</span> . Posted by:{" "}
              <Link to="/"><a>{titleDetails.postedBy}</a></Link> . Series:{" "}
              <a href="">{titleDetails.series}</a>
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
                title="title Player"
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

      {/*---DETAIL OF DONGHUA---*/}
      <div className="donghua-detail-container">
        <div className="donghua-detail-header">
          {/* Left: Logo */}
          <div className="donghua-detail-logo">
            <img src={titleDetails.image || logo} alt={titleDetails.title} />
            <button
              className={isBookmarked(currentAnime) ? "active" : ""}
              onClick={toggleBookmark}
            >
              <FontAwesomeIcon icon={faHeart} /> 
              {isBookmarked(currentAnime) ? "Bookmarked" : "Bookmark"}
            </button>
          </div>
          {/* Right: Title + Status */}
          <div className="donghua-detail-right">
            <div className="donghua-detail-title">
              <h3 className="big-titles">{titleDetails.title || "Loading..."}</h3>
              <p className="small-titles">{titleDetails.title || "Subtitle"}</p>
            </div>

            {/* Status/details under title */}
            <div className="donghua-detail-onstatus">
              <ul>
                <li>Status: {titleDetails.status || "Ongoing"}</li>
                <li>Release: {titleDetails.releaseDate || "2023"}</li>
                <li>Type: {titleDetails.type || "ONA"}</li>
              </ul>
              <ul>
                <li>Studio: {titleDetails.studio || "Sparkly Key Studio"}</li>
                <li>Duration: {titleDetails.duration || "20 min per ep"}</li>
                <li>Episodes: {titleDetails.episodes || episodes.length || 104}</li>
              </ul>
            </div>
            
            <div className="donghua-detail-movietype">
              {titleDetails.genres?.length > 0 ? (
                titleDetails.genres.map((genre, index) => (
                  <button key={index}>{genre}</button>
                ))
              ) : (
                <button>Unknown</button>
              )}
            </div>
          </div>
        </div>

        <div className="donghua-detail-description">
          {(showFullDescription ? fullDescription : descriptionPreview || "")
            .split("\n\n")
            .map((para, idx) => para && <p key={idx}>{para}</p>)
          }

          {fullDescription && (
            <button
              id="btn-toggle-description"
              onClick={() => setShowFullDescription(!showFullDescription)}
            >
              {showFullDescription ? "Hide" : "More"}
            </button>
          )}
        </div>
      </div>
      
    </header>

    <footer>
      <FooterDonghuaPage />
    </footer>
    </>
  );
}

export default WatchPage;
