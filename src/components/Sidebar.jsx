import { useState, useEffect } from "react";
import {
  FaHome,
  FaMap,
  FaClipboardList,
  FaHotel,
  FaCar,
  FaClipboardCheck,
  FaSignOutAlt,
  FaTimes,
  FaHamburger,
} from "react-icons/fa";
import Link from "next/link";
import { GiHamburgerMenu } from "react-icons/gi";
import { MdTravelExplore } from "react-icons/md";
import { useRouter } from "next/router";
import { FaChevronRight } from "react-icons/fa";
import { Button } from "@mui/material";
import { Add, Edit } from "@mui/icons-material";
import Cookies from "js-cookie";

const Sidebar = ({ children, onClick, isSave = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [paths, setPaths] = useState([]);
  const router = useRouter();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (router.isReady) {
      const pathSegments = router.asPath.split("/").filter(Boolean);

      const capitalizedPaths = pathSegments.map((segment) => {
        const formattedSegment = segment
          .replace(/%20/g, " ")
          .replace(/-/g, " ")
          .split("?")[0];
        const words = formattedSegment.split(" ");

        if (words.length > 1) {
          words[1] = words[1].charAt(0).toUpperCase() + words[1].slice(1);
        }

        words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);

        return words.join(" ");
      });

      setPaths(capitalizedPaths);
    }
  }, [router.asPath, router.isReady]);

  return (
    <>
      <button
        onClick={toggleSidebar}
        className="inline-flex items-center p-2 mt-2 ms-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200"
      >
        <GiHamburgerMenu className="w-6 h-6" />
      </button>

      <aside
        className={`fixed top-0 left-0 z-40 w-full h-screen bg-gray-50 transition-transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } sm:translate-x-0 sm:w-64`}
      >
        <div className="h-full px-3 py-4 overflow-y-auto">
          <button
            onClick={toggleSidebar}
            className="absolute top-4 right-4 sm:hidden"
          >
            <FaTimes className="w-6 h-6 text-gray-500" />
          </button>

          <ul className="space-y-2 font-medium">
            <div className="p-2 flex items-center text-teal-500 group gap-2">
              <MdTravelExplore className="w-6 h-6" />
              <h3 className="text-2xl font-semibold whitespace-nowrap">
                Travego
              </h3>
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = router.asPath.toLowerCase().includes(item.href.toLowerCase());
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-lg group ${
                      isActive ? "bg-gray-100 text-gray-900" : "text-gray-900"
                    } hover:bg-gray-100`}
                    onClick={() => {
                      if (item.name === "Logout") {
                        Cookies.remove("token");
                      }
                    }}
                  >
                    <div className={`flex-shrink-0 w-5 h-5 transition duration-75 ${
                      isActive ? "text-gray-900" : "text-gray-500 group-hover:text-gray-900"
                    }`}>
                      {item.icon}
                    </div>
                    <span className="flex-1 ms-3 whitespace-nowrap">
                      {item.name}
                    </span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </aside>

      {isOpen && (
        <div
          onClick={toggleSidebar}
          className="fixed inset-0 z-30 bg-black opacity-50 sm:hidden"
        />
      )}

      <div className="sm:ml-64 p-4 sm:p-8 md:p-12">
        <div className="w-full flex flex-row justify-between">
          <h4 className="text-2xl font-semibold mb-4 flex items-center text-gray-800">
            {paths.map((path, index) => (
              <span key={index} className="flex items-center">
                {path}
                {index < paths.length - 1 && (
                  <FaChevronRight className="mx-2 w-4 h-4" />
                )}
              </span>
            ))}
          </h4>
          {onClick && (
            <Button
              variant="contained"
              color="secondary"
              className="flex items-center gap-2"
              onClick={onClick}
            >
              {isSave ? <Edit /> : <Add />}
              {isSave ? "Simpan" : "Tambah"}
            </Button>
          )}
        </div>
        {children}
      </div>
    </>
  );
};

const NAV_ITEMS = [
  {
    name: "Dashboard",
    href: "/admin/dashboard",
    icon: <FaHome />,
  },
  {
    name: "Wisata",
    href: "/admin/wisata",
    icon: <FaMap />,
  },
  {
    name: "Paket Wisata",
    href: "/admin/paket-wisata",
    icon: <FaClipboardList />,
  },  
  {
    name: "Rumah Makan",
    href: "/admin/rumah-makan",
    icon: <FaHamburger />,
  },
  {
    name: "Kendaraan",
    href: "/admin/kendaraan",
    icon: <FaCar />,
  },
  {
    name: "Transaksi",
    href: "/admin/transaksi",
    icon: <FaClipboardCheck />,
  },
  {
    name: "Logout",
    href: "/admin/login",
    icon: <FaSignOutAlt />,
  },
];

export default Sidebar;
