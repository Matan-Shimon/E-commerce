import React, { useState } from "react";
import "./topbar.css";
import { NotificationsNone, Language, Settings } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { logout } from "../../redux/apiCalls";
import { Link } from 'react-router-dom';

export default function Topbar() {
  const [showLogout, setShowLogout] = useState(false);
  const dispatch = useDispatch();

  // Toggle the visibility of the logout button
  const handleAvatarClick = () => {
    setShowLogout(prevState => !prevState);
  };

  const handleLogout = async (e) => {
      try {
        await logout(dispatch);
        setShowLogout(false);
      } catch (err) {
        console.log("Logout failed:", err);
      }
  }

  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">Admin</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Settings />
          </div>
            <img
              src="https://i2.wp.com/vdostavka.ru/wp-content/uploads/2019/05/no-avatar.png?fit=512%2C512&ssl=1"
              alt="Avatar"
              className="topAvatar"
              onClick={handleAvatarClick}
              style={{ cursor: 'pointer' }} // Optional: Add a cursor pointer style
            />
          {showLogout && (
            <Link to="/login" className="logoutButton" onClick={handleLogout}>
              Logout
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
