import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8055",
});

// Tambahkan Authorization ke setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Tangani token expired
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Jika 401 dan belum pernah coba refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        alert("Sesi Anda telah berakhir. Silakan login ulang.");
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        return Promise.reject(error);
      }

      try {
        // Panggil endpoint refresh token Directus
        const res = await axios.post("http://localhost:8055/auth/refresh", {
          refresh_token: refreshToken,
        });

        const newAccessToken = res.data.data.access_token;
        const newRefreshToken = res.data.data.refresh_token;

        // Simpan token baru
        localStorage.setItem("access_token", newAccessToken);
        if (newRefreshToken)
          localStorage.setItem("refresh_token", newRefreshToken);

        // Ulang request sebelumnya dengan token baru
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Gagal refresh token:", refreshError);

        // Tampilkan alert ke user
        alert("Sesi Anda telah berakhir. Silakan login ulang.");

        // Hapus token dari localStorage
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        // Redirect ke halaman login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
