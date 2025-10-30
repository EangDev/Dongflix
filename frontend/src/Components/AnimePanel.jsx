import React, { useEffect, useState } from "react";

function AnimePanel() {
  const [animeList, setAnimeList] = useState([]);
  
  useEffect(() => {
    fetch("http://127.0.0.1:8000/lucifer")
      .then(res => res.json())
      .then(data => setAnimeList(data.data))
      .catch(console.error);
  }, []);
  
  return (
    <div className="grid grid-cols-4 gap-4 p-4">
      {animeList.map((a, i) => (
        <div key={i} className="rounded-lg shadow bg-gray-800 text-white">
          <img src={a.image} alt={a.title} className="w-full rounded-t-lg" />
          <div className="p-2">
            <h2 className="font-semibold">{a.title}</h2>
            <p>Ep {a.episode}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default AnimePanel;
