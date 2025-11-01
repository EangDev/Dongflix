import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import './style/PopularStyle.css';
import loadingImg from '../Assets/loading.gif';

function PopularPage() {
    const navigate = useNavigate();
    const [popularDong, setPopularDong] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewAll, setViewAll] = useState(false);
    const ITEM_PER_PAGE = 5;

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/anime/popular");
                const json = await res.json();
                setPopularDong(json.results || []);
            } catch (error) {
                console.error("Error fetching Anime4i Popular:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPopular();
    }, []);

    const indexOfLast = currentPage * ITEM_PER_PAGE;
    const indexOfFirst = (currentPage - 1) * ITEM_PER_PAGE;
    const currentItems = viewAll ? popularDong : popularDong.slice(indexOfFirst, indexOfLast);
    const totalPage = Math.ceil(popularDong.length / ITEM_PER_PAGE);

    const handleNext = () => { if (currentPage < totalPage) setCurrentPage(prev => prev + 1); };
    const handlePrev = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
    const handleViewAll = () => setViewAll(true);
    const handleCloseViewAll = () => { setViewAll(false); setCurrentPage(1); };

    const handleDetail = (item) => {
        if (!item.link) {
            alert("Video URL not available for this anime!");
            return;
        }
        navigate(`/watch?url=${encodeURIComponent(item.link)}&image=${encodeURIComponent(item.image)}`);
    };

    return (
        <>
            {loading && (
                <div className="loading">
                    <img src={loadingImg} alt="Loading..." />
                    <p className="loading-text">Loading...</p>
                </div>
            )}

            <section className="popular-dong-section">
                <div className='popular-dong-header'>
                    <div className='popular-dong-link'>
                        <ul>
                            <li>
                                <span>Popular</span> Today
                                <FontAwesomeIcon icon={faChevronRight} color='#ccc' />
                            </li>
                        </ul>
                    </div>
                </div>

                <div className='popular-dong-body'>
                    <div className='popular-banner-grid'>
                        {currentItems.map((item, index) => (
                            <div className="popular-donghua-slide" key={index}>
                                <div className="popular-image-wrapper" onClick={() => handleDetail(item)}>
                                    <img src={item.image} alt={item.title} />
                                    <div className="popular-play-overlay">
                                        <FontAwesomeIcon icon={faCirclePlay}/>
                                    </div>
                                    <p className='popular-donghua-episode'>Ep {item.episode || "?"}</p>
                                </div>
                                <a className="popular-donghua-title" onClick={() => handleDetail(item)}>
                                    <p>{item.title}</p>
                                </a>
                            </div>
                        ))}
                    </div>

                    <div className="popular-btn-ViewPage">
                        {!viewAll ? (
                            <>
                                <button onClick={handlePrev} disabled={currentPage === 1}>Prev</button>
                                <button onClick={handleNext} disabled={currentPage === totalPage}>Next</button>
                                <button onClick={handleViewAll}>View All</button>
                            </>
                        ) : (
                            <button onClick={handleCloseViewAll}>Close</button>
                        )}
                    </div>
                </div>
            </section>
        </>
    );
}

export default PopularPage;
