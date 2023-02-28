import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahKabupaten = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeKabupaten, setKodeKabupaten] = useState("");
  const [namaKabupaten, setNamaKabupaten] = useState("");
  const [kodeProvinsi, setKodeProvinsi] = useState("");

  const [provinsis, setProvinsis] = useState([]);
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
    getProvinsiData();
  }, []);

  const getProvinsiData = async (kodeUnit) => {
    setKodeProvinsi("");
    const response = await axios.post(`${tempUrl}/provinsis`, {
      _id: user.id,
      token: user.token
    });
    setProvinsis(response.data);
    setKodeProvinsi(response.data[0].id);
    getKabupatenNextKode(response.data[0].id);
  };

  const getKabupatenNextKode = async (provinsiId) => {
    const response = await axios.post(`${tempUrl}/kabupatenNextKode`, {
      provinsiId,
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setKodeKabupaten(response.data);
  };

  const saveKabupaten = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveKabupaten`, {
          kodeKabupaten,
          namaKabupaten,
          provinsiId: kodeProvinsi,
          userIdInput: user.id,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate("/kabupaten");
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
      <h5 style={{ fontWeight: 400 }}>Tambah Kabupaten</h5>
      <hr />
      <Card>
        <Card.Header>Kabupaten</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveKabupaten}>
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
                    <Form.Select
                      required
                      value={kodeProvinsi}
                      onChange={(e) => {
                        setKodeProvinsi(e.target.value);
                        getKabupatenNextKode(e.target.value);
                      }}
                    >
                      {provinsis.map((provinsi, index) => (
                        <option value={provinsi.id}>
                          {provinsi.id} - {provinsi.namaProvinsi}
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
                      value={kodeKabupaten}
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
                  <Form.Label column sm="3" style={textRight}>
                    Nama :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={namaKabupaten}
                      onChange={(e) =>
                        setNamaKabupaten(e.target.value.toUpperCase())
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
                onClick={() => navigate("/kabupaten")}
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

export default TambahKabupaten;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};
