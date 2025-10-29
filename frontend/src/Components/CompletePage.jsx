import React, { useState, useEffect } from "react";
import '../Components/style/CompletePageStyle.css';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';

function CompletePage(){
    const [completeDong, setCompleteDong] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [viewAll, setViewAll] = useState(false);
    const [error, setError] = useState(null);
        
    const ITEM_PER_PAGE = 5;

    useEffect(() => {
        async function fetchComDonghua(){
            try{
                const res = await fetch('http://127.0.0.1:8000/api/completed');
                if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
                const data = await res.json();
                const list = Array.isArray(data) ? data : data.data || []; 
                setCompleteDong(list);
            }catch(err){
                console.error('Failed to fetch', err);
                setError('Failed to load completed anime.');
                setCompleteDong([]);
            }finally{
                setLoading(false);
            }
        }
        fetchComDonghua();
    }, []);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const indexOfLast = currentPage * ITEM_PER_PAGE;
    const indexOfFirst = (currentPage - 1) * ITEM_PER_PAGE;
    const currentItems = viewAll ? completeDong : completeDong.slice(indexOfFirst, indexOfLast);
    const totalPage = Math.ceil(completeDong.length / ITEM_PER_PAGE);
        
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
        <section className="complete-dong-section">
        <div className='complete-dong-header'>
            <div className='complete-dong-link'>
            <ul>
                <li>
                <a href="#">
                    <span>Completed</span> Watch
                </a>
                <FontAwesomeIcon icon={faChevronRight} color='#ccc' />
                </li>
            </ul>
            </div>
        </div>     
        <div className='complete-dong-body'>
            {/* Anime grid */}
            <div className='complete-banner-grid'>
                {currentItems.map((item, index) => (
                    <div className="complete-donghua-slide" key={index}>
                    <div className="complete-image-wrapper">
                        <img src={item.thumbnail} alt={item.title} />
                        <div className="complete-play-overlay">
                        <FontAwesomeIcon icon={faCirclePlay}/>
                        </div>
                        <p className='complete-donghua-episode'>Ep {item.episodesCount || "?"}</p>
                    </div>
                    <a href='#' className="complete-donghua-title"><p>{item.title}</p></a>
                    </div>
                ))}
            </div>

            {/* Pagination Button */}
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