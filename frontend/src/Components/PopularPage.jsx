import React, { useState, useEffect } from "react";
import '../Components/style/PopularStyle.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';

function PopularPage() {
    const [popularDong, setPopularDong] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewAll, setViewAll] = useState(false);
    const [error, setError] = useState(null);
        
    const ITEM_PER_PAGE = 5;

    useEffect(() => {
        async function fetchPopDonghua(){
            try{
                const res = await fetch('http://127.0.0.1:8000/api/animate');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                const list = Array.isArray(data.results) ? data.results : [];
                setPopularDong(list);
            }catch(err){
                console.error('Failed to fetch', err);
                setError('Failed to load popular anime.');
                setPopularDong([]);
            }finally{
                setLoading(false);
            }
        }
        fetchPopDonghua();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const indexOfLast = currentPage * ITEM_PER_PAGE;
    const indexOfFirst = (currentPage - 1) * ITEM_PER_PAGE;
    const currentItems = viewAll ? popularDong : popularDong.slice(indexOfFirst, indexOfLast);
    const totalPage = Math.ceil(popularDong.length / ITEM_PER_PAGE);
        
    const handleNext = () => {
        if(currentPage < totalPage) setCurrentPage(prev => prev + 1);
    }

    const handlePrev = () => {
        if(currentPage > 1) setCurrentPage(prev => prev - 1);
    }

    const handleViewAll = () => setViewAll(true);

    const handleCloseViewAll = () => {
        setViewAll(false);
        setCurrentPage(1);
    };

    return (
        <section className="popular-dong-section">
        <div className='popular-dong-header'>
            <div className='popular-dong-link'>
            <ul>
                <li>
                <a href="#">
                    <span>Popular</span> Series
                </a>
                <FontAwesomeIcon icon={faChevronRight} color='#ccc' />
                </li>
            </ul>
            </div>
        </div>     
        <div className='popular-dong-body'>
            {/* Anime grid */}
            <div className='popular-banner-grid'>
                {currentItems.map((item, index) => (
                    <div className="popular-donghua-slide" key={index}>
                    <div className="popular-image-wrapper">
                        <img src={item.thumbnail} alt={item.title} />
                        <div className="popular-play-overlay">
                        <FontAwesomeIcon icon={faCirclePlay}/>
                        </div>
                        <p className='popular-donghua-episode'>Ep {item.episodesCount || "?"}</p>
                    </div>
                    <a href='#' className="popular-donghua-title"><p>{item.title}</p></a>
                    </div>
                ))}
            </div>

            {/* Pagination Button */}
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
