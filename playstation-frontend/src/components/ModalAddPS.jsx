import { useState } from "react";
import axios from "axios";

export default function ModalAddPS({ isOpen, onClose, onAdded }) {
  const [noPS, setNoPS] = useState("");
  const [tipePS, setTipePS] = useState("");
  const [hargaSewa, setHargaSewa] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAdd = async () => {
    if (!noPS || !tipePS || !hargaSewa) {
      setError("Semua field harus diisi");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(
        "http://localhost:8055/items/playstation",
        {
          no_ps: noPS,
          tipe_ps: tipePS,
          harga_sewa: parseFloat(hargaSewa),
          status: "available",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // reset form
      setNoPS("");
      setTipePS("");
      setHargaSewa("");
      setError("");
      onAdded();
      onClose();
    } catch (err) {
      console.error(err);
      setError("Gagal menambahkan PlayStation");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-blue-50 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-blue-600 text-lg font-semibold mb-4">Tambah PlayStation</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        {/* No PS */}
        <input
          type="text"
          placeholder="No PS"
          className="w-full border px-3 py-2 rounded mb-3"
          value={noPS}
          onChange={(e) => setNoPS(e.target.value)}
        />

        {/* Tipe PS */}
        <div className="mb-3">
          <label className="block mb-1 font-medium">Tipe PS</label>
          <select
            className="w-full border px-3 py-2 rounded"
            value={tipePS}
            onChange={(e) => setTipePS(e.target.value)}
          >
            <option value="">-- Pilih Tipe --</option>
            <option value="PS1">PS1</option>
            <option value="PS2">PS2</option>
            <option value="PS3">PS3</option>
            <option value="PS4">PS4</option>
            <option value="PS5">PS5</option>
          </select>
        </div>

        {/* Harga sewa per jam */}
        <label className="block mb-1 font-medium">Harga Sewa</label>
        <input
          type="number"
          placeholder="Harga sewa per jam"
          className="w-full border px-3 py-2 rounded mb-3"
          value={hargaSewa}
          onChange={(e) => setHargaSewa(e.target.value)}
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
          >
            Batal
          </button>
          <button
            onClick={handleAdd}
            disabled={loading}
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
