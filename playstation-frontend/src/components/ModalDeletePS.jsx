import axios from "axios";

export default function ModalDeletePS({ isOpen, onClose, ps, onDeleted }) {
  const handleDelete = async () => {
    if (!ps) return;
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://localhost:8055/items/playstation/${ps.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      onDeleted();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  if (!isOpen || !ps) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-blue-50 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-blue-600 text-lg font-semibold mb-4">Hapus PS: {ps.tipe_ps} ({ps.no_ps})</h2>
        <p className="mb-4">Apakah Anda yakin ingin menghapus PS ini?</p>
        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400">Batal</button>
          <button onClick={handleDelete} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Hapus</button>
        </div>
      </div>
    </div>
  );
}
