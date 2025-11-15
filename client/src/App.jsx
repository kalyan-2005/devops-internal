import { useEffect, useState } from "react";
import "./App.css";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:4000";

function App() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    imageUrl: "",
  });
  const [filterCategory, setFilterCategory] = useState("all");

  async function fetchProducts() {
    try {
      const res = await fetch(`${API_BASE}/api/products`);
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error("fetchProducts", err);
    }
  }

  useEffect(() => {
    fetchProducts();
  }, []);

  function resetForm() {
    setFormData({
      name: "",
      description: "",
      price: "",
      category: "",
      stock: "",
      imageUrl: "",
    });
    setEditingId(null);
    setShowForm(false);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        category: formData.category.trim() || "Uncategorized",
        stock: parseInt(formData.stock) || 0,
        imageUrl: formData.imageUrl.trim(),
      };

      if (editingId) {
        await fetch(`${API_BASE}/api/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      } else {
        await fetch(`${API_BASE}/api/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        });
      }
      resetForm();
      fetchProducts();
    } catch (err) {
      console.error("handleSubmit", err);
    }
  }

  function startEdit(product) {
    setFormData({
      name: product.name,
      description: product.description || "",
      price: product.price.toString(),
      category: product.category || "",
      stock: product.stock.toString(),
      imageUrl: product.imageUrl || "",
    });
    setEditingId(product._id);
    setShowForm(true);
  }

  async function deleteProduct(id) {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`${API_BASE}/api/products/${id}`, { method: "DELETE" });
      fetchProducts();
    } catch (err) {
      console.error("deleteProduct", err);
    }
  }

  const categories = [
    "all",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];
  const filteredProducts =
    filterCategory === "all"
      ? products
      : products.filter((p) => p.category === filterCategory);

  const totalValue = products.reduce((sum, p) => sum + p.price * p.stock, 0);
  const totalProducts = products.length;
  const lowStockProducts = products.filter((p) => p.stock < 10).length;

  return (
    <div className="app">
      <header className="app-header">
        <h1>Product Management</h1>
        <p className="subtitle">Manage your inventory efficiently</p>
      </header>

      <div className="stats-container">
        <div className="stat-card">
          <div className="stat-value">{totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">
            $
            {totalValue.toLocaleString("en-US", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </div>
          <div className="stat-label">Total Value</div>
        </div>
        <div className="stat-card warning">
          <div className="stat-value">{lowStockProducts}</div>
          <div className="stat-label">Low Stock</div>
        </div>
      </div>

      <div className="controls">
        <button
          className="btn btn-primary"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
        >
          + Add New Product
        </button>
        <div className="filter-group">
          <label>Filter by Category:</label>
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "all" ? "All Categories" : cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {showForm && (
        <div className="modal-overlay" onClick={resetForm}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{editingId ? "Edit Product" : "Add New Product"}</h2>
            <form onSubmit={handleSubmit} className="product-form">
              <div className="form-group">
                <label>Product Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Enter product description"
                  rows="3"
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Price ($) *</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={(e) =>
                      setFormData({ ...formData, price: e.target.value })
                    }
                    placeholder="0.00"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Stock *</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) =>
                      setFormData({ ...formData, stock: e.target.value })
                    }
                    placeholder="0"
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label>Category</label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  placeholder="e.g., Electronics, Clothing, Food"
                />
              </div>
              <div className="form-group">
                <label>Image URL</label>
                <input
                  type="url"
                  value={formData.imageUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, imageUrl: e.target.value })
                  }
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="btn btn-primary">
                  {editingId ? "Update Product" : "Add Product"}
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={resetForm}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="products-grid">
        {filteredProducts.length === 0 ? (
          <div className="empty-state">
            <p>No products found. Add your first product to get started!</p>
          </div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product._id}
              className={`product-card ${
                product.stock < 10 ? "low-stock" : ""
              }`}
            >
              {product.imageUrl && (
                <div className="product-image">
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    onError={(e) => (e.target.style.display = "none")}
                  />
                </div>
              )}
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                {product.description && (
                  <p className="product-description">{product.description}</p>
                )}
                <div className="product-meta">
                  <span className="product-category">
                    {product.category || "Uncategorized"}
                  </span>
                  <span
                    className={`product-stock ${
                      product.stock < 10 ? "warning" : ""
                    }`}
                  >
                    Stock: {product.stock}
                  </span>
                </div>
                <div className="product-price">
                  ${parseFloat(product.price).toFixed(2)}
                </div>
                <div className="product-actions">
                  <button
                    className="btn btn-edit"
                    onClick={() => startEdit(product)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-delete"
                    onClick={() => deleteProduct(product._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default App;
