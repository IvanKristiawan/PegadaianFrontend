import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahJenisJaminan = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [namaJenis, setNamaJenis] = useState("");
  const [namaJenisLama, setNamaJenisLama] = useState("");
  const [bungaPerBulanJenis, setBungaPerBulanJenis] = useState("");
  const [namaKategori, setNamaKategori] = useState("");

  const [kategoriJaminans, setKategoriJaminans] = useState([]);
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

  useEffect(() => {
    getJenisJaminanById();
    getKategoriJaminansData();
  }, []);

  const getJenisJaminanById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/jenisJaminans/${id}`, {
      _id: user.id,
      token: user.token
    });
    setNamaJenis(response.data.namaJenis);
    setNamaJenisLama(response.data.namaJenis);
    setBungaPerBulanJenis(response.data.bungaPerBulanJenis);
    setNamaKategori(response.data.kategorijaminan.namaKategori);
    setLoading(false);
  };

  const getKategoriJaminansData = async (kodeUnit) => {
    const response = await axios.post(`${tempUrl}/kategoriJaminans`, {
      _id: user.id,
      token: user.token
    });
    setKategoriJaminans(response.data);
  };

  const updateJenisJaminan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updateJenisJaminan/${id}`, {
            namaJenis,
            namaJenisLama,
            bungaPerBulanJenis,
            namaKategori,
            userIdUpdate: user.id,
            _id: user.id,
            token: user.token
          });
          setLoading(false);
          navigate(`/jenisJaminan/${id}`);
        } catch (error) {
          alert(error.response.data.message);
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

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "14px"
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Jaminan</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Jenis Jaminan</h5>
      <hr />
      <Card>
        <Card.Header>Jenis Jaminan</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateJenisJaminan}>
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
                      value={namaJenis}
                      onChange={(e) =>
                        setNamaJenis(e.target.value.toUpperCase())
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
                  <Form.Label column sm="3" style={textRightSmall}>
                    Bunga / Bulan :
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
                    Kategori :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={namaKategori}
                      onChange={(e) => {
                        setNamaKategori(e.target.value);
                      }}
                    >
                      {kategoriJaminans.map((kategoriJaminan) => (
                        <option value={kategoriJaminan.namaKategori}>
                          {kategoriJaminan.namaKategori}
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
                onClick={() => navigate("/jenisJaminan")}
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

export default UbahJenisJaminan;

const alertBox = {
  width: "100%"
};
