import Sidebar from "@/components/Sidebar";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/hoc/AuthPage";
import { useEffect, useState } from "react";

const initData = {
  totalTransaksi: 0,
  totalPaketWisata: 0,
  totalWisata: 0,
  totalHotel: 0,
  totalKendaraan: 0,
};

const Dashboard = () => {
  const [countData, setCountData] = useState(initData);
  useEffect(() => {
    const getCountData = async () => {
      try {
        const [transaksi, paketWisata, wisata, kendaraan] =
          await Promise.all([
            axiosInstance.get("/getTransaksi"),
            axiosInstance.get("/getPaketWisata"),
            axiosInstance.get("/getWisata"),            
            axiosInstance.get("/getKendaraan"),
          ]);
          

        setCountData({
          totalTransaksi: transaksi?.data?.data?.length,
          totalPaketWisata: paketWisata?.data?.length,
          totalWisata: wisata.data.length,          
          totalKendaraan: kendaraan?.data?.length,
        });
      } catch (error) {
        console.log(error);
      }
    };
    getCountData();
  }, []);

  return (
    <Sidebar>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold">Total Transaksi</h2>
          <p className="text-4xl font-bold mt-2">{countData?.totalTransaksi}</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold">Total Paket Wisata</h2>
          <p className="text-4xl font-bold mt-2">
            {countData?.totalPaketWisata}
          </p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold">Total Wisata</h2>
          <p className="text-4xl font-bold mt-2">{countData?.totalWisata}</p>
        </div>

        <div className="p-4 bg-white shadow rounded-lg">
          <h2 className="text-lg font-semibold">Total Kendaraan</h2>
          <p className="text-4xl font-bold mt-2">{countData?.totalKendaraan}</p>
        </div>
      </div>
    </Sidebar>
  );
};

export default AuthPage(Dashboard);
