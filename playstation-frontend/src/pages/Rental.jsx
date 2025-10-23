import { useState, useEffect, useCallback } from "react";
import api from "../utils/axiosInstance";
import { MoreVertical } from "lucide-react";
import Navbar from "../components/Navbar";
import ModalAddPS from "../components/ModalAddPS";
import ModalAddSewa from "../components/ModalAddSewa";
import ModalEditPS from "../components/ModalEditPS";
import ModalDeletePS from "../components/ModalDeletePS";
import ModalNotifSewaHabis from "../components/ModalNotifSewaHabis";

export default function Rental() {
  const [playstations, setPlaystations] = useState([]);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [selectedPS, setSelectedPS] = useState(null);
  const [modal, setModal] = useState({
    addPS: false,
    addSewa: false,
    editPS: false,
    deletePS: false,
    notifSewaHabis: false,
  });

  // 🔹 Fetch data PS dan sewa aktif
  const fetchData = useCallback(async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;

      const [psRes, sewaRes] = await Promise.all([
        api.get("/items/playstation", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        api.get("/items/sewa?filter[status_sewa][_eq]=ongoing", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const psList = psRes.data.data || [];
      const sewaList = sewaRes.data.data || [];

      const merged = psList.map((ps) => {
        const sewa = sewaList.find((s) => s.id_ps === ps.id);
        if (ps.status === "rented" && sewa?.jam_selesai) {
          const jamSelesai = new Date(sewa.jam_selesai);
          const now = new Date();
          const diff = Math.max(0, Math.floor((jamSelesai - now) / 1000));
          return { ...ps, sisaWaktu: diff };
        }
        return { ...ps, sisaWaktu: 0 };
      });

      setPlaystations(merged);
    } catch (error) {
      console.error("❌ Gagal memuat data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔹 Update countdown tiap detik
  useEffect(() => {
    const interval = setInterval(() => {
      setPlaystations((prev) =>
        prev.map((ps) => {
          if (ps.status === "rented" && ps.sisaWaktu > 0) {
            const newSisa = ps.sisaWaktu - 1;
            if (newSisa === 0)
              setModal((m) => ({ ...m, notifSewaHabis: true }));
            return { ...ps, sisaWaktu: newSisa };
          }
          return ps;
        })
      );
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  // 🔹 Auto refresh data dari backend
  useEffect(() => {
    const sync = setInterval(fetchData, 3000);
    return () => clearInterval(sync);
  }, [fetchData]);

  const formatTime = (seconds) => {
    if (seconds <= 0) return "0m 0s";
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return h > 0 ? `${h}j ${m}m ${s}s` : `${m}m ${s}s`;
  };

  const stats = {
    total: playstations.length,
    available: playstations.filter((ps) => ps.status === "available").length,
    rented: playstations.filter((ps) => ps.status === "rented").length,
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto">
        {/* Ringkasan */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {[
            { label: "Total PS", value: stats.total, color: "blue" },
            { label: "Available", value: stats.available, color: "green" },
            { label: "Rented", value: stats.rented, color: "red" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className={`bg-${color}-100 p-4 rounded-xl shadow text-center`}
            >
              <h3 className="text-gray-700 font-medium">{label}</h3>
              <p className={`text-2xl font-bold text-${color}-600`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Tombol tambah */}
        <div className="flex justify-end mb-4">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => setModal((m) => ({ ...m, addPS: true }))}
          >
            + Tambah PS
          </button>
        </div>

        {/* Daftar PS */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {playstations.map((ps) => (
            <div
              key={ps.id}
              className="relative bg-white rounded-xl shadow p-4 flex flex-col justify-between h-44"
            >
              <div>
                <div className="flex justify-between items-start">
                  <h2 className="text-lg font-semibold text-blue-700">
                    {ps.tipe_ps} ({ps.no_ps})
                  </h2>
                  <div className="relative">
                    <button
                      onClick={() =>
                        setDropdownOpen(dropdownOpen === ps.id ? null : ps.id)
                      }
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <MoreVertical size={20} />
                    </button>

                    {dropdownOpen === ps.id && (
                      <div className="absolute right-0 mt-2 w-32 bg-white border rounded-md shadow-lg z-50">
                        <button
                          onClick={() => {
                            setSelectedPS(ps);
                            setModal((m) => ({ ...m, editPS: true }));
                            setDropdownOpen(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => {
                            setSelectedPS(ps);
                            setModal((m) => ({ ...m, deletePS: true }));
                            setDropdownOpen(null);
                          }}
                          className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100"
                        >
                          Hapus
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 flex flex-col items-center">
                  {ps.status === "available" ? (
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      Available
                    </span>
                  ) : (
                    <div className="flex flex-col items-center">
                      <span className="inline-block bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-medium">
                        Rented
                      </span>
                      <p className="text-gray-600 text-sm mt-1">
                        Sisa waktu:{" "}
                        <span className="font-semibold text-blue-700">
                          {formatTime(ps.sisaWaktu)}
                        </span>
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <button
                className={`w-full py-2 rounded-lg font-semibold ${
                  ps.status === "rented"
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
                disabled={ps.status === "rented"}
                onClick={() => {
                  setSelectedPS(ps);
                  setModal((m) => ({ ...m, addSewa: true }));
                }}
              >
                + Tambah Sewa
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <ModalAddPS
        isOpen={modal.addPS}
        onClose={() => setModal((m) => ({ ...m, addPS: false }))}
        onAdded={fetchData}
      />
      <ModalAddSewa
        isOpen={modal.addSewa}
        onClose={() => setModal((m) => ({ ...m, addSewa: false }))}
        ps={selectedPS}
        onUpdated={fetchData}
      />
      <ModalEditPS
        isOpen={modal.editPS}
        onClose={() => setModal((m) => ({ ...m, editPS: false }))}
        ps={selectedPS}
        onUpdated={fetchData}
      />

      <ModalDeletePS
        isOpen={modal.deletePS}
        onClose={() => setModal((m) => ({ ...m, deletePS: false }))}
        ps={selectedPS}
        onDeleted={fetchData}
      />

      <ModalNotifSewaHabis
        isOpen={modal.notifSewaHabis}
        onClose={() => setModal((m) => ({ ...m, notifSewaHabis: false }))}
      />
    </div>
  );
}
