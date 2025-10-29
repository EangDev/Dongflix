import React, { useRef, useEffect, useState } from 'react'
import './style/HomePageStyle.css';
import LU1 from '../Assets/lu1.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, 
  faCirclePlay
 } from '@fortawesome/free-solid-svg-icons';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation } from 'swiper/modules';

function LatestDonghuaPage() {
  const [donghuaList, setDonghuaList] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch from backend
  useEffect(() => {
    async function fetchDonghua() {
      try {
        const res = await fetch('http://127.0.0.1:8000/lucifer');
        const data = await res.json();
        setDonghuaList(data.data || []);
      } catch (err) {
        console.error('Failed to fetch donghua:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchDonghua();
  }, []);

  if (loading) return <p>Loading latest donghua...</p>;

  return (
    <section className="latest-update-section">
      <div className='latest-update-header'>
        <div className='latest-update-link'>
          <ul>
            <li>
              <a href="#"><span>Latest</span> Update</a>
              <FontAwesomeIcon icon={faChevronRight} color='#ccc' />
            </li>
          </ul>
        </div>
      </div>

      <div className='latest-update-body'>
        <div className='latest-banner-show'>
          <Swiper
            slidesPerView={5}
            spaceBetween={10}
            navigation={true}
            modules={[Pagination, Navigation]}
            className="mySwiper"
          >
            {donghuaList.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="donghua-slide">
                  <div className="image-wrapper">
                    <img src={item.image} alt={item.title} />
                    <div className="play-overlay">
                      <FontAwesomeIcon icon={faCirclePlay}/>
                    </div>
                  </div>
                  <p className="donghua-title">{item.title}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}


export default LatestDonghuaPage