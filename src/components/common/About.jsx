import { useState, useEffect } from 'react';

const About = () => {
  const [data, setData] = useState(null); // State to store the fetched data
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    // Fetch data from the JSON file
    const fetchData = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/about'); // Adjust the path based on your API
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData.data[0]); // Assuming you're only interested in the first item in the array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array means this effect runs only once when the component mounts

  // If data is still loading, display a loading message
  if (loading) {
    return <div>Loading...</div>;
  }

  // If data is loaded, render the section
  return (
    <section className="section-2 py-5 bg-light">
      <div className="py-5 px-4">
        <div className="row">
          <div className="col-md-6">
            <img
              src={`http://127.0.0.1:8000/storage/${data.imageUrl}`} // Ensure it matches the URL pattern your Laravel app uses
              className="w-100"
              alt="About Us"
            />
          </div>

          <div className="col-md-6">
            <span>About Us</span>
            <h2 className='mt-2 mb-2'>{data.heading}</h2>
            {/* Render the description as HTML */}
            <div dangerouslySetInnerHTML={{ __html: data.description }} />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
