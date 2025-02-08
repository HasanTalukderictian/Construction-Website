const Video = () => {
    return (
      <div className="container py-5">
        <h2 className="text-center mt-2 mb-5 text-primary"> Our Latest Project Video View</h2>
        <iframe
          width="100%"  // Adjust width as needed
          height="600"   // Adjust height as needed
          src="https://www.youtube.com/embed/-AtUwelZlqI?rel=0"  // Added ?rel=0 to disable related videos
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="YouTube video"
          style={{ borderRadius: '10px' }} 
        ></iframe>
      </div>
    );
  }
  
  export default Video;
  