import Sidebar from "@/components/Sidebar";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/hoc/AuthPage";
import formatRupiah from "@/utils/formatRupiah";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const FIELDS = [
  "No",
  "",
  "Nama",
  "Tujuan",
  "Harga",
  "Aksi",
];

const PaketWisataPage = () => {
  const [data, setData] = useState([]);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedPaket, setSelectedPaket] = useState(null);
  const router = useRouter();

  // Fetch data paket wisata
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/getPaketWisata");
      setData(response.data);
    } catch (error) {
      console.log("Error fetching paket wisata:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handle open delete confirmation
  const handleDeleteConfirmation = (paket) => {
    setSelectedPaket(paket);
    setConfirmDelete(true);
  };

  // Handle delete paket wisata
  const handleDelete = async () => {
    try {
      await axiosInstance.delete(`/deletePaketWisata/${selectedPaket.id_paket}`);
      setConfirmDelete(false);
      setSelectedPaket(null);
      fetchData(); // Refresh data after deletion
    } catch (error) {
      console.log("Error deleting paket wisata:", error);
    }
  };

  return (
    <Sidebar onClick={() => router.push("/admin/paket-wisata/add")}>
      <div className="overflow-x-auto mt-8">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr>
              {FIELDS.map((field, index) => (
                <th
                  key={index}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b"
                >
                  {field}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {data.map((item, index) => (
              <tr key={item.id_paket}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4">
                  <Image
                    src={item.wisata.gambar_wisata}
                    alt={item.nama_paket}
                    className="w-16 h-16"
                    width={100}
                    height={100}
                  />
                </td>
                <td className="px-6 py-4">{item.nama_paket}</td>
                <td className="px-6 py-4">{item.wisata.nama_wisata}</td>
                <td className="px-6 py-4">{formatRupiah(item.harga)}</td>                
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      <Link
                        href={`/admin/paket-wisata/${item.nama_paket}?id=${item.id_paket}`}
                      >
                        Detail
                      </Link>
                    </button>
                    <button
                      className="text-red-600 hover:text-red-900"
                      onClick={() => handleDeleteConfirmation(item)}
                    >
                      Hapus
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog
        open={confirmDelete}
        onClose={() => setConfirmDelete(false)}
      >
        <DialogTitle>Konfirmasi Hapus</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Apakah Anda yakin ingin menghapus paket wisata &quot;{selectedPaket?.nama_paket}&quot;? Tindakan ini tidak dapat dibatalkan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDelete(false)}>Batal</Button>
          <Button
            onClick={handleDelete}
            color="primary"
            variant="contained"
            autoFocus
          >
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Sidebar>
  );
};

export default AuthPage(PaketWisataPage);
