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

        // Fetch recently watched from backend
        fetch(`http://127.0.0.1:8000/api/recently-watched/${savedUser.user_id}`)
            .then(res => res.json())
            .then(data => {
                // Deduplicate by donghua title and keep latest episode
                const uniqueDonghua = {};

                data.data.forEach(item => {
                    const cleanTitle = getCleanTitle(item.title);
                    const key = `${item.user_id}_${cleanTitle}`; // unique per user & donghua

                    if (!uniqueDonghua[key]) {
                        uniqueDonghua[key] = item;
                    } else {
                        // keep the one with newer time or higher episode
                        const existing = uniqueDonghua[key];
                        if (new Date(item.watched_at) > new Date(existing.watched_at) || 
                            (item.episode_number || 0) > (existing.episode_number || 0)) {
                            uniqueDonghua[key] = item;
                        }
                    }
                });

                // Sort by last watched time
                const filteredList = Object.values(uniqueDonghua)
                    .sort((a, b) => new Date(b.watched_at) - new Date(a.watched_at))
                    .slice(0, 20); // show latest 20

                setRecentlyWatched(filteredList);
            })
            .catch(err => console.error("Failed to fetch recently watched:", err));
    }, []);

    const handleClick = (item) => {
        // Navigate directly to the last watched episode
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
                            <FontAwesomeIcon icon={faChevronRight} color='#ccc' />
                        </li>
                    </ul>
                </div>
            </div>

            {/* BODY OF RECENTLY WATCHED PAGE */}
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
                                    <span>{getCleanTitle(item.title)}</span> - Recently Watched On EP <span className="episode_number">{item.episode_number || 1}</span>
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
