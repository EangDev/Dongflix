import React, { useRef, useEffect, useState } from 'react'
import './style/HomePageStyle.css';
import LU1 from '../Assets/lu1.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import { Pagination, Navigation } from 'swiper/modules';

function LatestDonghuaPage() {
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
            <SwiperSlide><button><img src={LU1} alt="" /></button></SwiperSlide>
            <SwiperSlide><button><img src={LU1} alt="" /></button></SwiperSlide>
            <SwiperSlide><button><img src={LU1} alt="" /></button></SwiperSlide>
            <SwiperSlide><button><img src={LU1} alt="" /></button></SwiperSlide>
            <SwiperSlide><button><img src={LU1} alt="" /></button></SwiperSlide>
            <SwiperSlide><button><img src={LU1} alt="" /></button></SwiperSlide>
            <SwiperSlide><button><img src={LU1} alt="" /></button></SwiperSlide>
            <SwiperSlide><button><img src={LU1} alt="" /></button></SwiperSlide>
            <SwiperSlide><button><img src={LU1} alt="" /></button></SwiperSlide>
          </Swiper>
        </div>
      </div>
    </section>
  );
}


export default LatestDonghuaPage