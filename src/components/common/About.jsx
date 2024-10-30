import AboutImg from '../../assets/images/about-us.jpg';

const About = () => {
  return (
   <>
          <section className='section-2 py-5 bg-light'>

              <div className='container'>

                  <div className='row'>
                      <div className='col-md-6'>
                          <img src={AboutImg} className='w-100' />
                      </div>

                      <div className='col-md-6'>
                          <span>
                              About Us
                          </span>
                          <h2>
                              Crafting structures that last a lifetime
                          </h2>
                          <p>
                              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem  <br />Ipsum has been the industry's standard dummy text ever since the 1500s, when  <br />an unknown printer took a galley of type and scrambled it to make a type specimen book
                          </p>

                          <p>
                              Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in <br /> a piece of classical Latin literature from 45 BC, making it over 2000 years old
                          </p>
                      </div>
                  </div>
              </div>
          </section>
   </>
  )
}

export default About
