import React, { useEffect, useState } from 'react';
import { FetchAllVidoes, FetchUserPlaylist } from '../FetchfromBackend/index.js';
import { useSelector, useDispatch } from 'react-redux';
import { FeedVideo } from './index.js';
import InfiniteScroll from "react-infinite-scroll-component";
import { setplaylist } from '../store/playlistSlice.js';
import { useLocation } from 'react-router-dom';
import axios from '../api/axios.js';

function Feed() {
  const [videos, setVideos] = useState([]);
  const status = useSelector(state => state.authReducer.status);
  const [limit, setLimit] = useState(9);
  const [hasMore, setHasMore] = useState(true);
  const [length, setLength] = useState(0);
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.authReducer.userData);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get('search');
  const subscription = queryParams.get('subscription');

  useEffect(() => {
    (async () => {
      if (status && subscription) {
        const subscriptionData = await axios.get(`/api/v1/subscription/get-subscribed-to/${currentUser?._id}`);
        const data = await axios.post(`/api/v1/videos/get-all-subscription-videos`, {
          allsubscribedId: subscriptionData.data.data
        });
        setVideos(data.data.data.videos);
        setLength(data.data.data.length);
      } else {
        const data = await FetchAllVidoes({ limit: limit + 6, query: search || "" });
        setVideos(data.videos);
        setLength(data.length);
      }
    })();

    if (status) {
      (async () => {
        const data = await FetchUserPlaylist(currentUser?._id);
        dispatch(setplaylist(data));
      })();
    }
  }, [status, subscription, currentUser, limit, search, dispatch]);

  const fetchMoreData = async () => {
    if (limit - 6 > length) {
      setHasMore(false);
      return;
    }
    setLimit(prev => prev + 6);
    const newLimit = limit + 6;
    
    if (subscription) {
      const subscriptionData = await axios.get(`/api/v1/subscription/get-subscribed-to/${currentUser?._id}`);
      const data = await axios.post(`/api/v1/videos/get-all-subscription-videos`, {
        allsubscribedId: subscriptionData.data.data
      });
      setVideos(data.data.data.videos);
      setLength(data.data.data.length);
    } else {
      const data = await FetchAllVidoes({ limit: newLimit });
      setVideos(data.videos);
      setLength(data.length);
    }
  };

  return (
    <div className="bg-gradient-to-b from-black via-gray-900 to-gray-800 w-full h-full min-h-[90vh] p-6">
    {videos?.length > 0 ? (
      <InfiniteScroll
        dataLength={videos.length}
        next={fetchMoreData}
        hasMore={hasMore}
        loader={<div className="text-white text-center mt-6 animate-bounce">Loading...</div>}
        endMessage={
          <p className="text-center text-white mt-6 font-semibold text-lg">
            <b>No more videos to show</b>
          </p>
        }
      >
        {subscription && (
          <h1 className="text-white px-8 py-3 text-3xl font-extrabold border-b border-gray-700 shadow-md">Latest Videos</h1>
        )}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6">
          {videos.map((video, index) => (
            <div
              key={index}
              className="flex flex-col items-center rounded-xl overflow-hidden bg-gray-700 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-transform duration-500 ease-in-out"
            >
              <FeedVideo video={video} />
            </div>
          ))}
        </div>
      </InfiniteScroll>
    ) : (
      <h1 className="text-white text-3xl font-extrabold mt-20 text-center">No Videos Found</h1>
    )}
  </div>
  );
}

export default Feed;
