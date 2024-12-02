import Common from "../common/Common"
import Footer from "../common/Footer"
import Header from "../common/Header"

import BlogImg1 from '../../assets/images/construction3.jpg';
import BlogImg2 from '../../assets/images/construction11.jpg';
import BlogImg3 from '../../assets/images/construction122 (2).jpg';
import BlogImg4 from '../../assets/images/construction5.jpg';

const Blogs = () => {
  return (
    <>
        <Header/>
        <main>
              <Common preHeading='Quality,Integrity,Value'
                  heading='Our Recent Blogs'
                  text='We execd at transforming visions into ready <br />
           through outstanding and precise'/>

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
                                      <img src={BlogImg1} className='w-100' />
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
                                      <img src={BlogImg2} className='w-100' />
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
                                      <img src={BlogImg3} className='w-100' />
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
                                      <img src={BlogImg4} className='w-100' />
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

export default Blogs
