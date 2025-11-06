import React from "react";
import logo from '../Assets/mylogo.png';
import './style/FooterPageStyle.css';

function FooterPage(){
    return(
        <div className="footer-container">
            <div className="footer-header">
                <img src={logo} alt="logo" />
            </div>
            <div className="footer-footer">
                <p>&copy; {new Date().getFullYear()} Dongflix – Watch Online: Chinese Anime / Donghua. All Rights Reserved</p>
                <p className="disclaimer">Disclaimer: This site Dongflix – Watch Online: Chinese Anime / Donghua does not store any files on its server. All contents are provided by non-affiliated third parties.</p>
            </div>
        </div>
    );
}

export default FooterPage;