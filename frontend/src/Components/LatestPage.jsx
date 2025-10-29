import React, { useEffect, useState } from 'react'
import './style/HomePageStyle.css';
import './style/LatestPageStyle.css';
import loadingImg from '../Assets/loading.gif'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';

function LatestDonghuaPage() {
  const [donghuaList, setDonghuaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  
  const ITEM_PER_PAGE = 20;

  // Fetch from backend
  useEffect(() => {
    async function fetchDonghua() {
      try {
        const res = await fetch('http://127.0.0.1:8001/lucifer');
        const data = await res.json();
        setDonghuaList(data.data || []);
      } catch (err) {
        console.error('Failed to fetch:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDonghua();
  }, []);

  if (loading) 
    return(
      <div className='loading'>
        <img src={loadingImg} alt="Loading..." />
        <p className='loading-text'>Loading...</p>
      </div>
    )

    //Pagination Logic
  const indexOfLast = currentPage * ITEM_PER_PAGE;
  const indexOfFirst = (currentPage - 1) * ITEM_PER_PAGE;
  const currentItems = viewAll ? donghuaList : donghuaList.slice(indexOfFirst, indexOfLast);
  const totalPage = Math.ceil(donghuaList.length / ITEM_PER_PAGE);
    
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
    <section className="latest-update-section">
      <div className='latest-update-header'>
        <div className='latest-update-link'>
          <ul>
            <li>
              <a href="#">
                <span>Latest</span> Release
              </a>
              <FontAwesomeIcon icon={faChevronRight} color='#ccc' />
            </li>
          </ul>
        </div>
      </div>     
      <div className='latest-update-body'>
        {/* Anime grid */}
        <div className='latest-banner-grid'>
          {currentItems.map((item, index) => (
            <div className="donghua-slide" key={index}>
              <div className="image-wrapper">
                <img src={item.image} alt={item.title} />
                <div className="play-overlay">
                  <FontAwesomeIcon icon={faCirclePlay}/>
                </div>
                <p className='donghua-episode'>Ep {item.episode || "?"}</p>
              </div>
              <a href='#' className="donghua-title"><p>{item.title}</p></a>
            </div>
          ))}
        </div>

        {/* Pagination Button */}
        <div className="btn-ViewPage">
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

export default LatestDonghuaPage