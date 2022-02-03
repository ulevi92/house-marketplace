import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => navigate("/"), 2500);

    return () => {
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div
      className='pageContainer'
      style={{
        textAlign: "center",
      }}
    >
      <h3 className='pageHeader'>Opps The Page Is Not Created Yet!</h3>

      <Link to='/' className='pageHeader'>
        Please Return to Home Page
      </Link>
    </div>
  );
};

export default NotFound;
