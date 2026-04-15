
// new code  start from here 

// import { useContext, useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import '../../../src/assets/css/product.scss';
// import Toast from "react-bootstrap/Toast";
// import { CartContext } from "./CartContext";

// // Swiper Components and Styles
// import { Swiper, SwiperSlide } from 'swiper/react';
// import { Navigation, Pagination, Autoplay } from 'swiper/modules';
// import 'swiper/css';
// import 'swiper/css/navigation';
// import 'swiper/css/pagination';

// export const API_BASE = import.meta.env.VITE_API_BASE_URL;

// const Item = () => {
//   const [team, setTeam] = useState([]);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState("");
//   const navigate = useNavigate();
//   const { addToCart } = useContext(CartContext);

//   useEffect(() => {
//     fetch(`${API_BASE}/get-products`)
//       .then(res => res.json())
//       .then(data => setTeam(data))
//       .catch(err => console.log("Error Loading JSON", err));
//   }, []);

//   const handleAddToCart = (item) => {
//     if (!item.quantity || item.quantity <= 0) {
//       setToastMessage("Product is out of stock!");
//       setShowToast(true);
//       return;
//     }
//     const mainImage = item.images?.[0] || null;
//     const normalizedProduct = {
//       id: item.id,
//       product_name: item.name || "Unknown Product",
//       image_url: mainImage,
//       price: parseFloat(item.price) || 0,
//     };
//     addToCart(normalizedProduct);
//     setToastMessage("Product added to cart!");
//     setShowToast(true);
//   };

//   // ক্যাটাগরি অনুযায়ী প্রোডাক্ট গ্রুপ করা
//   const categories = [...new Set(team.map(item => item.parent_category))];

//   return (
//     <section className="section-8 py-5 bg-light">
//       <div className="container">
//         {categories.map((category) => (
//           <div key={category} className="category-section mb-5">
//             {/* Header section like image */}
//             <div className="d-flex justify-content-between align-items-center mb-4">
//               <h3 className="fw-bold">{category} Offers!</h3>
//               <button className="btn btn-primary btn-sm rounded-pill px-4">View All</button>
//             </div>

//             <Swiper
//               modules={[Navigation, Pagination, Autoplay]} // মডিউল এখানে ঠিক আছে
//               spaceBetween={15}
//               slidesPerView={2} // মোবাইলে ২টা দেখালে ভালো লাগে
//               navigation={true} // এটাকে true করে দিন
//               breakpoints={{
//                 640: { slidesPerView: 2 },
//                 768: { slidesPerView: 3 },
//                 1024: { slidesPerView: 4 },
//                 1200: { slidesPerView: 5 },
//               }}
//               className="product-swiper"
//             >
//               {team
//                 .filter(p => p.parent_category === category)
//                 .map((item) => (
//                   <SwiperSlide key={item.id}>
//                     <div className="card product-card" onClick={() => navigate(`/product/${item.id}`)}>
//                       <div className="badge bg-danger position-absolute mt-2 end-0">-30%</div>

//                       <div className="image-holder">
//                         <img
//                           src={item.images?.[0] || '/placeholder.png'}
//                           alt={item.name}
//                           className="card-img-top"
//                         />
//                       </div>

//                       <div className="card-body">
//                         <span className="sub-cat">{item.sub_category}</span>
//                         <h6 className="product-title">{item.name}</h6>

//                         <div className="price-row d-flex justify-content-between align-items-center mb-3">
//                           <span className="current-price">৳{item.price}</span>
//                           <span className="rating-text">⭐ {item.rating}</span>
//                         </div>

//                         <button
//                           onClick={(e) => {
//                             e.stopPropagation();
//                             handleAddToCart(item);
//                           }}
//                           className="btn btn-add-cart"
//                         >
//                           <i className="bi bi-cart-plus me-1"></i> Add to Cart
//                         </button>
//                       </div>
//                     </div>
//                   </SwiperSlide>
//                 ))}
//             </Swiper>
//           </div>
//         ))}
//       </div>

//       {/* Toast Notification */}
//       <div className="toast-container position-fixed bottom-0 end-0 p-3">
//         <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide bg="dark" className="text-white">
//           <Toast.Body>{toastMessage}</Toast.Body>
//         </Toast>
//       </div>
//     </section>
//   );
// };

// export default Item;