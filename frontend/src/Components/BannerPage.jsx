import { useRef, useEffect, useState } from 'react';
import logo from '../Assets/mylogo.png';
import b1 from '../Assets/pic1.png';
import b2 from '../Assets/pic2.png';
import './style/HomePageStyle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';

function Banner(){

    return(
        <header>
            <div className='banner-header'>
                <div className='banner-show'>
                    <>
                        <Swiper
                            spaceBetween={30}
                            centeredSlides={true}
                            autoplay={{
                            delay: 2500,
                            disableOnInteraction: false,
                            }}
                            pagination={{
                            clickable: true,
                            }}
                            navigation={true}
                            modules={[Autoplay, Pagination, Navigation]}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                <img src={b1} alt="banner" />
                            </SwiperSlide>
                            <SwiperSlide>
                                <img src={b2} alt="banner" />
                            </SwiperSlide>
                        </Swiper>
                    </>
                </div>
            </div>
        </header>
    );
}

export default Banner;