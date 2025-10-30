import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function WatchPage() {
  const [params] = useSearchParams();
  const url = params.get("url"); // episode page URL
  const [servers, setServers] = useState({});
  const [currentServer, setCurrentServer] = useState(null);

  useEffect(() => {
    if (!url) return;
    fetch(`http://127.0.0.1:8001/api/stream?url=${encodeURIComponent(url)}`)
      .then(res => res.json())
      .then(data => {
        setServers(data.servers);
        setCurrentServer(Object.values(data.servers)[0]); // default to first server
      })
      .catch(console.error);
  }, [url]);

  if (!currentServer) return <p>Loading video...</p>;

  return (
    <div>
      <div style={{ marginBottom: "10px" }}>
        {Object.entries(servers).map(([name, src]) => (
          <button key={name} onClick={() => setCurrentServer(src)}>{name}</button>
        ))}
      </div>
      <div style={{ position: "relative", paddingTop: "56.25%" }}>
        <iframe
          src={currentServer}
          frameBorder="0"
          allowFullScreen
          title="Anime Player"
          style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
        />
      </div>
    </div>
  );
}

export default WatchPage;
