import React, { useEffect, useState } from 'react';
import { Logo, SearchBar, UserAvatar } from './index.js';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../api/axios.js';
import { logout as authLogout } from '../store/authSlice.js';

function Header() {
  const status = useSelector((state) => state.authReducer.status);
  const user = useSelector((state) => state.authReducer.userData);
  const [show, setShow] = useState(false);
  const [isLightMode, setIsLightMode] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const toggleMenu = (e) => {
    e.preventDefault();
    setShow((prev) => !prev);
  };

  const toggleTheme = () => {
    setIsLightMode((prev) => !prev);
    if (!isLightMode) {
      document.documentElement.classList.add('light');
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    }
  };

  useEffect(() => {
    if (status) {
      (async () => {
        try {
          const data = await axios.get(`/api/v1/users/get-current-user`);
        } catch (error) {
          if (error.request.status === 401) {
            window.localStorage.clear();
            dispatch(authLogout());
            navigate('/login');
          }
        }
      })();
    }
  }, []);

  const logout = async (e) => {
    e.preventDefault();
    const data = await axios.post('/api/v1/users/logout');
    if (data.status === 200) {
      window.localStorage.clear();
      navigate('/');
      window.location.reload();
    }
  };

  return (
    <div
      className={`z-50 flex flex-row fixed top-0 left-0 right-0 justify-between items-center px-7 border-b-2 ${
        isLightMode ? 'bg-white border-gray-300' : 'bg-gray-950 border-gray-800'
      }`}
      style={{ height: '10vh' }}
    >
      <Link to="/">
        <Logo classname="h-18" />
      </Link>
      <SearchBar />
      <ul>
        {status ? (
          <li>
            <button className="h-full w-full" onClick={(e) => toggleMenu(e)}>
              <UserAvatar avatar={user?.avatar} />
            </button>

            {show ? (
              <div
                onClick={(e) => toggleMenu(e)}
                className="fixed left-0 top-0 h-[100vh] w-[100vw]"
              >
                <div
                  onClick={(e) => e.stopPropagation()}
                  className={`rounded-lg top-16 right-2 mt-2 fixed flex flex-col justify-center items-center w-36 ${
                    isLightMode ? 'bg-white text-black' : 'bg-gray-600 text-white'
                  }`}
                >
                  <button
                    onClick={(e) => logout(e)}
                    className={`h-10 font-medium border-b w-full ${
                      isLightMode ? 'border-gray-300' : 'border-gray-900'
                    }`}
                  >
                    Sign Out
                  </button>
                  <button
                    className={`h-10 border-b w-full font-medium ${
                      isLightMode ? 'border-gray-300' : 'border-gray-900'
                    }`}
                  >
                    Switch Account
                  </button>
                  <button
                    onClick={toggleTheme}
                    className="h-10 font-medium w-full"
                  >
                    {isLightMode ? 'Dark Mode' : 'Light Mode'}
                  </button>
                </div>
              </div>
            ) : null}
          </li>
        ) : (
          <li>
            <Link to="/login">
              <UserAvatar avatar={user?.avatar} />
            </Link>
          </li>
        )}
      </ul>
    </div>
  );
}

export default Header;
