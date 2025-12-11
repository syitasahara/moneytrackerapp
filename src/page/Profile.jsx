import React, { useState, useEffect } from "react";
import { User, MapPin, Phone, Mail, Camera } from "lucide-react";
import Sidebar from "../components/Sidebar";
import api from "../api/api";

const ProfilePage = () => {
  const [currentPage, setCurrentPage] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    let parsedUser = null;
    if (savedUser) {
      try {
        parsedUser = JSON.parse(savedUser);
        setUser(parsedUser); 
      } catch (e) {
        console.error("Gagal parse user dari localStorage:", e);
      }
    }

    const fetchProfile = async () => {
      if (!parsedUser?.id) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get(`/users/${parsedUser.id}`);
        const freshUser = res.data.user;

        setUser(freshUser);
        localStorage.setItem("user", JSON.stringify(freshUser));
      } catch (err) {
        console.error("Gagal ambil data profil:", err);
        setError("Gagal memuat profil dari server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleEditProfile = () => {
    setCurrentPage("edit");
  };

  const handleBackToProfile = (updatedUser) => {
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
    setCurrentPage("profile");
  };

  if (loading && !user) {
    return (
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8 flex items-center justify-center">
          <p className="text-gray-500">Memuat data profil...</p>
        </main>
      </div>
    );
  }

  if (currentPage === "edit" && user) {
    return <EditProfilePage onBack={handleBackToProfile} user={user} />;
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Saya</h1>

        {error && (
          <div className="mb-4 p-3 rounded-md bg-red-100 text-red-700 text-sm">
            {error}
          </div>
        )}

        {user && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Profile Card */}
            <div className="lg:col-span-2">
              <div className="bg-blue-600 rounded-2xl shadow-lg overflow-hidden">
                <div className="p-8 relative">
                  <button
                    onClick={handleEditProfile}
                    className="absolute top-6 right-6 text-white hover:bg-blue-700 p-2 rounded-lg transition"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                      />
                    </svg>
                  </button>

                  <div className="flex items-center gap-6">
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                      {user.image ? (
                        <img
                          src={user.image}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="w-12 h-12 text-white" />
                      )}
                    </div>
                    <div className="text-white">
                      <h2 className="text-3xl font-bold">
                        {user.username || "User"}
                      </h2>
                      <p className="text-blue-100 text-lg mt-1">
                        {user.status_mahasiswa || "Mahasiswa Aktif"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Informasi Pribadi */}
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-4">
                        Informasi Pribadi
                      </h3>

                      <div className="space-y-4">
                        {/* Jenis Kelamin */}
                        <div className="flex items-start gap-3">
                          <User className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Jenis Kelamin
                            </p>
                            <p className="text-gray-900 font-medium">
                              {user.jenis_kelamin || "Belum diisi"}
                            </p>
                          </div>
                        </div>

                        {/* Domisili */}
                        <div className="flex items-start gap-3">
                          <MapPin className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">Domisili</p>
                            <p className="text-gray-900 font-medium">
                              {user.domisili || "Belum diisi"}
                            </p>
                          </div>
                        </div>

                        {/* Nomor Handphone */}
                        <div className="flex items-start gap-3">
                          <Phone className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">
                              Nomor Handphone
                            </p>
                            <p className="text-gray-900 font-medium">
                              {user.phone_number || "-"}
                            </p>
                          </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-start gap-3">
                          <Mail className="w-5 h-5 text-blue-500 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="text-gray-900 font-medium break-all">
                              {user.email || "-"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Saldo Card */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-6">
                  Saldo Saat Ini
                </h3>

                <div className="flex justify-center mb-6">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-green-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>
                  </div>
                </div>

                <div className="text-center mb-6">
                  <p className="text-4xl font-bold text-gray-900">
                    {user.balance
                      ? `Rp ${Number(user.balance).toLocaleString("id-ID")}`
                      : "Rp 0"}
                  </p>
                </div>

                <div className="space-y-3 pt-4 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pemasukan</span>
                    <span className="text-green-600 font-semibold">
                      Rp 3.200.000
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Pengeluaran</span>
                    <span className="text-red-600 font-semibold">
                      Rp 350.000
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

const EditProfilePage = ({ onBack, user }) => {
  const [formData, setFormData] = useState({
    username: user?.username || "",
    statusMahasiswa: user?.status_mahasiswa || "Aktif",
    jenisKelamin: user?.jenis_kelamin || "Laki-laki",
    domisili: user?.domisili || "",
    noTelepon: user?.phone_number || "",
    email: user?.email || "",
    image: user?.image || null,
  });

  const [profileImage, setProfileImage] = useState(user?.image || null);
  const [loading, setLoading] = useState(false); // utk submit & upload

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setLoading(true);

      const form = new FormData();
      form.append("image", file);

      const token = localStorage.getItem("token");

      const res = await api.put("/users/profile/upload-image", form, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      console.log("Upload success:", res.data);

      const updatedUser = res.data.user;

      if (!updatedUser?.image) {
        alert("Upload berhasil tapi URL gambar tidak ditemukan di response.");
        return;
      }

      setProfileImage(updatedUser.image);
      setFormData((prev) => ({ ...prev, image: updatedUser.image }));

      localStorage.setItem("user", JSON.stringify(updatedUser));
    } catch (err) {
      console.error("Upload image error:", err?.response || err);
      alert(
        err?.response?.data?.message ||
          "Gagal upload foto profil, cek console Network untuk detailnya."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    onBack(); 
  };

  const handleSubmit = async () => {
    if (!user?.id) {
      alert("User ID tidak ditemukan. Coba login ulang.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        username: formData.username,
        phone_number: formData.noTelepon,
        email: formData.email,
        domisili: formData.domisili,
        status_mahasiswa: formData.statusMahasiswa,
        jenis_kelamin: formData.jenisKelamin,
        image: formData.image, 
      };

      const res = await api.put(`/users/${user.id}`, payload);

      const updatedUser = res.data.user;

      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert(res.data.message || "Profile updated successfully");

      onBack(updatedUser);
    } catch (error) {
      console.error("Update profile error:", error);
      alert(
        error.response?.data?.message || "Gagal update profile, coba lagi ya."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Profile Saya</h1>

        <div className="max-w-2xl">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            {/* Profile Photo Section */}
            <div className="mb-8">
              <label className="block text-gray-900 font-semibold mb-4">
                Foto Profile
              </label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-24 h-24 bg-gradient-to-br from-pink-400 to-blue-400 rounded-full flex items-center justify-center border-4 border-white shadow-lg overflow-hidden">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-12 h-12 text-white" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition">
                    <Camera className="w-4 h-4 text-white" />
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
                <div>
                  <p className="text-sm text-gray-600">
                    JPG, PNG disarankan &lt; 2MB
                  </p>
                </div>
              </div>
            </div>

            {/* Username Field */}
            <div className="mb-6">
              <label className="block text-gray-900 font-semibold mb-2">
                Username<span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Masukkan username"
              />
            </div>

            {/* Status & Gender Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Status Mahasiswa<span className="text-red-500">*</span>
                </label>
                <select
                  name="statusMahasiswa"
                  value={formData.statusMahasiswa}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1.25rem",
                  }}
                >
                  <option value="Aktif">Aktif</option>
                  <option value="Non-Aktif">Non-Aktif</option>
                </select>
              </div>

              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Jenis Kelamin<span className="text-red-500">*</span>
                </label>
                <select
                  name="jenisKelamin"
                  value={formData.jenisKelamin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
                  style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "right 0.75rem center",
                    backgroundSize: "1.25rem",
                  }}
                >
                  <option value="Laki-laki">Laki-laki</option>
                  <option value="Perempuan">Perempuan</option>
                </select>
              </div>
            </div>

            {/* Domisili Field */}
            <div className="mb-6">
              <label className="block text-gray-900 font-semibold mb-2">
                Domisili<span className="text-red-500">*</span>
              </label>
              <textarea
                name="domisili"
                value={formData.domisili}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                placeholder="Masukkan alamat lengkap"
              />
            </div>

            {/* Phone & Email Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  No. Telepon<span className="text-red-500">*</span>
                </label>
                <div className="flex">
                  <span className="inline-flex items-center px-4 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-gray-600">
                    +62
                  </span>
                  <input
                    type="text"
                    name="noTelepon"
                    value={formData.noTelepon}
                    onChange={handleInputChange}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-r-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="81234567890"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-900 font-semibold mb-2">
                  Email<span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="email@example.com"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-medium"
                disabled={loading}
              >
                ✕ Batal
              </button>
              <button
                onClick={handleSubmit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
