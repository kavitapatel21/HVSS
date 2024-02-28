import "../assets/scss/loader.scss";

const SubLoader = () => {
    return (
      <div className="inner-loader">  
        <div className="load-wrapper text-center">
            <div className="loading"></div> 
            <span className="regular-title mt-3 d-block bold-title">Processing...</span>
        </div>
      </div>
    );
  };
export default SubLoader;