import Footer from "../common/Footer"
import Header from "../common/Header"

import Common from "../common/Common";
import AbountNew from "./AbountNew";

const About = () => {
  return (

      <>
        <Header/>
          <Common preHeading='Quality,Integrity,Value'
          heading='About Us'
          text='We execd at transforming visions into ready <br />
           through outstanding and precise'/>



         {/* Our Team  */}

          <section className="section-8 py-5">
                <div className="mt-5">
                  <div className='section-header text-center'>
                      <span className="mt-10">Team</span>
                      <h2>Our Team</h2>
                      <p>We Ofer a diverse array of construction services, spaning residential, commerical, and industrial projects</p>
                  </div>

                  <div className='row pt-3'>
                      
                   <AbountNew/>

                  </div>

                </div>
          </section>

        <Footer/>
      </>
  )
}

export default About
