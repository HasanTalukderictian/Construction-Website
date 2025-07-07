import { useEffect, useState } from "react";
import Common from "../common/Common"
import Footer from "../common/Footer"
import Header from "../common/Header"
import { Link } from "react-router-dom";
import Whatsapp from "./Whatsapp";


const Blogs = () => {

     const [blogs, setBlogs] = useState([]);

     const BASE_URL = import.meta.env.VITE_BASE_URL;
   
      useEffect(() => {
            const fetchBlogs = async () => {
                try {
                    const response = await fetch(`${BASE_URL}/api/get-blogs`);
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    const result = await response.json();
                    // console.log(result.data); // Log the fetched data
                    setBlogs(result.data); // Assuming `result.data` contains the array of blogs
                } catch (error) {
                    console.error("Error fetching blog data:", error);
                }
            };
    
            fetchBlogs();
        }, []);


  return (
    <>
        <Header/>
        <main>
              <Common preHeading='Quality,Integrity,Value'
                  heading='Our Recent Blogs'
                  text='We execd at transforming visions into ready <br />
           through outstanding and precise'/>

            <section className="section-6 bg-light py-5">
                                <div className="container">
                                    <div className="section-header text-center mb-4">
                                        <span>Blog & News</span>
                                        <h2>Articles & Blog Posts</h2>
                                        <p>
                                            We specialize in a wide range of construction services, including residential and industrial
                                            projects.
                                        </p>
                                    </div>
            
                                    <div className="row pt-3">
                                        {blogs.map((blog) => (
                                            <div className="col-md-4 mb-3 d-flex align-items-stretch" key={blog.id}>
                                                <div className="card shadow border-0" style={{ width: "100%", height: "500px" }}>
                                                    <div className="card-img-top">
                                                        <img
                                                            src={`${BASE_URL}/${blog.image}`}
                                                            className="w-100"
                                                            alt={blog.title}
                                                            style={{ height: "300px", objectFit: "cover" }}
                                                        />
                                                    </div>
                                                    <div className="card-body p-4 text-center">
                                                        <h5 className="card-title">
                                                            <a
                                                                href="#"
                                                                className="text-dark text-decoration-none"
                                                                style={{ fontWeight: "600" }}
                                                            >
                                                                {blog.title}
                                                            </a>
                                                        </h5>
            
                                                        <Link to={`/blog/${blog.id}`} className="btn btn-primary">
                                                                Read More
                                                            </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>


                                <div>
                                    <Whatsapp/>
                                </div>
                            </section>
            
        </main>
        <Footer/>
    </>
  )
}

export default Blogs
