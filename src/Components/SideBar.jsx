import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Subscribedfeed } from './index.js';
import axios from '../api/axios.js';

function SideBar() {
  const [isActive, setIsActive] = useState('');
  const authstatus = useSelector((state) => state.authReducer.status);
  const user = useSelector((state) => state.authReducer.userData);
  const navigate = useNavigate();
  let value = window.location.href.split('/');

  const [limit, setLimit] = useState(10);
  const [subscribed, setSubscribed] = useState([]);

  useEffect(() => {
    if (value.length === 4) {
      if (value[3] === 'history') {
        setIsActive('History');
      } else if (value[3] === '?subscription=true') {
        setIsActive('Subscriptions');
      } else {
        setIsActive('Home');
      }
    } else if (value.length >= 5 && value[4] === `${user?.username}`) {
      setIsActive('You');
    } else {
      setIsActive('Home');
    }

    if (authstatus) {
      (async () => {
        try {
          const data = await axios.get(
            `/api/v1/subscription/get-subscribed-to/${user?._id}?limit=${limit}`
          );
          setSubscribed(data.data.data);
        } catch (error) {
          console.log(error);
        }
      })();
    }
  }, [user]);

  const changeActive = (e) => {
    if (e.name === 'Home') {
      navigate('/');
      window.location.reload();
    } else if (authstatus) {
      navigate(e.path);
      window.location.reload();
    } else {
      navigate('/login');
      window.location.reload();
    }
  };

  return (
    <div className="z-50 px-4 py-6 flex flex-col w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white sticky top-0 h-full overflow-y-auto shadow-lg rounded-r-lg">
      <button
        className={`flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
          isActive === 'Home' ? 'bg-blue-500 text-black' : 'hover:bg-gray-700'
        }`}
        onClick={(e) => {
          e.preventDefault();
          changeActive({ name: 'Home', path: '/' });
        }}
      >
        <span className="material-symbols-outlined">home</span>
        Home
      </button>
      <button
        className={`flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
          isActive === 'Subscriptions' ? 'bg-blue-500 text-black' : 'hover:bg-gray-700'
        }`}
        onClick={(e) => {
          e.preventDefault();
          changeActive({ name: 'Subscriptions', path: `/?subscription=true` });
        }}
      >
        <span className="material-symbols-outlined">subscriptions</span>
        Subscriptions
      </button>
      <button
        className={`flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
          isActive === 'You' ? 'bg-blue-500 text-black' : 'hover:bg-gray-700'
        }`}
        onClick={(e) => {
          e.preventDefault();
          changeActive({ name: 'You', path: `/channel/${user?.username}` });
        }}
      >
        <span className="material-symbols-outlined">person</span>
        Your Channel
      </button>
      <button
        className={`flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
          isActive === 'Tweets' ? 'bg-blue-500 text-black' : 'hover:bg-gray-700'
        }`}
        onClick={(e) => {
          e.preventDefault();
          changeActive({ name: 'Tweets', path: `/` });
        }}
      >
        <span className="material-symbols-outlined">chat</span>
        Tweets
      </button>

      <div className="border-b border-gray-700 my-4"></div>

      <button
        onClick={(e) => {
          e.preventDefault();
          changeActive({ name: 'History', path: '/history' });
        }}
        className={`flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-lg transition-all duration-300 ${
          isActive === 'History' ? 'bg-blue-500 text-black' : 'hover:bg-gray-700'
        }`}
      >
        <span className="material-symbols-outlined">history</span>
        History
      </button>

      <div className="border-b border-gray-700 my-4"></div>

      <div className="flex flex-col gap-4">
        <h1 className="text-lg font-bold">Subscriptions</h1>
        {subscribed?.map((item, index) => (
          <div
            key={index}
            className="flex items-center gap-3 py-2 px-4 rounded-lg hover:bg-gray-700 transition-all duration-300"
          >
            <Subscribedfeed id={item?.channel} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SideBar;
