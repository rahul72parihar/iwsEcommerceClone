import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { FiEdit3, FiTrash2, FiStar, FiPlus } from "react-icons/fi";
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
    title: "",
    price: "",
    image: "",
    category: "SHOES",
    description: "",
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
      <h1>Admin - Product Management</h1>

      {/* NEW PRODUCT FORM */}
      <div className="admin-section">
        <h2>
          Add New Product <FiPlus />
        </h2>
        <form onSubmit={createProduct} className="admin-form">
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
        <h2>Products ({products.length})</h2>
        <div className="table-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Image</th>
                <th>Title</th>
                <th>Price</th>
                <th>Category</th>
                <th>Trending</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr key={product._id}>
                  <td data-label="ID:">{product._id.slice(-6)}</td>
                  <td data-label="Image:">
                    <img src={product.image} alt="" width="50" />
                  </td>
                  <td data-label="Title:">
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
                  </td>
                  <td data-label="Price:">
                    {editingId === product._id ? (
                      <input
                        value={editForm.price}
                        onChange={(e) =>
                          setEditForm({ ...editForm, price: e.target.value })
                        }
                      />
                    ) : (
                      `$${product.price}`
                    )}
                  </td>
                  <td data-label="Category:">
                    {editingId === product._id ? (
                      <select
                        value={editForm.category}
                        onChange={(e) =>
                          setEditForm({ ...editForm, category: e.target.value })
                        }
                      >
                        <option value="MEN">MEN</option>
                        <option value="WOMEN">WOMEN</option>
                        <option value="SHOES">SHOES</option>
                      </select>
                    ) : (
                      product.category
                    )}
                  </td>
                  <td data-label="Trending:">
                    <button
                      style={{
                        backgroundColor: product.trending ? "gold" : "white",
                        color: "black",
                        padding: "10px 20px",
                        borderRadius: "5px",
                        border: "1px solid black",
                        cursor: "pointer",
                      }}
                      onClick={() => toggleTrending(product._id)}
                    >
                      <FiStar /> {product.trending ? "Yes" : "No"}
                    </button>
                  </td>
                  <td data-label="Description:">
                    {editingId === product._id ? (
                      <textarea 
                        value={editForm.description} 
                        onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        rows="3"
                        style={{ width: '100%', resize: 'vertical', borderRadius: '8px', padding: '0.5rem', border: '1px solid #ddd' }}
                      />
                    ) : (
                      product.description.slice(0, 50) + '...'
                    )}
                  </td>
                  <td data-label="Actions:">
                    {editingId === product._id ? (
                      <>
                        <button onClick={() => saveEdit(product._id)}>
                          Save
                        </button>
                        <button onClick={cancelEdit}>Cancel</button>
                      </>
                    ) : (
                      <button
                        onClick={() => startEdit(product)}
                        className="action-icon"
                      >
                        <FiEdit3 color="white" />
                      </button>
                    )}
                    <button
                      onClick={() => deleteProduct(product._id)}
                      className="action-icon"
                    >
                      <FiTrash2 color="white" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
