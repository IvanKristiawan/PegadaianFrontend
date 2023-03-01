import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahMarketing = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeMarketing, setKodeMarketing] = useState("");
  const [namaMarketing, setNamaMarketing] = useState("");
  const [teleponMarketing, setTeleponMarketing] = useState("");
  const [kodeCabang, setKodeCabang] = useState("");

  const [cabangs, setCabangs] = useState([]);
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
    getMarketingById();
    getCabangsData();
  }, []);

  const getMarketingById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/marketings/${id}`, {
      _id: user.id,
      token: user.token
    });
    setKodeMarketing(response.data.kodeMarketing);
    setNamaMarketing(response.data.namaMarketing);
    setTeleponMarketing(response.data.teleponMarketing);
    setKodeCabang(response.data.cabang.id);
    setLoading(false);
  };

  const getCabangsData = async (kodeUnit) => {
    const response = await axios.post(`${tempUrl}/cabangs`, {
      _id: user.id,
      token: user.token
    });
    setCabangs(response.data);
  };

  const updateMarketing = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updateMarketing/${id}`, {
            kodeMarketing,
            namaMarketing,
            teleponMarketing,
            kodeCabang,
            userIdUpdate: user.id,
            _id: user.id,
            token: user.token
          });
          setLoading(false);
          navigate(`/marketing/${id}`);
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
      <h3>Marketing</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Marketing</h5>
      <hr />
      <Card>
        <Card.Header>Marketing</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateMarketing}>
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
                      value={kodeMarketing}
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
                      value={namaMarketing}
                      onChange={(e) =>
                        setNamaMarketing(e.target.value.toUpperCase())
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
                    Telepon :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      type="number"
                      value={teleponMarketing}
                      onChange={(e) =>
                        setTeleponMarketing(e.target.value.toUpperCase())
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
            <Box>
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

export default UbahMarketing;

const alertBox = {
  width: "100%"
};
