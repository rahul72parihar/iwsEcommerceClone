import { useState, useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  FiEdit3,
  FiTrash2,
  FiStar,
  FiPlus,
  FiImage,
  FiLayers,
} from "react-icons/fi";
import { apiService } from "../services/api";
import { addToast } from "../src/store/slices/uiSlice";
import { fetchCatalog } from "../src/store/slices/catalogSlice";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const token = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const categories = useSelector((state) => state.catalog.categories);
  const subcategories = useSelector((state) => state.catalog.subcategories);
  const catalogLoading = useSelector((state) => state.catalog.loading);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newProductForm, setNewProductForm] = useState({
    id: "",
    title: "",
    price: "",
    image: "",
    images: [],
    category: "",
    subcategory: "",
    description: "",
  });

  const [formErrors, setFormErrors] = useState({});
  const [searchTerm, setSearchTerm] = useState("");

  const categoryMap = useMemo(() => {
    const map = {};
    categories.forEach((c) => (map[c._id] = c.name));
    return map;
  }, [categories]);

  const subcategoryMap = useMemo(() => {
    const map = {};
    subcategories.forEach((s) => (map[s._id] = s.name));
    return map;
  }, [subcategories]);

  const filteredProducts = products.filter((product) => {
    const catName = categoryMap[product.category] || "";
    const subName = subcategoryMap[product.subcategory] || "";
    return (
      product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      catName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      subName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product._id.slice(-6).includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  useEffect(() => {
    if (!token || !isAdmin) {
      dispatch(
        addToast({
          type: "error",
          message: "Admin access required. Login as admin.",
        }),
      );
      navigate("/login");
      return;
    }
    fetchProducts();
    if (categories.length === 0) {
      dispatch(fetchCatalog());
    }
  }, [token, isAdmin, navigate, dispatch, categories.length]);

  const fetchProducts = async () => {
    try {
      const response = await apiService.adminGetProducts();
      if (response.status === "success") {
        setProducts(response.data);
      }
    } catch (error) {
      dispatch(addToast({ type: "error", message: "Failed to load products" }));
    } finally {
      setLoading(false);
    }
  };

  const toggleTrending = async (id) => {
    try {
      const response = await apiService.adminToggleTrending(id);
      if (response.status === "success") {
        setProducts(products.map((p) => (p._id === id ? response.data : p)));
        dispatch(addToast({ type: "success", message: "Trending updated" }));
      }
    } catch (error) {
      dispatch(
        addToast({ type: "error", message: "Failed to update trending" }),
      );
    }
  };

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditForm({
      title: product.title,
      price: product.price,
      image: product.image,
      images: product.images || [],
      category: product.category?._id || product.category || "",
      subcategory: product.subcategory?._id || product.subcategory || "",
      description: product.description,
    });
  };

  // Helper functions for managing additional images in new product form
  const [newImageInput, setNewImageInput] = useState("");
  const [editImageInput, setEditImageInput] = useState("");

  const addNewImage = () => {
    if (!newImageInput.trim()) return;
    setNewProductForm({
      ...newProductForm,
      images: [...newProductForm.images, newImageInput.trim()],
    });
    setNewImageInput("");
  };

  const removeNewImage = (index) => {
    setNewProductForm({
      ...newProductForm,
      images: newProductForm.images.filter((_, i) => i !== index),
    });
  };

  const updateNewImage = (index, value) => {
    const updated = [...newProductForm.images];
    updated[index] = value;
    setNewProductForm({ ...newProductForm, images: updated });
  };

  // Helper functions for managing additional images in edit form
  const addEditImage = () => {
    if (!editImageInput.trim()) return;
    setEditForm({
      ...editForm,
      images: [...(editForm.images || []), editImageInput.trim()],
    });
    setEditImageInput("");
  };

  const removeEditImage = (index) => {
    setEditForm({
      ...editForm,
      images: (editForm.images || []).filter((_, i) => i !== index),
    });
  };

  const updateEditImage = (index, value) => {
    const updated = [...(editForm.images || [])];
    updated[index] = value;
    setEditForm({ ...editForm, images: updated });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
    const errors = {};

    if (!editForm.title?.trim()) errors.title = "Title is required";
    if (!editForm.price?.toString().trim()) errors.price = "Price is required";
    if (!editForm.image?.trim()) errors.image = "Main image is required";
    if (!editForm.category) errors.category = "Category is required";
    if (!editForm.subcategory) errors.subcategory = "Subcategory is required";

    // ❌ If errors exist → show toast and stop
    if (Object.keys(errors).length > 0) {
      const firstError = Object.values(errors)[0];

      dispatch(
        addToast({
          type: "error",
          message: firstError,
        }),
      );

      return;
    }

    try {
      const response = await apiService.adminUpdateProduct(id, editForm);
      if (response.status === "success") {
        setProducts(products.map((p) => (p._id === id ? response.data : p)));
        setEditingId(null);
        dispatch(addToast({ type: "success", message: "Product updated" }));
      }
    } catch (error) {
      dispatch(
        addToast({ type: "error", message: "Failed to update product" }),
      );
    }
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete product?")) return;
    try {
      const response = await apiService.adminDeleteProduct(id);
      if (response.status === "success") {
        setProducts(products.filter((p) => p._id !== id));
        dispatch(addToast({ type: "success", message: "Product deleted" }));
      }
    } catch (error) {
      dispatch(
        addToast({ type: "error", message: "Failed to delete product" }),
      );
    }
  };

  const createProduct = async (e) => {
    e.preventDefault();

    const errors = {};
    if (!newProductForm.id.trim()) errors.id = "ID is required";
    if (!newProductForm.title.trim()) errors.title = "Title is required";
    if (!newProductForm.price.trim()) errors.price = "Price is required";
    if (!newProductForm.image.trim()) errors.image = "Image URL is required";
    if (!newProductForm.category) errors.category = "Category is required";
    if (!newProductForm.subcategory)
      errors.subcategory = "Subcategory is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      dispatch(
        addToast({
          type: "error",
          message: "Please fill in all required fields",
        }),
      );
      return;
    }

    setFormErrors({});

    try {
      const response = await apiService.adminCreateProduct(newProductForm);

      if (response.status === "success") {
        setProducts([response.data, ...products]);
        setNewProductForm({
          id: "",
          title: "",
          price: "",
          image: "",
          images: [],
          category: "",
          subcategory: "",
          description: "",
        });
        dispatch(addToast({ type: "success", message: "Product created" }));
        return;
      }

      const message = response?.data?.message || "Failed to create product";

      dispatch(addToast({ type: "error", message }));
    } catch (error) {
      dispatch(
        addToast({ type: "error", message: "Failed to create product" }),
      );
    }
  };

  const newFormSubcategories = subcategories.filter(
    (s) =>
      s.category?._id === newProductForm.category ||
      s.category === newProductForm.category,
  );

  const editFormSubcategories = subcategories.filter(
    (s) =>
      s.category?._id === editForm.category || s.category === editForm.category,
  );

  // if (loading || catalogLoading)
  //   return <div className="admin-loading">Loading admin panel...</div>;

  return (
    <div className="admin-page">
      <h1>Admin Dashboard</h1>

      {/* ADMIN NAVIGATION */}
      <div className="admin-section">
        <h2>Management Sections</h2>
        <div className="admin-nav-cards">
          <Link to="/admin" className="admin-nav-card active">
            <FiStar /> Products
          </Link>
          <Link to="/admin/banners" className="admin-nav-card">
            <FiImage /> Banners
          </Link>
          <Link to="/admin/categories" className="admin-nav-card">
            <FiLayers /> Categories
          </Link>
        </div>
      </div>

      <h2 style={{ textAlign: "center", marginBottom: "1.5rem" }}>
        Product Management
      </h2>

      {/* NEW PRODUCT FORM */}
      <div className="admin-section">
        <h2>
          Add New Product <FiPlus />
        </h2>
        <form onSubmit={createProduct} className="admin-form">
          <input
            data-label="ID:"
            placeholder="ID"
            className={formErrors.id ? "field-error" : ""}
            value={newProductForm.id}
            onChange={(e) => {
              setNewProductForm({ ...newProductForm, id: e.target.value });
              if (formErrors.id) setFormErrors((prev) => ({ ...prev, id: "" }));
            }}
            required
          />
          {formErrors.id && <span className="error-msg">{formErrors.id}</span>}

          <input
            data-label="Title:"
            placeholder="Title"
            className={formErrors.title ? "field-error" : ""}
            value={newProductForm.title}
            onChange={(e) => {
              setNewProductForm({ ...newProductForm, title: e.target.value });
              if (formErrors.title)
                setFormErrors((prev) => ({ ...prev, title: "" }));
            }}
            required
          />
          {formErrors.title && (
            <span className="error-msg">{formErrors.title}</span>
          )}

          <input
            data-label="Price:"
            placeholder="Price (e.g. 29.99)"
            className={formErrors.price ? "field-error" : ""}
            value={newProductForm.price}
            onChange={(e) => {
              setNewProductForm({ ...newProductForm, price: e.target.value });
              if (formErrors.price)
                setFormErrors((prev) => ({ ...prev, price: "" }));
            }}
            required
          />
          {formErrors.price && (
            <span className="error-msg">{formErrors.price}</span>
          )}

          <input
            data-label="Image:"
            placeholder="Image URL"
            className={formErrors.image ? "field-error" : ""}
            value={newProductForm.image}
            onChange={(e) => {
              setNewProductForm({ ...newProductForm, image: e.target.value });
              if (formErrors.image)
                setFormErrors((prev) => ({ ...prev, image: "" }));
            }}
            required
          />
          {formErrors.image && (
            <span className="error-msg">{formErrors.image}</span>
          )}

          {/* Additional Images Section - New Product */}
          <div className="images-section">
            <label className="images-label">Additional Images:</label>
            <div className="image-input-row">
              <input
                placeholder="Additional Image URL"
                value={newImageInput}
                onChange={(e) => setNewImageInput(e.target.value)}
                onKeyDown={(e) =>
                  e.key === "Enter" && (e.preventDefault(), addNewImage())
                }
              />
              <button
                type="button"
                className="add-image-btn"
                onClick={addNewImage}
              >
                <FiPlus /> Add
              </button>
            </div>
            {newProductForm.images.length > 0 && (
              <div className="image-list">
                {newProductForm.images.map((img, idx) => (
                  <div key={idx} className="image-item">
                    <img
                      src={img}
                      alt={`Additional ${idx + 1}`}
                      className="image-thumb"
                    />
                    <input
                      value={img}
                      onChange={(e) => updateNewImage(idx, e.target.value)}
                      placeholder="Image URL"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={() => removeNewImage(idx)}
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <select
            data-label="Category:"
            className={formErrors.category ? "field-error" : ""}
            value={newProductForm.category}
            onChange={(e) => {
              setNewProductForm({
                ...newProductForm,
                category: e.target.value,
                subcategory: "",
              });
              if (formErrors.category)
                setFormErrors((prev) => ({ ...prev, category: "" }));
            }}
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
          {formErrors.category && (
            <span className="error-msg">{formErrors.category}</span>
          )}

          <select
            data-label="SubCategory:"
            className={formErrors.subcategory ? "field-error" : ""}
            value={newProductForm.subcategory}
            onChange={(e) => {
              setNewProductForm({
                ...newProductForm,
                subcategory: e.target.value,
              });
              if (formErrors.subcategory)
                setFormErrors((prev) => ({ ...prev, subcategory: "" }));
            }}
            required
            disabled={!newProductForm.category}
          >
            <option value="">
              {newProductForm.category
                ? "Select Subcategory"
                : "Choose category first"}
            </option>
            {newFormSubcategories.map((sub) => (
              <option key={sub._id} value={sub._id}>
                {sub.name}
              </option>
            ))}
          </select>
          {formErrors.subcategory && (
            <span className="error-msg">{formErrors.subcategory}</span>
          )}

          <textarea
            data-label="Description:"
            placeholder="Description"
            value={newProductForm.description}
            onChange={(e) =>
              setNewProductForm({
                ...newProductForm,
                description: e.target.value,
              })
            }
          />
          <button type="submit">Create Product</button>
        </form>
      </div>

      {/* PRODUCTS TABLE - RESPONSIVE */}
      <div className="admin-section">
        <h2>
          Products ({filteredProducts.length}) - {products.length} total
        </h2>
        <div className="search-container">
          <input
            type="text"
            placeholder="🔍 Search products by title, category, or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="admin-products">
          {filteredProducts.map((product) => (
            <div key={product._id} className="product-card">
              <div className="card-row">
                <span className="card-label">ID:</span>
                <span className="card-value">{product.id}</span>
              </div>
              <div className="card-row">
                <span className="card-label">Image:</span>
                {editingId === product._id ? (
                  <input
                    value={editForm.image}
                    onChange={(e) =>
                      setEditForm({ ...editForm, image: e.target.value })
                    }
                    placeholder="Main Image URL"
                    style={{ flex: 1 }}
                  />
                ) : (
                  <img src={product.image} alt="" className="card-image" />
                )}
              </div>
              {editingId === product._id ? (
                <div
                  className="card-row"
                  style={{ flexDirection: "column", alignItems: "stretch" }}
                >
                  <span className="card-label">Additional Images:</span>
                  <div className="images-section edit-images-section">
                    <div className="image-input-row">
                      <input
                        placeholder="Additional Image URL"
                        value={editImageInput}
                        onChange={(e) => setEditImageInput(e.target.value)}
                        onKeyDown={(e) =>
                          e.key === "Enter" &&
                          (e.preventDefault(), addEditImage())
                        }
                      />
                      <button
                        type="button"
                        className="add-image-btn"
                        onClick={addEditImage}
                      >
                        <FiPlus /> Add
                      </button>
                    </div>
                    {(editForm.images || []).length > 0 && (
                      <div className="image-list">
                        {(editForm.images || []).map((img, idx) => (
                          <div key={idx} className="image-item">
                            <img
                              src={img}
                              alt={`Additional ${idx + 1}`}
                              className="image-thumb"
                            />
                            <input
                              value={img}
                              onChange={(e) =>
                                updateEditImage(idx, e.target.value)
                              }
                              placeholder="Image URL"
                            />
                            <button
                              type="button"
                              className="remove-image-btn"
                              onClick={() => removeEditImage(idx)}
                            >
                              <FiTrash2 />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                product.images &&
                product.images.length > 0 && (
                  <div className="card-row">
                    <span className="card-label">More Images:</span>
                    <div className="card-value more-images">
                      {product.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={img}
                          alt={`${product.title} ${idx + 1}`}
                          className="card-image-thumb"
                        />
                      ))}
                    </div>
                  </div>
                )
              )}
              <div className="card-row">
                <span className="card-label">Title:</span>
                <span className="card-value">
                  {editingId === product._id ? (
                    <input
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                    />
                  ) : (
                    product.title
                  )}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Price:</span>
                <span className="card-value">
                  {editingId === product._id ? (
                    <input
                      value={editForm.price}
                      onChange={(e) =>
                        setEditForm({ ...editForm, price: e.target.value })
                      }
                    />
                  ) : (
                    `₹${product.price}`
                  )}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Category:</span>
                <span className="card-value">
                  {editingId === product._id ? (
                    <select
                      value={editForm.category}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          category: e.target.value,
                          subcategory: "",
                        })
                      }
                    >
                      <option value="">Select Category</option>
                      {categories.map((cat) => (
                        <option key={cat._id} value={cat._id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    categoryMap[product.category] || product.category
                  )}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Subcategory:</span>
                <span className="card-value">
                  {editingId === product._id ? (
                    <select
                      value={editForm.subcategory}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          subcategory: e.target.value,
                        })
                      }
                      disabled={!editForm.category}
                    >
                      <option value="">
                        {editForm.category
                          ? "Select Subcategory"
                          : "Choose category first"}
                      </option>
                      {editFormSubcategories.map((sub) => (
                        <option key={sub._id} value={sub._id}>
                          {sub.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    subcategoryMap[product.subcategory] || product.subcategory
                  )}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Trending:</span>
                <span className="card-value">
                  <button
                    className="trending-toggle"
                    onClick={() => toggleTrending(product._id)}
                  >
                    <FiStar /> {product.trending ? "Yes" : "No"}
                  </button>
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Description:</span>
                <span className="card-value">
                  {editingId === product._id ? (
                    <textarea
                      value={editForm.description}
                      onChange={(e) =>
                        setEditForm({
                          ...editForm,
                          description: e.target.value,
                        })
                      }
                      rows="3"
                      style={{ width: "100%", resize: "vertical" }}
                    />
                  ) : (
                    product.description.slice(0, 50) + "..."
                  )}
                </span>
              </div>
              <div className="card-row">
                <span className="card-label">Actions:</span>
                <div className="action-buttons">
                  {editingId === product._id ? (
                    <>
                      <button
                        className="save-btn"
                        onClick={() => saveEdit(product._id)}
                      >
                        Save
                      </button>
                      <button className="cancel-btn" onClick={cancelEdit}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="edit-btn"
                        onClick={() => startEdit(product)}
                      >
                        <FiEdit3 /> Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() => deleteProduct(product._id)}
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

export default AdminPage;
