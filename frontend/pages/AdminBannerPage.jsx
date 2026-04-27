import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FiEdit3, FiTrash2, FiPlus, FiEye, FiEyeOff, FiImage, FiStar, FiLayers } from "react-icons/fi";
import { apiService } from "../services/api";
import { addToast } from "../src/store/slices/uiSlice";
import "../styles/AdminPage.css";

const AdminBannerPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPage, setEditingPage] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [previewImage, setPreviewImage] = useState("");
  const [newBannerForm, setNewBannerForm] = useState({
    page: "main",
    title: "",
    image: "",
    link: "/",
    order: 0,
    isActive: true,
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredBanners = banners.flatMap((pb) =>
    pb.banners.map((b, idx) => ({ ...b, page: pb.page, index: idx }))
  ).filter((banner) =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    banner.page.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    if (!token || !isAdmin) {
      dispatch(
        addToast({
          type: "error",
          message: "Admin access required. Login as admin.",
        })
      );
      navigate("/login");
      return;
    }
    fetchBanners();
  }, [token, isAdmin, navigate, dispatch]);

  const fetchBanners = async () => {
    try {
      const response = await apiService.adminGetBanners();
      if (response.status === "success") {
        setBanners(response.data || response || []);
      }
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to load banners" }));
    } finally {
      setLoading(false);
    }
  };

  const toggleActive = async (page, index) => {
    try {
      const response = await apiService.adminToggleBanner(page, index);
      if (response.status === "success") {
        fetchBanners();
        dispatch(addToast({ type: "success", message: "Banner status updated" }));
      }
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to update banner" }));
    }
  };

  const startEdit = (banner) => {
    setEditingPage(banner.page);
    setEditingIndex(banner.index);
    setEditForm({
      title: banner.title,
      image: banner.image,
      link: banner.link,
      order: banner.order,
      isActive: banner.isActive,
    });
    setPreviewImage(banner.image);
  };

  const cancelEdit = () => {
    setEditingPage(null);
    setEditingIndex(null);
    setEditForm({});
    setPreviewImage("");
  };

  const saveEdit = async () => {
    try {
      const response = await apiService.adminUpdateBanner(editingPage, editingIndex, editForm);
      if (response.status === "success") {
        fetchBanners();
        setEditingPage(null);
        setEditingIndex(null);
        dispatch(addToast({ type: "success", message: "Banner updated" }));
      }
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to update banner" }));
    }
  };

  const deleteBanner = async (page, index) => {
    if (!confirm("Delete banner?")) return;
    try {
      const response = await apiService.adminDeleteBanner(page, index);
      if (response.status === "success") {
        fetchBanners();
        dispatch(addToast({ type: "success", message: "Banner deleted" }));
      }
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to delete banner" }));
    }
  };

  const createBanner = async (e) => {
    e.preventDefault();
    try {
      const response = await apiService.adminCreateBanner(newBannerForm);
      if (response.status === "success") {
        fetchBanners();
        setNewBannerForm({
          page: "main",
          title: "",
          image: "",
          link: "/",
          order: 0,
          isActive: true,
        });
        dispatch(addToast({ type: "success", message: "Banner created" }));
      }
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to create banner" }));
    }
  };

  if (loading) return <div className="admin-loading">Loading banners...</div>;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      {/* ADMIN NAVIGATION */}
      <div className="admin-section">
        <h2>Management Sections</h2>
        <div className="admin-nav-cards">
          <Link to="/admin" className="admin-nav-card">
            <FiStar /> Products
          </Link>
          <Link to="/admin/banners" className="admin-nav-card active">
            <FiImage /> Banners
          </Link>
          <Link to="/admin/categories" className="admin-nav-card">
            <FiLayers /> Categories
          </Link>
        </div>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Banner Management</h2>

      {/* NEW BANNER FORM */}
      <div className="admin-section">
        <h2>
          Add New Banner <FiPlus />
        </h2>
        <form onSubmit={createBanner} className="admin-form">
          <select
            value={newBannerForm.page}
            onChange={(e) => setNewBannerForm({ ...newBannerForm, page: e.target.value })}
          >
            <option value="main">Main</option>
            <option value="men">Men</option>
            <option value="women">Women</option>
            <option value="shoes">Shoes</option>
          </select>
          <input
            placeholder="Title"
            value={newBannerForm.title}
            onChange={(e) => setNewBannerForm({ ...newBannerForm, title: e.target.value })}
            required
          />
          <input
            placeholder="Image URL"
            value={newBannerForm.image}
            onChange={(e) => setNewBannerForm({ ...newBannerForm, image: e.target.value })}
            required
          />
          {newBannerForm.image && (
            <div className="banner-preview">
              <img src={newBannerForm.image} alt="Preview" />
            </div>
          )}
          <input
            placeholder="Link (e.g. /men)"
            value={newBannerForm.link}
            onChange={(e) => setNewBannerForm({ ...newBannerForm, link: e.target.value })}
          />
          <input
            type="number"
            placeholder="Order"
            value={newBannerForm.order}
            onChange={(e) => setNewBannerForm({ ...newBannerForm, order: Number(e.target.value) })}
          />
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={newBannerForm.isActive}
              onChange={(e) => setNewBannerForm({ ...newBannerForm, isActive: e.target.checked })}
            />
            Active
          </label>
          <button type="submit">Create Banner</button>
        </form>
      </div>

      {/* BANNERS TABLE */}
      <div className="admin-section">
        <h2>Banners ({filteredBanners.length})</h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search banners by title or page..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="admin-products">
          {filteredBanners.map((banner) => (
            <div key={`${banner.page}-${banner.index}`} className="product-card">
              <div className="card-row">
                <span className="card-label">Page:</span>
                <span className="card-value">{banner.page}</span>
              </div>
              <div className="card-row">
                <span className="card-label">Image:</span>
                {editingPage === banner.page && editingIndex === banner.index ? (
                  <div className="edit-image-wrap">
                    <input
                      value={editForm.image}
                      onChange={(e) => {
                        setEditForm({ ...editForm, image: e.target.value });
                        setPreviewImage(e.target.value);
                      }}
                      placeholder="Image URL"
                    />
                    {previewImage && (
                      <div className="banner-preview">
                        <img src={previewImage} alt="Preview" />
                      </div>
                    )}
                  </div>
                ) : (
                  <img src={banner.image} alt={banner.title} className="card-image" />
                )}
              </div>
              <div className="card-row">
                <span className="card-label">Title:</span>
                <span className="card-value">
                  {editingPage === banner.page && editingIndex === banner.index ? (
                    <input
                      value={editForm.title}
                      onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    />
                  ) : (
                    banner.title
                  )}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Link:</span>
                <span className="card-value">
                  {editingPage === banner.page && editingIndex === banner.index ? (
                    <input
                      value={editForm.link}
                      onChange={(e) => setEditForm({ ...editForm, link: e.target.value })}
                    />
                  ) : (
                    banner.link
                  )}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Order:</span>
                <span className="card-value">
                  {editingPage === banner.page && editingIndex === banner.index ? (
                    <input
                      type="number"
                      value={editForm.order}
                      onChange={(e) => setEditForm({ ...editForm, order: Number(e.target.value) })}
                    />
                  ) : (
                    banner.order
                  )}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Active:</span>
                <span className="card-value">
                  {editingPage === banner.page && editingIndex === banner.index ? (
                    <label className="toggle-label">
                      <input
                        type="checkbox"
                        checked={editForm.isActive}
                        onChange={(e) => setEditForm({ ...editForm, isActive: e.target.checked })}
                      />
                      {editForm.isActive ? "Yes" : "No"}
                    </label>
                  ) : (
                    <button
                      className="trending-toggle"
                      onClick={() => toggleActive(banner.page, banner.index)}
                    >
                      {banner.isActive ? <FiEye /> : <FiEyeOff />} {banner.isActive ? "Yes" : "No"}
                    </button>
                  )}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Actions:</span>
                <div className="action-buttons">
                  {editingPage === banner.page && editingIndex === banner.index ? (
                    <>
                      <button className="save-btn" onClick={saveEdit}>
                        Save
                      </button>
                      <button className="cancel-btn" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="edit-btn" onClick={() => startEdit(banner)}>
                        <FiEdit3 /> Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteBanner(banner.page, banner.index)}
                      >
                        <FiTrash2 /> Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBannerPage;

