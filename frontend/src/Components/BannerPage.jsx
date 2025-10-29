import { useRef, useEffect, useState } from 'react';
import b1 from '../Assets/pic1.png';
import b2 from '../Assets/pic2.png';
import './style/HomePageStyle.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Autoplay, Pagination, Navigation } from 'swiper/modules';

function Banner(){
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
                            {donghuaList.map((item, index) => (
                                <SwiperSlide key={index}>
                                    <img src={item.image} alt={item.title} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </>
                </div>
            </div>
        </header>
    );
}

export default Banner;