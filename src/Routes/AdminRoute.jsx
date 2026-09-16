import { Navigate, Outlet } from "react-router-dom";
import useAdmin from "../hooks/useAdmin";

const AdminRoute = () => {

    const [isAdmin, isAdminLoading] = useAdmin();

    if (isAdminLoading) {
        return <div>Loading...</div>;
    }

    if (!isAdmin) {
        return <Navigate to="/dashboard" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;