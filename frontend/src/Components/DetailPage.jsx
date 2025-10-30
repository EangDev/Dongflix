import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faMagnifyingGlass, faHouse,
    faHeart, faBookOpen, faEnvelope, faTelevision
} from "@fortawesome/free-solid-svg-icons";

import WatchPage from './WatchPage';

import './style/DetailPageStyle.css';
import logo from '../Assets/mylogo.png';
import { useParams } from "react-router-dom";

function DetailPage() {
    const { id } = useParams();
    return (
        <header>
            <div className="detail-header-container">
                <div className="detail-logo-img">
                    <img src={logo} alt="logo" />
                </div>
                <div className="detail-search-box">
                    <input type="text" className="detail-search" placeholder="Search..."/>
                    <button id="detail-btn-search">
                        <FontAwesomeIcon icon={faMagnifyingGlass} className="detail-magnifying"/>
                    </button>
                </div>
                <div className="detail-menu-text">
                    <ul>
                        <li>
                            <FontAwesomeIcon icon={faHouse} color="#ccc" size="lg"/>
                            <a href="#">Home</a>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faBookOpen} color="#ccc" size="lg"/>
                            <a href="#">About Us</a>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faEnvelope} color="#ccc" size="lg"/>
                            <a href="#">Contact Us</a>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faHeart} color="#ccc" size="lg"/>
                            <a href="#">Support Us</a>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faTelevision} color="#ccc" size="lg"/>
                            <a href="#">Hide ADS</a>
                        </li>
                        <li>
                            <FontAwesomeIcon icon={faUser} color="#ccc" size="lg"/>
                            <button id="detail-btn-signin">Sign in</button>
                        </li>
                    </ul>
                </div>
            </div>
            <div>
                <WatchPage animeId={id} /> {/* Pass the ID if needed */}
            </div>
        </header>
    );
}

export default DetailPage;
