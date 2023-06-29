import useUserStore from '../store/userStore';
import React, { useRef, useState } from 'react';
import axios from 'axios';

function Upload() {
  const { setAvatar, username, password, avatar } = useUserStore();
  const [selectedFile, setSelectedFile] = useState({
    fileName: '',
    file: null,
  });
  const [imageUrl, setImageUrl] = useState('');
  const fileInputRef = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (selectedFile.file) {
      await getPresignedURL(selectedFile.fileName, selectedFile.file);
    } else {
      alert('Please upload another image to save');
    }
  };

  const getPresignedURL = async (filename, file) => {
    try {
      const response = await axios.post(
        `http://localhost:5000/api/images/signed-url?fileType=${file.type}`,
        {},
        {
          headers: { Authorization: `Basic ${window.btoa(`${username}:${password}`)}` },
        },
      );
      const url = response.data.data.signedUrl;
      putFileToS3(url, file);
    } catch (err) {
      console.error(`Error uploading image: ${err.message}`);
    }
  };

  const putFileToS3 = async (url, file) => {
    const result = await axios.put(url, file, {
      headers: {
        'Content-Type': file.type,
      },
    });
    const expand = file.type.split('/')[1];
    if (result.status == 200) {
      postPathToBE(expand);
    }
  };

  const postPathToBE = async (expand) => {
    const res = await axios.post(
      `http://localhost:5000/api/images/upload`,
      {
        path: `${process.env.REACT_APP_S3_BUCKET_PATH}/${username}/avatar.${expand}`,
      },
      {
        headers: { Authorization: `Basic ${window.btoa(`${username}:${password}`)}` },
      },
    );
    const parsedData = JSON.parse(res.config.data);
    const path = parsedData.path;
    console.log('path', path);
    setAvatar(path);
  };

  const handleButtonClick = () => {
    // Trigger the file input's click event
    fileInputRef.current.click();
  };

  const handleFileChange = (event) => {
    const timestamp = new Date().getTime();
    const file = event.target.files[0];
    const filename =
      file.name
        .split('.')[0]
        .replace(/[&\/\\#,+()$~%'":*?<>{}]/g, '')
        .toLowerCase() + `_${timestamp}`;
    const fileExtension = file.name.split('.').pop();
    const fileName = `${filename}.${fileExtension}`;
    if (file) {
      // Check file size (in bytes)
      const fileSize = file.size;
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (fileSize > maxSize) {
        alert('File size exceeds the maximum limit of 5MB.');
        setSelectedFile({
          fileName: '',
          file: null,
        });
      } else {
        setSelectedFile({
          fileName,
          file,
        });
        const reader = new FileReader();
        reader.onload = () => {
          setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div className="container-modal">
      <div className="all-button">
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button type="button" onClick={handleButtonClick}>
          Upload
        </button>
        <button onClick={handleSubmit}>Save</button>
      </div>
      <div className="show-img">
        {selectedFile.file ? (
          <img src={imageUrl} alt="Selected Image" />
        ) : (
          <img src={`${avatar ? `${avatar}` : 'avarta.jpg'}`} alt="Selected Image" />
        )}
      </div>
    </div>
  );
}

export default Upload;
