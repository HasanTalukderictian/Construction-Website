import { useEffect, useState } from 'react';
import Header from '../common/Header';
import Footer from '../common/Footer';
import Common from '../common/Common';


import DefaultImage from '../../assets/images/construction1.jpg'; 
import { Link } from 'react-router-dom';

const Projects = () => {
  const [projects, setProjects] = useState([]); 
  const [loading, setLoading] = useState(true); 

  // Fetch data using useEffect when the component mounts
  useEffect(() => {
   
    fetch('projects.json')
      .then(response => response.json()) 
      .then(data => {
        setProjects(data);
        setLoading(false); 
      })
      .catch(error => {
        console.error('Error fetching projects:', error);
        setLoading(false); 
      });
  }, []); 

  if (loading) {
    return <div>Loading...</div>; 
  }

  return (
    <>
      <Header />
      <main>
        <Common
          preHeading="Quality, Integrity, Value"
          heading="Our Projects"
          text="We excel at transforming visions into reality through outstanding and precise execution."
        />

        <section className="section-3 py-5">
          <div className="container py-5">
            <div className="section-header text-center">
              <span>Our Current Projects</span>
              <h2>Discover our diverse range of projects</h2>
              <p>
                We offer a diverse array of construction services, spanning residential, commercial, and industrial
                projects.
              </p>
            </div>

            <div className="row mt-5 mb-4">
              {projects.map(project => (
                <div className="col-md-4 col-lg-4" key={project.id}>
                  <div className="item">
                    <div className="service-image">
                      <img
                        src={project.image || DefaultImage} 
                        alt={project.title}
                        className="w-100"
                      />
                      <div className="service-title">
                        <h3>{project.title}</h3>
                      </div>
                    </div>

                    <div className="service-body">
                      <div className="service-content">
                        <p>{project.description}</p>
                        <Link to={`/project/${project.id}`} className="btn btn-primary">
                                                    Read More
                                                </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default Projects;
