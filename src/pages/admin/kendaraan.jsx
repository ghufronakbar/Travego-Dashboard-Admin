import Sidebar from "@/components/Sidebar";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/hoc/AuthPage";
import formatRupiah from "@/utils/formatRupiah";
import Image from "next/image";
import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Input,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

const FIELDS = [
  "No",
  "",
  "Nama",
  "Tipe",
  "Nopol",
  "Jumlah Seat",
  "Harga Sewa",
  "Aksi",
];

const initInput = {
  id_kendaraan: 0,
  no_kendaraan: "",
  tipe_kendaraan: "",
  jumlah_seat: 0,
  nama_kendaraan: "",
  harga_sewa: 0,
  gambar_kendaraan: null,
};

const KendaraanPage = () => {
  const [data, setData] = useState([]);
  const [formInput, setFormInput] = useState(initInput);
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/getKendaraan");
      setData(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setFormInput(initInput);
    setSelectedImage(null);
  };

  const handleCloseConfirm = () => {
    setConfirm(false);
    setFormInput(initInput);
  };

  const handleConfirmation = (data) => {
    setFormInput(data);
    setConfirm(true);
  };

  const handleDelete = async () => {
    console.log("delete");
    try {
      await axiosInstance.delete(`/deleteKendaraan/${formInput.id_kendaraan}`);
      fetchData();
      handleCloseConfirm();
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleChangeImage = (e) => {
    const file = e.target.files[0];
    setFormInput((prevState) => ({
      ...prevState,
      gambar_kendaraan: file,
    }));
    setSelectedImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !formInput.gambar_kendaraan ||
      formInput.no_kendaraan === "" ||
      formInput.tipe_kendaraan === "" ||
      formInput.jumlah_seat === 0 ||
      formInput.nama_kendaraan === "" ||
      formInput.harga_sewa === 0
    ) {
      setIsError("Lengkapi semua data");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("no_kendaraan", formInput.no_kendaraan);
      formData.append("tipe_kendaraan", formInput.tipe_kendaraan);
      formData.append("jumlah_seat", formInput.jumlah_seat);
      formData.append("nama_kendaraan", formInput.nama_kendaraan);
      formData.append("harga_sewa", formInput.harga_sewa);
      formData.append("gambar_kendaraan", formInput.gambar_kendaraan);

      if (formInput.id_kendaraan === 0) {
        await axiosInstance.post("/addKendaraan", formData);
      } else {
        await axiosInstance.put(
          `/editKendaraan/${formInput.id_kendaraan}`,
          formData
        );
      }

      handleClose();
      fetchData();
    } catch (error) {
      console.log(error);
      setIsError("Terjadi kesalahan");
    }
  };

  return (
    <Sidebar onClick={() => setOpen(true)}>
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
              <tr key={item.id_kendaraan}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4">
                  <Image
                    src={item.gambar_kendaraan}
                    alt={item.nama_kendaraan}
                    className="w-16 h-16"
                    width={100}
                    height={100}
                  />
                </td>
                <td className="px-6 py-4">{item.nama_kendaraan}</td>
                <td className="px-6 py-4">{item.tipe_kendaraan}</td>
                <td className="px-6 py-4">{item.no_kendaraan}</td>
                <td className="px-6 py-4">{item.jumlah_seat}</td>
                <td className="px-6 py-4">{formatRupiah(item.harga_sewa)}</td>
                <td className="px-6 py-4">
                  <button
                    className="text-blue-600 hover:text-blue-900"
                    onClick={() => {
                      setOpen(true);
                      setFormInput(item);
                    }}
                  >
                    Edit
                  </button>
                  <button
                    className="ml-4 text-red-600 hover:text-red-900"
                    onClick={() => handleConfirmation(item)}
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit Kendaraan */}
      <Modal
        open={open}
        onClose={handleClose}
        className="flex justify-center items-center overflow-y-auto"
      >
        <Box className="relative p-8 bg-white shadow-lg rounded-lg w-[90%] md:w-2/3 lg:w-1/2 xl:w-1/3 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {formInput.id_kendaraan > 0 ? "Edit" : "Tambah"} Kendaraan
          </h2>
          <form>            
            <TextField
              label="Nomor Polisi"
              name="no_kendaraan"
              value={formInput.no_kendaraan}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Tipe Kendaraan"
              name="tipe_kendaraan"
              value={formInput.tipe_kendaraan}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Jumlah Seat"
              name="jumlah_seat"
              value={formInput.jumlah_seat}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Nama Kendaraan"
              name="nama_kendaraan"
              value={formInput.nama_kendaraan}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Harga Sewa"
              name="harga_sewa"
              value={formInput.harga_sewa}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            {formInput.id_kendaraan === 0 ? (
              <Input
                label="Gambar Kendaraan"
                type="file"
                name="gambar_kendaraan"
                onChange={handleChangeImage}
                fullWidth
                margin="normal"
              />
            ) : (
              <div className="w-full h-full">
                <Image
                  src={
                    selectedImage ? selectedImage : formInput.gambar_kendaraan
                  }
                  alt={formInput.nama_kendaraan}
                  className="w-full h-full object-cover"
                  width={500}
                  height={500}
                />
                <input
                  type="file"
                  name="gambar_kendaraan"
                  id="image-edit"
                  onChange={handleChangeImage}
                  className="hidden"
                />
                <Button
                  onClick={() => {
                    document.getElementById("image-edit").click();
                  }}
                >
                  Ganti Gambar
                </Button>
              </div>
            )}
            {isError && <p className="mt-2 text-sm text-red-500">{isError}</p>}
            <div className="mt-4 flex gap-2 justify-end">
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
              >
                Simpan
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={handleClose}
              >
                Batal
              </Button>
            </div>
          </form>
        </Box>
      </Modal>

      {/* Dialog Konfirmasi Hapus */}
      <Dialog open={confirm} onClose={handleCloseConfirm}>
        <DialogTitle>
          Apakah anda yakin ingin menghapus kendaraan ini?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Setelah dihapus, data tidak dapat dikembalikan.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseConfirm}>Batal</Button>
          <Button onClick={handleDelete} autoFocus>
            Hapus
          </Button>
        </DialogActions>
      </Dialog>
    </Sidebar>
  );
};

export default AuthPage(KendaraanPage);
