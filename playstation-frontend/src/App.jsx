import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rental from "./pages/Rental";
import Transaksi from "./pages/Transaksi";
import AutoUpdateSewa from "./components/AutoUpdateSewa";

export default function App() {
  return (
    <BrowserRouter>
      <AutoUpdateSewa />
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/rental" element={<Rental />} />
          <Route path="/transaksi" element={<Transaksi />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
