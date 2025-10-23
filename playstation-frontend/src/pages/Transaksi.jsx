import { useEffect, useState, useCallback } from "react";
import api from "../utils/axiosInstance";
import Navbar from "../components/Navbar";
import ModalAddTransaksi from "../components/ModalAddTransaksi";

export default function Transaksi() {
  const [showModal, setShowModal] = useState(false);
  const [transaksi, setTransaksi] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [filter, setFilter] = useState({
    startDate: "",
    endDate: "",
    tipe: "",
  });
  const [summary, setSummary] = useState({
    pemasukan: 0,
    pengeluaran: 0,
    profit: 0,
  });
  const [loading, setLoading] = useState(true);

  // 🔹 Fetch data transaksi
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get("/items/transaksi?sort[]=-tanggal");
      const data = res.data?.data || [];
      setTransaksi(data);
      setFilteredData(data); // tampilkan semua di awal
      calculateSummary(data);
    } catch (err) {
      console.error("❌ Gagal mengambil data transaksi:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // 🔹 Hitung ringkasan
  const calculateSummary = (data) => {
    const today = new Date().toISOString().split("T")[0];
    const hariIni = data.filter((t) => t.tanggal.startsWith(today));

    const total = (tipe) =>
      hariIni
        .filter((t) => t.tipe?.toLowerCase() === tipe)
        .reduce((acc, t) => acc + Number(t.nominal || 0), 0);

    const pemasukan = total("pemasukan");
    const pengeluaran = total("pengeluaran");

    setSummary({
      pemasukan,
      pengeluaran,
      profit: pemasukan - pengeluaran,
    });
  };

  // 🔹 Terapkan filter
  const handleFilter = () => {
    let data = [...transaksi];
    const { startDate, endDate, tipe } = filter;

    if (startDate)
      data = data.filter((t) => new Date(t.tanggal) >= new Date(startDate));
    if (endDate)
      data = data.filter((t) => new Date(t.tanggal) <= new Date(endDate));
    if (tipe)
      data = data.filter((t) => t.tipe?.toLowerCase() === tipe.toLowerCase());

    setFilteredData(data);
    calculateSummary(data); // hitung ulang ringkasan berdasarkan filter
  };

  // 🔹 Reset filter
  const resetFilter = () => {
    setFilter({ startDate: "", endDate: "", tipe: "" });
    setFilteredData(transaksi);
    calculateSummary(transaksi);
  };

  // 🔹 Tambah transaksi baru
  const handleAddTransaksi = async (newData) => {
    try {
      const res = await api.post("/items/transaksi", newData);
      const updated = [res.data.data, ...transaksi];
      setTransaksi(updated);
      setFilteredData(updated);
      calculateSummary(updated);
      setShowModal(false);
    } catch (error) {
      console.error("❌ Gagal menambah transaksi:", error);
      alert("Gagal menambahkan transaksi.");
    }
  };

  const displayedData = filteredData;

  return (
    <div className="min-h-screen bg-blue-50">
      <Navbar />
      <div className="p-6 max-w-7xl mx-auto space-y-6">
        {/* Ringkasan */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Profit Hari Ini", value: summary.profit, color: "blue" },
            { label: "Pemasukan Hari Ini", value: summary.pemasukan, color: "green" },
            { label: "Pengeluaran Hari Ini", value: summary.pengeluaran, color: "red" },
          ].map(({ label, value, color }) => (
            <div
              key={label}
              className={`bg-${color}-100 p-4 rounded-xl shadow text-center`}
            >
              <h3 className="text-gray-700 font-medium">{label}</h3>
              <p className={`text-2xl font-bold text-${color}-600`}>
                Rp {value.toLocaleString()}
              </p>
            </div>
          ))}
        </div>

        {/* Tombol Tambah */}
        <div className="flex justify-end">
          <button
            className="bg-blue-600 text-white px-5 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
            onClick={() => setShowModal(true)}
          >
            + Tambah Transaksi
          </button>
        </div>

        {/* Filter */}
        <div className="bg-white p-4 rounded-xl shadow space-y-3">
          <h2 className="font-semibold text-gray-700">Filter Transaksi</h2>
          <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
            <input
              type="date"
              className="border rounded-lg px-3 py-2"
              value={filter.startDate}
              onChange={(e) =>
                setFilter((f) => ({ ...f, startDate: e.target.value }))
              }
            />
            <input
              type="date"
              className="border rounded-lg px-3 py-2"
              value={filter.endDate}
              onChange={(e) =>
                setFilter((f) => ({ ...f, endDate: e.target.value }))
              }
            />
            <select
              className="border rounded-lg px-3 py-2"
              value={filter.tipe}
              onChange={(e) =>
                setFilter((f) => ({ ...f, tipe: e.target.value }))
              }
            >
              <option value="">Semua</option>
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
            <button
              onClick={handleFilter}
              className="bg-gray-800 text-white rounded-lg px-3 py-2 hover:bg-gray-900"
            >
              Terapkan
            </button>
            <button
              onClick={resetFilter}
              className="bg-gray-300 text-gray-800 rounded-lg px-3 py-2 hover:bg-gray-400"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Tabel */}
        <div className="bg-white p-4 rounded-xl shadow overflow-x-auto">
          {loading ? (
            <p className="text-center text-gray-500 py-6">Memuat data...</p>
          ) : (
            <table className="w-full border-collapse text-center">
              <thead>
                <tr className="bg-gray-100 text-gray-700">
                  <th className="px-4 py-2 border">ID Sewa</th>
                  <th className="px-4 py-2 border">Tanggal</th>
                  <th className="px-4 py-2 border">Tipe</th>
                  <th className="px-4 py-2 border">Nominal</th>
                  <th className="px-4 py-2 border">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {displayedData.length > 0 ? (
                  displayedData.map((t) => (
                    <tr
                      key={t.id}
                      className={`border-b ${
                        t.tipe?.toLowerCase() === "pengeluaran"
                          ? "bg-red-50"
                          : "bg-green-50"
                      }`}
                    >
                      <td className="px-4 py-2">{t.id_sewa || "-"}</td>
                      <td className="px-4 py-2">
                        {new Date(t.tanggal).toLocaleString()}
                      </td>
                      <td className="px-4 py-2 capitalize">{t.tipe}</td>
                      <td className="px-4 py-2">
                        Rp {Number(t.nominal).toLocaleString()}
                      </td>
                      <td className="px-4 py-2">{t.keterangan}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="text-center py-3 text-gray-500">
                      Tidak ada data transaksi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <ModalAddTransaksi
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleAddTransaksi}
      />
    </div>
  );
}
