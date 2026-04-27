import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FiEdit3, FiTrash2, FiPlus, FiStar, FiImage, FiLayers } from "react-icons/fi";
import { apiService } from "../services/api";
import { addToast } from "../src/store/slices/uiSlice";
import "../styles/AdminPage.css";

const AdminCategoriesPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editCategoryForm, setEditCategoryForm] = useState({ name: "" });
  const [newCategoryForm, setNewCategoryForm] = useState({ name: "" });

  const [editingSubcategoryId, setEditingSubcategoryId] = useState(null);
  const [editSubcategoryForm, setEditSubcategoryForm] = useState({ name: "", category: "" });
  const [newSubcategoryForm, setNewSubcategoryForm] = useState({ name: "", category: "" });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(searchTerm.toLowerCase())
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
    fetchData();
  }, [token, isAdmin, navigate, dispatch]);

  const fetchData = async () => {
    try {
      const [catRes, subRes] = await Promise.all([
        apiService.adminGetCategories(),
        apiService.adminGetSubcategories(),
      ]);
      if (catRes.status === "success") {
        setCategories(catRes.data || []);
      }
      if (subRes.status === "success") {
        setSubcategories(subRes.data || []);
      }
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to load categories" }));
    } finally {
      setLoading(false);
    }
  };

  // =====================
  // CATEGORY CRUD
  // =====================

  const createCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryForm.name.trim()) return;
    try {
      const response = await apiService.adminCreateCategory({ name: newCategoryForm.name.trim() });
      if (response.status === "success") {
        setCategories([...categories, response.data]);
        setNewCategoryForm({ name: "" });
        dispatch(addToast({ type: "success", message: "Category created" }));
      }
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to create category" }));
    }
  };

  const startEditCategory = (category) => {
    setEditingCategoryId(category._id);
    setEditCategoryForm({ name: category.name });
  };

  const cancelEditCategory = () => {
    setEditingCategoryId(null);
    setEditCategoryForm({ name: "" });
  };

  const saveEditCategory = async (id) => {
    try {
      const response = await apiService.adminUpdateCategory(id, { name: editCategoryForm.name });
      if (response.status === "success") {
        setCategories(categories.map((c) => (c._id === id ? { ...c, name: response.data.name } : c)));
        setEditingCategoryId(null);
        dispatch(addToast({ type: "success", message: "Category updated" }));
      }
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to update category" }));
    }
  };

  const deleteCategory = async (id) => {
    const cat = categories.find((c) => c._id === id);
    const hasSubs = subcategories.some((s) => s.category?._id === id || s.category === id);
    const msg = hasSubs
      ? `Delete category "${cat?.name}" and ALL its subcategories?`
      : `Delete category "${cat?.name}"?`;
    if (!confirm(msg)) return;
    try {
      const response = await apiService.adminDeleteCategory(id);
      if (response.status === "success") {
        setCategories(categories.filter((c) => c._id !== id));
        setSubcategories(subcategories.filter((s) => s.category?._id !== id && s.category !== id));
        dispatch(addToast({ type: "success", message: "Category deleted" }));
      }
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to delete category" }));
    }
  };

  // =====================
  // SUBCATEGORY CRUD
  // =====================

  const createSubcategory = async (e) => {
    e.preventDefault();
    if (!newSubcategoryForm.name.trim() || !newSubcategoryForm.category) return;
    try {
      const response = await apiService.adminCreateSubcategory({
        name: newSubcategoryForm.name.trim(),
        category: newSubcategoryForm.category,
      });
      if (response.status === "success") {
        setSubcategories([...subcategories, response.data]);
        setNewSubcategoryForm({ name: "", category: "" });
        dispatch(addToast({ type: "success", message: "Subcategory created" }));
      }
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to create subcategory" }));
    }
  };

  const startEditSubcategory = (subcategory) => {
    setEditingSubcategoryId(subcategory._id);
    setEditSubcategoryForm({
      name: subcategory.name,
      category: typeof subcategory.category === "object" ? subcategory.category._id : subcategory.category,
    });
  };

  const cancelEditSubcategory = () => {
    setEditingSubcategoryId(null);
    setEditSubcategoryForm({ name: "", category: "" });
  };

  const saveEditSubcategory = async (id) => {
    try {
      const response = await apiService.adminUpdateSubcategory(id, {
        name: editSubcategoryForm.name,
        category: editSubcategoryForm.category,
      });
      if (response.status === "success") {
        setSubcategories(subcategories.map((s) => (s._id === id ? response.data : s)));
        setEditingSubcategoryId(null);
        dispatch(addToast({ type: "success", message: "Subcategory updated" }));
      }
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to update subcategory" }));
    }
  };

  const deleteSubcategory = async (id) => {
    const sub = subcategories.find((s) => s._id === id);
    if (!confirm(`Delete subcategory "${sub?.name}"?`)) return;
    try {
      const response = await apiService.adminDeleteSubcategory(id);
      if (response.status === "success") {
        setSubcategories(subcategories.filter((s) => s._id !== id));
        dispatch(addToast({ type: "success", message: "Subcategory deleted" }));
      }
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to delete subcategory" }));
    }
  };

  if (loading) return <div className="admin-loading">Loading categories...</div>;

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
          <Link to="/admin/banners" className="admin-nav-card">
            <FiImage /> Banners
          </Link>
          <Link to="/admin/categories" className="admin-nav-card active">
            <FiLayers /> Categories
          </Link>
        </div>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>Category & Subcategory Management</h2>

      <div className="search-container">
        <input
          type="text"
          placeholder="🔍 Search categories..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* CATEGORIES SECTION */}
      <div className="admin-section">
        <h2>
          Categories ({filteredCategories.length}) <FiLayers />
        </h2>

        {/* NEW CATEGORY FORM */}
        <form onSubmit={createCategory} className="admin-form" style={{ marginBottom: "1.5rem" }}>
          <input
            placeholder="New category name (e.g. MEN)"
            value={newCategoryForm.name}
            onChange={(e) => setNewCategoryForm({ ...newCategoryForm, name: e.target.value })}
            required
          />
          <button type="submit">
            <FiPlus /> Add Category
          </button>
        </form>

        <div className="admin-products">
          {filteredCategories.map((category) => (
            <div key={category._id} className="product-card">
              <div className="card-row">
                <span className="card-label">Name:</span>
                <span className="card-value">
                  {editingCategoryId === category._id ? (
                    <input
                      value={editCategoryForm.name}
                      onChange={(e) => setEditCategoryForm({ ...editCategoryForm, name: e.target.value })}
                    />
                  ) : (
                    category.name
                  )}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Subcategories:</span>
                <span className="card-value">
                  {subcategories.filter((s) =>
                    (s.category?._id || s.category) === category._id
                  ).length}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Actions:</span>
                <div className="action-buttons">
                  {editingCategoryId === category._id ? (
                    <>
                      <button className="save-btn" onClick={() => saveEditCategory(category._id)}>
                        Save
                      </button>
                      <button className="cancel-btn" onClick={cancelEditCategory}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="edit-btn" onClick={() => startEditCategory(category)}>
                        <FiEdit3 /> Edit
                      </button>
                      <button className="delete-btn" onClick={() => deleteCategory(category._id)}>
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

      {/* SUBCATEGORIES SECTION */}
      <div className="admin-section">
        <h2>
          Subcategories ({subcategories.length}) <FiLayers />
        </h2>

        {/* NEW SUBCATEGORY FORM */}
        <form onSubmit={createSubcategory} className="admin-form" style={{ marginBottom: "1.5rem" }}>
          <input
            placeholder="New subcategory name (e.g. T-Shirts)"
            value={newSubcategoryForm.name}
            onChange={(e) => setNewSubcategoryForm({ ...newSubcategoryForm, name: e.target.value })}
            required
          />
          <select
            value={newSubcategoryForm.category}
            onChange={(e) => setNewSubcategoryForm({ ...newSubcategoryForm, category: e.target.value })}
            required
          >
            <option value="">Select parent category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          <button type="submit">
            <FiPlus /> Add Subcategory
          </button>
        </form>

        <div className="admin-products">
          {subcategories.map((subcategory) => (
            <div key={subcategory._id} className="product-card">
              <div className="card-row">
                <span className="card-label">Name:</span>
                <span className="card-value">
                  {editingSubcategoryId === subcategory._id ? (
                    <input
                      value={editSubcategoryForm.name}
                      onChange={(e) =>
                        setEditSubcategoryForm({ ...editSubcategoryForm, name: e.target.value })
                      }
                    />
                  ) : (
                    subcategory.name
                  )}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Category:</span>
                <span className="card-value">
                  {editingSubcategoryId === subcategory._id ? (
                    <select
                      value={editSubcategoryForm.category}
                      onChange={(e) =>
                        setEditSubcategoryForm({ ...editSubcategoryForm, category: e.target.value })
                      }
                    >
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    subcategory.category?.name || "N/A"
                  )}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Actions:</span>
                <div className="action-buttons">
                  {editingSubcategoryId === subcategory._id ? (
                    <>
                      <button className="save-btn" onClick={() => saveEditSubcategory(subcategory._id)}>
                        Save
                      </button>
                      <button className="cancel-btn" onClick={cancelEditSubcategory}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="edit-btn" onClick={() => startEditSubcategory(subcategory)}>
                        <FiEdit3 /> Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteSubcategory(subcategory._id)}
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

export default AdminCategoriesPage;

