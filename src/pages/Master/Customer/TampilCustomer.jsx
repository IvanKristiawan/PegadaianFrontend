import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableCustomer } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import { SearchBar, Loader, usePagination } from "../../../components";
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

const TampilCustomer = () => {
  const tableRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [cif, setCif] = useState("");
  const [nikCustomer, setNikCustomer] = useState("");
  const [namaCustomer, setNamaCustomer] = useState("");
  const [tempatLahirCustomer, setTempatLahirCustomer] = useState("");
  const [tanggalLahirCustomer, setTanggalLahirCustomer] = useState("");
  const [jenisKelaminCustomer, setJenisKelaminCustomer] = useState("");
  const [noTeleponCustomer, setNoTeleponCustomer] = useState("");
  const [alamatCustomer, setAlamatCustomer] = useState("");
  const [kodeProvinsi, setKodeProvinsi] = useState("");
  const [kodeKabupaten, setKodeKabupaten] = useState("");
  const [kodeKecamatan, setKodeKecamatan] = useState("");
  const [kodeKelurahan, setKodeKelurahan] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [statusPerkawinanCustomer, setStatusPerkawinanCustomer] = useState("");
  const [pekerjaanCustomer, setPekerjaanCustomer] = useState("");
  const [kewarganegaraanCustomer, setKewarganegaraanCustomer] = useState("");

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState([]);
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
  const tempPosts = customers.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.namaCustomer.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.alamatCustomer.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.noTeleponCustomer.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(customers, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getCustomers();
    id && getCustomerById();
  }, [id]);

  const getCustomers = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/customersPerCabang`, {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id
      });
      setCustomers(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getCustomerById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/customers/${id}`, {
        _id: user.id,
        token: user.token
      });
      setCif(response.data.id);
      setNikCustomer(response.data.nikCustomer);
      setNamaCustomer(response.data.namaCustomer);
      setTempatLahirCustomer(response.data.tempatLahirCustomer);
      setTanggalLahirCustomer(response.data.tanggalLahirCustomer);
      setJenisKelaminCustomer(response.data.jenisKelaminCustomer);
      setNoTeleponCustomer(response.data.noTeleponCustomer);
      setAlamatCustomer(response.data.alamatCustomer);
      setKodeProvinsi(response.data.provinsis.namaProvinsi);
      setKodeKabupaten(response.data.kabupaten.namaKabupaten);
      setKodeKecamatan(response.data.kecamatan.namaKecamatan);
      setKodeKelurahan(response.data.kelurahan.namaKelurahan);
      setKodePos(response.data.kelurahan.kodePos);
      setStatusPerkawinanCustomer(response.data.statusPerkawinanCustomer);
      setPekerjaanCustomer(response.data.pekerjaanCustomer);
      setKewarganegaraanCustomer(response.data.kewarganegaraanCustomer);
    }
  };

  const deleteCustomer = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteCustomer/${id}`, {
        _id: user.id,
        token: user.token
      });
      getCustomers();
      setNikCustomer("");
      setCif("");
      setNamaCustomer("");
      setTempatLahirCustomer("");
      setTanggalLahirCustomer("");
      setJenisKelaminCustomer("");
      setNoTeleponCustomer("");
      setAlamatCustomer("");
      setKodeProvinsi("");
      setKodeKabupaten("");
      setKodeKecamatan("");
      setKodeKelurahan("");
      setKodePos("");
      setStatusPerkawinanCustomer("");
      setPekerjaanCustomer("");
      setKewarganegaraanCustomer("");
      navigate("/customer");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${cif} tidak bisa dihapus karena sudah ada data!`);
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
    doc.text(`Daftar Customer`, 90, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.nikCustomer} | Tanggal : ${current_date} | Jam : ${current_time}`,
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
    doc.save("daftarCustomer.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Customer",
    sheet: "daftarCustomer"
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
      <h3>Customer</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar Customer</h5>
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
                <th>Nama</th>
                <th>Alamat</th>
                <th>No. Telp</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.namaCustomer}</td>
                  <td>{user.alamatCustomer}</td>
                  <td>{user.noTeleponCustomer}</td>
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
                <th>Nama</th>
                <th>Alamat</th>
                <th>No. Telp</th>
              </tr>
              {customers.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.namaCustomer}</td>
                  <td>{user.alamatCustomer}</td>
                  <td>{user.noTeleponCustomer}</td>
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
            navigate(`/customer/tambahCustomer`);
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
                  navigate(`/customer/${id}/edit`);
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
                  {`Yakin ingin menghapus data ${cif}?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => deleteCustomer(id)}>Ok</Button>
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
                  <Form.Label column sm="4" style={textRight}>
                    CIF :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={cif} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Kel. / Desa :
                  </Form.Label>
                  <Col sm="8">
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
                  <Form.Label column sm="4" style={textRight}>
                    NIK :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={nikCustomer} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Kecamatan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={kodeKecamatan} disabled readOnly />
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
                  <Form.Label column sm="4" style={textRight}>
                    Nama :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={namaCustomer} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Kabupaten / Kota :
                  </Form.Label>
                  <Col sm="8">
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
                  <Form.Label column sm="4" style={textRight}>
                    Tempat Lahir :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={tempatLahirCustomer}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Provinsi :
                  </Form.Label>
                  <Col sm="8">
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
                  <Form.Label column sm="4" style={textRight}>
                    Tgl. Lahir :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={tanggalLahirCustomer}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Kode POS :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={kodePos} disabled readOnly />
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
                  <Form.Label column sm="4" style={textRight}>
                    Jenis Kelamin :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={jenisKelaminCustomer}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Status Perkawinan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={statusPerkawinanCustomer}
                      disabled
                      readOnly
                    />
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
                  <Form.Label column sm="4" style={textRight}>
                    No. Telp / HP :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={noTeleponCustomer} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Pekerjaan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={pekerjaanCustomer} disabled readOnly />
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
                  <Form.Label column sm="4" style={textRight}>
                    Alamat :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={alamatCustomer} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Kewarganegaraan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={kewarganegaraanCustomer}
                      disabled
                      readOnly
                    />
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
        <ShowTableCustomer
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

export default TampilCustomer;

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
