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
    await axios.post("http://localhost:4000/uploadimage", formData, {
      headers: { "Content-Type": "multipart/form-data" }
    });
    getImages();
  };

  const getImages = async () => {
    const result = await axios.get("http://localhost:4000/getimage");
    setAllImage(result.data.data || []);
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
              src={`http://localhost:4000/images/${data.image}`}
              alt=" "
              style={{ width: '200px', height: 'auto', margin: '10px' }}
            />
          ) : null
        )) : "No images available"}
      </div>
    </div>
  );
};

export default App;
