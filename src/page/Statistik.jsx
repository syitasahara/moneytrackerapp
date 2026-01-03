import React, { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import api from "../api/api";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";

const months = [
  { value: "januari", label: "Januari" },
  { value: "februari", label: "Februari" },
  { value: "maret", label: "Maret" },
  { value: "april", label: "April" },
  { value: "mei", label: "Mei" },
  { value: "juni", label: "Juni" },
  { value: "juli", label: "Juli" },
  { value: "agustus", label: "Agustus" },
  { value: "september", label: "September" },
  { value: "oktober", label: "Oktober" },
  { value: "november", label: "November" },
  { value: "desember", label: "Desember" },
];

const getCurrentMonthValue = () => {
  const now = new Date();
  return months[now.getMonth()].value; 
};

const CATEGORY_NAMES = {
  1: "Makanan & Minuman",
  2: "Transportasi",
  3: "Hiburan",
  4: "Lainnya",
};

const COLORS = ["#3B82F6", "#22C55E", "#EAB308", "#EF4444", "#A855F7"];

const Statistik = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("custom"); 
  const [selectedMonth, setSelectedMonth] = useState(getCurrentMonthValue);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/transactions");
        setTransactions(res.data.transactions || []);
        setError(null);
      } catch (err) {
        console.error("Error fetching transactions:", err);
        setError("Gagal memuat data transaksi");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleMonthChange = (e) => {
    const value = e.target.value;
    setSelectedMonth(value);
    setSelectedPeriod("custom"); 
  };

  const handlePeriodChange = (period) => {
    if (period === "bulan-lalu") {
      const currentMonthIndex = months.findIndex(
        (m) => m.value === selectedMonth
      );

      if (currentMonthIndex === 0) {
        setSelectedMonth("desember");
        setSelectedYear((prev) => prev - 1);
      } else {
        setSelectedMonth(months[currentMonthIndex - 1].value);
      }

      setSelectedPeriod("bulan-lalu");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID").format(amount || 0);
  };

  // === FILTER TRANSAKSI BERDASARKAN BULAN YANG DIPILIH ===
  const selectedMonthIndex = months.findIndex(
    (m) => m.value === selectedMonth
  );

  const monthlyTransactions = transactions.filter((tx) => {
    const date = new Date(tx.transaction_date || tx.created_at);
    if (Number.isNaN(date.getTime())) return false;

    return (
      date.getMonth() === selectedMonthIndex &&
      date.getFullYear() === selectedYear
    );
  });


  // === HITUNG PEMASUKAN & PENGELUARAN BULAN INI ===
  let incomeTotal = 0;
  let expenseTotal = 0;

  monthlyTransactions.forEach((tx) => {
    const amount = parseFloat(tx.amount) || 0;
    if (tx.type === "income") {
      incomeTotal += amount;
    } else if (tx.type === "expense") {
      expenseTotal += amount;
    }
  });

  // Rata-rata pengeluaran harian
  const daysInMonth = new Date(selectedYear, selectedMonthIndex + 1, 0).getDate();
  const dailyAverageExpense =
    expenseTotal > 0 ? expenseTotal / daysInMonth : 0;

  // === PENGELUARAN PER KATEGORI (HANYA expense) ===
  const categoryTotals = {};

  monthlyTransactions.forEach((tx) => {
    if (tx.type === "expense" && tx.category_id) {
      const id = tx.category_id;
      const amount = parseFloat(tx.amount) || 0;
      if (!categoryTotals[id]) categoryTotals[id] = 0;
      categoryTotals[id] += amount;
    }
  });

  const categoryChartData = Object.entries(categoryTotals).map(
    ([id, total]) => ({
      id: Number(id),
      name: CATEGORY_NAMES[id] || "Lainnya",
      value: total,
    })
  );

  const totalCategoryExpense = categoryChartData.reduce(
    (sum, cat) => sum + cat.value,
    0
  );

  const categoryWithPercentage = categoryChartData.map((cat, index) => ({
    ...cat,
    percentage:
      totalCategoryExpense > 0
        ? ((cat.value / totalCategoryExpense) * 100).toFixed(1)
        : 0,
    color: COLORS[index % COLORS.length],
  }));

  // === KATEGORI PALING BOROS ===
  let topCategory = null;
  if (categoryChartData.length > 0) {
    topCategory = categoryChartData.reduce((max, cat) =>
      cat.value > max.value ? cat : max
    );
  }

  // === PENGELUARAN PER MINGGU ===
  const weeklyExpenses = [0, 0, 0, 0]; 

  monthlyTransactions.forEach((tx) => {
    if (tx.type !== "expense") return;
    const date = new Date(tx.transaction_date || tx.created_at);
    const day = date.getDate(); 
    const weekIndex = Math.min(3, Math.floor((day - 1) / 7)); 
    weeklyExpenses[weekIndex] += parseFloat(tx.amount) || 0;
  });

  const maxWeekly = Math.max(...weeklyExpenses, 0);
  const MAX_BAR_HEIGHT = 120; 
  const weeklyHeights = weeklyExpenses.map((val) =>
    maxWeekly > 0 ? (val / maxWeekly) * MAX_BAR_HEIGHT : 0
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />

      {/* Konten Utama */}
      <main className="flex-1 p-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Statistik</h1>
          <p className="text-gray-600 mt-1">
            Kelola keuangan mahasiswa dengan mudah
          </p>
        </div>

        {/* Error / Loading */}
        {loading && (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-500 mt-2">Memuat data statistik...</p>
          </div>
        )}

        {error && !loading && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Pilih Periode */}
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                Pilih Periode:
              </h3>
              <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
                {/* Dropdown untuk memilih bulan */}
                <div className="relative">
                  <select
                    value={selectedMonth}
                    onChange={handleMonthChange}
                    className="appearance-none w-full sm:w-48 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 cursor-pointer"
                  >
                    {months.map((month) => (
                      <option key={month.value} value={month.value}>
                        {month.label}
                      </option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg
                      className="fill-current h-4 w-4"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                    </svg>
                  </div>
                </div>

                {/* Dropdown untuk memilih tahun */}
                <select
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(Number(e.target.value))}
                  className="appearance-none w-full sm:w-32 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 focus:ring-2 focus:ring-blue-500"
                >
                  {Array.from({ length: 10 }, (_, i) => {
                    const year = new Date().getFullYear() - i;
                    return (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    );
                  })}
                </select>

                {/* Tombol untuk bulan lalu */}
                <button
                  onClick={() => handlePeriodChange("bulan-lalu")}
                  className={`px-4 py-2 rounded-lg font-medium text-sm ${
                    selectedPeriod === "bulan-lalu"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Bulan lalu
                </button>
              </div>
            </div>

            {/* Tiga Kartu Statistik Atas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* Pemasukan Bulan Ini */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Pemasukan bulan ini
                </h3>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-gray-900">
                    Rp {formatCurrency(incomeTotal)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">bulan ini</p>
              </div>

              {/* Pengeluaran */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Pengeluaran
                </h3>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-gray-900">
                    Rp {formatCurrency(expenseTotal)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">bulan ini</p>
              </div>

              {/* Rata-rata Pengeluaran Harian */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-sm font-medium text-gray-700 mb-2">
                  Rata-rata Pengeluaran Harian
                </h3>
                <div className="mb-1">
                  <span className="text-3xl font-bold text-gray-900">
                    Rp {formatCurrency(dailyAverageExpense)}
                  </span>
                </div>
                <p className="text-sm text-gray-500">per hari (bulan ini)</p>
              </div>
            </div>

            {/* Container utama dengan grid 2 kolom */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Kolom Kiri - Pengeluaran per Kategori (Pie Chart) */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Pengeluaran per Kategori
                  </h3>

                  {categoryChartData.length > 0 ? (
                    <div className="flex items-center">
                      {/* Pie Chart */}
                      <div className="relative w-40 h-40 mr-6">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={categoryChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={40}
                              outerRadius={60}
                              paddingAngle={2}
                              dataKey="value"
                            >
                              {categoryChartData.map((entry, index) => (
                                <Cell
                                  key={`cell-${index}`}
                                  fill={COLORS[index % COLORS.length]}
                                />
                              ))}
                            </Pie>
                          </PieChart>
                        </ResponsiveContainer>
                      </div>

                      {/* Legend dengan persentase */}
                      <div className="flex-1">
                        <div className="space-y-3">
                          {categoryWithPercentage.map((cat, index) => (
                            <div
                              key={cat.id}
                              className="flex items-center justify-between"
                            >
                              <div className="flex items-center">
                                <div
                                  className="w-3 h-3 rounded-full mr-2"
                                  style={{ backgroundColor: cat.color }}
                                ></div>
                                <span className="text-gray-600 text-sm">
                                  {cat.name}
                                </span>
                              </div>
                              <span className="font-medium text-gray-900 text-sm">
                                {cat.percentage}%
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Belum ada pengeluaran di bulan ini.
                    </p>
                  )}
                </div>
              </div>

              {/* Kolom Kanan - Dua kartu bertumpuk */}
              <div className="space-y-6">
                {/* Kategori Paling Boros */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-4">
                    Kategori Paling Boros Bulan Ini
                  </h3>

                  {topCategory ? (
                    <div className="mb-4">
                      <div className="flex items-center mb-2">
                        <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center mr-3">
                          <span className="text-white font-bold text-sm">
                            1
                          </span>
                        </div>
                        <h4 className="font-bold text-gray-900">
                          {CATEGORY_NAMES[topCategory.id] || "Lainnya"}
                        </h4>
                      </div>
                      <p className="text-sm text-gray-500 ml-11">
                        {(
                          (topCategory.value / (expenseTotal || 1)) *
                          100
                        ).toFixed(1)}
                        % dari total pengeluaran bulan ini (
                        Rp {formatCurrency(topCategory.value)})
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Belum ada data pengeluaran untuk menentukan kategori
                      paling boros.
                    </p>
                  )}
                </div>

                {/* Pengeluaran per Minggu */}
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-6">
                    Pengeluaran per minggu
                  </h3>

                  {expenseTotal > 0 ? (
                    <>
                      {/* Bar Chart */}
                      <div className="flex items-end justify-between h-40 mb-4">
                        {["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"].map(
                          (label, idx) => {
                            const rawHeight = weeklyHeights[idx] || 0;
                            const height =
                              weeklyExpenses[idx] > 0
                                ? Math.max(rawHeight, 10)
                                : 0;

                            return (
                              <div
                                className="flex flex-col items-center"
                                key={label}
                              >
                                <div
                                  className="w-10 bg-blue-500 rounded-t-lg transition-all duration-300"
                                  style={{ height: `${height}px` }}
                                ></div>
                                <span className="text-xs text-gray-500 mt-2">
                                  {label}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                  Rp {formatCurrency(weeklyExpenses[idx])}
                                </span>
                              </div>
                            );
                          }
                        )}
                      </div>

                      {/* Info total */}
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>
                          Total pengeluaran bulan ini: Rp{" "}
                          {formatCurrency(expenseTotal)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">
                      Belum ada pengeluaran di bulan ini, jadi diagram mingguan
                      belum bisa ditampilkan.
                    </p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default Statistik;