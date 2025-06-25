import { useState, useEffect } from "react";

const AbountNew = () => {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch(`http://127.0.0.1:8000/api/get-team`)
      .then((response) => response.json())
      .then((responseData) => {
        console.log(responseData); // Debugging purposes
        setMembers(responseData.data); // Accessing the `data` field of the API response
      })
      .catch((error) => console.error("Error fetching members:", error));
  }, []);

  return (
    <div className="row">
      {members.map((member, index) => (
        <div key={index} className="col-md-6 col-lg-3 mb-3 ml-4">
          <div className="card shadow border-0">
            {/* Image container with fixed size */}
            <div
              className="p-4"
              style={{
                width: "100%",
                height: "400px",
                overflow: "hidden",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",

              }}
            >
              <img
                src={`http://127.0.0.1:8000/storage/${member.image}`} // Adjust the URL for the image path
                alt={member.Name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </div>
            <div className="card-title pb-0 mb-0 p-2">{member.Name}</div>

            <div className="card-sub-title">
              <p dangerouslySetInnerHTML={{ __html: member.Designation }} />
            </div>

            <div className="card-icon mb-2">
              <a
                href={member.socialMediaLink}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  className="bi bi-facebook"
                  viewBox="0 0 16 16"
                >
                  <path d="M8.051 5.796h1.25V4.108c0-.539.011-1.37.36-1.78.354-.415.84-.7 1.684-.7h1.72v2.57h-1.18c-.332 0-.803.16-.803.882v1.716h2.088l-.272 2.076h-1.816v6.187h-2.5V7.872H7.05V5.796h1.001z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AbountNew;
