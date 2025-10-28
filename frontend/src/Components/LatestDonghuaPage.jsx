import React, { useRef, useEffect, useState } from 'react'
import './style/HomePageStyle.css';
import LU1 from '../Assets/lu1.jpg'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';


function LatestDonghuaPage() {
  return (
    <header>
        <div className='text-bgstyle'></div>
        <div className='latest-update-header'>
            <div className='latest-update-link'>
                <ul>
                    <li>
                        <a href="#"><span>Latest</span> Update</a>
                        <FontAwesomeIcon icon={faChevronRight} color='#ccc' size='3px'/>
                    </li>
                </ul>
            </div>
        </div>
    </header>
  )
}

export default LatestDonghuaPage