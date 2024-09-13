import React, { useState, useEffect } from 'react';
import axios from 'axios';

const App = () => {
  const [image, setImage] = useState();
  const [allImage, setAllImage] = useState([]);

  useEffect(() => {
    getImages();
  }, []);

  const onInputChange = (e) => {
    setImage(e.target.files[0]);
  };

  const submitImage = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("image", image);
    try {
      await axios.post("https://image-omega-jade.vercel.app/uploadimage", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      getImages();
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const getImages = async () => {
    try {
      const result = await axios.get("https://image-omega-jade.vercel.app/getimage");
      setAllImage(result.data.data || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  return (
    <div>
      <form onSubmit={submitImage}>
        <input type='file' accept='image/*' onChange={onInputChange} />
        <button type="submit">Submit</button>
      </form>
      <div>
        {allImage.length > 0 ? allImage.map((data, index) => (
          data && data.image ? (
            <img
              key={index}
              src={data.image}
              alt=""
              style={{ width: '200px', height: 'auto', margin: '10px' }}
            />
          ) : null
        )) : "No images available"}
      </div>
    </div>
  );
};

export default App;
