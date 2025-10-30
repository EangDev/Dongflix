import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import './style/PopularStyle.css';

function PopularPage({ data }) {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [viewAll, setViewAll] = useState(false);
    const ITEM_PER_PAGE = 5;

    const popularDong = data.filter(item => item.category === "popular");

    const indexOfLast = currentPage * ITEM_PER_PAGE;
    const indexOfFirst = (currentPage - 1) * ITEM_PER_PAGE;
    const currentItems = viewAll ? popularDong : popularDong.slice(indexOfFirst, indexOfLast);
    const totalPage = Math.ceil(popularDong.length / ITEM_PER_PAGE);

    const handleNext = () => { if (currentPage < totalPage) setCurrentPage(prev => prev + 1); };
    const handlePrev = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
    const handleViewAll = () => setViewAll(true);
    const handleCloseViewAll = () => { setViewAll(false); setCurrentPage(1); };

    const handleDetail = (item) => {
        if (!item.link) return alert("Video URL not available for this anime!");
        navigate(`/watch?url=${encodeURIComponent(item.link)}`);
    };

    return (
        <section className="popular-dong-section">
            <div className='popular-dong-header'>
                <div className='popular-dong-link'>
                    <ul>
                        <li>
                            <span>Popular</span> Series
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
                                <img src={item.thumbnail || item.image} alt={item.title} />
                                <div className="popular-play-overlay">
                                    <FontAwesomeIcon icon={faCirclePlay}/>
                                </div>
                                <p className='popular-donghua-episode'>Ep {item.episodesCount || item.episode || "?"}</p>
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
    );
}

export default PopularPage;
