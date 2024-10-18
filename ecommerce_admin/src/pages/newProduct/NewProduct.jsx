import { useState } from "react";
import "./newProduct.css";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import app from "../../firebase";
import { addProduct } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";
import Select from 'react-select';

export default function NewProduct() {
  const [inputs, setInputs] = useState({});
  const [file, setFile] = useState(null);
  const [cats, setCats] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedColors, setSelectedColors] = useState([]);
  const dispatch = useDispatch();

  const sizeOptions = [
    { value: 'XS', label: 'XS' },
    { value: 'S', label: 'S' },
    { value: 'M', label: 'M' },
    { value: 'L', label: 'L' },
    { value: 'XL', label: 'XL' },
  ];

  const colorOptions = [
    { value: 'red', label: 'Red' },
    { value: 'green', label: 'Green' },
    { value: 'blue', label: 'Blue' },
    { value: 'yellow', label: 'Yellow' },
    { value: 'black', label: 'Black' },
    { value: 'brown', label: 'Brown' },
    { value: 'white', label: 'White' },
    { value: 'orange', label: 'Orange' },
    { value: 'purple', label: 'Purple' },
    { value: 'pink', label: 'Pink' },
    { value: 'gray', label: 'Gray' },
  ];

  const handleSizeChange = (selectedOptions) => {
      const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
      setSelectedSizes(values);
      console.log("Selected sizes:", values);
  };

  const handleColorChange = (selectedOptions) => {
      const values = selectedOptions ? selectedOptions.map(option => option.value) : [];
      setSelectedColors(values);
      console.log("Selected colors:", values);
  };
  
  const handleChange = (e) => {

    setInputs(prev => {
      return {...prev, [e.target.name]: e.target.value}
    })
  }

  const handleCat = (e) => {
    setCats(e.target.value.split(","));
  }

  const handleClick = (e) => {
    e.preventDefault();

    if (!file) {
      alert("Please choose a file before creating the product.");
      return;
    }

    setInputs(prev => {
      const updatedInputs = { ...prev, size: selectedSizes, color: selectedColors };
      handleProductUpdate(updatedInputs); // Call your function here
      return updatedInputs; // Return updated state for React
    });
  }

  const handleProductUpdate = (updatedInputs) => {
    const fileName = new Date().getTime() + file.name;
    const storage = getStorage(app);
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on('state_changed', 
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('Upload is paused');
            break;
          case 'running':
            console.log('Upload is running');
            break;
            default:
        }
      }, 
      (error) => {
        // Handle unsuccessful uploads
      }, 
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const product = {...updatedInputs, img: downloadURL, categories: cats};
          addProduct(dispatch, product);
        });
      }
    );
  }

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Product</h1>
      <form className="addProductForm">
        <div className="addProductItem">
          <label>Image</label>
          <input type="file" id="file" onChange={e => setFile(e.target.files[0])}/>
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input name="title" type="text" placeholder="Apple Airpods" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input name="desc" type="text" placeholder="description..."  onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Price</label>
          <input name="price" type="number" placeholder="100" onChange={handleChange} />
        </div>
        <div className="addProductItem">
          <label>Categories</label>
          <input type="text" placeholder="jeans, skirts" onChange={handleCat} />
        </div>
        <div className="addProductItem">
          <label>Size</label>
          <Select
            name="size"
            isMulti
            options={sizeOptions}
            value={sizeOptions.filter(option => selectedSizes.includes(option.value))} // Filter options to reflect selected sizes
            onChange={handleSizeChange} />
        </div>
        <div className="addProductItem">
          <label>Color</label>
          <Select
            name="color"
            isMulti
            options={colorOptions}
            value={colorOptions.filter(option => selectedColors.includes(option.value))} // Filter options to reflect selected sizes
            onChange={handleColorChange} />
        </div>
        <div className="addProductItem">
          <label>Stock</label>
          <select name="inStock" onChange={handleChange} >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <button onClick={handleClick} className="addProductButton">Create</button>
      </form>
    </div>
  );
}
