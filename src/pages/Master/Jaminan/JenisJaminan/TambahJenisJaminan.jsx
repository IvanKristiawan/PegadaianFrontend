import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahJenisJaminan = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [namaJenis, setNamaJenis] = useState("");
  const [bungaPerBulanJenis, setBungaPerBulanJenis] = useState("");
  const [namaKategori, setNamaKategori] = useState("");

  const [kategoriJaminans, setKategoriJaminans] = useState([]);
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
    getKategoriJaminansData();
  }, []);

  const getKategoriJaminansData = async (kodeUnit) => {
    setNamaKategori("");
    const response = await axios.post(`${tempUrl}/kategoriJaminans`, {
      _id: user.id,
      token: user.token
    });
    setKategoriJaminans(response.data);
    setNamaKategori(response.data[0].namaKategori);
  };

  const saveJenisJaminan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveJenisJaminan`, {
          namaJenis,
          bungaPerBulanJenis,
          namaKategori,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate("/jenisJaminan");
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
      <h3>Jaminan</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah Jenis Jaminan</h5>
      <hr />
      <Card>
        <Card.Header>Jenis Jaminan</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveJenisJaminan}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Nama
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={namaJenis}
                      onChange={(e) =>
                        setNamaJenis(e.target.value.toUpperCase())
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
                  <Form.Label column sm="3" style={textRight}>
                    Bunga / Bulan
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      type="number"
                      value={bungaPerBulanJenis}
                      onChange={(e) =>
                        setBungaPerBulanJenis(e.target.value.toUpperCase())
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
                    Kategori
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={namaKategori}
                      onChange={(e) => {
                        setNamaKategori(e.target.value);
                      }}
                    >
                      {kategoriJaminans.map((kategoriJaminan, index) => (
                        <option value={kategoriJaminan.namaKategori}>
                          {kategoriJaminan.namaKategori}
                        </option>
                      ))}
                    </Form.Select>
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/jenisJaminan")}
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

export default TambahJenisJaminan;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};