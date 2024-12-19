import Sidebar from "@/components/Sidebar";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/hoc/AuthPage";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
} from "@mui/material";

const initInput = {
  nama_paket: "",
  deskripsi: "",
  id_rm: 0,
  id_hotel: 0,
  id_kendaraan: 0,
  harga: 0,
  id_wisata: 0,
};

const AddPaketWisataPage = () => {
  const router = useRouter();
  const [formInput, setFormInput] = useState(initInput);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [wisataList, setWisataList] = useState([]);

  const fetchData = async () => {
    try {
      const res = await axiosInstance.get("/getWisata");
      setWisataList(res.data);
    } catch (error) {}
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error when the user starts typing
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: "",
    }));
  };

  // Validate form input
  const validateForm = () => {
    let valid = true;
    let newErrors = {};

    if (!formInput.nama_paket) {
      valid = false;
      newErrors.nama_paket = "Nama paket harus diisi";
    }
    if (!formInput.deskripsi) {
      valid = false;
      newErrors.deskripsi = "Deskripsi harus diisi";
    }
    if (formInput.harga <= 0) {
      valid = false;
      newErrors.harga = "Harga harus lebih dari 0";
    }

    if (!formInput.id_wisata) {
      valid = false;
      newErrors.id_wisata = "Pilih wisata";
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await axiosInstance.post("/addPaketWisata", formInput);
      router.push("/admin/paket-wisata");
    } catch (error) {
      console.log("Error adding paket wisata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sidebar>
      <Box className="p-8 bg-white shadow-lg rounded-lg max-w-3xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6">Tambah Paket Wisata</h1>
        <form>
          <TextField
            label="Nama Paket"
            name="nama_paket"
            value={formInput.nama_paket}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.nama_paket}
            helperText={errors.nama_paket}
          />
          <TextField
            label="Deskripsi"
            name="deskripsi"
            value={formInput.deskripsi}
            onChange={handleChange}
            fullWidth
            multiline
            rows={4}
            margin="normal"
            error={!!errors.deskripsi}
            helperText={errors.deskripsi}
          />
          <TextField
            label="Harga"
            name="harga"
            type="number"
            value={formInput.harga}
            onChange={handleChange}
            fullWidth
            margin="normal"
            error={!!errors.harga}
            helperText={errors.harga}
          />
          <FormControl fullWidth margin="normal" error={!!errors.id_wisata}>
            <InputLabel id="select-wisata-label">Wisata</InputLabel>
            <Select
              labelId="select-wisata-label"
              name="id_wisata"
              value={formInput.id_wisata}
              onChange={handleChange}
            >
              {wisataList.map((wisata) => (
                <MenuItem key={wisata.id_wisata} value={wisata.id_wisata}>
                  {wisata.nama_wisata}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <div className="mt-6 flex justify-end gap-4">
            <Button
              variant="outlined"
              onClick={() => router.push("/admin/paket-wisata")}
              disabled={isLoading}
            >
              Batal
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={isLoading}
            >
              {isLoading ? "Menyimpan..." : "Simpan"}
            </Button>
          </div>
        </form>
      </Box>
    </Sidebar>
  );
};

export default AuthPage(AddPaketWisataPage);
