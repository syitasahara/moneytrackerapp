import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import TambahTransaksi from "./page/TambahTransaksi";
import Dashboard from "./page/Dashboard";
import EditTransaksi from "./page/EditTransaksi";
import RiwayatTransaksi from "./page/RiwayatTransaksi";
import Statistik from "./page/Statistik";
import Pengaturan from "./page/Pengaturan";
import Login from "./page/Login";
import Register from "./page/Register";
import Profile from "./page/Profile";

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/tambah-transaksi" element={<TambahTransaksi />} />
            <Route path="/edit-transaksi" element={<EditTransaksi />} />
            <Route path="/riwayat-transaksi" element={<RiwayatTransaksi />} />
            <Route path="/statistik" element={<Statistik />} />
            <Route path="/pengaturan" element={<Pengaturan />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
