export default function ModalNotifSewaHabis({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm text-center">
        <h2 className="text-lg font-semibold mb-4 text-red-600">Sewa Habis!</h2>
        <p className="mb-4">Sewa salah satu PS telah habis waktunya.</p>
        <button
          onClick={onClose}
          className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}
