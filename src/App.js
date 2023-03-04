// import "./styles.css";
import React, { useContext, useState, useEffect } from "react";
// import { Route, Switch, Redirect } from 'react-router-dom';
import { Routes, Route, Navigate } from "react-router-dom";
// import Login from "./pages/Login/Login";
import "./styles.scss";
import { Sidebar, Footer, ScrollToTop } from "./components";
// import { Link } from "react-router-dom";
// import { Routes, Route, Navigate, BrowserRouter } from "react-router-dom";
// import { ErrorBoundary } from "react-error-boundary";
// import { Colors } from "./constants/styles";
import { AuthContext } from "./contexts/AuthContext";
import { useStateContext } from "./contexts/ContextProvider";
import {
  Login,
  ProfilUser,
  UbahProfilUser,
  DaftarUser,
  TambahUser,
  UbahUser,
  TampilSetting,
  UbahSetting,
  TampilGantiPeriode,
  TampilKategoriJaminan,
  TambahKategoriJaminan,
  UbahKategoriJaminan,
  TampilJenisJaminan,
  TambahJenisJaminan,
  UbahJenisJaminan,
  TampilMarketing,
  TambahMarketing,
  UbahMarketing,
  TampilJenisCOA,
  TambahJenisCOA,
  UbahJenisCOA,
  TampilGroupCOA,
  TambahGroupCOA,
  UbahGroupCOA,
  TampilSubGroupCOA,
  TambahSubGroupCOA,
  UbahSubGroupCOA,
  TampilCOA,
  TambahCOA,
  UbahCOA,
  TampilCabang,
  TambahCabang,
  UbahCabang,
  TampilProvinsi,
  TambahProvinsi,
  UbahProvinsi,
  TampilKabupaten,
  TambahKabupaten,
  UbahKabupaten,
  TampilKecamatan,
  TambahKecamatan,
  UbahKecamatan,
  TampilKelurahan,
  TambahKelurahan,
  UbahKelurahan,
  TampilCustomer,
  TambahCustomer,
  UbahCustomer,
  TampilDaftarPengajuan,
  TambahPengajuan,
  TampilPengajuan,
  UbahPengajuan,
  TambahJaminan,
  TampilJaminan,
  UbahJaminan
} from "./pages/index";
import { FaBars } from "react-icons/fa";

const App = () => {
  const { screenSize, setScreenSize } = useStateContext();
  // const { collapseSidebar } = useProSidebar();
  const { user } = useContext(AuthContext);
  // const [open, setOpen] = useState(true);
  const [collapsed, setCollapsed] = useState(false);
  const [toggled, setToggled] = useState(false);

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed);
  };

  const handleToggleSidebar = (value) => {
    setToggled(value);
  };

  const USERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user) {
      return children;
    }

    return <Navigate to="/login" />;
  };

  const JAMINANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.jaminan) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const MARKETINGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.marketing) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const BUKUBESARRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.bukuBesar) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const AREARoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.area) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const CUSTOMERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.customer) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const CABANGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.cabang) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const PROFILUSERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.profilUser) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const SETTINGRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.setting) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const DAFTARUSERRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.daftarUser) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const TUTUPPERIODERoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.tutupPeriode) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const GANTIPERIODERoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.gantiPeriode) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  const PENGAJUANRoute = ({ children }) => {
    const { user } = useContext(AuthContext);

    if (user.akses.pengajuan) {
      return children;
    }

    return <Navigate to="/unauthorized" />;
  };

  useEffect(() => {
    const handleResize = () => setScreenSize(window.innerWidth);

    window.addEventListener("resize", handleResize);

    handleResize();

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={`app ${toggled ? "toggled" : ""}`}>
      {user && (
        <Sidebar
          collapsed={collapsed}
          toggled={toggled}
          handleToggleSidebar={handleToggleSidebar}
          handleCollapsedChange={handleCollapsedChange}
        />
      )}

      <main>
        <div className="btn-toggle" onClick={() => handleToggleSidebar(true)}>
          <FaBars />
        </div>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          {/* Profil User */}
          <Route
            path="/profilUser"
            element={
              <PROFILUSERRoute>
                <ProfilUser />
              </PROFILUSERRoute>
            }
          />
          <Route
            path="/profilUser/:id/edit"
            element={
              <PROFILUSERRoute>
                <UbahProfilUser />
              </PROFILUSERRoute>
            }
          />
          {/* Daftar User */}
          <Route
            path="/daftarUser"
            element={
              <DAFTARUSERRoute>
                <DaftarUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/:id"
            element={
              <DAFTARUSERRoute>
                <DaftarUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/:id/edit"
            element={
              <DAFTARUSERRoute>
                <UbahUser />
              </DAFTARUSERRoute>
            }
          />
          <Route
            path="/daftarUser/tambahUser"
            element={
              <DAFTARUSERRoute>
                <TambahUser />
              </DAFTARUSERRoute>
            }
          />
          {/* Setting */}
          <Route
            path="/setting"
            element={
              <SETTINGRoute>
                <TampilSetting />
              </SETTINGRoute>
            }
          />
          <Route
            path="/setting/:id/edit"
            element={
              <SETTINGRoute>
                <UbahSetting />
              </SETTINGRoute>
            }
          />
          {/* Ganti Periode */}
          <Route
            path="/gantiPeriode"
            element={
              <GANTIPERIODERoute>
                <TampilGantiPeriode />
              </GANTIPERIODERoute>
            }
          />
          <Route
            path="/gantiPeriode/:id"
            element={
              <GANTIPERIODERoute>
                <TampilGantiPeriode />
              </GANTIPERIODERoute>
            }
          />
          {/* Kategori Jaminan */}
          <Route
            path="/kategoriJaminan"
            element={
              <JAMINANRoute>
                <TampilKategoriJaminan />
              </JAMINANRoute>
            }
          />
          <Route
            path="/kategoriJaminan/:id"
            element={
              <JAMINANRoute>
                <TampilKategoriJaminan />
              </JAMINANRoute>
            }
          />
          <Route
            path="/kategoriJaminan/:id/edit"
            element={
              <JAMINANRoute>
                <UbahKategoriJaminan />
              </JAMINANRoute>
            }
          />
          <Route
            path="/kategoriJaminan/tambahKategoriJaminan"
            element={
              <JAMINANRoute>
                <TambahKategoriJaminan />
              </JAMINANRoute>
            }
          />
          {/* Jenis Jaminan */}
          <Route
            path="/jenisJaminan"
            element={
              <JAMINANRoute>
                <TampilJenisJaminan />
              </JAMINANRoute>
            }
          />
          <Route
            path="/jenisJaminan/:id"
            element={
              <JAMINANRoute>
                <TampilJenisJaminan />
              </JAMINANRoute>
            }
          />
          <Route
            path="/jenisJaminan/tambahJenisJaminan"
            element={
              <JAMINANRoute>
                <TambahJenisJaminan />
              </JAMINANRoute>
            }
          />
          <Route
            path="/jenisJaminan/:id/edit"
            element={
              <JAMINANRoute>
                <UbahJenisJaminan />
              </JAMINANRoute>
            }
          />
          {/* Marketing */}
          <Route
            path="/marketing"
            element={
              <MARKETINGRoute>
                <TampilMarketing />
              </MARKETINGRoute>
            }
          />
          <Route
            path="/marketing/:id"
            element={
              <MARKETINGRoute>
                <TampilMarketing />
              </MARKETINGRoute>
            }
          />
          <Route
            path="/marketing/tambahMarketing"
            element={
              <MARKETINGRoute>
                <TambahMarketing />
              </MARKETINGRoute>
            }
          />
          <Route
            path="/marketing/:id/edit"
            element={
              <MARKETINGRoute>
                <UbahMarketing />
              </MARKETINGRoute>
            }
          />
          {/* Jenis COA */}
          <Route
            path="/jenisCoa"
            element={
              <BUKUBESARRoute>
                <TampilJenisCOA />
              </BUKUBESARRoute>
            }
          />
          <Route
            path="/jenisCoa/:id"
            element={
              <BUKUBESARRoute>
                <TampilJenisCOA />
              </BUKUBESARRoute>
            }
          />
          <Route
            path="/jenisCoa/:id/edit"
            element={
              <BUKUBESARRoute>
                <UbahJenisCOA />
              </BUKUBESARRoute>
            }
          />
          <Route
            path="/jenisCoa/tambahJenisCoa"
            element={
              <BUKUBESARRoute>
                <TambahJenisCOA />
              </BUKUBESARRoute>
            }
          />
          {/* Group COA */}
          <Route
            path="/groupCoa"
            element={
              <BUKUBESARRoute>
                <TampilGroupCOA />
              </BUKUBESARRoute>
            }
          />
          <Route
            path="/groupCoa/:id"
            element={
              <BUKUBESARRoute>
                <TampilGroupCOA />
              </BUKUBESARRoute>
            }
          />
          <Route
            path="/groupCoa/:id/edit"
            element={
              <BUKUBESARRoute>
                <UbahGroupCOA />
              </BUKUBESARRoute>
            }
          />
          <Route
            path="/groupCoa/tambahGroupCoa"
            element={
              <BUKUBESARRoute>
                <TambahGroupCOA />
              </BUKUBESARRoute>
            }
          />
          {/* Sub Group COA */}
          <Route
            path="/subGroupCoa"
            element={
              <BUKUBESARRoute>
                <TampilSubGroupCOA />
              </BUKUBESARRoute>
            }
          />
          <Route
            path="/subGroupCoa/:id"
            element={
              <BUKUBESARRoute>
                <TampilSubGroupCOA />
              </BUKUBESARRoute>
            }
          />
          <Route
            path="/subGroupCoa/:id/edit"
            element={
              <BUKUBESARRoute>
                <UbahSubGroupCOA />
              </BUKUBESARRoute>
            }
          />
          <Route
            path="/subGroupCoa/tambahSubGroupCoa"
            element={
              <BUKUBESARRoute>
                <TambahSubGroupCOA />
              </BUKUBESARRoute>
            }
          />
          {/*  COA */}
          <Route
            path="/coa"
            element={
              <BUKUBESARRoute>
                <TampilCOA />
              </BUKUBESARRoute>
            }
          />
          <Route
            path="/coa/:id"
            element={
              <BUKUBESARRoute>
                <TampilCOA />
              </BUKUBESARRoute>
            }
          />
          <Route
            path="/coa/:id/edit"
            element={
              <BUKUBESARRoute>
                <UbahCOA />
              </BUKUBESARRoute>
            }
          />
          <Route
            path="/coa/tambahCoa"
            element={
              <BUKUBESARRoute>
                <TambahCOA />
              </BUKUBESARRoute>
            }
          />
          {/*  Cabang */}
          <Route
            path="/cabang"
            element={
              <CABANGRoute>
                <TampilCabang />
              </CABANGRoute>
            }
          />
          <Route
            path="/cabang/:id"
            element={
              <CABANGRoute>
                <TampilCabang />
              </CABANGRoute>
            }
          />
          <Route
            path="/cabang/:id/edit"
            element={
              <CABANGRoute>
                <UbahCabang />
              </CABANGRoute>
            }
          />
          <Route
            path="/cabang/tambahCabang"
            element={
              <CABANGRoute>
                <TambahCabang />
              </CABANGRoute>
            }
          />
          {/*  Provinsi */}
          <Route
            path="/provinsi"
            element={
              <AREARoute>
                <TampilProvinsi />
              </AREARoute>
            }
          />
          <Route
            path="/provinsi/:id"
            element={
              <AREARoute>
                <TampilProvinsi />
              </AREARoute>
            }
          />
          <Route
            path="/provinsi/:id/edit"
            element={
              <AREARoute>
                <UbahProvinsi />
              </AREARoute>
            }
          />
          <Route
            path="/provinsi/tambahProvinsi"
            element={
              <AREARoute>
                <TambahProvinsi />
              </AREARoute>
            }
          />
          {/*  Kabupaten */}
          <Route
            path="/kabupaten"
            element={
              <AREARoute>
                <TampilKabupaten />
              </AREARoute>
            }
          />
          <Route
            path="/kabupaten/:id"
            element={
              <AREARoute>
                <TampilKabupaten />
              </AREARoute>
            }
          />
          <Route
            path="/kabupaten/:id/edit"
            element={
              <AREARoute>
                <UbahKabupaten />
              </AREARoute>
            }
          />
          <Route
            path="/kabupaten/tambahKabupaten"
            element={
              <AREARoute>
                <TambahKabupaten />
              </AREARoute>
            }
          />
          {/*  Kecamatan */}
          <Route
            path="/kecamatan"
            element={
              <AREARoute>
                <TampilKecamatan />
              </AREARoute>
            }
          />
          <Route
            path="/kecamatan/:id"
            element={
              <AREARoute>
                <TampilKecamatan />
              </AREARoute>
            }
          />
          <Route
            path="/kecamatan/:id/edit"
            element={
              <AREARoute>
                <UbahKecamatan />
              </AREARoute>
            }
          />
          <Route
            path="/kecamatan/tambahKecamatan"
            element={
              <AREARoute>
                <TambahKecamatan />
              </AREARoute>
            }
          />
          {/*  Kelurahan */}
          <Route
            path="/kelurahan"
            element={
              <AREARoute>
                <TampilKelurahan />
              </AREARoute>
            }
          />
          <Route
            path="/kelurahan/:id"
            element={
              <AREARoute>
                <TampilKelurahan />
              </AREARoute>
            }
          />
          <Route
            path="/kelurahan/:id/edit"
            element={
              <AREARoute>
                <UbahKelurahan />
              </AREARoute>
            }
          />
          <Route
            path="/kelurahan/tambahKelurahan"
            element={
              <AREARoute>
                <TambahKelurahan />
              </AREARoute>
            }
          />
          {/*  Customer */}
          <Route
            path="/customer"
            element={
              <CUSTOMERRoute>
                <TampilCustomer />
              </CUSTOMERRoute>
            }
          />
          <Route
            path="/customer/:id"
            element={
              <CUSTOMERRoute>
                <TampilCustomer />
              </CUSTOMERRoute>
            }
          />
          <Route
            path="/customer/:id/edit"
            element={
              <CUSTOMERRoute>
                <UbahCustomer />
              </CUSTOMERRoute>
            }
          />
          <Route
            path="/customer/tambahCustomer"
            element={
              <CUSTOMERRoute>
                <TambahCustomer />
              </CUSTOMERRoute>
            }
          />
          {/* GADAI */}
          {/* Pengajuan */}
          <Route
            path="/daftarPengajuan"
            element={
              <PENGAJUANRoute>
                <TampilDaftarPengajuan />
              </PENGAJUANRoute>
            }
          />
          <Route
            path="/daftarPengajuan/pengajuan/tambahPengajuan"
            element={
              <PENGAJUANRoute>
                <TambahPengajuan />
              </PENGAJUANRoute>
            }
          />
          <Route
            path="/daftarPengajuan/pengajuan/:id"
            element={
              <PENGAJUANRoute>
                <TampilPengajuan />
              </PENGAJUANRoute>
            }
          />
          <Route
            path="/daftarPengajuan/pengajuan/:id/edit"
            element={
              <PENGAJUANRoute>
                <UbahPengajuan />
              </PENGAJUANRoute>
            }
          />
          <Route
            path="/daftarPengajuan/pengajuan/:id/tambahJaminan"
            element={
              <PENGAJUANRoute>
                <TambahJaminan />
              </PENGAJUANRoute>
            }
          />
          <Route
            path="/daftarPengajuan/pengajuan/:id/:idPinjaman"
            element={
              <PENGAJUANRoute>
                <TampilJaminan />
              </PENGAJUANRoute>
            }
          />
          <Route
            path="/daftarPengajuan/pengajuan/:id/:idPinjaman/edit"
            element={
              <PENGAJUANRoute>
                <UbahJaminan />
              </PENGAJUANRoute>
            }
          />
        </Routes>
        <Footer />
      </main>
    </div>
  );
};

export default App;
