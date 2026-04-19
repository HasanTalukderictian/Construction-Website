import { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import '../../assets/css/allcategory.scss'; // CSS file link

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AllCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE}/all-category`);
                const result = await response.json();
                if (result.success) {
                    setCategories(result.data);
                }
            } catch (error) {
                console.error("Error fetching categories:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    if (loading) return <div className="text-center p-5">Loading...</div>;

    return (
        <div className="category-slider-container my-4">
            <Swiper
                modules={[Navigation]}
                navigation={true}
                spaceBetween={15}
                slidesPerView={2}
                breakpoints={{
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 5 },
                }}
                className="category-swiper"
            >
                {categories.map((cat) => (
                    <SwiperSlide key={cat.id}>
                        <div className="category-item-card">
                            <div className="cat-image-wrapper">
                                <img 
                                    src={cat.image_url || 'https://via.placeholder.com/150'} 
                                    alt={cat.name} 
                                />
                            </div>
                            <div className="cat-info">
                                <h6 className="cat-name">{cat.name}</h6>
                                <p className="cat-subtext text-muted">
                                    {cat.sub_categories.length > 0 
                                        ? cat.sub_categories[0].name + " available" 
                                        : "Latest Products"}
                                </p>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default AllCategory;