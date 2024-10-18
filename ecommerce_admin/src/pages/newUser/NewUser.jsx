import "./newUser.css";
import { useState } from "react";
import { addUser } from "../../redux/apiCalls";
import { useDispatch } from "react-redux";

export default function NewUser() {
  const [inputs, setInputs] = useState({
    isAdmin: false
  });
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setInputs(prev => {
      return {
        ...prev,
        [e.target.name]:
        e.target === "checkbox" ? e.target.checked
        : e.target.value}
    });
  }

  const handleClick = (e) => {
    e.preventDefault();
    console.log("inputs\n", inputs);
    addUser(dispatch, inputs);
  }
  

  return (
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>
      <form className="newUserForm">
      <div className="newUserItem">
          <label>Full Name</label>
          <input name="fullname" type="text" placeholder="john wick" onChange={handleChange} />
        </div>
        <div className="newUserItem">
          <label>Username</label>
          <input name="username" type="text" placeholder="john123" onChange={handleChange} />
        </div>
        <div className="newUserItem">
          <label>Email</label>
          <input name="email" type="text" placeholder="john@gmail.com" onChange={handleChange} />
        </div>
        <div className="newUserItem">
          <label>Address</label>
          <input name="address" type="text" placeholder="NY, USA" onChange={handleChange} />
        </div>
        <div className="newUserItem">
          <label>Password</label>
          <input name="password" type="number" placeholder="123456" onChange={handleChange} />
        </div>
        <div className="newUserItem">
          <label>Admin</label>
          <input 
            name="isAdmin"
            type="checkbox"
            onChange={handleChange}
            className="userUpdateInput"
            style={{ position: "relative", left: "-110px" }}
          />
        </div>
        <button className="newUserButton" onClick={handleClick}>Create</button>
      </form>
    </div>
  );
}
