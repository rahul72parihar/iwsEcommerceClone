import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import "../styles/AdminPage.css";

const AdminOrdersPage = () => {
  const navigate = useNavigate();
  const isAdmin = useSelector((state) => state.auth.isAdmin);
  const token = useSelector((state) => state.auth.token);

  useEffect(() => {
    if (!token || !isAdmin) {
      navigate("/login");
    }
  }, [token, isAdmin, navigate]);

  if (!token || !isAdmin) return null;

  return (
    <div className="admin-page">
      <h1>Admin - Orders Management</h1>
      <div className="admin-section">
        <p>Orders CRUD functionality coming soon!</p>
      </div>
    </div>
  );
};

export default AdminOrdersPage;

