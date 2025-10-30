import React, { useState } from 'react';
import { useNavigate } from "react-router-dom";
import './style/HomePageStyle.css';
import './style/LatestPageStyle.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';

function LatestDonghuaPage({ data }) {
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
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

  const handleDetail = (item) => {
    if (!item.link) return alert("Video URL not available for this anime!");
    navigate(`/watch?url=${encodeURIComponent(item.link)}`);
  };

  return (
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
            <div className="donghua-slide" key={index}>
              <div className="image-wrapper" onClick={() => handleDetail(item)}>
                <img src={item.image || item.thumbnail} alt={item.title} />
                <div className="play-overlay">
                  <FontAwesomeIcon icon={faCirclePlay}/>
                </div>
                <p className='donghua-episode'>Ep {item.episode || item.episodesCount || "?"}</p>
              </div>
              <a className="donghua-title" onClick={() => handleDetail(item)}>
                <p>{item.title}</p>
              </a>
            </div>
          ))}
        </div>

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

export default LatestDonghuaPage;
