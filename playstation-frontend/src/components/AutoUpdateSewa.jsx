// AutoUpdateSewa.jsx
import { useEffect } from "react";
import axios from "axios";

export default function AutoUpdateSewa() {
  useEffect(() => {
    const checkAndUpdate = async () => {
      try {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        // 🔹 Ambil hanya sewa yang masih ongoing
        const res = await axios.get(
          "http://localhost:8055/items/sewa?filter[status_sewa][_eq]=ongoing",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = res.data.data || [];
        const now = new Date();

        for (const sewa of data) {
          const end = new Date(sewa.jam_selesai);

          if (now > end) {
            console.log(`⏰ Sewa ${sewa.id} telah habis, memperbarui status...`);

            // Update status sewa
            await axios.patch(
              `http://localhost:8055/items/sewa/${sewa.id}`,
              { status_sewa: "finished" },
              { headers: { Authorization: `Bearer ${token}` } }
            );

            // Update status playstation terkait
            if (sewa.id_ps) {
              await axios.patch(
                `http://localhost:8055/items/playstation/${sewa.id_ps}`,
                { status: "available", sisaWaktu: 0 },
                { headers: { Authorization: `Bearer ${token}` } }
              );
            }
          }
        }
      } catch (err) {
        console.error("Gagal memperbarui status sewa:", err);
      }
    };

    checkAndUpdate();
    const interval = setInterval(checkAndUpdate, 5000);
    return () => clearInterval(interval);
  }, []);

  return null;
}