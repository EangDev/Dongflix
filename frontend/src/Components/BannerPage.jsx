import React from 'react';
import './style/HomePageStyle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import pw from '../Assets/images/pw.jpg'
import btth from '../Assets/images/btth.jpg'
import ri from '../Assets/images/ri.jpg'
import sl1 from '../Assets/images/sl1.jpg'
import sl2 from '../Assets/images/sl2.jpg'
import sw from '../Assets/images/sw.jpg'
import ss from '../Assets/images/ss.jpg'

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
                            modules={[Autoplay, Pagination]}
                            className="mySwiper"
                        >
                            <SwiperSlide>
                                    <img src={pw} alt="Perfect-World" />
                            </SwiperSlide>
                            <SwiperSlide>
                                    <img src={btth} alt="Battle-Through-The-Heavens" />
                            </SwiperSlide>
                            <SwiperSlide>
                                    <img src={ri} alt="Renegade-Immortal" />
                            </SwiperSlide>
                            <SwiperSlide>
                                    <img src={sl1} alt="Soul-Land-1" />
                            </SwiperSlide>
                            <SwiperSlide>
                                    <img src={sl2} alt="Soul-Land-2" />
                            </SwiperSlide>
                            <SwiperSlide>
                                    <img src={sw} alt="Sword-Of-Coming" />
                            </SwiperSlide>
                            <SwiperSlide>
                                    <img src={ss} alt="Swallowed-Star" />
                            </SwiperSlide>
                        </Swiper>
                    </>
                </div>
            </div>
        </header>
    );
}

export default Banner;