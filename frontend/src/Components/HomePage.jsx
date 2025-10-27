import React, { useState } from "react";

function HomePage() {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (!searchQuery) return;
    // Navigate or fetch API with searchQuery
    console.log("Searching for:", searchQuery);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-600 to-blue-500 text-white font-sans">
      {/* Header */}
      <header className="flex items-center justify-between p-6">
        <div className="text-3xl font-bold">Anichin</div>
        <nav className="space-x-6">
          <button className="hover:text-gray-200">Explore</button>
          <button className="hover:text-gray-200">Contact</button>
        </nav>
      </header>

      {/* Hero / Search */}
      <section className="flex flex-col items-center justify-center text-center mt-20">
        <h1 className="text-5xl font-extrabold mb-6">Welcome to Anichin</h1>
        <p className="mb-8 text-lg max-w-xl">
          Discover, explore, and watch your favorite anime and donghua easily.
        </p>

        <div className="flex w-full max-w-xl">
          <input
            type="text"
            placeholder="Search for anime or donghua..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 p-3 rounded-l-lg text-black focus:outline-none"
          />
          <button
            onClick={handleSearch}
            className="bg-yellow-500 p-3 rounded-r-lg font-bold hover:bg-yellow-600 transition"
          >
            Search
          </button>
        </div>
      </section>

      {/* Explore Section */}
      <section className="mt-32 px-10">
        <h2 className="text-3xl font-bold mb-6">Explore</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white/20 p-6 rounded-lg hover:bg-white/30 transition">
            <h3 className="text-xl font-semibold">Trending</h3>
          </div>
          <div className="bg-white/20 p-6 rounded-lg hover:bg-white/30 transition">
            <h3 className="text-xl font-semibold">New Releases</h3>
          </div>
          <div className="bg-white/20 p-6 rounded-lg hover:bg-white/30 transition">
            <h3 className="text-xl font-semibold">Genres</h3>
          </div>
          <div className="bg-white/20 p-6 rounded-lg hover:bg-white/30 transition">
            <h3 className="text-xl font-semibold">Top Rated</h3>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="mt-32 px-10 mb-20">
        <h2 className="text-3xl font-bold mb-6">Contact</h2>
        <p>
          Have questions or suggestions? Reach out to us at{" "}
          <a href="mailto:support@anichin.com" className="underline">
            support@anichin.com
          </a>
        </p>
      </section>
    </div>
  );
}

export default HomePage;
