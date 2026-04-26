import  { useEffect, useState } from 'react';
import Carousel from 'react-multi-carousel';
import 'react-multi-carousel/lib/styles.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import '../../assets/css/allcategory.scss';

export const API_BASE = import.meta.env.VITE_API_BASE_URL;

const AllCategory = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Navigation hook

    const responsive = {
        desktop: { breakpoint: { max: 3000, min: 1024 }, items: 5 },
        tablet: { breakpoint: { max: 1024, min: 464 }, items: 3 },
        mobile: { breakpoint: { max: 464, min: 0 }, items: 1 }
    };

    useEffect(() => {
        axios.get(`${API_BASE}/all-category`)
            .then(res => {
                if (res.data.success) {
                    setCategories(res.data.data);
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const handleCategoryClick = (categoryName) => {
        // dynamic URL: /category/Gadget
        navigate(`/category/${categoryName}`);
    };

    if (loading) return null;

    return (
        <div className="category-slider-container my-4">
            <Carousel responsive={responsive} infinite={true} autoPlay={true}>
                {categories.map((cat) => (
                    <div 
                        key={cat.id} 
                        className="category-item-card" 
                        onClick={() => handleCategoryClick(cat.name)} // Click event
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="cat-image-wrapper">
                            <img src={cat.image_url || 'https://via.placeholder.com/150'} alt={cat.name} />
                        </div>
                        <div className="cat-info">
                            <h6 className="cat-name">{cat.name}</h6>
                            <p className="cat-subtext text-muted">
                                {cat.sub_categories.length > 0 ? cat.sub_categories[0].name : "Latest Deal"}
                            </p>
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default AllCategory;