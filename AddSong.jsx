import React, { useState, useEffect } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { toast } from 'react-toastify'; // Ensure you have toast for notifications
import { url } from '../App';

const AddSong = () => {
  const [image, setImage] = useState(null);
  const [song, setSong] = useState(null);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [album, setAlbum] = useState("none");
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);

  // Fetch available albums on component mount (if needed)
  useEffect(() => {
    const fetchAlbums = async () => {
      try {
        const response = await axios.get(`${url}/api/albums`);
        setAlbumData(response.data); // Assuming the API returns the list of albums
      } catch (error) {
        // toast.error("Failed to load albums.");
      }
    };

    fetchAlbums();
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!image || !song) {
      toast.error("Please upload both an image and a song.");
      setLoading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);
      formData.append('image', image);
      formData.append('audio', song);
      formData.append('album', album);

      const response = await axios.post(`${url}/api/song/add`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.success) {
        toast.success("Song added successfully");
        setName("");
        setDesc("");
        setAlbum("none");
        setImage(null);
        setSong(null);
      } else {
        toast.error("Failed to add song. Please try again.");
      }
    } catch (error) {
      toast.error("An error occurred while adding the song.");
    }

    setLoading(false);
  };

  const loadAlbumData = async () => {
    try {
      const response = await axios.get(`${url}/api/album/list`);
      if (response.data.success) {
        setAlbumData(response.data.albums);
      }
      else{
        toast.error("Unable to load albums data");
      }
    } catch (error) {
      toast.error("Error occur");
    }
  }

  useEffect(()=>{
    loadAlbumData();
  },[])

  return loading ? (
    <div className='grid place-items-center min-h-[80vh]'>
      <div className='w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin '></div>
    </div>
  ) : (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 text-gray-600'>
      <div className='flex gap-8'>
        <div className='flex flex-col gap-4'>
          <p>Upload Song</p>
          <input onChange={(e) => setSong(e.target.files[0])} type="file" id='song' accept='audio/*' hidden />
          <label htmlFor="song">
            <img src={song ? assets.upload_added : assets.upload_song} className='w-24 cursor-pointer' alt="" />
          </label>
        </div>
        <div className='flex flex-col gap-4'>
          <p>Upload Image</p>
          <input onChange={(e) => setImage(e.target.files[0])} type="file" id='image' accept='image/*' hidden />
          <label htmlFor="image">
            <img src={image ? URL.createObjectURL(image) : assets.upload_area} className='w-24 cursor-pointer' alt="" />
          </label>
        </div>
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Song name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Type Here' type="text" required />
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Song description</p>
        <input onChange={(e) => setDesc(e.target.value)} value={desc} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Type Here' type="text" required />
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Album</p>
        <select onChange={(e) => setAlbum(e.target.value)} value={album} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]'>
          <option value="none">None</option>
          {albumData.map((item,index) => (
            <option key={index} value={item.name}>{item.name}</option>
          ))}
        </select>
      </div>

      <button type="submit" className='text-base bg-black text-white py-2.5 px-14 cursor-pointer'>ADD</button>
    </form>
  );
};

export default AddSong;
