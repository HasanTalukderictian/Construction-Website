import { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import 'react-quill/dist/quill.snow.css';
import Layout from "../Layout";
import Footer from "../../Footer";
import DashNav from "../DashNav";

const CustomerFeedback = () => {
  const [blogs, setBlogs] = useState([]);

  
  const BASE_URL = import.meta.env.VITE_BASE_URL;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${BASE_URL}/api/get-contact`);
        const result = await response.json();

        console.log(result);

        // Access the "data" property and update image URLs
        const updatedBlogs = result.data.map((blog) => ({
          ...blog,
          image: blog.image
            ? `${BASE_URL}/storage/${blog.image}`
            : null,
        }));

        setBlogs(updatedBlogs);
      } catch (error) {
        console.error("Error fetching blogs:", error);
      }
    };

    fetchData();
  }, []);






 
 




  return (
    <Layout>
    <DashNav/>
      <div className="container mt-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2>Customer Feedback</h2>
        </div>

        <table
  className="table table-bordered border-2"
  style={{
    borderRadius: "10px",
    overflow: "hidden",
    borderCollapse: "separate",
    borderSpacing: "0",
    backgroundColor: "#FFFF", // White Background
    border: "2px solid black", // Bolder Table Border
  }}
>
  <thead
    className="thead-dark"
    style={{
    backgroundColor: "#e3fc03", // Yellow-green background
    fontWeight: "bold",
    color: "#000", // Black text for contrast
  }}
  >
    <tr>
      <th
        className="text-center fs-3"
        style={{
          border: "2px solid black",
          padding: "10px",
        }}
      >
        No
      </th>
      <th
        className="text-center fs-3"
        style={{
          border: "2px solid black",
          padding: "10px",
        }}
      >
        Name
      </th>
      <th
        className="text-center fs-3"
        style={{
          border: "2px solid black",
          padding: "10px",
        }}
      >
        Email
      </th>
      <th
        className="text-center fs-3"
        style={{
          border: "2px solid black",
          padding: "10px",
        }}
      >
        Phone
      </th>
      <th
        className="text-center fs-3"
        style={{
          border: "2px solid black",
          padding: "10px",
        }}
      >
        Subject
      </th>
      <th
        className="text-center fs-3"
        style={{
          border: "2px solid black",
          padding: "10px",
        }}
      >
        Message
      </th>
    </tr>
  </thead>
  <tbody>
    {blogs.length > 0 ? (
      blogs.map((blog, index) => (
        <tr key={blog.id} style={{ border: "2px solid black" }}>
          <td
            className="text-center"
            style={{
              border: "2px solid black",
              padding: "10px",
            }}
          >
            {index + 1}
          </td>
          <td
            className="text-center"
            style={{
              border: "2px solid black",
              padding: "10px",
            }}
          >
            {blog.name}
          </td>
          <td
            className="text-center"
            style={{
              border: "2px solid black",
              padding: "10px",
            }}
          >
            {blog.email}
          </td>
          <td
            className="text-center"
            style={{
              border: "2px solid black",
              padding: "10px",
            }}
          >
            {blog.phone}
          </td>
          <td
            className="text-center"
            style={{
              border: "2px solid black",
              padding: "10px",
            }}
          >
            {blog.subject}
          </td>
          <td
            className="text-center"
            style={{
              border: "2px solid black",
              padding: "10px",
            }}
          >
            {blog.message}
          </td>
        </tr>
      ))
    ) : (
      <tr>
        <td
          colSpan="6"
          className="text-center"
          style={{
            border: "2px solid black",
            padding: "10px",
          }}
        >
          No blogs available.
        </td>
      </tr>
    )}
  </tbody>
</table>


      
      </div>

      {/* Add/Edit Blog Modal */}
   
      <Footer/>
    </Layout>
  );
};

export default CustomerFeedback;
