// import AboutImg from '../../assets/images/about-us.jpg';

// const About = () => {
//   return (
//    <>
//           <section className='section-2 py-5 bg-light'>

//               <div className='container'>

//                   <div className='row'>
//                       <div className='col-md-6'>
//                           <img src={AboutImg} className='w-100' />
//                       </div>

//                       <div className='col-md-6'>
//                           <span>
//                               About Us
//                           </span>
//                           <h2>
//                               Crafting structures that last a lifetime
//                           </h2>
//                           <p>
//                               Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem  <br />Ipsum has been the industry's standard dummy text ever since the 1500s, when  <br />an unknown printer took a galley of type and scrambled it to make a type specimen book
//                           </p>

//                           <p>
//                               Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in <br /> a piece of classical Latin literature from 45 BC, making it over 2000 years old
//                           </p>
//                       </div>
//                   </div>
//               </div>
//           </section>
//    </>
//   )
// }

// export default About



import  { useState, useEffect } from 'react';


const About = () => {
  const [data, setData] = useState(null); // State to store the fetched data
  const [loading, setLoading] = useState(true); // State for loading status

  useEffect(() => {
    // Fetch data from the JSON file
    const fetchData = async () => {
      try {
        const response = await fetch('data.json'); // Adjust the path based on your file location
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        const jsonData = await response.json();
        setData(jsonData);
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
    <>
      <section className="section-2 py-5 bg-light">
        <div className="container">
          <div className="row">
            <div className="col-md-6">
              <img src={data.imageUrl} className="w-100" alt="About Us" />
            </div>

            <div className="col-md-6">
              <span>About Us</span>
              <h2>{data.heading}</h2>
              {data.description.map((text, index) => (
                <p key={index}>{text}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default About;
