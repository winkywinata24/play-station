import { useState } from "react";

export default function ModalAddTransaksi({ show, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    tanggal: "",
    tipe: "",
    nominal: "",
    keterangan: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      tanggal: "",
      tipe: "",
      nominal: "",
      keterangan: "",
    });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-blue-50 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-blue-600 text-xl font-semibold mb-4">Tambah Transaksi Manual</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input tanggal */}
          <div>
            <label className="block text-gray-700 mb-1">Tanggal</label>
            <input
              type="datetime-local"
              className="w-full border p-2 rounded"
              value={formData.tanggal}
              onChange={(e) =>
                setFormData({ ...formData, tanggal: e.target.value })
              }
              required
            />
          </div>

          {/* Input tipe */}
          <div>
            <label className="block text-gray-700 mb-1">Tipe</label>
            <select
              className="w-full border p-2 rounded"
              value={formData.tipe}
              onChange={(e) =>
                setFormData({ ...formData, tipe: e.target.value })
              }
              required
            >
              <option value="">-- Pilih Tipe --</option>
              <option value="pemasukan">Pemasukan</option>
              <option value="pengeluaran">Pengeluaran</option>
            </select>
          </div>

          {/* Input nominal */}
          <div>
            <label className="block text-gray-700 mb-1">Nominal</label>
            <input
              type="number"
              className="w-full border p-2 rounded"
              value={formData.nominal}
              onChange={(e) =>
                setFormData({ ...formData, nominal: e.target.value })
              }
              required
            />
          </div>

          {/* Input keterangan */}
          <div>
            <label className="block text-gray-700 mb-1">Keterangan</label>
            <textarea
              className="w-full border p-2 rounded"
              rows="3"
              value={formData.keterangan}
              onChange={(e) =>
                setFormData({ ...formData, keterangan: e.target.value })
              }
            />
          </div>

          {/* Tombol aksi */}
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            >
              Batal
            </button>
            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Simpan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
