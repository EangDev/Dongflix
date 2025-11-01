import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import './style/LatestPageStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';
import loadingImg from '../Assets/loading.gif';

function LatestDonghuaPage({ data }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const ITEM_PER_PAGE = 20;

  const latestDonghua = data.filter(item => item.category === "latest");

  const indexOfLast = currentPage * ITEM_PER_PAGE;
  const indexOfFirst = (currentPage - 1) * ITEM_PER_PAGE;
  const currentItems = viewAll ? latestDonghua : latestDonghua.slice(indexOfFirst, indexOfLast);
  const totalPage = Math.ceil(latestDonghua.length / ITEM_PER_PAGE);

  const handleNext = () => { if (currentPage < totalPage) setCurrentPage(prev => prev + 1); };
  const handlePrev = () => { if (currentPage > 1) setCurrentPage(prev => prev - 1); };
  const handleViewAll = () => setViewAll(true);
  const handleCloseViewAll = () => { setViewAll(false); setCurrentPage(1); };

  useEffect(() => {
    if (!data) return;
    setLoading(false);
  }, [data])
  
  const handleDetail = (item) => {
    if (!item.link) return alert("Video URL not available for this anime!");
    navigate(`/watch?url=${encodeURIComponent(item.link)}&image=${encodeURIComponent(item.image || item.thumbnail)}`);
  };

  return (
    <>
      {loading && (
        <div className="loading">
          <img src={loadingImg} alt="Loading..." />
          <p className="loading-text">Loading...</p>
        </div>
      )}
      <section className="latest-update-section">
        <div className='latest-update-header'>
          <div className='latest-update-link'>
            <ul>
              <li>
                <span>Latest</span> Release
                <FontAwesomeIcon icon={faChevronRight} color='#ccc' />
              </li>
            </ul>
          </div>
        </div>     
        <div className='latest-update-body'>
          <div className='latest-banner-grid'>
            {currentItems.map((item, index) => (
              <div className="latest-donghua-slide" key={index}>
                <div className="latest-image-wrapper" onClick={() => handleDetail(item)}>
                  <img src={item.image || item.thumbnail} alt={item.title} />
                  <div className="play-overlay">
                    <FontAwesomeIcon icon={faCirclePlay}/>
                  </div>
                  <p className='latest-donghua-episode'>Ep {item.episode || item.episodesCount || "?"}</p>
                </div>
                <a className="latest-donghua-title" onClick={() => handleDetail(item)}>
                  <p>{item.title}</p>
                </a>
              </div>
            ))}
          </div>

          <div className="latest-btn-ViewPage">
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

export default LatestDonghuaPage;
