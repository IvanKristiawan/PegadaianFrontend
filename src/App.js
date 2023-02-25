// import "./styles.css";
import React, { useContext, useState, useEffect } from "react";
// import { Route, Switch, Redirect } from 'react-router-dom';
import { Routes, Route, Navigate } from "react-router-dom";
import FormInput from "./pages/FormInput";
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
  UbahSubGroupCOA
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
          <Route
            path="/formInput"
            element={
              <USERRoute>
                <FormInput />
              </USERRoute>
            }
          />
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
        </Routes>
        <Footer />
      </main>
    </div>
  );
};

export default App;
