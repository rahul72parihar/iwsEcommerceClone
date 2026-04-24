import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { FiEdit3, FiTrash2, FiStar, FiPlus, FiImage } from "react-icons/fi";
import { apiService } from "../services/api";
import { addToast } from "../src/store/slices/uiSlice";
import "../styles/AdminPage.css";

const AdminPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);
  const token = useSelector((state) => state.auth.token);
  const isAdmin = useSelector((state) => state.auth.isAdmin);

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [newProductForm, setNewProductForm] = useState({
    id: "",
    title: "",
    price: "",
    image: "",
    category: "SHOES",
    description: "",
  });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredProducts = products.filter((product) =>
    product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product._id.slice(-6).includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
  }, [token, isAdmin, navigate, dispatch]);

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
      category: product.category,
      description: product.description,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const saveEdit = async (id) => {
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
    try {
      const response = await apiService.adminCreateProduct(newProductForm);
      if (response.status === "success") {
        setProducts([response.data, ...products]);
        setNewProductForm({
          id : "",
          title: "",
          price: "",
          image: "",
          category: "SHOES",
          description: "",
        });
        dispatch(addToast({ type: "success", message: "Product created" }));
      }
    } catch (error) {
      dispatch(
        addToast({ type: "error", message: "Failed to create product" }),
      );
    }
  };

  if (loading)
    return <div className="admin-loading">Loading admin panel...</div>;

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
        </div>
      </div>

      <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>Product Management</h2>

      {/* NEW PRODUCT FORM */}
      <div className="admin-section">
        <h2>
          Add New Product <FiPlus />
        </h2>
        <form onSubmit={createProduct} className="admin-form">
          <input
            data-label="ID:"
            placeholder="ID"
            value={newProductForm.id}
            onChange={(e) =>
              setNewProductForm({ ...newProductForm, id: e.target.value })
            }
            required
          />
          <input
            data-label="Title:"
            placeholder="Title"
            value={newProductForm.title}
            onChange={(e) =>
              setNewProductForm({ ...newProductForm, title: e.target.value })
            }
            required
          />
          <input
            data-label="Price:"
            placeholder="Price (e.g. 29.99)"
            value={newProductForm.price}
            onChange={(e) =>
              setNewProductForm({ ...newProductForm, price: e.target.value })
            }
            required
          />
          <input
            data-label="Image:"
            placeholder="Image URL"
            value={newProductForm.image}
            onChange={(e) =>
              setNewProductForm({ ...newProductForm, image: e.target.value })
            }
            required
          />
          <select
            data-label="Category:"
            value={newProductForm.category}
            onChange={(e) =>
              setNewProductForm({ ...newProductForm, category: e.target.value })
            }
          >
            <option value="MEN">MEN</option>
            <option value="WOMEN">WOMEN</option>
            <option value="SHOES">SHOES</option>
          </select>
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
        <h2>Products ({filteredProducts.length}) - {products.length} total</h2>
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
                    <img src={product.image} alt="" className="card-image" />
                  </div>
                  <div className="card-row">
                    <span className="card-label">Title:</span>
                    <span className="card-value">
                      {editingId === product._id ? (
                        <input
                          value={editForm.title}
                          onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
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
                          onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                        />
                      ) : (
                        `$${product.price}`
                      )}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Category:</span>
                    <span className="card-value">
                      {editingId === product._id ? (
                        <select
                          value={editForm.category}
                          onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                        >
                          <option value="MEN">MEN</option>
                          <option value="WOMEN">WOMEN</option>
                          <option value="SHOES">SHOES</option>
                        </select>
                      ) : (
                        product.category
                      )}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Trending:</span>
                    <span className="card-value">
                      <button className="trending-toggle" onClick={() => toggleTrending(product._id)}>
                        <FiStar /> {product.trending ? 'Yes' : 'No'}
                      </button>
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Description:</span>
                    <span className="card-value">
                      {editingId === product._id ? (
                        <textarea 
                          value={editForm.description} 
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                          rows="3"
                          style={{ width: '100%', resize: 'vertical' }}
                        />
                      ) : (
                        product.description.slice(0, 50) + '...'
                      )}
                    </span>
                  </div>
                  <div className="card-row">
                    <span className="card-label">Actions:</span>
                    <div className="action-buttons">
                      {editingId === product._id ? (
                        <>
                          <button className="save-btn" onClick={() => saveEdit(product._id)}>
                            Save
                          </button>
                          <button className="cancel-btn" onClick={cancelEdit}>
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button className="edit-btn" onClick={() => startEdit(product)}>
                            <FiEdit3 /> Edit
                          </button>
                          <button className="delete-btn" onClick={() => deleteProduct(product._id)}>
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
