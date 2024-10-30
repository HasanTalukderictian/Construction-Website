import Common from "../common/Common"
import Footer from "../common/Footer"
import Header from "../common/Header"

import ServiceImage from '../../assets/images/construction1.jpg';
import ServiceImage1 from '../../assets/images/construction11.jpg';
import ServiceImage2 from '../../assets/images/construction2.jpg';
import ServiceImage3 from '../../assets/images/construction3.jpg';

import ServiceImage4 from '../../assets/images/construction10.jpg';
import ServiceImage5 from '../../assets/images/construction11212.jpg';
import ServiceImage6 from '../../assets/images/construction1212.jpg';
import ServiceImage7 from '../../assets/images/construction122 (2).jpg'

const Services = () => {
  return (
    <>
        <Header/>
          <Common preHeading='Quality,Integrity,Value'
           heading='Services'
            text='We execd at transforming visions into ready <br /> through outstanding and precise' />

          <section className='section-3 py-5 '>
              <div className='container py-5 '>
                  <div className='section-header text-center'>
                      <span>Our Services</span>
                      <h2>Our Constructions Services</h2>
                      <p>We Ofer a diverse array of construction services, spaning residential, commerical, and industrial projects</p>
                  </div>

                  <div className='row mt-5 mb-4'>
                      <div className='col-md-4 col-lg-4'>
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
                      <div className='col-md-4 col-lg-4'>
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
                      <div className='col-md-4 col-lg-4'>
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
                      <div className='col-md-4 col-lg-4'>
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

                      <div className='col-md-4 col-lg-4'>
                          <div className='item'>
                              <div className='service-image'>
                                  <img src={ServiceImage} alt='Service Images' className='w-100' />
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

                      <div className='col-md-4 col-lg-4'>
                          <div className='item'>
                              <div className='service-image'>
                                  <img src={ServiceImage1} alt='Service Images' className='w-100' />
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
        <Footer/>
    </>
  )
}

export default Services
