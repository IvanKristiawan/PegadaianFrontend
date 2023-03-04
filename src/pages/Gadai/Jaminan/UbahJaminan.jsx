import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahJaminan = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [ketJam, setKetJam] = useState("");
  const [hargaTafsirJam, setHargaTafsirJam] = useState("");

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id, idJaminan } = useParams();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getJaminanById();
  }, []);

  const getJaminanById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/jaminans/${idJaminan}`, {
      _id: user.id,
      token: user.token
    });
    setKetJam(response.data.ketJam);
    setHargaTafsirJam(response.data.hargaTafsirJam.toLocaleString());
    setLoading(false);
  };

  const updateJaminan = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updateJaminan/${idJaminan}`, {
            ketJam,
            hargaTafsirJam: hargaTafsirJam.replace(/,/g, ""),
            userIdUpdate: user.id,
            _id: user.id,
            token: user.token
          });
          setLoading(false);
          navigate(`/daftarPengajuan/pengajuan/${id}/${idJaminan}`);
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
      <h3>Gadai</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah Pinjaman</h5>
      <hr />
      <Card>
        <Card.Header>Pinjaman</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateJaminan}>
            <Row>
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
                    <Form.Control
                      required
                      value={ketJam}
                      onChange={(e) => setKetJam(e.target.value.toUpperCase())}
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
                    Harga Tafsiran Rp. :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={hargaTafsirJam}
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
                        setHargaTafsirJam(tempNum);
                      }}
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() =>
                  navigate(`/daftarPengajuan/pengajuan/${id}/${idJaminan}`)
                }
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

export default UbahJaminan;

const alertBox = {
  width: "100%"
};
