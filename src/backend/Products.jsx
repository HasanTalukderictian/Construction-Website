import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Toast from "react-bootstrap/Toast";
import { CartContext } from "../../src/components/frontend/CartContext";
import "../assets/css/product.scss";

const Item = () => {
  const [products, setProducts] = useState([]);
  const [inputValue, setInputValue] = useState(""); // typing value
  const [searchTerm, setSearchTerm] = useState(""); // actual search value
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);

  // ===============================
  // FETCH PRODUCTS
  // ===============================
  useEffect(() => {
    console.log("🚀 Fetching products...");

    fetch("http://127.0.0.1:8000/api/products")
      .then((res) => res.json())
      .then((data) => {
        console.log("✅ API Response:", data);
        // adjust if your API wraps data in "data"
        setProducts(data.data || data);
      })
      .catch((err) => console.log("❌ API Error:", err));
  }, []);

  // ===============================
  // HANDLE SEARCH
  // ===============================
  const handleSearch = () => {
    console.log("🔍 Search Triggered:", inputValue);
    setSearchTerm(inputValue.trim());
  };

  // ===============================
  // ADD TO CART
  // ===============================
  const handleAddToCart = (product) => {
    addToCart(product);
    setToastMessage("Your order has been created successfully");
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // ===============================
  // FILTER PRODUCTS
  // ===============================
  const filteredProducts = products.filter((item) =>
    item?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  console.log("🧠 Filtered Products:", filteredProducts);

  return (
    <section className="section-8 py-5">
      <div className="container">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap">
          <div>
            <h2>New available</h2>
            <p>We offer a diverse array of construction services...</p>
          </div>

          {/* SEARCH BOX */}
          <div style={{ marginTop: "10px", position: "relative" }}>
            <input
              type="text"
              placeholder="Search products..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSearch();
              }}
              style={{
                padding: "8px 35px 8px 15px",
                width: "250px",
                borderRadius: "20px",
                border: "1px solid #ccc",
                outline: "none"
              }}
            />

            {/* SEARCH ICON */}
            <span
              onClick={handleSearch}
              style={{
                position: "absolute",
                right: "10px",
                top: "50%",
                transform: "translateY(-50%)",
                cursor: "pointer",
                fontSize: "18px"
              }}
            >
              🔍
            </span>
          </div>
        </div>

        {/* PRODUCT LIST */}
        <div className="row">
          {filteredProducts.length === 0 ? (
            <h5 className="text-danger text-center">
              No products found
            </h5>
          ) : (
            filteredProducts.map((item) => (
              <div className="col-md-6 col-lg-3 mb-4" key={item.id}>
                <div className="card h-100 shadow-sm">

                  <img
                    src={item.image_url}
                    alt={item.name}
                    className="card-img-top"
                    style={{
                      height: "220px",
                      objectFit: "cover"
                    }}
                  />

                  <div className="card-body">
                    <h5>{item.name}</h5>
                    <p>Price: {item.price}৳</p>
                    <p>Rating: ⭐ {item.rating}</p>
                    <p>Quantity: {item.quantity}</p>
                  </div>

                  <div className="text-center mb-3">
                    <button
                      onClick={() => handleAddToCart(item)}
                      className="btn btn-danger me-2"
                    >
                      Add to Cart
                    </button>

                    <button
                      onClick={() => navigate(`/product/${item.id}`)}
                      className="btn btn-success"
                    >
                      View
                    </button>
                  </div>

                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* TOAST */}
      <div style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 9999 }}>
        <Toast
          show={showToast}
          onClose={() => setShowToast(false)}
          delay={3000}
          autohide
          bg="success"
        >
          <Toast.Header>
            <strong className="me-auto">Cart</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </div>

    </section>
  );
};

export default Item;
