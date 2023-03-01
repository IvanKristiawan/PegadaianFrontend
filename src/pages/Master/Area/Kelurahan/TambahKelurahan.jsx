import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahKelurahan = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeKelurahan, setKodeKelurahan] = useState("");
  const [namaKelurahan, setNamaKelurahan] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [kodeProvinsi, setKodeProvinsi] = useState("");
  const [kodeKabupaten, setKodeKabupaten] = useState("");
  const [kodeKecamatan, setKodeKecamatan] = useState("");

  const [kecamatans, setKecamatans] = useState([]);
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
    getKecamatansData();
  }, []);

  const getKecamatansData = async (kodeUnit) => {
    setKodeKecamatan("");
    const response = await axios.post(`${tempUrl}/kecamatans`, {
      _id: user.id,
      token: user.token
    });
    setKecamatans(response.data);
    setKodeKecamatan(response.data[0].id);
    setKodeProvinsi(
      `${response.data[0].provinsis.id} - ${response.data[0].provinsis.namaProvinsi}`
    );
    setKodeKabupaten(
      `${response.data[0].kabupaten.id} - ${response.data[0].kabupaten.namaKabupaten}`
    );
    getKelurahanNextKode(response.data[0].id);
  };

  const getKelurahanNextKode = async (kecamatanId) => {
    const response = await axios.post(`${tempUrl}/kelurahanNextKode`, {
      kecamatanId,
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setKodeKelurahan(response.data);
    const findKecamatan = await axios.post(
      `${tempUrl}/kecamatans/${kecamatanId}`,
      {
        _id: user.id,
        token: user.token
      }
    );
    setKodeProvinsi(
      `${findKecamatan.data.provinsis.id} - ${findKecamatan.data.provinsis.namaProvinsi}`
    );
    setKodeKabupaten(
      `${findKecamatan.data.kabupaten.id} - ${findKecamatan.data.kabupaten.namaKabupaten}`
    );
  };

  const saveKelurahan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveKelurahan`, {
          namaKelurahan,
          kodePos,
          kecamatanId: kodeKecamatan,
          userIdInput: user.id,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate("/kelurahan");
      } catch (error) {
        alert(error.response.data.message);
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
      <h3>Area</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah Kelurahan</h5>
      <hr />
      <Card>
        <Card.Header>Kelurahan</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveKelurahan}>
            <Row>
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
                    Kecamatan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Select
                      required
                      value={kodeKecamatan}
                      onChange={(e) => {
                        setKodeKecamatan(e.target.value);
                        getKelurahanNextKode(e.target.value);
                      }}
                    >
                      {kecamatans.map((kecamatan, index) => (
                        <option value={kecamatan.id}>
                          {kecamatan.id} - {kecamatan.namaKecamatan}
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
                    Kode :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={kodeKelurahan}
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
                      value={namaKelurahan}
                      onChange={(e) =>
                        setNamaKelurahan(e.target.value.toUpperCase())
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
                    Kode Pos :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      type="number"
                      value={kodePos}
                      onChange={(e) => setKodePos(e.target.value.toUpperCase())}
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/kelurahan")}
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

export default TambahKelurahan;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};
