import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart"
import {productData} from "../../dummyData"
import { Publish } from "@material-ui/icons";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../../requestMethods";
import {getStorage, ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import { useDispatch } from "react-redux";
import app from "../../firebase";
import { updateProduct } from "../../redux/apiCalls";
import Select from 'react-select';

export default function Product() {
    const location = useLocation();
    const productId = location.pathname.split("/")[2];
    const product = useSelector((state) => state.product.products.find(
        (product) => product._id === productId
    ));
    
    const [prodStats, setProdStats] = useState([]);
    
    const [totalSalesCount, setTotalSalesCount] = useState(0);
    const [inputs, setInputs] = useState({
        title: product.title,
        desc: product.desc,
        price: product.price || '',
        inStock: product.inStock ? 'true' : 'false'
    });
    const [file, setFile] = useState(product.img); // Initialize with the existing image
    const [cats, setCats] = useState(product.categories);
    const [selectedSizes, setSelectedSizes] = useState(product.size);
    const [selectedColors, setSelectedColors] = useState(product.color);
    const dispatch = useDispatch();

    useEffect(() => {
        setFile(product.img); // Ensure file is set to the current product's image on component load
    }, [product]);

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
        });
        console.log("inputs\n",inputs);
    };

    const handleCat = (e) => {
        setCats(e.target.value.split(","));
    };

    const handleClick = (e) => {
        e.preventDefault();
    
        setInputs(prev => {
            const updatedInputs = { ...prev, size: selectedSizes, color: selectedColors };
            handleProductUpdate(updatedInputs); // Call your function here
            return updatedInputs; // Return updated state for React
        });
    };

    const handleProductUpdate = (updatedInputs) => {
        // If the file is a string (image URL), skip upload and just send the current image
        if (typeof file === 'string') {
            const productData = { ...updatedInputs, img: file, categories: cats };
            updateProduct(dispatch, productData, productId);
        } else {
            // Handle new file upload if the user uploaded a new file
            const fileName = new Date().getTime() + file.name;
            const storage = getStorage(app);
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on('state_changed', 
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log('Upload is ' + progress + '% done');
                }, 
                (error) => {
                    // Handle unsuccessful uploads
                    console.error('Upload error: ', error);
                }, 
                () => {
                    // Handle successful uploads on complete
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const productData = { ...updatedInputs, img: downloadURL, categories: cats };
                        // console.log("PRODUCT!\n"+productData);
                        console.log("PRODUCT ID!\n"+productId);
                        updateProduct(dispatch, productData, productId); // Pass productId for identification
                    });
                }
            );
        }
    };
    
    
    const MONTHS = useMemo(
        () => [
          "Jan",
          "Feb",
          "Mar",
          "Apr",
          "May",
          "Jun",
          "Jul",
          "Aug",
          "Sep",
          "Oct",
          "Nov",
          "Dec"
        ],
        []
      );

      useEffect(() => {
        const getTotalCount = async () => {
            try {
                const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
                const res = await userRequest(token).get("/orders/product-count?pid=" + productId);
                console.log("RES:\n", res.data);
                setTotalSalesCount(res.data.totalQuantity);
            } catch {}
        }
        getTotalCount();
      }, [MONTHS]);
    
      useEffect(() => {
        const getStats = async () => {
          try {
            const token = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.accessToken;
            const res = await userRequest(token).get("/orders/product-count-per-month?pid="+productId)
            const sortedData = res.data.map((item) => ({
              name: MONTHS[item._id - 1], // Get the month name based on the _id from API
              Sales: item.totalQuantity * product.price, // Assign the total sales
            }))
            .sort((a, b) => MONTHS.indexOf(a.name) - MONTHS.indexOf(b.name)); // Sort by month order (from Jan to Dec)
    
            setProdStats(sortedData);
            console.log("Sorted Data: ", sortedData);
          } catch {}
        }
        getStats();
      }, [MONTHS]);

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
      </div>
      <div className="productTop">
          <div className="productTopLeft">
              <Chart data={prodStats} dataKey="Sales" title="Sales Performance"/>
          </div>
          <div className="productTopRight">
              <div className="productInfoTop">
                  <img src={product.img} />
                  <span className="productName">{product.title}</span>
              </div>
              <div className="productInfoBottom">
                  <div className="productInfoItem">
                      <span className="productInfoKey">number of sales:</span>
                      <span className="productInfoValue">{totalSalesCount}</span>
                  </div>
                  <div className="productInfoItem">
                      <span className="productInfoKey">in stock:</span>
                      <span className="productInfoValue">{product.inStock ? 'Yes' : 'No'}</span>
                  </div>
              </div>
          </div>
      </div>
      <div className="productBottom">
          <form className="productForm">
              <div className="productFormLeft">
                  <label>Product Name</label>
                  <input name="title" type="text" placeholder={product.title} onChange={handleChange} />
                  <label>Description</label>
                  <input name="desc" type="text" placeholder={product.desc} onChange={handleChange} />
                  <label>Price</label>
                  <input name="price" type="number" placeholder={product.price} onChange={handleChange} />
                  <label>Categories</label>
                  <input type="text" placeholder={product.categories} onChange={handleCat} />
                  <label>Size</label>
                  <Select
                    name="size"
                    isMulti
                    options={sizeOptions}
                    value={sizeOptions.filter(option => selectedSizes.includes(option.value))} // Filter options to reflect selected sizes
                    onChange={handleSizeChange} />
                  <label>Color</label>
                  <Select
                    name="color"
                    isMulti
                    options={colorOptions}
                    value={colorOptions.filter(option => selectedColors.includes(option.value))} // Filter options to reflect selected sizes
                    onChange={handleColorChange} />
                  <label>In Stock</label>
                  <select name="inStock" id="idStock" onChange={handleChange} >
                      <option value="true">Yes</option>
                      <option value="false">No</option>
                  </select>
              </div>
              <div className="productFormRight">
                  <div className="productUpload">
                      <img src={product.img} />
                      <label for="file">
                          <Publish/>
                      </label>
                      <input type="file" id="file" style={{display:"none"}} onChange={e => setFile(e.target.files[0])} />
                  </div>
                  <button className="productButton" onClick={handleClick}>Update</button>
              </div>
          </form>
      </div>
    </div>
  );
}