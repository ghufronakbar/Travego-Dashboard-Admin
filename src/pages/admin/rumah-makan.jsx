import Sidebar from "@/components/Sidebar";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/hoc/AuthPage";
import { useEffect, useState } from "react";
import {
  Modal,
  Box,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Input,
} from "@mui/material";
import Image from "next/image";

const FIELDS = [
  "No",
  "",
  "Nama",
  "Harga/Pax",
  "Menu",
  "Alamat",
  "No Telepon",
  "Jumlah Pax",
  "Aksi",
];

const initInput = {
  id_rm: 0,
  nama_rm: "",
  harga_pax: 0,
  menu: "",
  alamat: "",
  no_tlpn: "",
  jumlah_pax: 0,
  gambar: null,
};

const RumahMakanPage = () => {
  const [data, setData] = useState([]);
  const [formInput, setFormInput] = useState(initInput);
  const [open, setOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [confirm, setConfirm] = useState(false);

  // Fetch data rumah makan
  const fetchData = async () => {
    try {
      const response = await axiosInstance.get("/getRumahMakan");
      setData(response.data);
    } catch (error) {
      console.log("Error fetching rumah makan:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleClose = () => {
    setOpen(false);
    setFormInput(initInput);
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
    try {
      await axiosInstance.delete(`/deleteRumahMakan/${formInput.id_rm}`);
      fetchData();
      handleCloseConfirm();
    } catch (error) {
      console.log("Error deleting rumah makan:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      formInput.nama_rm === "" ||
      formInput.harga_pax === 0 ||
      formInput.menu === "" ||
      formInput.alamat === "" ||
      formInput.no_tlpn === "" ||
      formInput.jumlah_pax === 0
    ) {
      setIsError("Lengkapi semua data");
      return;
    }

    if (formInput.gambar === null && formInput.id_rm === 0) {
      setIsError("Harap pilih gambar");
      return;
    }

    const formData = new FormData();
    formData.append("nama_rm", formInput.nama_rm);
    formData.append("harga_pax", formInput.harga_pax);
    formData.append("menu", formInput.menu);
    formData.append("alamat", formInput.alamat);
    formData.append("no_tlpn", formInput.no_tlpn);
    formData.append("jumlah_pax", formInput.jumlah_pax);
    if (formInput.gambar) {
      formData.append("gambar", formInput.gambar);
    }

    try {
      if (formInput.id_rm === 0) {
        // Add new data
        await axiosInstance.post("/addRumahMakan", formData);
      } else {
        if (!formInput.gambar) {
          await axiosInstance.put(
            `/editRumahMakan/${formInput.id_rm}`,
            formInput
          );
        } else {
          await axiosInstance.put(
            `/editRumahMakan/${formInput.id_rm}`,
            formData
          );
        }
      }
      handleClose();
      fetchData();
    } catch (error) {
      console.log("Error saving rumah makan:", error);
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
              <tr key={item.id_rm}>
                <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                <td className="px-6 py-4">
                  <Image
                    src={item?.gambar}
                    alt={""}
                    className="w-16 h-16 object-cover"
                    width={100}
                    height={100}
                  />
                </td>
                <td className="px-6 py-4">{item.nama_rm}</td>
                <td className="px-6 py-4">{item.harga_pax}</td>
                <td className="px-6 py-4">{item.menu}</td>
                <td className="px-6 py-4">{item.alamat}</td>
                <td className="px-6 py-4">{item.no_tlpn}</td>
                <td className="px-6 py-4">{item.jumlah_pax}</td>
                <td className="px-6 py-4">
                  <div className="flex items-center">
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
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit Rumah Makan */}
      <Modal
        open={open}
        onClose={handleClose}
        className="flex justify-center items-center overflow-y-auto"
      >
        <Box className="relative p-8 bg-white shadow-lg rounded-lg w-[90%] md:w-2/3 lg:w-1/2 xl:w-1/3 max-h-[80vh] overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">
            {formInput.id_rm > 0 ? "Edit" : "Tambah"} Rumah Makan
          </h2>
          <form>
            <TextField
              label="Nama Rumah Makan"
              name="nama_rm"
              value={formInput.nama_rm}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Harga/Pax"
              name="harga_pax"
              value={formInput.harga_pax}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <TextField
              label="Menu"
              name="menu"
              value={formInput.menu}
              onChange={handleChange}
              fullWidth
              margin="normal"
              multiline
              rows={4}
            />
            <TextField
              label="Alamat"
              name="alamat"
              value={formInput.alamat}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="No Telepon"
              name="no_tlpn"
              value={formInput.no_tlpn}
              onChange={handleChange}
              fullWidth
              margin="normal"
            />
            <TextField
              label="Jumlah Pax"
              name="jumlah_pax"
              value={formInput.jumlah_pax}
              onChange={handleChange}
              type="number"
              fullWidth
              margin="normal"
            />
            <Input
              type="file"
              name="gambar"
              onChange={(e) => {
                if (e.target.files[0]) {
                  setFormInput({ ...formInput, gambar: e.target.files[0] });
                }
              }}
              accept="image/*"
            />
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
          Apakah anda yakin ingin menghapus rumah makan ini?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
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

export default AuthPage(RumahMakanPage);
