import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function SearchBar() {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  const findVideos = (e) => {
    navigate(`/?search=${search}`);
    window.location.reload();
  };

  return (
    <div className="flex justify-center items-center my-4">
      <div className="relative w-full max-w-md">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search for videos..."
          className="w-full h-12 pl-5 pr-12 text-gray-800 rounded-full shadow-md outline-none focus:ring-2 focus:ring-blue-400 transition-all duration-300 bg-gradient-to-r from-gray-200 to-gray-300"
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              findVideos(e);
            }
          }}
        />
        <button
          onClick={(e) => {
            e.preventDefault();
            findVideos(e);
          }}
          className="absolute right-2 top-2 flex items-center justify-center w-8 h-8 bg-blue-500 rounded-full shadow-lg hover:bg-blue-600 transition-all duration-300"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            fill="white"
            viewBox="0 0 50 50"
          >
            <path d="M 21 3 C 11.621094 3 4 10.621094 4 20 C 4 29.378906 11.621094 37 21 37 C 24.710938 37 28.140625 35.804688 30.9375 33.78125 L 44.09375 46.90625 L 46.90625 44.09375 L 33.90625 31.0625 C 36.460938 28.085938 38 24.222656 38 20 C 38 10.621094 30.378906 3 21 3 Z M 21 5 C 29.296875 5 36 11.703125 36 20 C 36 28.296875 29.296875 35 21 35 C 12.703125 35 6 28.296875 6 20 C 6 11.703125 12.703125 5 21 5 Z"></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default SearchBar;
