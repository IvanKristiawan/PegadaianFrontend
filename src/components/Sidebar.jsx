import React, { useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import {
  ProSidebar,
  Menu,
  MenuItem,
  SubMenu,
  SidebarHeader,
  SidebarFooter,
  SidebarContent
} from "react-pro-sidebar";
import {
  FaAngleDoubleLeft,
  FaAngleDoubleRight,
  FaBook,
  FaUserCog,
  FaSignOutAlt,
  FaChartArea
} from "react-icons/fa";

const Sidebar = ({
  image,
  collapsed,
  toggled,
  handleToggleSidebar,
  handleCollapsedChange
}) => {
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const logoutButtonHandler = async (e) => {
    e.preventDefault();
    dispatch({ type: "LOGOUT" });
    navigate("/");
  };

  return (
    <ProSidebar
      collapsed={collapsed}
      toggled={toggled}
      onToggle={handleToggleSidebar}
      breakPoint="md"
    >
      {/* Header */}
      <SidebarHeader>
        <Menu iconShape="circle">
          {collapsed ? (
            <MenuItem
              icon={<FaAngleDoubleRight />}
              onClick={handleCollapsedChange}
            ></MenuItem>
          ) : (
            <MenuItem
              suffix={<FaAngleDoubleLeft />}
              onClick={handleCollapsedChange}
            >
              <div
                style={{
                  padding: "9px",
                  textTransform: "uppercase",
                  fontWeight: "bold",
                  fontSize: 15,
                  letterSpacing: "1px"
                }}
              >
                Gadai TechKu
              </div>
            </MenuItem>
          )}
        </Menu>
      </SidebarHeader>
      {/* Content */}
      <SidebarContent>
        <Menu iconShape="circle">
          <SubMenu title={"Master"} icon={<FaBook />}>
            {user.akses.jaminan === true && (
              <SubMenu title={"Jaminan"}>
                <MenuItem>
                  Kategori <NavLink to="/kategoriJaminan" />
                </MenuItem>
                <MenuItem>
                  Jenis Jaminan <NavLink to="/jenisJaminan" />
                </MenuItem>
              </SubMenu>
            )}
            {user.akses.marketing === true && (
              <MenuItem>
                Marketing <NavLink to="/marketing" />
              </MenuItem>
            )}
            {user.akses.bukuBesar === true && (
              <SubMenu title={"Buku Besar"}>
                <MenuItem>
                  Kelompok COA <NavLink to="/jenisCoa" />
                </MenuItem>
                <MenuItem>
                  Group COA <NavLink to="/groupCoa" />
                </MenuItem>
                <MenuItem>
                  SubGroup COA <NavLink to="/subGroupCoa" />
                </MenuItem>
                <MenuItem>
                  COA <NavLink to="/coa" />
                </MenuItem>
              </SubMenu>
            )}
            {user.akses.area === true && (
              <SubMenu title={"Area"}>
                <MenuItem>
                  Kelurahan / Desa <NavLink to="/kelurahan" />
                </MenuItem>
                <MenuItem>
                  Kecamatan <NavLink to="/kecamatan" />
                </MenuItem>
                <MenuItem>
                  Kabupaten / Kota <NavLink to="/kabupaten" />
                </MenuItem>
                <MenuItem>
                  Provinsi <NavLink to="/provinsi" />
                </MenuItem>
              </SubMenu>
            )}
            {user.akses.cabang === true && (
              <MenuItem>
                Cabang <NavLink to="/cabang" />
              </MenuItem>
            )}
          </SubMenu>
          <SubMenu title={"Utility"} icon={<FaUserCog />}>
            {user.akses.profilUser === true && (
              <MenuItem>
                Profil User <NavLink to="/profilUser" />
              </MenuItem>
            )}
            {user.akses.daftarUser === true && (
              <MenuItem>
                Daftar User <NavLink to="/daftarUser" />
              </MenuItem>
            )}
            {user.akses.tutupPeriode === true && (
              <MenuItem>
                Tutup Periode
                <NavLink to="/tutupPeriode" />
              </MenuItem>
            )}
            {user.akses.gantiPeriode === true && (
              <MenuItem>
                Ganti Periode <NavLink to="/gantiPeriode" />
              </MenuItem>
            )}
          </SubMenu>
        </Menu>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter style={{ textAlign: "center" }}>
        <p style={{ fontSize: "12px", marginTop: "10px" }}>{user.username}</p>
        <p style={{ fontSize: "12px", marginTop: "-10px" }}>
          Cabang : {user.cabang.namaCabang}
        </p>
        <div className="sidebar-btn-wrapper" style={{ paddingBottom: "10px" }}>
          <Link
            className="sidebar-btn"
            style={{ cursor: "pointer" }}
            to="/"
            onClick={logoutButtonHandler}
          >
            <span style={{ marginRight: "6px" }}>Logout</span>
            <FaSignOutAlt />
          </Link>
        </div>
      </SidebarFooter>
    </ProSidebar>
  );
};

export default Sidebar;
