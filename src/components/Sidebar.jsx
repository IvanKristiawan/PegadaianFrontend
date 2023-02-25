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
  FaTachometerAlt,
  FaGem,
  FaBook,
  FaUserCog,
  FaSignOutAlt
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
            <MenuItem>
              Marketing <NavLink to="/marketing" />
            </MenuItem>
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
          </SubMenu>
          <SubMenu title={"Utility"} icon={<FaUserCog />}>
            <MenuItem>
              Profil User <NavLink to="/profilUser" />
            </MenuItem>
            <MenuItem>
              Daftar User <NavLink to="/daftarUser" />
            </MenuItem>
            <MenuItem>
              Tutup Periode
              <NavLink to="/tutupPeriode" />
            </MenuItem>
            <MenuItem>
              Ganti Periode <NavLink to="/gantiPeriode" />
            </MenuItem>
          </SubMenu>

          <MenuItem
            icon={<FaTachometerAlt />}
            suffix={<span className="badge red">NEW</span>}
          >
            Form Input
            <NavLink to="/formInput" />
          </MenuItem>
          <MenuItem icon={<FaGem />}>
            Login <Link to="/login" />
          </MenuItem>
        </Menu>
      </SidebarContent>
      {/* Footer */}
      <SidebarFooter style={{ textAlign: "center" }}>
        <div className="sidebar-btn-wrapper" style={{ padding: "20px" }}>
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
