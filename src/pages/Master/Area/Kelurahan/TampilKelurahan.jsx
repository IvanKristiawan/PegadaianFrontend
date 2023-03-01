import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { ShowTableKelurahan } from "../../../../components/ShowTable";
import { FetchErrorHandling } from "../../../../components/FetchErrorHandling";
import { SearchBar, Loader, usePagination } from "../../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Pagination,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TampilKelurahan = () => {
  const tableRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeKelurahan, setKodeKelurahan] = useState("");
  const [namaKelurahan, setNamaKelurahan] = useState("");
  const [kodeProvinsi, setKodeProvinsi] = useState("");
  const [kodeKabupaten, setKodeKabupaten] = useState("");
  const [kodeKecamatan, setKodeKecamatan] = useState("");

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [kelurahans, setKelurahans] = useState([]);
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
  const tempPosts = kelurahans.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.id.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaKelurahan.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.provinsis.id.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.provinsis.namaProvinsi
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.kabupaten.id.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.kabupaten.namaKabupaten
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.kecamatan.id.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.kecamatan.namaKecamatan
        .toUpperCase()
        .includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(kelurahans, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getKelurahans();
    id && getKelurahanById();
  }, [id]);

  const getKelurahans = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/kelurahans`, {
        _id: user.id,
        token: user.token
      });
      setKelurahans(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getKelurahanById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/kelurahans/${id}`, {
        _id: user.id,
        token: user.token
      });
      setKodeKelurahan(response.data.id);
      setNamaKelurahan(response.data.namaKelurahan);
      setKodeProvinsi(
        `${response.data.provinsis.id} - ${response.data.provinsis.namaProvinsi}`
      );
      setKodeKabupaten(
        `${response.data.kabupaten.id} - ${response.data.kabupaten.namaKabupaten}`
      );
      setKodeKecamatan(
        `${response.data.kecamatan.id} - ${response.data.kecamatan.namaKecamatan}`
      );
    }
  };

  const deleteKelurahan = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteKelurahan/${id}`, {
        _id: user.id,
        token: user.token
      });
      getKelurahans();
      setNamaKelurahan("");
      setKodeKelurahan("");
      setKodeProvinsi("");
      setKodeKabupaten("");
      navigate("/kelurahan");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${kodeKelurahan} tidak bisa dihapus karena sudah ada data!`);
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
    doc.text(`${setting.lokasiPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Daftar Kelurahan`, 90, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.namaKelurahan} | Tanggal : ${current_date} | Jam : ${current_time}`,
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
    doc.save("daftarKelurahan.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Kelurahan",
    sheet: "daftarKelurahan"
  });

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <h3>Area</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar Kelurahan</h5>
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
                <th>Kode</th>
                <th>Nama</th>
                <th>Provinsi</th>
                <th>Kabupaten</th>
                <th>Kecamatan</th>
              </tr>
            </thead>
            <tbody>
              {kelurahans.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.namaKelurahan}</td>
                  <td>
                    {user.provinsis.id} - {user.provinsis.namaProvinsi}
                  </td>
                  <td>
                    {user.kabupaten.id} - {user.kabupaten.namaKabupaten}
                  </td>
                  <td>
                    {user.kecamatan.id} - {user.kecamatan.namaKecamatan}
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
                <th>Kode</th>
                <th>Nama</th>
                <th>Provinsi</th>
                <th>Kabupaten</th>
                <th>Kecamatan</th>
              </tr>
              {kelurahans.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.namaKelurahan}</td>
                  <td>
                    {user.provinsis.id} - {user.provinsis.namaProvinsi}
                  </td>
                  <td>
                    {user.kabupaten.id} - {user.kabupaten.namaKabupaten}
                  </td>
                  <td>
                    {user.kecamatan.id} - {user.kecamatan.namaKecamatan}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <Box sx={buttonModifierContainer}>
        <Button
          variant="contained"
          color="success"
          sx={{ bgcolor: "success.light", textTransform: "none" }}
          startIcon={<AddCircleOutlineIcon />}
          size="small"
          onClick={() => {
            navigate(`/kelurahan/tambahKelurahan`);
          }}
        >
          Tambah
        </Button>
        {id && (
          <>
            <ButtonGroup variant="contained">
              <Button
                color="primary"
                startIcon={<EditIcon />}
                sx={{ textTransform: "none" }}
                onClick={() => {
                  navigate(`/kelurahan/${id}/edit`);
                }}
              >
                Ubah
              </Button>
              <Button
                color="error"
                startIcon={<DeleteOutlineIcon />}
                sx={{ textTransform: "none" }}
                onClick={handleClickOpen}
              >
                Hapus
              </Button>
            </ButtonGroup>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{`Hapus Data`}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  {`Yakin ingin menghapus data ${kodeKelurahan}?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => deleteKelurahan(id)}>Ok</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
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
                    Kode :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={kodeKelurahan} disabled readOnly />
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
                    Nama :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={namaKelurahan} disabled readOnly />
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
                    Provinsi :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={kodeProvinsi} disabled readOnly />
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
                    Kabupaten :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={kodeKabupaten} disabled readOnly />
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
                    Kecamatan :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={kodeKecamatan} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      )}
      <hr />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableKelurahan
          currentPosts={currentPosts}
          searchTerm={searchTerm}
        />
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

export default TampilKelurahan;

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
