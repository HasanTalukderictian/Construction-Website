
import AboutImg from '../../assets/images/about-us.jpg';
import Footer from '../common/Footer';
import Header from '../common/Header';
import ServiceImage from '../../assets/images/construction1.jpg';
import ServiceImage1 from '../../assets/images/construction11.jpg';
import ServiceImage2 from '../../assets/images/construction2.jpg';
import ServiceImage3 from '../../assets/images/construction3.jpg';

import ServiceImage4 from '../../assets/images/construction10.jpg';
import ServiceImage5 from '../../assets/images/construction11212.jpg';
import ServiceImage6 from '../../assets/images/construction1212.jpg';
import ServiceImage7 from '../../assets/images/construction122 (2).jpg';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination} from 'swiper/modules';
import 'swiper/css/pagination';


import Icon1 from '../../assets/images/icon-1.svg';
import Icon2 from '../../assets/images/icon-2.svg';
import Icon3 from '../../assets/images/icon-3.svg';

import BlogImg from '../../assets/images/construction3.jpg';



import person from '../../assets/images/pexels-pixabay-220453.jpg';
import person1 from '../../assets/images/pexels-sindre-fs-1040880.jpg';
import About from '../common/About';

const Home = () => {
    return (
       <>
          <Header/>

            <main>

               {/* hero Section  */}
              <section className='section-1'>
                 <div className='hero d-flex align-items-center'>
                       <div className='container-fluid'>
                             <div className='text-center'>
                                <span>Welcome Amazing Construction</span>
                                <h1>Crafitng dreams with <br/> precision and excellence</h1>
                                <p>We execd at transforming visions into ready through outstanding and precise <br/>
                                 attention to detailswith years of experience and a dedification to quality</p>

                                  <div className='mt-4'>
                                    <a className='btn btn-primary'> Contact Now</a>
                                    <a className='btn btn-secondary ms-2'>View Projects</a>
                                  </div>
                             </div>
                       </div>
                 </div>
              </section>


             {/* About Us Section */}


                <About/>



             {/* Our Services  */}

             <section className='section-3 py-5 '>
              <div className='container-fluid py-5 '>
                        <div className='section-header text-center'>
                        <span>Our Services</span>
                        <h2>Our Constructions Services</h2>
                        <p>We Ofer a diverse array of construction services, spaning residential, commerical, and industrial projects</p>
                </div>

                        <div className='row mt-5 mb-4'>
                            <div className='col-md-3 col-lg-3'>
                                <div className='item'>
                                    <div className='service-image'>
                                        <img src={ServiceImage4} alt='Service Images' className='w-100' />
                                        <div className='service-title'>
                                            <h3>Speciality Construction</h3>
                                        </div>
                                    </div>

                                    <div className='service-body'>
                                        <div className='service-content'>
                                            <p>
                                                Speciality construction is a niche sector within the construction
                                                industry that focuses on projects requiring specialized skills, materials, and techniques.
                                            </p>
                                            <a href='#' className='btn btn-primary'>Read More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 col-lg-3'>
                                <div className='item'>
                                    <div className='service-image'>
                                        <img src={ServiceImage5} alt='Service Images' className='w-100' />
                                        <div className='service-title'>
                                            <h3>Speciality Construction</h3>
                                        </div>
                                    </div>

                                    <div className='service-body'>
                                        <div className='service-content'>
                                            <p>
                                                Speciality construction is a niche sector within the construction
                                                industry that focuses on projects requiring specialized skills, materials, and techniques.
                                            </p>
                                            <a href='#' className='btn btn-primary'>Read More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 col-lg-3'>
                                <div className='item'>
                                    <div className='service-image'>
                                        <img src={ServiceImage6} alt='Service Images' className='w-100' />
                                        <div className='service-title'>
                                            <h3>Speciality Construction</h3>
                                        </div>
                                    </div>

                                    <div className='service-body'>
                                        <div className='service-content'>
                                            <p>
                                                Speciality construction is a niche sector within the construction
                                                industry that focuses on projects requiring specialized skills, materials, and techniques.
                                            </p>
                                            <a href='#' className='btn btn-primary'>Read More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 col-lg-3'>
                                <div className='item'>
                                    <div className='service-image'>
                                        <img src={ServiceImage7} alt='Service Images' className='w-100' />
                                        <div className='service-title'>
                                            <h3>Speciality Construction</h3>
                                        </div>
                                    </div>

                                    <div className='service-body'>
                                        <div className='service-content'>
                                            <p>
                                                Speciality construction is a niche sector within the construction
                                                industry that focuses on projects requiring specialized skills, materials, and techniques.
                                            </p>
                                            <a href='#' className='btn btn-primary'>Read More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



              </div>
             </section>


             {/* Why Choose Us */}


             <section className='section-4 py-5'>
              <div className='container py-5'>
                        <div className='section-header text-center mb-4'>
                            <span>Why Choose Us</span>
                            <h2>Discover our wide varity of projects</h2>
                            <p>Created in close partnership with our clients and colaborates, this approch  merges industry expertise <br/>
                            decades of experience, innovation, and flexibility to consistently deliver excellence.
                            </p>
                        </div>

                        <div className='row'>
                            <div className='col-md-4 mt-2'>
                                <div className='card shadow p-4'>
                                    <div className='card-icon'>
                                        <img src={Icon1}/>
                                    </div>
                                    <div className='card-title mt-3'>
                                            <h3>Cutting-Edge Solutions</h3>
                                    </div>

                                    <div>
                                        <p>
                                            Small actions create big impacts. It all begins and with each employee committing
                                            to safer work practies daily, ensuring they return home safety.
                                        </p>
                                    </div>

                                </div>
                            </div>

                            <div className='col-md-4 mt-2'>
                                <div className='card shadow p-4'>
                                    <div className='card-icon'>
                                        <img src={Icon2} />
                                    </div>
                                    <div className='card-title mt-3'>
                                        <h3>Cutting-Edge Solutions</h3>
                                    </div>

                                    <div>
                                        <p>
                                            Small actions create big impacts. It all begins and with each employee committing
                                            to safer work practies daily, ensuring they return home safety.
                                        </p>
                                    </div>

                                </div>
                            </div>

                            <div className='col-md-4 mt-2'>
                                <div className='card shadow p-4'>
                                    <div className='card-icon'>
                                        <img src={Icon3} />
                                    </div>
                                    <div className='card-title mt-3'>
                                        <h3>Cutting-Edge Solutions</h3>
                                    </div>

                                    <div>
                                        <p>
                                            Small actions create big impacts. It all begins and with each employee committing
                                            to safer work practies daily, ensuring they return home safety.
                                        </p>
                                    </div>

                                </div>
                            </div>

                        </div>

              </div>



             </section>


               {/* Our Projects */}

                <section className='section-3 py-5 '>
                    <div className='container-fluid py-5 '>
                        <div className='section-header text-center'>
                            <span>Our Projects</span>
                            <h2>Discover our diverse range of projects</h2>
                            <p>We Ofer a diverse array of construction services, spaning residential, commerical, and industrial projects</p>
                        </div>

                        <div className='row mt-5 mb-4'>
                            <div className='col-md-3 col-lg-3'>
                                <div className='item'>
                                    <div className='service-image'>
                                        <img src={ServiceImage} alt='Service Images' className='w-100' />
                                        <div className='service-title'>
                                            <h3>Rampura Projects</h3>
                                        </div>
                                    </div>

                                    <div className='service-body'>
                                        <div className='service-content'>
                                            <p>
                                                Speciality construction is a niche sector within the construction
                                                industry that focuses on projects requiring specialized skills, materials, and techniques.
                                            </p>
                                            <a href='#' className='btn btn-primary'>Read More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 col-lg-3'>
                                <div className='item'>
                                    <div className='service-image'>
                                        <img src={ServiceImage3} alt='Service Images' className='w-100' />
                                        <div className='service-title'>
                                            <h3>Uttra Projects</h3>
                                        </div>
                                    </div>

                                    <div className='service-body'>
                                        <div className='service-content'>
                                            <p>
                                                Speciality construction is a niche sector within the construction
                                                industry that focuses on projects requiring specialized skills, materials, and techniques.
                                            </p>
                                            <a href='#' className='btn btn-primary'>Read More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 col-lg-3'>
                                <div className='item'>
                                    <div className='service-image'>
                                        <img src={ServiceImage2} alt='Service Images' className='w-100' />
                                        <div className='service-title'>
                                            <h3>Dhanmodi Projects</h3>
                                        </div>
                                    </div>

                                    <div className='service-body'>
                                        <div className='service-content'>
                                            <p>
                                                Speciality construction is a niche sector within the construction
                                                industry that focuses on projects requiring specialized skills, materials, and techniques.
                                            </p>
                                            <a href='#' className='btn btn-primary'>Read More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-3 col-lg-3'>
                                <div className='item'>
                                    <div className='service-image'>
                                        <img src={ServiceImage1} alt='Service Images' className='w-100' />
                                        <div className='service-title'>
                                            <h3>Rajshahi Projects</h3>
                                        </div>
                                    </div>

                                    <div className='service-body'>
                                        <div className='service-content'>
                                            <p>
                                                Speciality construction is a niche sector within the construction
                                                industry that focuses on projects requiring specialized skills, materials, and techniques.
                                            </p>
                                            <a href='#' className='btn btn-primary'>Read More</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>



                    </div>
                </section>

                {/* testomonial section  */}

            <section className='section-5 py-5'>

                   <div className='container'>
                        <div className='section-header text-center mb-4'>
                            <span>Testomonial</span>
                            <h2>What People are saying about us</h2>
                            <p>We offer a diverse array of construction services, spanning residentail,
                            commerical, and industrial projects.
                            </p>
                        </div>

                        <Swiper
                            modules={[ Pagination]}
                            spaceBetween={30}
                            slidesPerView={3}
                            pagination={{ clickable: true }}
                            breakpoints={{
                                640: { slidesPerView: 1, spaceBetween: 10 }, // Mobile - 1 slide
                                768: { slidesPerView: 2, spaceBetween: 20 }, // Tablet - 2 slides
                                1024: { slidesPerView: 3, spaceBetween: 30 } // Desktop - 3 slides
                            }}
                        >
                            <SwiperSlide>
                                <div className='card shadow border-0 '>
                                     <div className='card-body p-4'>
                                       <div className='rating'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                       </div>

                                        <div className='content pt-4 pb-3'>
                                            <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters</p>
                                       </div>
                                       <hr/>

                                       <div className='d-flex'>

                                        <div>
                                                <img src={person} width={60} className="rounded-circle" />
                                        </div>
                                        <div className='pt-2 px-3'>
                                            <div className='name'>
                                                Ratul
                                            </div>
                                            <div>
                                                Engineer
                                            </div>
                                        </div>

                                       </div>

                                     </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='card shadow border-0 '>
                                    <div className='card-body p-4'>
                                        <div className='rating'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                        </div>

                                        <div className='content pt-4 pb-3'>
                                            <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters</p>
                                        </div>
                                        <hr />

                                        <div className='d-flex'>

                                            <div>
                                                <img src={person} width={60} className="rounded-circle" />
                                            </div>
                                            <div className='pt-2 px-3'>
                                                <div className='name'>
                                                    Ratul
                                                </div>
                                                <div>
                                                    Engineer
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div className='card shadow border-0 '>
                                    <div className='card-body p-4'>
                                        <div className='rating'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                        </div>

                                        <div className='content pt-4 pb-3'>
                                            <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters</p>
                                        </div>
                                        <hr />

                                        <div className='d-flex'>

                                            <div>
                                                <img src={person} width={60} className="rounded-circle" />
                                            </div>
                                            <div className='pt-2 px-3'>
                                                <div className='name'>
                                                    Ratul
                                                </div>
                                                <div>
                                                    Engineer
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div></SwiperSlide>
                            <SwiperSlide>
                                <div className='card shadow border-0 '>
                                    <div className='card-body p-4'>
                                        <div className='rating'>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                                                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z" />
                                            </svg>
                                        </div>

                                        <div className='content pt-4 pb-3'>
                                            <p>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters</p>
                                        </div>
                                        <hr />

                                        <div className='d-flex'>

                                            <div>
                                                <img src={person} width={60} className="rounded-circle" />
                                            </div>
                                            <div className='pt-2 px-3'>
                                                <div className='name'>
                                                    Ratul
                                                </div>
                                                <div>
                                                    Engineer
                                                </div>
                                            </div>

                                        </div>

                                    </div>
                                </div></SwiperSlide>
                            ...
                        </Swiper>

                   </div>



            </section>

           {/* blogs section */}

           <section className='section-6 bg-light py-5'>
              <div className='container'>
                        <div className='section-header text-center mb-4'>
                            <span>Blog & News</span>
                            <h2>Articles & blogs posts</h2>
                            <p>We specialize in a wide range of construction services, including residentail, and industrial projects.
                            </p>
                        </div>

                        <div className='row pt-3'>
                          <div className='col-md-4 mb-3'>
                             <div className='card shadow border-0'>
                                       <div className='card-img-top'>
                                        <img src={BlogImg} className='w-100' />
                                       </div>
                                      <div className='card-body p-4'>
                                            <div>
                                                <a href='#' className='title'>Damy Blog Title</a>
                                            </div>
                                            <a href='#' className='btn btn-primary mt-2'> Read More</a>
                                      </div>
                             </div>
                          </div>

                            <div className='col-md-4 mb-3'>
                                <div className='card shadow border-0'>
                                    <div className='card-img-top'>
                                        <img src={BlogImg} className='w-100' />
                                    </div>
                                    <div className='card-body p-4'>
                                        <div>
                                            <a href='#' className='title'>Damy Blog Title</a>
                                        </div>
                                        <a href='#' className='btn btn-primary mt-2'> Read More</a>
                                    </div>
                                </div>
                            </div>
                            <div className='col-md-4 mb-3'>
                                <div className='card shadow border-0'>
                                    <div className='card-img-top'>
                                        <img src={BlogImg} className='w-100' />
                                    </div>
                                    <div className='card-body p-4'>
                                        <div>
                                            <a href='#' className='title'>Damy Blog Title</a>
                                        </div>
                                        <a href='#' className='btn btn-primary mt-2'> Read More</a>
                                    </div>
                                </div>
                            </div>

                        </div>
              </div>
           </section>







            </main>

             <Footer/>


       </>
    )
}

export default Home
