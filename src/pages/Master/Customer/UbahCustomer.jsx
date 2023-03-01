import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahCustomer = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [cif, setCif] = useState("");
  const [nikCustomer, setNikCustomer] = useState("");
  const [namaCustomer, setNamaCustomer] = useState("");
  const [tempatLahirCustomer, setTempatLahirCustomer] = useState("");
  const [tanggalLahirCustomer, setTanggalLahirCustomer] = useState(new Date());
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

  const [kelurahans, setKelurahans] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const jenisKelaminOption = ["LAKI-LAKI", "PEREMPUAN"];
  const statusPerkawinanOption = ["BELUM MENIKAH", "(JANDA/DUDA)", "MENIKAH"];
  const kewarganegaraanOption = ["WNI", "WNA"];

  useEffect(() => {
    getCustomerById();
    getKelurahansData();
  }, []);

  const getCustomerById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/customers/${id}`, {
      _id: user.id,
      token: user.token
    });
    setCif(response.data.id);
    setNikCustomer(response.data.nikCustomer);
    setNamaCustomer(response.data.namaCustomer);
    setTempatLahirCustomer(response.data.tempatLahirCustomer);
    setTanggalLahirCustomer(new Date(response.data.tanggalLahirCustomer));
    setJenisKelaminCustomer(response.data.jenisKelaminCustomer);
    setNoTeleponCustomer(response.data.noTeleponCustomer);
    setAlamatCustomer(response.data.alamatCustomer);
    setKodeProvinsi(response.data.provinsis.namaProvinsi);
    setKodeKabupaten(response.data.kabupaten.namaKabupaten);
    setKodeKecamatan(response.data.kecamatan.namaKecamatan);
    setKodeKelurahan(response.data.kelurahan.id);
    setKodePos(response.data.kelurahan.kodePos);
    setStatusPerkawinanCustomer(response.data.statusPerkawinanCustomer);
    setPekerjaanCustomer(response.data.pekerjaanCustomer);
    setKewarganegaraanCustomer(response.data.kewarganegaraanCustomer);
    setLoading(false);
  };

  const getKelurahansData = async (kodeUnit) => {
    const response = await axios.post(`${tempUrl}/kelurahans`, {
      _id: user.id,
      token: user.token
    });
    setKelurahans(response.data);
  };

  const findKelurahan = async (kelurahanId) => {
    const response = await axios.post(`${tempUrl}/kelurahans/${kelurahanId}`, {
      _id: user.id,
      token: user.token
    });
    setKodeKelurahan(kelurahanId);
    setKodeProvinsi(
      `${response.data.provinsis.id} - ${response.data.provinsis.namaProvinsi}`
    );
    setKodeKabupaten(
      `${response.data.kabupaten.id} - ${response.data.kabupaten.namaKabupaten}`
    );
    setKodeKecamatan(
      `${response.data.kecamatan.id} - ${response.data.kecamatan.namaKecamatan}`
    );
    setKodePos(response.data.kodePos);
  };

  const updateCustomer = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updateCustomer/${id}`, {
            nikCustomer,
            namaCustomer,
            tempatLahirCustomer,
            tanggalLahirCustomer,
            jenisKelaminCustomer,
            noTeleponCustomer,
            alamatCustomer,
            kelurahanId: kodeKelurahan,
            statusPerkawinanCustomer,
            pekerjaanCustomer,
            kewarganegaraanCustomer,
            userIdUpdate: user.id,
            _id: user.id,
            token: user.token
          });
          setLoading(false);
          navigate(`/customer/${id}`);
        } catch (err) {
          console.log(err);
        }
        setLoading(false);
      } catch (error) {
        alert(error);
      }
      setLoading(false);
    } else {
      setError(true);
      setOpen(!open);
    }
    setValidated(true);
  };

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Customer</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Customer</h5>
      <hr />
      <Card>
        <Card.Header>Customer</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateCustomer}>
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
                    <Form.Control required value={cif} disabled readOnly />
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
                    <Form.Select
                      required
                      value={kodeKelurahan}
                      onChange={(e) => {
                        findKelurahan(e.target.value);
                      }}
                    >
                      {kelurahans.map((kelurahan, index) => (
                        <option value={kelurahan.id}>
                          {kelurahan.id} - {kelurahan.namaKelurahan}
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
                    NIK :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={nikCustomer}
                      onChange={(e) =>
                        setNikCustomer(e.target.value.toUpperCase())
                      }
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
                    <Form.Control
                      required
                      value={kodeKecamatan}
                      readOnly
                      disabled
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
                    Nama :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={namaCustomer}
                      onChange={(e) =>
                        setNamaCustomer(e.target.value.toUpperCase())
                      }
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
                    <Form.Control
                      required
                      value={kodeKabupaten}
                      readOnly
                      disabled
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
                    Tempat Lahir :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={tempatLahirCustomer}
                      onChange={(e) =>
                        setTempatLahirCustomer(e.target.value.toUpperCase())
                      }
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
                    <Form.Control
                      required
                      value={kodeProvinsi}
                      readOnly
                      disabled
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
                    Tgl. Lahir :
                  </Form.Label>
                  <Col sm="8">
                    <DatePicker
                      dateFormat="dd/MM/yyyy"
                      selected={tanggalLahirCustomer}
                      onChange={(date) => setTanggalLahirCustomer(date)}
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
                    <Form.Control required value={kodePos} readOnly disabled />
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
                    <Form.Select
                      required
                      value={jenisKelaminCustomer}
                      onChange={(e) => {
                        setJenisKelaminCustomer(e.target.value);
                      }}
                    >
                      {jenisKelaminOption.map((jenisKelamin) => (
                        <option value={jenisKelamin}>{jenisKelamin}</option>
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
                    Status Perkawinan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Select
                      required
                      value={statusPerkawinanCustomer}
                      onChange={(e) => {
                        setStatusPerkawinanCustomer(e.target.value);
                      }}
                    >
                      {statusPerkawinanOption.map((statusPerkawinan) => (
                        <option value={statusPerkawinan}>
                          {statusPerkawinan}
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
                    No. Telp / HP :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      type="number"
                      value={noTeleponCustomer}
                      onChange={(e) =>
                        setNoTeleponCustomer(e.target.value.toUpperCase())
                      }
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
                    <Form.Control
                      required
                      value={pekerjaanCustomer}
                      onChange={(e) =>
                        setPekerjaanCustomer(e.target.value.toUpperCase())
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
                  <Form.Label column sm="4" style={textRight}>
                    Alamat :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={alamatCustomer}
                      onChange={(e) =>
                        setAlamatCustomer(e.target.value.toUpperCase())
                      }
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
                    Kewarganegaraan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Select
                      required
                      value={kewarganegaraanCustomer}
                      onChange={(e) => {
                        setKewarganegaraanCustomer(e.target.value);
                      }}
                    >
                      {kewarganegaraanOption.map((kewarganegaraan) => (
                        <option value={kewarganegaraan}>
                          {kewarganegaraan}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/customer")}
                sx={{ marginRight: 2 }}
              >
                {"< Kembali"}
              </Button>
              <Button
                variant="contained"
                startIcon={<EditIcon />}
                type="submit"
              >
                Edit
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

export default UbahCustomer;

const alertBox = {
  width: "100%"
};
