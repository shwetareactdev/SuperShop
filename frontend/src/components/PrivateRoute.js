// import React from "react";
// import { Navigate } from "react-router-dom";

// const PrivateRoute = ({ element }) => {
//   const token = localStorage.getItem("token"); // Check if user is logged in

//   return token ? element : <Navigate to="/login" />;
// };

// export default PrivateRoute;
import React from "react";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ element }) => {
  const token = localStorage.getItem("authToken"); // Check if token exists

  return token ? element : <Navigate to="/login" replace />;
};

export default PrivateRoute;
