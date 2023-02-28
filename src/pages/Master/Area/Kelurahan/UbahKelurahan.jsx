import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahKelurahan = () => {
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
    getKelurahanById();
  }, []);

  const getKelurahanById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/kelurahans/${id}`, {
      _id: user.id,
      token: user.token
    });
    setKodeKelurahan(response.data.id);
    setNamaKelurahan(response.data.namaKelurahan);
    setKodePos(response.data.kodePos);
    setKodeProvinsi(
      `${response.data.provinsis.id} - ${response.data.provinsis.namaProvinsi}`
    );
    setKodeKabupaten(
      `${response.data.kabupaten.id} - ${response.data.kabupaten.namaKabupaten}`
    );
    setKodeKecamatan(
      `${response.data.kecamatan.id} - ${response.data.kecamatan.namaKecamatan}`
    );
    setLoading(false);
  };

  const updateKelurahan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updateKelurahan/${id}`, {
            namaKelurahan,
            kodePos,
            userIdUpdate: user.id,
            _id: user.id,
            token: user.token
          });
          setLoading(false);
          navigate(`/kelurahan/${id}`);
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

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Area</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Kelurahan</h5>
      <hr />
      <Card>
        <Card.Header>Kelurahan</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateKelurahan}>
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
                  <Form.Label column sm="3" style={textRight}>
                    Kecamatan :
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
                  <Form.Label column sm="3" style={textRight}>
                    Kode :
                  </Form.Label>
                  <Col sm="9">
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
                  <Form.Label column sm="3" style={textRight}>
                    Nama :
                  </Form.Label>
                  <Col sm="9">
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
                  <Form.Label column sm="3" style={textRight}>
                    Kode Pos :
                  </Form.Label>
                  <Col sm="9">
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
            <Box>
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

export default UbahKelurahan;

const alertBox = {
  width: "100%"
};
