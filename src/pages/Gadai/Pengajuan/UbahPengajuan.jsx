import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import { AuthContext } from "../../../contexts/AuthContext";
import { Colors } from "../../../constants/styles";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader, SearchBar } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Alert,
  Button,
  Snackbar,
  Paper,
  Dialog,
  DialogTitle,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: Colors.blue700
    }
  },
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "white",
    borderStyle: "solid"
  }
});

const UbahPengajuan = () => {
  const { screenSize } = useStateContext();
  const { user, setting } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [noAju, setNoAju] = useState("");
  const [tanggalAju, setTanggalAju] = useState(new Date());
  const [jenisResikoAju, setJenisResikoAju] = useState("");
  const [ketResikoAju, setKetResikoAju] = useState("");
  const [noSbg, setNoSbg] = useState("");
  const [tglKontrak, setTglKontrak] = useState("");
  const [tglJtTempo, setTglJtTemp] = useState("");
  const [bungaPerBulanAju, setBungaPerBulanAju] = useState(0);
  const [pinjamanAju, setPinjamanAju] = useState(0);
  const [biayaAdmAju, setBiayaAdmAju] = useState(0);

  const [cifCustomer, setCifCustomer] = useState("");
  const [nikCustomer, setNikCustomer] = useState("");
  const [namaCustomer, setNamaCustomer] = useState("");
  const [tempatLahirCustomer, setTempatLahirCustomer] = useState("");
  const [tanggalLahirCustomer, setTanggalLahirCustomer] = useState("");
  const [jenisKelaminCustomer, setJenisKelaminCustomer] = useState("");
  const [noTeleponCustomer, setNoTeleponCustomer] = useState("");
  const [alamatCustomer, setAlamatCustomer] = useState("");
  const [kodeKelurahan, setKodeKelurahan] = useState("");
  const [kodeKecamatan, setKodeKecamatan] = useState("");
  const [kodeKabupaten, setKodeKabupaten] = useState("");
  const [kodeProvinsi, setKodeProvinsi] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [statusPerkawinanCustomer, setStatusPerkawinanCustomer] = useState("");
  const [pekerjaanCustomer, setPekerjaanCustomer] = useState("");
  const [kewarganegaraanCustomer, setKewarganegaraanCustomer] = useState("");

  const [kodeCOA, setKodeCOA] = useState("");
  const [kodeMarketing, setKodeMarketing] = useState("");
  const [namaJenis, setNamaJenis] = useState("");
  const [bungaPerBulanJenis, setBungaPerBulanJenis] = useState("");

  const [customers, setCustomers] = useState([]);
  const [coas, setCoas] = useState([]);
  const [marketings, setMarketings] = useState([]);
  const [jenisJaminans, setJenisJaminans] = useState([]);
  const [error, setError] = useState(false);
  const [searchTermCustomer, setSearchTermCustomer] = useState("");
  const [openCustomer, setOpenCustomer] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const classes = useStyles();

  const handleClickOpenCustomer = () => {
    setOpenCustomer(true);
  };

  const handleCloseCustomer = () => {
    setOpenCustomer(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const tempPostsCustomer = customers.filter((val) => {
    if (searchTermCustomer === "") {
      return val;
    } else if (
      val.namaCustomer
        .toUpperCase()
        .includes(searchTermCustomer.toUpperCase()) ||
      val.alamatCustomer
        .toUpperCase()
        .includes(searchTermCustomer.toUpperCase()) ||
      val.noTeleponCustomer
        .toUpperCase()
        .includes(searchTermCustomer.toUpperCase())
    ) {
      return val;
    }
  });

  const jenisResikoOption = ["RENDAH", "SEDANG", "TINGGI"];

  useEffect(() => {
    getPengajuanById();
    getCustomersData();
    getCoasData();
    getMarketingsData();
    getJenisJaminansData();
  }, []);

  const getPengajuanById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/pengajuans/${id}`, {
      _id: user.id,
      token: user.token
    });
    setNoAju(response.data.noAju);
    setTanggalAju(new Date(response.data.tanggalAju));
    setJenisResikoAju(response.data.jenisResikoAju);
    setKetResikoAju(response.data.ketResikoAju);
    setNoSbg(response.data.noSbg);
    setTglKontrak(response.data.tglKontrak);
    setTglJtTemp(response.data.tglJtTempo);
    setBungaPerBulanAju(response.data.bungaPerBulanAju);
    setPinjamanAju(response.data.pinjamanAju);
    setBiayaAdmAju(response.data.biayaAdmAju);

    setCifCustomer(response.data.customer.cifCustomer);
    setNikCustomer(response.data.customer.nikCustomer);
    setNamaCustomer(response.data.customer.namaCustomer);
    setTempatLahirCustomer(response.data.customer.tempatLahirCustomer);
    let newTglLahir = new Date(response.data.customer.tanggalLahirCustomer);
    let tempTglLahir = `${newTglLahir.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${(newTglLahir.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${newTglLahir.getFullYear()}`;
    setTanggalLahirCustomer(tempTglLahir);
    setJenisKelaminCustomer(response.data.customer.jenisKelaminCustomer);
    setNoTeleponCustomer(response.data.customer.noTeleponCustomer);
    setAlamatCustomer(response.data.customer.alamatCustomer);

    const findCustomer = await axios.post(
      `${tempUrl}/customers/${response.data.customer.id}`,
      {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id
      }
    );

    setKodeKelurahan(
      `${findCustomer.data.kelurahan.id} - ${findCustomer.data.kelurahan.namaKelurahan}`
    );
    setKodeKecamatan(
      `${findCustomer.data.kecamatan.id} - ${findCustomer.data.kecamatan.namaKecamatan}`
    );
    setKodeKabupaten(
      `${findCustomer.data.kabupaten.id} - ${findCustomer.data.kabupaten.namaKabupaten}`
    );
    setKodeProvinsi(
      `${findCustomer.data.provinsis.id} - ${findCustomer.data.provinsis.namaProvinsi}`
    );
    setKodePos(findCustomer.data.kelurahan.kodePos);

    setStatusPerkawinanCustomer(
      response.data.customer.statusPerkawinanCustomer
    );
    setPekerjaanCustomer(response.data.customer.pekerjaanCustomer);
    setKewarganegaraanCustomer(response.data.customer.kewarganegaraanCustomer);

    setKodeCOA(response.data.coa.kodeCOA);
    setKodeMarketing(response.data.marketing.kodeMarketing);
    setNamaJenis(response.data.jenisjaminan.namaJenis);
    setBungaPerBulanJenis(response.data.jenisjaminan.bungaPerBulanJenis);
    setLoading(false);
  };

  const getCustomersData = async (kodeUnit) => {
    const response = await axios.post(
      `${tempUrl}/customersPerCabangSorByNama`,
      {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id
      }
    );
    setCustomers(response.data);
  };

  const getCoasData = async (kodeUnit) => {
    const response = await axios.post(`${tempUrl}/COAs`, {
      _id: user.id,
      token: user.token
    });
    setCoas(response.data);
  };

  const getMarketingsData = async (kodeUnit) => {
    const response = await axios.post(`${tempUrl}/marketings`, {
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setMarketings(response.data);
  };

  const getJenisJaminansData = async (kodeUnit) => {
    const response = await axios.post(`${tempUrl}/jenisJaminans`, {
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setJenisJaminans(response.data);
  };

  const changeJenisJaminan = async (namaJenis) => {
    const response = await axios.post(`${tempUrl}/jenisJaminanByNama`, {
      namaJenis,
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setNamaJenis(namaJenis);
    setBungaPerBulanJenis(response.data.bungaPerBulanJenis);
  };

  const updatePengajuan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity() && cifCustomer.length !== 0) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/updatePengajuan/${id}`, {
          cifCustomer,
          kodeCOA,
          kodeMarketing,
          namaJenis,

          tanggalAju,
          jenisResikoAju,
          ketResikoAju,
          bungaPerBulanAju,
          pinjamanAju,
          biayaAdmAju,

          kodeCabang: user.cabang.id,
          userIdInput: user.id,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate("/daftarPengajuan");
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    } else {
      setError(true);
      setOpen(!open);
    }
    setValidated(true);
  };

  if (loading) {
    return <Loader />;
  }

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  return (
    <Container>
      <h3>Gadai</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Pengajuan</h5>
      <hr />
      <Form noValidate validated={validated} onSubmit={updatePengajuan}>
        <Card>
          <Card.Header>Data Nasabah</Card.Header>
          <Card.Body>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    No. Pengajuan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control required value={noAju} disabled readOnly />
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
                    <Form.Control
                      required
                      value={kodeKelurahan}
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
                    Tanggal :
                  </Form.Label>
                  <Col sm="8">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={tanggalAju}
                      onChange={(date) => setTanggalAju(date)}
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
                    NIK / CIF :
                  </Form.Label>
                  <Col sm="4">
                    <Form.Control
                      type="number"
                      value={nikCustomer}
                      disabled
                      readOnly
                    />
                  </Col>
                  <Col sm="4">
                    <Form.Control
                      required
                      type="number"
                      value={cifCustomer}
                      readOnly
                      placeholder="Pilih..."
                      onClick={() => handleClickOpenCustomer()}
                      isInvalid={cifCustomer.length === 0 && true}
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
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={alamatCustomer}
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
                    Marketing :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Select
                      required
                      value={kodeMarketing}
                      onChange={(e) => {
                        setKodeMarketing(e.target.value);
                      }}
                    >
                      {marketings.map((marketing, index) => (
                        <option value={marketing.kodeMarketing}>
                          {marketing.kodeMarketing} - {marketing.namaMarketing}
                        </option>
                      ))}
                    </Form.Select>
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
                    Kode Kas :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Select
                      required
                      value={kodeCOA}
                      onChange={(e) => {
                        setKodeCOA(e.target.value);
                      }}
                    >
                      {coas.map((coa, index) => (
                        <option value={coa.kodeCOA}>
                          {coa.kodeCOA} - {coa.namaCOA}
                        </option>
                      ))}
                    </Form.Select>
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
                    Jenis Resiko :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Select
                      required
                      value={jenisResikoAju}
                      onChange={(e) => {
                        setJenisResikoAju(e.target.value);
                      }}
                    >
                      {jenisResikoOption.map((jenisResiko) => (
                        <option value={jenisResiko}>{jenisResiko}</option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}></Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Keterangan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={ketResikoAju}
                      onChange={(e) =>
                        setKetResikoAju(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Card.Header>Data Pinjaman</Card.Header>
          <Card.Body>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    No. SBG :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={noSbg} disabled readOnly />
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
                    Tgl. Kontrak :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={tglKontrak} disabled readOnly />
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
                    Tgl. J. Tempo :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={tglJtTempo} disabled readOnly />
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
                    Jenis Jaminan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Select
                      required
                      value={namaJenis}
                      onChange={(e) => {
                        changeJenisJaminan(e.target.value);
                      }}
                    >
                      {jenisJaminans.map((jenisJaminan) => (
                        <option value={jenisJaminan.namaJenis}>
                          {jenisJaminan.namaJenis}
                        </option>
                      ))}
                    </Form.Select>
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
                    Bunga / Bln (%) :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={`${bungaPerBulanJenis} %`}
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
                    Pinjaman Rp. :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={pinjamanAju}
                      onChange={(e) => setPinjamanAju(e.target.value)}
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
                    Bunga / Bln Rp. :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={`${(bungaPerBulanJenis * pinjamanAju) / 100} %`}
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
                    Bi. Administrasi :
                  </Form.Label>
                  <Col sm="4">
                    <Form.Control
                      value={`${setting.feeAdmGadai} %`}
                      disabled
                      readOnly
                    />
                  </Col>
                  <Col sm="4">
                    <Form.Control
                      value={`${(setting.feeAdmGadai * pinjamanAju) / 100} %`}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate(`/daftarPengajuan/pengajuan/${id}`)}
                sx={{ marginRight: 2 }}
              >
                {"< Kembali"}
              </Button>
              <Button
                variant="contained"
                startIcon={<SaveIcon />}
                type="submit"
              >
                Simpan
              </Button>
            </Box>
          </Card.Body>
        </Card>
      </Form>
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
      <Dialog
        open={openCustomer}
        onClose={handleCloseCustomer}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Pilih Data Customer`}</DialogTitle>
        <DialogActions>
          <Box sx={dialogContainer}>
            <SearchBar setSearchTerm={setSearchTermCustomer} />
            <TableContainer component={Paper} sx={dialogWrapper}>
              <Table aria-label="simple table">
                <TableHead className={classes.root}>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      Nama
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      Alamat
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>
                      No. Telp / HP
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tempPostsCustomer
                    .filter((val) => {
                      if (searchTermCustomer === "") {
                        return val;
                      } else if (
                        val.namaCustomer
                          .toUpperCase()
                          .includes(searchTermCustomer.toUpperCase()) ||
                        val.alamatCustomer
                          .toUpperCase()
                          .includes(searchTermCustomer.toUpperCase()) ||
                        val.noTeleponCustomer
                          .toUpperCase()
                          .includes(searchTermCustomer.toUpperCase())
                      ) {
                        return val;
                      }
                    })
                    .map((user, index) => (
                      <TableRow
                        key={user._id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                          "&:hover": { bgcolor: Colors.grey300 },
                          cursor: "pointer"
                        }}
                        onClick={() => {
                          setCifCustomer(user.cifCustomer);
                          setNikCustomer(user.nikCustomer);
                          setNamaCustomer(user.namaCustomer);
                          setTempatLahirCustomer(user.tempatLahirCustomer);
                          let newTglLahir = new Date(user.tanggalLahirCustomer);
                          let tempTglLahir = `${newTglLahir
                            .getDate()
                            .toLocaleString("en-US", {
                              minimumIntegerDigits: 2,
                              useGrouping: false
                            })}-${(newTglLahir.getMonth() + 1).toLocaleString(
                            "en-US",
                            {
                              minimumIntegerDigits: 2,
                              useGrouping: false
                            }
                          )}-${newTglLahir.getFullYear()}`;
                          setTanggalLahirCustomer(tempTglLahir);
                          setJenisKelaminCustomer(user.jenisKelaminCustomer);
                          setNoTeleponCustomer(user.noTeleponCustomer);
                          setAlamatCustomer(user.alamatCustomer);
                          setKodeKelurahan(
                            `${user.kelurahan.id} - ${user.kelurahan.namaKelurahan}`
                          );
                          setKodeKecamatan(
                            `${user.kecamatan.id} - ${user.kecamatan.namaKecamatan}`
                          );
                          setKodeKabupaten(
                            `${user.kabupaten.id} - ${user.kabupaten.namaKabupaten}`
                          );
                          setKodeProvinsi(
                            `${user.provinsis.id} - ${user.provinsis.namaProvinsi}`
                          );
                          setKodePos(user.kelurahan.kodePos);
                          setStatusPerkawinanCustomer(
                            user.statusPerkawinanCustomer
                          );
                          setPekerjaanCustomer(user.pekerjaanCustomer);
                          setKewarganegaraanCustomer(
                            user.kewarganegaraanCustomer
                          );
                          handleCloseCustomer();
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {user.namaCustomer}
                        </TableCell>
                        <TableCell>{user.alamatCustomer}</TableCell>
                        <TableCell>{user.noTeleponCustomer}</TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default UbahPengajuan;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

const dialogContainer = {
  display: "flex",
  flexDirection: "column",
  padding: 4,
  width: "800px"
};

const dialogWrapper = {
  width: "100%",
  marginTop: 2
};
