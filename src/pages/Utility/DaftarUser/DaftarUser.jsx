import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableUser } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Box, Pagination, Button, ButtonGroup } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const DaftarUser = () => {
  const tableRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeCabang, setKodeCabang] = useState("");
  const [username, setUsername] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [periode, setPeriode] = useState("");
  const [kodeKwitansi, setKodeKwitansi] = useState("");
  const [noTerakhir, setNoTerakhir] = useState("");
  const [coaKasir, setCoaKasir] = useState("");

  // Akses Master
  const [jaminan, setJaminan] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [bukuBesar, setBukuBesar] = useState(false);
  const [area, setArea] = useState(false);
  const [customer, setCustomer] = useState(false);
  const [cabang, setCabang] = useState(false);

  // Akses Gadai
  const [pengajuan, setPengajuan] = useState(false);
  const [approval, setApproval] = useState(false);
  const [buktiPencairan, setBuktiPencairan] = useState(false);
  const [topup, setTopup] = useState(false);

  // Akses Utility
  const [profilUser, setProfilUser] = useState(false);
  const [daftarUser, setDaftarUser] = useState(false);
  const [tutupPeriode, setTutupPeriode] = useState(false);
  const [gantiPeriode, setGantiPeriode] = useState(false);
  const [settingAkses, setSettingAkses] = useState(false);

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUser] = useState([]);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = users.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.username.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tipeUser.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tutupperiode.namaPeriode
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.kodeKwitansi.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.noTerakhir.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.cabang.id.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.cabang.namaCabang.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(users, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getUsers();
    id && getUserById();
  }, [id]);

  const getUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/users`, {
        tipeAdmin: user.tipeUser,
        _id: user.id,
        token: user.token
      });
      setUser(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getUserById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/findUser/${id}`, {
        _id: user.id,
        token: user.token
      });
      setUsername(response.data.username);
      setTipeUser(response.data.tipeUser);
      setPeriode(response.data.tutupperiode.namaPeriode);
      setKodeKwitansi(response.data.kodeKwitansi);
      setNoTerakhir(response.data.noTerakhir);
      setKodeCabang(response.data.cabang);
      setCoaKasir(response.data.coaKasir);

      // Akses Gadai
      setPengajuan(response.data.akses.pengajuan);
      setApproval(response.data.akses.approval);
      setBuktiPencairan(response.data.akses.buktiPencairan);
      setTopup(response.data.akses.topup);

      // Akses Master
      setJaminan(response.data.akses.jaminan);
      setMarketing(response.data.akses.marketing);
      setBukuBesar(response.data.akses.bukuBesar);
      setArea(response.data.akses.area);
      setCustomer(response.data.akses.customer);
      setCabang(response.data.akses.cabang);

      // Akses Pengajuan
      setPengajuan(response.data.akses.pengajuan);
      setApproval(response.data.akses.approval);
      setBuktiPencairan(response.data.akses.buktiPencairan);
      setTopup(response.data.akses.topup);

      // Akses Utility
      setProfilUser(response.data.akses.profilUser);
      setDaftarUser(response.data.akses.daftarUser);
      setTutupPeriode(response.data.akses.tutupPeriode);
      setGantiPeriode(response.data.akses.gantiPeriode);
      setSettingAkses(response.data.akses.setting);
    }
  };

  const deleteUser = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/users/deleteUser/${id}`, {
        tipeAdmin: user.tipeUser,
        _id: user.id,
        token: user.token
      });
      getUsers();
      setUsername("");
      setTipeUser("");
      setPeriode("");
      setKodeKwitansi("");
      setNoTerakhir("");
      setKodeCabang("");

      navigate("/daftarUser");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${username} tidak bisa dihapus karena sudah ada data!`);
      }
    }
    setLoading(false);
  };

  const downloadPdf = () => {
    var date = new Date();
    var current_date =
      date.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      (date.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      date.getFullYear();
    var current_time =
      date.getHours().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      ":" +
      date.getMinutes().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      ":" +
      date.getSeconds().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`${setting.alamatPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Daftar User`, 90, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      290
    );
    doc.autoTable({
      html: "#table",
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 45,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save("daftarUser.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Daftar User",
    sheet: "DaftarUser"
  });

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "14px"
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar User</h5>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewPdf(!previewPdf);
              setPreviewExcel(false);
            }}
          >
            PDF
          </Button>
          <Button
            color="secondary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewExcel(!previewExcel);
              setPreviewPdf(false);
            }}
          >
            Excel
          </Button>
        </ButtonGroup>
      </Box>
      {previewPdf && (
        <div>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => downloadPdf()}
          >
            CETAK
          </Button>
          <table class="table" id="table">
            <thead>
              <tr>
                <th>Username</th>
                <th>Tipe User</th>
                <th>Periode</th>
                <th>Kode Kwitansi</th>
                <th>No Terakhir</th>
                <th>Cabang</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.tipeUser}</td>
                  <td>{user.tutupperiode.namaPeriode}</td>
                  <td>{user.kodeKwitansi}</td>
                  <td>{user.noTerakhir}</td>
                  <td>
                    {user.cabang.id} - {user.cabang.namaCabang}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        {previewExcel && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
          >
            EXCEL
          </Button>
        )}
        <table ref={tableRef}>
          {previewExcel && (
            <tbody>
              <tr>
                <th>Username</th>
                <th>Tipe User</th>
                <th>Periode</th>
                <th>Kode Kwitansi</th>
                <th>No Terakhir</th>
                <th>Cabang</th>
              </tr>
              {users.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.username}</td>
                  <td>{user.tipeUser}</td>
                  <td>{user.tutupperiode.namaPeriode}</td>
                  <td>{user.kodeKwitansi}</td>
                  <td>{user.noTerakhir}</td>
                  <td>
                    {user.cabang.id} - {user.cabang.namaCabang}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/daftarUser/tambahUser`}
          editLink={`/daftarUser/${id}/edit`}
          deleteUser={deleteUser}
          nameUser={username}
        />
      </Box>
      {id && (
        <Container>
          <hr />
          <Form>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Username :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={username} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRightSmall}>
                    Kode Kwitansi :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={kodeKwitansi} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Tipe User :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={tipeUser} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    No Terakhir :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={noTerakhir} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Periode :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={periode} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    COA Kasir :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={coaKasir} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Cabang :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={`${kodeCabang.id} - ${kodeCabang.namaCabang}`}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
          {user.tipeUser !== "ADMIN" && (
            <Container style={{ marginTop: 30 }}>
              <h4>Hak Akses User</h4>
              <Box sx={showDataContainer}>
                <Box sx={showDataWrapper}>
                  <p style={checkboxTitle}>Master</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Jaminan"
                      disabled
                      checked={jaminan}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Marketing"
                      disabled
                      checked={marketing}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Buku Besar"
                      disabled
                      checked={bukuBesar}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Area"
                      disabled
                      checked={area}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Customer"
                      disabled
                      checked={customer}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Cabang"
                      disabled
                      checked={cabang}
                    />
                  </Form>
                  <p style={secondCheckboxTitle}>Gadai</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Pengajuan"
                      disabled
                      checked={pengajuan}
                    />
                  </Form>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Approval"
                      disabled
                      checked={approval}
                    />
                  </Form>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Bukti Pencairan"
                      disabled
                      checked={buktiPencairan}
                    />
                  </Form>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Top-Up"
                      disabled
                      checked={topup}
                    />
                  </Form>
                </Box>
                <Box sx={[showDataWrapper, secondWrapper]}>
                  <p style={checkboxTitle}>Utility</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Profil User"
                      disabled
                      checked={profilUser}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Daftar User"
                      disabled
                      checked={daftarUser}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Tutup Periode"
                      disabled
                      checked={tutupPeriode}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Ganti Periode"
                      disabled
                      checked={gantiPeriode}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Setting"
                      disabled
                      checked={settingAkses}
                    />
                  </Form>
                </Box>
              </Box>
            </Container>
          )}
        </Container>
      )}
      <hr />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableUser currentPosts={currentPosts} searchTerm={searchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <Pagination
          count={count}
          page={page}
          onChange={handleChange}
          color="primary"
          size={screenSize <= 600 ? "small" : "large"}
        />
      </Box>
    </Container>
  );
};

export default DaftarUser;

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const showDataContainer = {
  mt: 2,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};

const secondWrapper = {
  marginLeft: {
    sm: 4
  },
  marginTop: {
    sm: 0,
    xs: 2
  }
};

const checkboxTitle = {
  marginBottom: 0
};

const secondCheckboxTitle = {
  marginTop: 15,
  marginBottom: 0
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center"
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center"
};
