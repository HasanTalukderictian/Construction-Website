import { useParams, useNavigate } from 'react-router-dom';
import { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import Header from '../common/Header';
import Footer from '../common/Footer';
import { CartContext } from './CartContext';

const ProductPage = () => {
  const { parent, subcategory } = useParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10);
  const { addToCart } = useContext(CartContext);
  const navigate = useNavigate();

  // Filter state
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(200000000);

  const handleAddToCart = (product) => {
    addToCart(product);
  };

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:8000/api/products/${parent}/${subcategory}`)
      .then(res => {
        if (res.data.success) {
          setProducts(res.data.data);
          setFilteredProducts(res.data.data);
        }
      })
      .catch(err => console.log(err));
  }, [parent, subcategory]);

  // Filter products by price
  const handleFilter = () => {
    const filtered = products.filter(
      p => p.price >= minPrice && p.price <= maxPrice
    );
    setFilteredProducts(filtered);
    setCurrentPage(1); // Reset to first page after filter
  };

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  return (
    <>
      <Header />
      <div className="container py-5">
        <h2 className="mb-4 text-capitalize">{subcategory.replace("-", " ")}</h2>

        <div className="row">
          {/* Left Column: Filter */}
          <div className="col-md-3 mb-4 pe-md-4 border-end" style={{ borderColor: '#dee2e6' }}>
            <div className="card p-3">
              <h5>Filter Options</h5>
              <div className="mb-3">
                <label className="form-label">Min Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={minPrice}
                  onChange={e => setMinPrice(Number(e.target.value))}
                  placeholder="0"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Max Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={maxPrice}
                  onChange={e => setMaxPrice(Number(e.target.value))}
                  placeholder="200000000"
                />
              </div>
              <button
                className="btn btn-success w-100"
                onClick={handleFilter}
              >
                Apply Filter
              </button>
            </div>
          </div>

          {/* Right Column: Products */}
          <div className="col-md-9 ps-md-4">
            <div className="row">
              {currentProducts.length > 0 ? currentProducts.map(product => (
                <div className="col-md-4 mb-4" key={product.id}>
                  <div className="card h-100 d-flex flex-column">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="card-img-top"
                      style={{
                        height: "200px",
                        objectFit: "cover",
                        width: "100%",
                        padding: '10px'
                      }}
                    />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{product.name}</h5>
                      <p className="card-text">৳ {product.price}</p>
                      <p className="mb-1"><strong>Rating:</strong> {product.rating || 'N/A'}</p>
                      <p className="mb-3"><strong>Quantity:</strong> {product.quantity || '0'}</p>

                      <div className="mt-auto d-flex">
                        <button
                          onClick={() => handleAddToCart(product)}
                          className="btn me-2 flex-fill"
                          style={{ backgroundColor: "#e4032e", color: "#fff", fontWeight: "bold" }}
                        >
                          Add to Cart
                        </button>
                        <button
                          className="btn flex-fill"
                          style={{ backgroundColor: "#11cc1aff", color: "#fff", fontWeight: "bold" }}
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )) : (
                <p>No products found in this subcategory.</p>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="d-flex justify-content-center mt-4">
                {[...Array(totalPages)].map((_, index) => (
                  <button
                    key={index}
                    className={`btn mx-1 ${currentPage === index + 1 ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={() => setCurrentPage(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProductPage;