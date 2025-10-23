import { useState, useEffect } from "react";
import axios from "axios";

export default function ModalAddSewa({ isOpen, onClose, ps, onUpdated }) {
  const [users, setUsers] = useState([]);
  const [idUser, setIdUser] = useState("");
  const [jamMulai, setJamMulai] = useState("");
  const [durasi, setDurasi] = useState(1);
  const [jamSelesai, setJamSelesai] = useState("");
  const [totalBiaya, setTotalBiaya] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Ambil data user dari Directus
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const token = localStorage.getItem("access_token");
        const res = await axios.get("http://localhost:8055/users", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(res.data.data || []);

      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    if (jamMulai && durasi > 0 && ps) {
      const start = new Date(jamMulai);
      const end = new Date(start.getTime() + durasi * 60 * 60 * 1000);

      const pad = (n) => n.toString().padStart(2, "0");
      const yyyy = end.getFullYear();
      const mm = pad(end.getMonth() + 1);
      const dd = pad(end.getDate());
      const hh = pad(end.getHours());
      const min = pad(end.getMinutes());
      setJamSelesai(`${yyyy}-${mm}-${dd}T${hh}:${min}`);

      setTotalBiaya(ps.harga_sewa * durasi);
    }
  }, [jamMulai, durasi, ps]);

  const handleAddSewa = async () => {
    if (!ps || !idUser || !jamMulai || durasi <= 0) {
      setError("Semua field harus diisi");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");

      // Update playstation
      await axios.patch(
        `http://localhost:8055/items/playstation/${ps.id}`,
        {
          status: "rented",
          sisaWaktu: durasi * 60 * 60, // durasi jam ke detik
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Tambahkan log sewa (misal di tabel "sewa")
      const resSewa = await axios.post(
        "http://localhost:8055/items/sewa",
        {
          id_ps: ps.id,
          id_user: idUser,
          jam_mulai: jamMulai,
          durasi,
          jam_selesai: jamSelesai,
          total_biaya: totalBiaya,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const sewa = resSewa.data.data;

      await axios.post("http://localhost:8055/items/transaksi",
        {
          id_sewa: sewa.id,
          tanggal: new Date().toISOString(),
          tipe: "Pemasukan",
          nominal: totalBiaya,
          keterangan: `Pembayaran sewa ${ps.tipe_ps} (${ps.no_ps})`,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onUpdated();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Gagal menambahkan sewa");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !ps) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-blue-50 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-blue-600 text-lg font-semibold mb-4">
          Tambah Sewa: {ps.tipe_ps} ({ps.no_ps})
        </h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* Pilih user */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Pilih User</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={idUser}
            onChange={(e) => setIdUser(e.target.value)}
          >
            <option value="">-- Pilih User --</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.first_name} {user.last_name} ({user.email})
              </option>
            ))}
          </select>
        </div>

        {/* Jam Mulai */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Jam Mulai</label>
          <input
            type="datetime-local"
            className="w-full border px-3 py-2 rounded"
            value={jamMulai}
            onChange={(e) => setJamMulai(e.target.value)}
          />
        </div>

        {/* Durasi */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Durasi (jam)</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded"
            value={durasi}
            onChange={(e) => setDurasi(Number(e.target.value))}
            min={1}
          />
        </div>

        {/* Jam Selesai */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Jam Selesai</label>
          <input
            type="datetime-local"
            className="w-full border px-3 py-2 rounded bg-gray-100"
            value={jamSelesai}
            disabled
          />
        </div>

        {/* Total Biaya */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Total Biaya</label>
          <input
            type="number"
            className="w-full border px-3 py-2 rounded bg-gray-100"
            value={totalBiaya}
            disabled
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleAddSewa}
            disabled={loading || !idUser || !jamMulai || durasi <= 0}
            className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700"
          >
            {loading ? "Menyimpan..." : "Tambah Sewa"}
          </button>
        </div>
      </div>
    </div>
  );
}
