import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logout } from "../src/store/slices/authSlice";
import { resetCartOnLogout } from "../src/store/slices/uiSlice";

import "../styles/ProfilePage.css";

export default function ProfilePage() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(resetCartOnLogout());
    dispatch(logout());
    navigate("/");
  };


  if (!user) {
    return (
      <div className="profilePage">
        <div className="profileContainer">
          <h1>Profile</h1>
          <p>Please <a href="/login">log in</a> to view your profile.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="profilePage">
      <div className="profileContainer">
        <h1>My Profile</h1>
        <div className="profileCard">
          <div className="profileAvatar">
            <div className="avatarPlaceholder">
              {user.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
          </div>
          <div className="profileInfo">
            <h2>{user.name || 'User'}</h2>
            <p className="email">{user.email}</p>
            <p className="userId">ID: {user.id?.slice(-6) || 'N/A'}</p>
          </div>
          <button className="logoutBtn" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

