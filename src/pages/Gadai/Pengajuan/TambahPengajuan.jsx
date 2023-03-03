import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahPengajuan = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [noAju, setNoAju] = useState("");
  const [tanggalAju, setTanggalAju] = useState(new Date());
  const [jenisResikoAju, setJenisResikoAju] = useState("");
  const [ketResikoAju, setKetResikoAju] = useState("");
  const [bungaPerBulanAju, setBungaPerBulanAju] = useState(0);
  const [pinjamanAju, setPinjamanAju] = useState(0);
  const [biayaAdmAju, setBiayaAdmAju] = useState(0);

  const [cifCustomer, setCifCustomer] = useState("");
  const [kodeCOA, setKodeCOA] = useState("");
  const [kodeMarketing, setKodeMarketing] = useState("");
  const [namaJenis, setNamaJenis] = useState("");
  const [kodeCabang, setKodeCabang] = useState("");

  const [customers, setCustomers] = useState([]);
  const [coas, setCoas] = useState([]);
  const [marketings, setMarketings] = useState([]);
  const [jenisJaminans, setJenisJaminans] = useState([]);
  const [cabangs, setCabangs] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getCustomersData();
    getCoasData();
    getMarketingsData();
    getJenisJaminansData();
    getCabangsData();
    getPengajuanNextKode();
  }, []);

  const getCustomersData = async (kodeUnit) => {
    setCifCustomer("");
    const response = await axios.post(`${tempUrl}/customersPerCabang`, {
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setCoas(response.data);
    setCifCustomer(response.data[0].cifCustomer);
  };

  const getCoasData = async (kodeUnit) => {
    setKodeCOA("");
    const response = await axios.post(`${tempUrl}/COAs`, {
      _id: user.id,
      token: user.token
    });
    setCustomers(response.data);
    setKodeCOA(response.data[0].kodeCOA);
  };

  const getMarketingsData = async (kodeUnit) => {
    setKodeMarketing("");
    const response = await axios.post(`${tempUrl}/marketings`, {
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setMarketings(response.data);
    setKodeMarketing(response.data[0].kodeMarketing);
  };

  const getJenisJaminansData = async (kodeUnit) => {
    setNamaJenis("");
    const response = await axios.post(`${tempUrl}/jenisJaminans`, {
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setJenisJaminans(response.data);
    setNamaJenis(response.data[0].namaJenis);
  };

  const getCabangsData = async (kodeUnit) => {
    setKodeCabang("");
    const response = await axios.post(`${tempUrl}/cabangs`, {
      _id: user.id,
      token: user.token
    });
    setCabangs(response.data);
    if (user.tipeUser === "OWNER") {
      setKodeCabang(response.data[0].id);
    } else {
      setKodeCabang(user.cabang.id);
    }
  };

  const getPengajuanNextKode = async () => {
    const response = await axios.post(`${tempUrl}/pengajuanNextKode`, {
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setNoAju(response.data);
  };

  const savePengajuan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/savePengajuan`, {
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

          kodeCabang,
          userIdInput: user.id,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate("/pengajuan");
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
      <h5 style={{ fontWeight: 400 }}>Tambah Pengajuan</h5>
      <hr />
      <Card>
        <Card.Header>Data Nasabah</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={savePengajuan}>
            <Row>
              <Col sm={4}>
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
              <Col sm={2}>
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
                    Kel. / Desa :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control required value={noAju} disabled readOnly />
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
                    Telepon :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      type="number"
                      value={jenisResikoAju}
                      onChange={(e) =>
                        setJenisResikoAju(e.target.value.toUpperCase())
                      }
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
                  <Form.Label column sm="3" style={textRight}>
                    Cabang :
                  </Form.Label>
                  <Col sm="9">
                    {user.tipeUser === "OWNER" ? (
                      <Form.Select
                        required
                        value={kodeCabang}
                        onChange={(e) => {
                          setKodeCabang(e.target.value);
                        }}
                      >
                        {cabangs.map((cabang, index) => (
                          <option value={cabang.id}>
                            {cabang.id} - {cabang.namaCabang}
                          </option>
                        ))}
                      </Form.Select>
                    ) : (
                      <Form.Control
                        required
                        value={kodeCabang}
                        disabled
                        readOnly
                      />
                    )}
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/marketing")}
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
          </Form>
        </Card.Body>
      </Card>
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Data belum terisi semua!
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
};

export default TambahPengajuan;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};
