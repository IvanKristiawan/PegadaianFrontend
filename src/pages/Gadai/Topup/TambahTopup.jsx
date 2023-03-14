import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  DialogContent,
  DialogContentText,
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

const TambahTopup = () => {
  const { screenSize } = useStateContext();
  const { user, dispatch, setting } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [ajuId, setAjuId] = useState("");
  const [noAju, setNoAju] = useState("");
  const [tanggalAju, setTanggalAju] = useState();
  const [jenisResikoAju, setJenisResikoAju] = useState("");
  const [ketResikoAju, setKetResikoAju] = useState("");
  const [noSbg, setNoSbg] = useState("");
  const [tglKontrak, setTglKontrak] = useState("");
  const [tglJtTempo, setTglJtTempo] = useState("");
  const [bungaPerBulanAju, setBungaPerBulanAju] = useState("");
  const [pinjamanAju, setPinjamanAju] = useState("");
  const [bayarPinjamanAju, setBayarPinjamanAju] = useState("");
  const [biayaAdmAju, setBiayaAdmAju] = useState("");

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
  const [lamaJatuhTempo, setLamaJatuhTempo] = useState(0);
  const [sisaSaldo, setSisaSaldo] = useState(0);

  // Topup
  const [noKwitansi, setNoKwitansi] = useState(user.noTerakhir);
  const [nilaiTopup, setNilaiTopup] = useState("");
  const [tglTopup, setTglTopup] = useState(new Date());

  const [pengajuans, setPengajuans] = useState([]);
  const [coas, setCoas] = useState([]);
  const [error, setError] = useState(false);
  const [searchTermPengajuan, setSearchTermPengajuan] = useState("");
  const [openPengajuan, setOpenPengajuan] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [openSaldo, setOpenSaldo] = useState(false);

  const handleClickOpenSaldo = () => {
    setOpenSaldo(true);
  };

  const handleCloseSaldo = () => {
    setOpenSaldo(false);
  };

  const classes = useStyles();

  const handleClickOpenPengajuan = () => {
    setOpenPengajuan(true);
  };

  const handleClosePengajuan = () => {
    setOpenPengajuan(false);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const tempPostsPengajuan = pengajuans.filter((val) => {
    if (searchTermPengajuan === "") {
      return val;
    } else if (
      val.noAju.toUpperCase().includes(searchTermPengajuan.toUpperCase()) ||
      val.tanggalAju
        .toUpperCase()
        .includes(searchTermPengajuan.toUpperCase()) ||
      val.customer.namaCustomer
        .toUpperCase()
        .includes(searchTermPengajuan.toUpperCase())
    ) {
      return val;
    }
  });

  useEffect(() => {
    if (user.tipeUser === "ADMIN") {
      getPengajuansDataAdmin();
    } else {
      getPengajuansDataManager();
    }
    getCoasData();
  }, []);

  const getPengajuansDataManager = async (kodeUnit) => {
    setCifCustomer("");
    const response = await axios.post(`${tempUrl}/pengajuansApproved`, {
      _id: user.id,
      token: user.token
    });
    setPengajuans(response.data);
  };

  const getPengajuansDataAdmin = async (kodeUnit) => {
    setCifCustomer("");
    const response = await axios.post(
      `${tempUrl}/pengajuansPerCabangApproved`,
      {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id
      }
    );
    setPengajuans(response.data);
  };

  const getCoasData = async (kodeUnit) => {
    setKodeCOA("");
    const response = await axios.post(`${tempUrl}/COAs`, {
      _id: user.id,
      token: user.token
    });
    setCoas(response.data);
    setKodeCOA(response.data[0].kodeCOA);
  };

  const saveTopup = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity() && noAju.length !== 0) {
      const findSisaTopup = await axios.post(
        `${tempUrl}/checkTopupPengajuans`,
        {
          noSbg,
          _id: user.id,
          token: user.token,
          kodeCabang: user.cabang.id
        }
      );
      if (findSisaTopup.data > 0) {
        if (findSisaTopup.data < parseInt(nilaiTopup.replace(/,/g, ""))) {
          // Cannot Topup
          setSisaSaldo(findSisaTopup.data);
          handleClickOpenSaldo();
        } else {
          // Can Topup
          setLoading(true);
          try {
            await axios.post(`${tempUrl}/saveTopup`, {
              noKwitansi,
              nilaiTopup: nilaiTopup.replace(/,/g, ""),
              tglTopup,
              biayaAdmAju,
              noSbg,
              kodeCOA,

              kodeCabang: user.cabang.id,
              userIdInput: user.id,
              _id: user.id,
              token: user.token
            });

            // Change noTerakhir User
            const findSetting = await axios.post(`${tempUrl}/lastSetting`, {
              _id: user.id,
              token: user.token,
              kodeCabang: user.cabang.id
            });
            const gantiPeriodeUser = await axios.post(
              `${tempUrl}/updateUserThenLogin/${user.id}`,
              {
                _id: user.id,
                token: user.token,
                kodeCabang: user.cabang.id
              }
            );
            dispatch({
              type: "LOGIN_SUCCESS",
              payload: gantiPeriodeUser.data.details,
              setting: findSetting.data
            });

            navigate("/daftarTopup");
          } catch (err) {
            alert(err);
          }
          setLoading(false);
        }
      } else {
        // Cannot Topup
        setSisaSaldo(0);
        handleClickOpenSaldo();
      }
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
      <h5 style={{ fontWeight: 400 }}>Tambah Topup</h5>
      <hr />
      <Form noValidate validated={validated} onSubmit={saveTopup}>
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
                    <Form.Control
                      required
                      value={noAju}
                      readOnly
                      placeholder="Pilih..."
                      onClick={() => handleClickOpenPengajuan()}
                      isInvalid={noAju.length === 0 && true}
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
                    <Form.Control value={tanggalAju} disabled readOnly />
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
                    <Form.Control value={nikCustomer} disabled readOnly />
                  </Col>
                  <Col sm="4">
                    <Form.Control value={cifCustomer} disabled readOnly />
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
                    <Form.Control value={kodeMarketing} disabled readOnly />
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
                    <Form.Control value={jenisResikoAju} disabled readOnly />
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
                    <Form.Control value={ketResikoAju} disabled readOnly />
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
                    No. Kwitansi :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={noKwitansi} disabled readOnly />
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
                    <Form.Control value={namaJenis} disabled readOnly />
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
                      value={pinjamanAju.toLocaleString()}
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
                    Bayar / Cicilan Rp. :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={bayarPinjamanAju.toLocaleString()}
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
                    Sisa Pinjaman Rp. :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={(pinjamanAju - bayarPinjamanAju).toLocaleString()}
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
                    Tgl. Top-Up :
                  </Form.Label>
                  <Col sm="8">
                    <DatePicker
                      required
                      dateFormat="dd/MM/yyyy"
                      selected={tglTopup}
                      onChange={(date) => setTglTopup(date)}
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
                    Top-UP Rp. :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={nilaiTopup}
                      onChange={(e) => {
                        let tempNum;
                        let isNumNan = isNaN(
                          parseInt(e.target.value.replace(/,/g, ""), 10)
                        );
                        if (isNumNan) {
                          tempNum = "";
                        } else {
                          tempNum = parseInt(
                            e.target.value.replace(/,/g, ""),
                            10
                          ).toLocaleString();
                        }
                        setNilaiTopup(tempNum);
                      }}
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
                    Total Pinjaman Rp. :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={
                        nilaiTopup === ""
                          ? 0
                          : (
                              parseInt(pinjamanAju - bayarPinjamanAju) +
                              parseInt(nilaiTopup.replace(/,/g, ""))
                            ).toLocaleString()
                      }
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
                    Bunga / Bln Rp. :
                  </Form.Label>
                  <Col sm="4">
                    <Form.Control
                      value={`${bungaPerBulanAju} %`}
                      disabled
                      readOnly
                    />
                  </Col>
                  <Col sm="4">
                    <Form.Control
                      value={(
                        (bungaPerBulanAju * pinjamanAju) /
                        100
                      ).toLocaleString()}
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
                      value={`${biayaAdmAju} %`}
                      disabled
                      readOnly
                    />
                  </Col>
                  <Col sm="4">
                    <Form.Control
                      value={(
                        (biayaAdmAju * pinjamanAju) /
                        100
                      ).toLocaleString()}
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
                onClick={() => navigate("/daftarTopup")}
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
        open={openSaldo}
        onClose={handleCloseSaldo}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Tidak Bisa Topup ${noSbg}`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Sisa Saldo : ${sisaSaldo}`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseSaldo}>Cancel</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openPengajuan}
        onClose={handleClosePengajuan}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Pilih Data Pengajuan`}</DialogTitle>
        <DialogActions>
          <Box sx={dialogContainer}>
            <SearchBar setSearchTerm={setSearchTermPengajuan} />
            <TableContainer component={Paper} sx={dialogWrapper}>
              <Table aria-label="simple table">
                <TableHead className={classes.root}>
                  <TableRow>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      No. Aju
                    </TableCell>
                    <TableCell
                      sx={{ fontWeight: "bold" }}
                      className={classes.tableRightBorder}
                    >
                      Tanggal
                    </TableCell>
                    <TableCell sx={{ fontWeight: "bold" }}>Customer</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {tempPostsPengajuan
                    .filter((val) => {
                      if (searchTermPengajuan === "") {
                        return val;
                      } else if (
                        val.noAju
                          .toUpperCase()
                          .includes(searchTermPengajuan.toUpperCase()) ||
                        val.tanggalAju
                          .toUpperCase()
                          .includes(searchTermPengajuan.toUpperCase()) ||
                        val.customer.namaCustomer
                          .toUpperCase()
                          .includes(searchTermPengajuan.toUpperCase())
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
                          setAjuId(user.id);
                          setNoAju(user.noAju);
                          setTanggalAju(user.tanggalAju);
                          setJenisResikoAju(user.jenisResikoAju);
                          setKetResikoAju(user.ketResikoAju);
                          setBungaPerBulanAju(user.bungaPerBulanAju);
                          setPinjamanAju(user.pinjamanAju + user.nilaiTopup);
                          setBayarPinjamanAju(user.bayarPinjamanAju);
                          setBiayaAdmAju(user.biayaAdmAju);
                          setCifCustomer(user.customer.cifCustomer);
                          setNikCustomer(user.customer.nikCustomer);
                          setNamaCustomer(user.customer.namaCustomer);
                          setTempatLahirCustomer(
                            user.customer.tempatLahirCustomer
                          );
                          let newTglLahir = new Date(
                            user.customer.tanggalLahirCustomer
                          );
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
                          setJenisKelaminCustomer(
                            user.customer.jenisKelaminCustomer
                          );
                          setNoTeleponCustomer(user.customer.noTeleponCustomer);
                          setAlamatCustomer(user.customer.alamatCustomer);
                          setKodeKelurahan(
                            `${user.customer.kelurahan.id} - ${user.customer.kelurahan.namaKelurahan}`
                          );
                          setKodeKecamatan(
                            `${user.customer.kecamatan.id} - ${user.customer.kecamatan.namaKecamatan}`
                          );
                          setKodeKabupaten(
                            `${user.customer.kabupaten.id} - ${user.customer.kabupaten.namaKabupaten}`
                          );
                          setKodeProvinsi(
                            `${user.customer.provinsis.id} - ${user.customer.provinsis.namaProvinsi}`
                          );
                          setKodePos(user.customer.kelurahan.kodePos);
                          setStatusPerkawinanCustomer(
                            user.customer.statusPerkawinanCustomer
                          );
                          setPekerjaanCustomer(user.customer.pekerjaanCustomer);
                          setKewarganegaraanCustomer(
                            user.customer.kewarganegaraanCustomer
                          );

                          setKodeMarketing(
                            `${user.marketing.kodeMarketing} - ${user.marketing.namaMarketing}`
                          );
                          setKodeCOA(`${user.coa.kodeCOA}`);
                          setJenisResikoAju(user.jenisResikoAju);
                          setKetResikoAju(user.ketResikoAju);

                          setNamaJenis(user.jenisjaminan.namaJenis);
                          setLamaJatuhTempo(user.jenisjaminan.lamaJatuhTempo);

                          // Approval
                          setNoSbg(user.noSbg);

                          let newTglKontrak = new Date(user.tglKontrak);
                          let tempTglKontrak = `${newTglKontrak
                            .getDate()
                            .toLocaleString("en-US", {
                              minimumIntegerDigits: 2,
                              useGrouping: false
                            })}-${(newTglKontrak.getMonth() + 1).toLocaleString(
                            "en-US",
                            {
                              minimumIntegerDigits: 2,
                              useGrouping: false
                            }
                          )}-${newTglKontrak.getFullYear()}`;
                          setTglKontrak(tempTglKontrak);

                          let newTglJtTempo = new Date(user.tglJtTempo);
                          let tempTglJtTempo = `${newTglJtTempo
                            .getDate()
                            .toLocaleString("en-US", {
                              minimumIntegerDigits: 2,
                              useGrouping: false
                            })}-${(newTglJtTempo.getMonth() + 1).toLocaleString(
                            "en-US",
                            {
                              minimumIntegerDigits: 2,
                              useGrouping: false
                            }
                          )}-${newTglJtTempo.getFullYear()}`;
                          setTglJtTempo(tempTglJtTempo);

                          handleClosePengajuan();
                        }}
                      >
                        <TableCell component="th" scope="row">
                          {user.noAju}
                        </TableCell>
                        <TableCell>{user.tanggalAju}</TableCell>
                        <TableCell>{user.customer.namaCustomer}</TableCell>
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

export default TambahTopup;

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
