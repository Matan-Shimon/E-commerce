import {
  CalendarToday,
  LocationSearching,
  MailOutline,
  PermIdentity,
  PhoneAndroid,
  Publish,
} from "@material-ui/icons";
import { Link, useLocation } from "react-router-dom";
import "./user.css";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { updateUser } from "../../redux/apiCalls";

export default function User() {
  const location = useLocation();
  const userId = location.pathname.split("/")[2];
  const user = useSelector((state) => state.users.users.find(
    (user) => user._id === userId
  ));

  const [inputs, setInputs] = useState({
    fullname: user.fullname,
    username: user.username,
    address: user.address,
    email: user.email,
    isAdmin: user.isAdmin ? 'true' : 'false'
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInputs(prev => {
        return {
          ...prev,
          [e.target.name]:
          e.target === "checkbox"? e.target.checked
          : e.target.value}
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    updateUser(dispatch, inputs, userId);
  }


  return (
    <div className="user">
      <div className="userTitleContainer">
        <h1 className="userTitle">Edit User</h1>
      </div>
      <div className="userContainer">
        <div className="userShow">
          <div className="userShowTop">
            <img
              src="https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1"
              alt=""
              className="userShowImg"
            />
            <div className="userShowTopTitle">
              <span className="userShowUsername">{user.username}</span>
            </div>
          </div>
          <div className="userShowBottom">
            <span className="userShowTitle">Account Details</span>
            <div className="userShowInfo">
              <PermIdentity className="userShowIcon" />
              <span className="userShowInfoTitle">{user.username}</span>
            </div>
            <div className="userShowInfo">
              <span className="userShowInfoTitle">{user.isAdmin ? "Admin: Yes" : "Admin : No"}</span>
            </div>
            <span className="userShowTitle">Contact Details</span>
            <div className="userShowInfo">
              <MailOutline className="userShowIcon" />
              <span className="userShowInfoTitle">{user.email}</span>
            </div>
          </div>
        </div>
        <div className="userUpdate">
          <span className="userUpdateTitle">Edit</span>
          <form className="userUpdateForm">
            <div className="userUpdateLeft">
            <div className="userUpdateItem">
                <label>Full Name</label>
                <input
                  name="fullname"
                  type="text"
                  onChange={handleChange}
                  placeholder={user.fullname}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Username</label>
                <input
                  name="username"
                  type="text"
                  onChange={handleChange}
                  placeholder={user.username}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Email</label>
                <input
                  name="email"
                  type="text"
                  onChange={handleChange}
                  placeholder={user.email}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem">
                <label>Address</label>
                <input
                  name="address"
                  type="text"
                  onChange={handleChange}
                  placeholder={user.address}
                  className="userUpdateInput"
                />
              </div>
              <div className="userUpdateItem" style={{ display: "flex" }}>
                <label>Admin</label>
                <input
                  name="isAdmin"
                  type="checkbox"
                  onChange={handleChange}
                  className="userUpdateInput"
                  style={{ position: "relative", left: "-110px" }}
                />
              </div>
            </div>
            <div className="userUpdateRight">
              <div className="userUpdateUpload">
                <img
                  className="userUpdateImg"
                  src="https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1"
                  alt=""
                />
              </div>
              <button className="userUpdateButton" onClick={handleClick}>Update</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
