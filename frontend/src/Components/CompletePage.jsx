import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './style/CompletePageStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';

function CompletePage({ data }) {
    const navigate = useNavigate();
    const [currentPage, setCurrentPage] = useState(1);
    const [viewAll, setViewAll] = useState(false);
    const ITEM_PER_PAGE = 5;

    const completeDong = data.filter(item => item.category === "completed");

    const indexOfLast = currentPage * ITEM_PER_PAGE;
    const indexOfFirst = (currentPage - 1) * ITEM_PER_PAGE;
    const currentItems = viewAll ? completeDong : completeDong.slice(indexOfFirst, indexOfLast);
    const totalPage = Math.ceil(completeDong.length / ITEM_PER_PAGE);

    const handleNext = () => { if (currentPage < totalPage) setCurrentPage(prev => prev + 1); };
    const handlePrev = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
    const handleViewAll = () => setViewAll(true);
    const handleCloseViewAll = () => { setViewAll(false); setCurrentPage(1); };

    const handleDetail = (item) => {
        if (!item.link) return alert("Video URL not available for this anime!");
        navigate(`/watch?url=${encodeURIComponent(item.link)}`);
    };

    return (
        <section className="complete-dong-section">
            <div className='complete-dong-header'>
                <div className='complete-dong-link'>
                    <ul>
                        <li>
                            <span>Completed</span> Series
                            <FontAwesomeIcon icon={faChevronRight} color='#ccc' />
                        </li>
                    </ul>
                </div>
            </div>     
            <div className='complete-dong-body'>
                <div className='complete-banner-grid'>
                    {currentItems.map((item, index) => (
                        <div className="complete-donghua-slide" key={index}>
                            <div className="complete-image-wrapper" onClick={() => handleDetail(item)}>
                                <img src={item.image || item.thumbnail} alt={item.title} />
                                {/* Play overlay */}
                                <div className="play-overlay">
                                    <FontAwesomeIcon icon={faCirclePlay}/>
                                </div>
                                {/* Episode info */}
                                <p className='donghua-episode'>Ep {item.episode || item.episodesCount || "?"}</p>
                                {/* Completed badge */}
                                {item.category === "completed" && (
                                    <div className="completed-badge">Completed</div>
                                )}
                            </div>
                            <a className="complete-donghua-title" onClick={() => handleDetail(item)}>
                                <p>{item.title}</p>
                            </a>
                        </div>
                    ))}
                </div>

                <div className="complete-btn-ViewPage">
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

export default CompletePage;
