import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';

import './style/RecentlyPageStyle.css';

function RecentlyPage() {
  const navigate = useNavigate();
  const [recentlyWatched, setRecentlyWatched] = useState([]);
  const [user, setUser] = useState(null);

  const getCleanTitle = (title) => {
    if (!title) return "";
    return title.replace(/Episode\s*\d+/i, "").trim();
  };

  useEffect(() => {
    const savedUser = JSON.parse(localStorage.getItem("user"));
    if (!savedUser) return;
    setUser(savedUser);

    fetch(`http://127.0.0.1:8000/api/recently-watched/${savedUser.user_id}`)
      .then(res => res.json())
      .then(data => {
        if (!data.data) return;

        const uniqueDonghua = {};
        data.data.forEach(item => {
          const cleanTitle = getCleanTitle(item.title);
          const key = `${item.user_id}_${cleanTitle}`;

          if (!uniqueDonghua[key]) {
            uniqueDonghua[key] = item;
          } else {
            const existing = uniqueDonghua[key];
            if (
              new Date(item.watched_at) > new Date(existing.watched_at) ||
              Number(item.episode_number || 0) > Number(existing.episode_number || 0)
            ) {
              uniqueDonghua[key] = item;
            }
          }
        });

        setRecentlyWatched(Object.values(uniqueDonghua));
      })
      .catch(console.error);
  }, []);

  const handleClick = (item) => {
    const urlWithEpisode = item.link + (item.episode_number ? `?ep=${item.episode_number}` : '');
    navigate(`/watch?url=${encodeURIComponent(urlWithEpisode)}&image=${encodeURIComponent(item.image)}`);
  };

  return (
    <section className="recently-dong-section">
      <div className="recently-dong-header">
        <div className="recently-dong-link">
          <ul>
            <li>
              <span>Recently</span> Watched
              <FontAwesomeIcon icon={faChevronRight} color="#ccc" />
            </li>
          </ul>
        </div>
      </div>

      <div className="recently-dong-body">
        <div className="recently-banner-grid">
          {recentlyWatched.length > 0 ? (
            recentlyWatched.map((item, index) => (
              <div
                key={index}
                className="recently-item"
                onClick={() => handleClick(item)}
              >
                <div className="recently-item-image">
                  <img src={item.image} alt={item.title} />
                  <FontAwesomeIcon icon={faCirclePlay} className="play-icon" />
                </div>

                <div className="recently-item-title">
                  <span>{getCleanTitle(item.title)}</span> – EP{" "}
                  <span className="episode_number">{item.episode_number || 1}</span>
                </div>

                {/* Optional bottom info (watched date or icon) */}
                <div style={{ textAlign: "center", fontSize: "12px", color: "#777" }}>
                  {item.watched_at
                    ? new Date(item.watched_at).toLocaleString()
                    : ""}
                </div>
              </div>
            ))
          ) : (
            <p className="no-recently">No recently watched donghua.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default RecentlyPage;
