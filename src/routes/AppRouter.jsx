import { Routes, Route, Navigate } from "react-router-dom";
import Customer from "../pages/Customer";
import Admin from "../pages/Admin";
import Login from "../pages/Login";
import OrderForm from "../pages/OrderForm";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<OrderForm />} />

      <Route path="/customer/:orderId" element={<Customer />} />

      <Route path="/login" element={<Login />} />
      <Route path="/admin" element={<Admin />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
