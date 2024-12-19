import Sidebar from "@/components/Sidebar";
import axiosInstance from "@/config/axiosInstance";
import AuthPage from "@/hoc/AuthPage";
import { useEffect, useState } from "react";
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
  Typography,
} from "@mui/material";
import Image from "next/image";

const initInput = {
  nama_paket: "",
  deskripsi: "",
  id_rm: 0,
  id_hotel: 0,
  id_kendaraan: 0,
  harga: 0,
  id_wisata: 0,
  gambar_paket: null,
};

const DetailPaketWisataPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [formInput, setFormInput] = useState(initInput);
  const [errors, setErrors] = useState({});
  const [rumahMakanList, setRumahMakanList] = useState([]);
  const [hotelList, setHotelList] = useState([]);
  const [kendaraanList, setKendaraanList] = useState([]);
  const [wisataList, setWisataList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch data paket wisata
  const fetchPaketWisata = async () => {
    try {
      const response = await axiosInstance.get(`/getPaketWisata/${id}`);
      setFormInput(response.data);
    } catch (error) {
      console.log(error);
      router.push("/admin/paket-wisata");
    }
  };

  // Fetch data dropdown
  const fetchDropdownData = async () => {
    try {
      const [wisataResponse] = await Promise.all([
        axiosInstance.get("/getWisata"),
      ]);

      setWisataList(wisataResponse.data);
    } catch (error) {
      console.log("Error fetching dropdown data:", error);
    }
  };

  useEffect(() => {
    if (id && router.isReady) {
      fetchPaketWisata();
      fetchDropdownData();
    }
  }, [id, router.isReady]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // Clear error when user starts typing
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
    console.log({ newErrors });
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      await axiosInstance.put(`/editPaketWisata/${id}`, formInput);
      router.push("/admin/paket-wisata");
    } catch (error) {
      console.log("Error updating paket wisata:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sidebar>
      <Box className="p-8 bg-white shadow-lg rounded-lg max-w-3xl mx-auto mt-8">
        <h1 className="text-2xl font-bold mb-6">Detail Paket Wisata</h1>

        {/* Display Paket Wisata Image */}
        {formInput.gambar_paket && (
          <div className="mb-4">
            <Typography variant="h6" className="font-semibold mb-2">
              Gambar Paket:
            </Typography>
            <Image
              src={formInput.gambar_paket}
              alt={formInput.nama_paket}
              width={600}
              height={600}
              className="object-cover rounded-lg w-full"
            />
          </div>
        )}

        {/* Display Hotel Image */}
        {formInput.hotel?.gambar_hotel && (
          <div className="mb-4">
            <Typography variant="h6" className="font-semibold mb-2">
              Gambar Hotel:
            </Typography>
            <Image
              src={formInput.hotel.gambar_hotel}
              alt={formInput.hotel.nama_hotel}
              width={600}
              height={600}
              className="object-cover rounded-lg w-full"
            />
          </div>
        )}

        {/* Display Kendaraan Image */}
        {formInput.kendaraan?.gambar_kendaraan && (
          <div className="mb-4">
            <Typography variant="h6" className="font-semibold mb-2">
              Gambar Kendaraan:
            </Typography>
            <Image
              src={formInput.kendaraan.gambar_kendaraan}
              alt={formInput.kendaraan.nama_kendaraan}
              width={600}
              height={600}
              className="object-cover rounded-lg w-full"
            />
          </div>
        )}

        {/* Display Wisata Image */}
        {formInput.wisata?.gambar_wisata && (
          <div className="mb-4">
            <Typography variant="h6" className="font-semibold mb-2">
              Gambar Wisata:
            </Typography>
            <Image
              src={formInput.wisata.gambar_wisata}
              alt={formInput.wisata.nama_wisata}
              width={600}
              height={600}
              className="object-cover rounded-lg w-full"
            />
          </div>
        )}

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

          {/* Dropdown Wisata */}
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
            {errors.id_wisata && (
              <FormHelperText>{errors.id_wisata}</FormHelperText>
            )}
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

export default AuthPage(DetailPaketWisataPage);
