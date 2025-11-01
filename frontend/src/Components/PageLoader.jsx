// src/Components/PageLoader.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import loadingImg from "../Assets/loading.gif";
import "./style/PageLoaderStyle.css";

function PageLoader() {
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2400);

    return () => clearTimeout(timer);
  }, [location]);

  if (!loading) return null;

  return (
    <div className="page-loading-overlay">
      <img src={loadingImg} alt="Loading..." />
      <p>Loading...</p>
    </div>
  );
}

export default PageLoader;
