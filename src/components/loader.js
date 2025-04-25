import "../assets/scss/loader.scss";

const Loader = ({ message = "Processing..." }) => {
    return (
      <div className="loader">  
        <div className="load-wrapper text-center">
            <div className="loading"></div> 
            <span className="regular-title mt-3 d-block bold-title">{message}</span>
        </div>
      </div>
    );
  };
export default Loader;