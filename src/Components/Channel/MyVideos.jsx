import React, { useEffect, useState } from 'react';
import { fetchUserVideo } from '../../FetchfromBackend';
import { useParams } from 'react-router-dom';
import { Input, Button, MyvideosFeed } from '../index.js';
import { setdata as setvideodata, adddata as addvideodata } from '../../store/videoSlice.js';
import { useDispatch, useSelector } from 'react-redux';
import axios from '../../api/axios.js';
import { ThreeDots } from 'react-loader-spinner';

function MyVideos() {
  const videodata = useSelector(state => state.videoReducer.videoData);
  const videolen = useSelector(state => state.videoReducer.length);
  const [showUploadSection, setShowUploadSection] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const currentUser = useSelector(state => state.authReducer.userData);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      (async () => {
        const data = await fetchUserVideo(id);
        if (data) {
          dispatch(setvideodata(data));
        }
      })();
    }
  }, [id]);

  const uploadFile = async (type) => {
    const data = new FormData();
    data.append("file", type === 'video' ? videoFile : thumbnail);
    data.append("upload_preset", type === 'video' ? "videos_preset" : "images_preset");

    try {
      const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
      const resourceType = type === 'video' ? 'video' : 'image';
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

      if (!url) throw new Error('Cloudinary API is not configured');

      const response = await fetch(url, { method: "POST", body: data });
      const result = await response.json();
      return result?.secure_url;
    } catch (error) {
      console.error("File upload error:", error);
      alert("Failed to upload file. Please try again.");
      return null;
    }
  };

  const handleUploadVideo = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title || !description || !videoFile || !thumbnail) {
      alert('Please fill in all fields.');
      setLoading(false);
      return;
    }

    if (videoFile.size > 30000000 || thumbnail.size > 5000000) {
      alert('Video (max 30MB) and Thumbnail (max 5MB) sizes are too large');
      setLoading(false);
      return;
    }

    const thumbnailUrl = await uploadFile('image');
    const videoUrl = await uploadFile('video');

    if (thumbnailUrl && videoUrl) {
      try {
        const response = await axios.post('/api/v1/videos/publish-video', {
          title,
          description,
          thumbnail: thumbnailUrl,
          videoFile: videoUrl
        });
        if (response.status === 200) {
          alert("Video uploaded successfully");
          window.location.reload();
        }
      } catch (error) {
        console.error("Upload failed:", error);
        alert("Failed to upload video. Please try again.");
      }
    }

    setTitle('');
    setDescription('');
    setVideoFile(null);
    setThumbnail(null);
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-center mb-4">
        {showUploadSection && (
          <div 
            onClick={() => setShowUploadSection(false)} 
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-20"
          >
            <div 
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-800 p-5 rounded-lg w-[25rem]"
            >
              <form onSubmit={handleUploadVideo} className="flex flex-col gap-3">
                <h1 className="text-2xl font-bold text-center mb-2">Upload Video</h1>
                
                <label className="text-gray-400">Title</label>
                <input 
                  className="w-full p-2 bg-gray-200 rounded-md" 
                  type="text" 
                  value={title}
                  onChange={(e) => setTitle(e.target.value)} 
                  required 
                />

                <label className="text-gray-400">Description</label>
                <input 
                  className="w-full p-2 bg-gray-200 rounded-md" 
                  type="text" 
                  value={description}
                  onChange={(e) => setDescription(e.target.value)} 
                  required 
                />

                <label className="text-gray-400">Video File</label>
                <input 
                  type="file" 
                  accept="video/*" 
                  onChange={(e) => setVideoFile(e.target.files[0])}
                  required 
                />

                <label className="text-gray-400">Thumbnail</label>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={(e) => setThumbnail(e.target.files[0])}
                  required 
                />

                <Button type="submit" label="Upload" />
                {loading && (
                  <div className="flex justify-center mt-4">
                    <ThreeDots color="#4fa94d" />
                  </div>
                )}
              </form>
            </div>
          </div>
        )}

        {currentUser?._id === id && (
          <Button 
            onClick={() => setShowUploadSection(prev => !prev)}
            label="Upload Video" 
            classname="ml-3 mb-0 mt-1 rounded-3xl"
          />
        )}
      </div>

      {videodata?.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 px-5">
          {videodata.map((video, index) => (
            <MyvideosFeed key={index} video={video} />
          ))}
        </div>
      ) : (
        <div className="text-white h-[50vh] flex justify-center items-center text-3xl font-bold">
          NO VIDEOS
        </div>
      )}
    </>
  );
}

export default MyVideos;
