import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();

  const active = (path) =>
    location.pathname === path
      ? "text-blue-600 font-semibold border-b-2 border-blue-600"
      : "text-gray-600";

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    navigate("/login");
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
        {/* Logo / Judul */}
        <div className="text-2xl font-bold text-blue-700">PlayStation Rent</div>

        {/* Menu */}
        <div className="flex items-center space-x-6">
          <Link to="/rental" className={active("/rental")}>
            Rental
          </Link>
          <Link to="/transaksi" className={active("/transaksi")}>
            Transaksi
          </Link>

          {/* Tombol Logout */}
          <button
            onClick={handleLogout}
            className="ml-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
