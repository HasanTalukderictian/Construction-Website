import whatsapp from '../../assets/images/whatsapp-icon.png';

const Whatsapp = () => {
  return (
    <>
      <style>
        {`
          @keyframes vibrateShadow {
            0% {
              box-shadow: 0 0 20px 5px rgba(0, 255, 0, 0.5);
            }
            50% {
              box-shadow: 0 0 30px 10px rgba(0, 255, 0, 0.8);
            }
            100% {
              box-shadow: 0 0 20px 5px rgba(0, 255, 0, 0.5);
            }
          }

          .vibrate-shadow {
            animation: vibrateShadow 1s infinite;
          }
        `}
      </style>

      <a
        href="https://wa.me/8801768712230?text=Hi%2CHow%20can%20I%20help%20you%21"
        className="whatsapp-sticky"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: '9999'
        }}
      >
        <img
          src={whatsapp}
          alt="WhatsApp Chat"
          className="vibrate-shadow"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            cursor: 'pointer',
            border: '3px solid green',
          }}
        />
      </a>
    </>
  );
};

export default Whatsapp;
