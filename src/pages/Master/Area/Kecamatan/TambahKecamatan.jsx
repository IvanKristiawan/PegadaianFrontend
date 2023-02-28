import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahKecamatan = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeKecamatan, setKodeKecamatan] = useState("");
  const [namaKecamatan, setNamaKecamatan] = useState("");
  const [kodeProvinsi, setKodeProvinsi] = useState("");
  const [kodeKabupaten, setKodeKabupaten] = useState("");

  const [kabupatens, setKabupatens] = useState([]);
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
    getKabupatensData();
  }, []);

  const getKabupatensData = async (kodeUnit) => {
    setKodeKabupaten("");
    const response = await axios.post(`${tempUrl}/kabupatens`, {
      _id: user.id,
      token: user.token
    });
    setKabupatens(response.data);
    setKodeKabupaten(response.data[0].id);
    setKodeProvinsi(
      `${response.data[0].provinsis.id} - ${response.data[0].provinsis.namaProvinsi}`
    );
    getKecamatanNextKode(response.data[0].id);
  };

  const getKecamatanNextKode = async (kabupatenId) => {
    const response = await axios.post(`${tempUrl}/kecamatanNextKode`, {
      kabupatenId,
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setKodeKecamatan(response.data);
    const findKabupaten = await axios.post(
      `${tempUrl}/kabupatens/${kabupatenId}`,
      {
        _id: user.id,
        token: user.token
      }
    );
    setKodeProvinsi(
      `${findKabupaten.data.provinsis.id} - ${findKabupaten.data.provinsis.namaProvinsi}`
    );
  };

  const saveKecamatan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveKecamatan`, {
          namaKecamatan,
          kabupatenId: kodeKabupaten,
          userIdInput: user.id,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate("/kecamatan");
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

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "14px"
  };

  return (
    <Container>
      <h3>Area</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah Kecamatan</h5>
      <hr />
      <Card>
        <Card.Header>Kecamatan</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveKecamatan}>
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
                  <Form.Label column sm="3" style={textRight}>
                    Kabupaten :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={kodeKabupaten}
                      onChange={(e) => {
                        setKodeKabupaten(e.target.value);
                        getKecamatanNextKode(e.target.value);
                      }}
                    >
                      {kabupatens.map((kabupaten, index) => (
                        <option value={kabupaten.id}>
                          {kabupaten.id} - {kabupaten.namaKabupaten}
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
                  <Form.Label column sm="3" style={textRight}>
                    Kode :
                  </Form.Label>
                  <Col sm="9">
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
                  <Form.Label column sm="3" style={textRightSmall}>
                    Nama :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={namaKecamatan}
                      onChange={(e) =>
                        setNamaKecamatan(e.target.value.toUpperCase())
                      }
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/kecamatan")}
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

export default TambahKecamatan;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};
