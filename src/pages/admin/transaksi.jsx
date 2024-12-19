import Sidebar from "@/components/Sidebar";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/hoc/AuthPage";
import formatDate from "@/utils/formatDate";
import formatRupiah from "@/utils/formatRupiah";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Modal, Box, Button, Typography } from "@mui/material";

const FIELDS = [
  "No",
  "Pemesan",
  "Paket",
  "Total",
  "Status",
  "Dibuat Pada",
  "Aksi",
];

const TransaksiPage = () => {
  const [data, setData] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedTransaksi, setSelectedTransaksi] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/getTransaksi");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenModal = (transaksi) => {
    setSelectedTransaksi(transaksi);
    setOpen(true);
  };

  const handleCloseModal = () => {
    setOpen(false);
    setSelectedTransaksi(null);
  };

  return (
    <Sidebar>
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
            {data?.data?.map((item, index) => (
              <tr key={item.id_pesanan}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="font-bold">{item?.nama}</span>
                    <span>{item.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">{item.nama_paket}</td>
                <td className="px-6 py-4">{formatRupiah(item.total)}</td>
                <td className="px-6 py-4">{item?.status}</td>
                <td className="px-6 py-4">{formatDate(item.tgl_pesanan)}</td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => handleOpenModal(item)}
                  >
                    Detail
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Detail Transaksi */}
      <Modal
        open={open}
        onClose={handleCloseModal}
        className="flex justify-center items-center overflow-y-auto"
      >
        <Box className="bg-white p-8 rounded-lg shadow-lg w-[90%] md:w-2/3 lg:w-1/2 xl:w-1/3 max-h-[80vh] overflow-y-auto">
          {selectedTransaksi && (
            <>
              <Typography variant="h6" className="font-bold mb-4">
                Detail Transaksi
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Pemesan:</strong> {selectedTransaksi.nama} (
                {selectedTransaksi.email})
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Nomor HP:</strong> {selectedTransaksi?.no_hp || "-"}
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Tanggal Pesanan:</strong>{" "}
                {formatDate(selectedTransaksi?.tgl_pesanan)}
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Catatan:</strong> {selectedTransaksi?.catatan || "-"}
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Jumlah:</strong> {selectedTransaksi?.qty}
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Harga:</strong> {formatRupiah(selectedTransaksi?.harga)}
              </Typography>
              <Typography variant="subtitle1" className="mb-2">
                <strong>Total:</strong> {formatRupiah(selectedTransaksi?.total)}
              </Typography>

              <div className="mt-4">
                <Typography variant="subtitle1" className="font-bold mb-2">
                  Paket: {selectedTransaksi?.nama_paket}
                </Typography>

                <div className="mb-4">
                  <Typography variant="subtitle1" className="font-bold mb-2">
                    Rincian:
                  </Typography>
                  <div className="flex items-center gap-4">
                    <div>
                      <Typography variant="body2">
                        <strong>Nama:</strong> {selectedTransaksi?.nama_paket}
                      </Typography>
                      <Typography variant="body2">
                        <strong>Harga per item:</strong>{" "}
                        {formatRupiah(selectedTransaksi?.harga)}
                      </Typography>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 flex justify-end">
                <Button variant="outlined" onClick={handleCloseModal}>
                  Tutup
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </Sidebar>
  );
};

export default AuthPage(TransaksiPage);
