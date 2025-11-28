import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children, allowAdmin = true }) => {
  const { isAuthenticated, user } = useSelector(state => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowAdmin && user?.role === 'admin') {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default PrivateRoute;

