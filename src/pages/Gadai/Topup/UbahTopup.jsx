import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahTopup = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [noKwitansi, setNoKwitansi] = useState("");
  const [nilaiTopup, setNilaiTopup] = useState("");
  const [nilaiTopupLama, setNilaiTopupLama] = useState("");
  const [tglTopup, setTglTopup] = useState("");
  const [noSbg, setNoSbg] = useState("");

  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id, idTopup } = useParams();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getTopupById();
  }, []);

  const getTopupById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/topups/${idTopup}`, {
      _id: user.id,
      token: user.token
    });
    setNoKwitansi(response.data.noKwitansi);
    setNilaiTopup(response.data.nilaiTopup.toLocaleString());
    setNilaiTopupLama(response.data.nilaiTopup);

    let newTglTopup = new Date(response.data.tglTopup);
    let tempTglTopup = `${newTglTopup.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${(newTglTopup.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${newTglTopup.getFullYear()}`;
    setTglTopup(tempTglTopup);
    setNoSbg(response.data.pengajuan.noSbg);
    setLoading(false);
  };

  const updateTopup = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updateTopup/${idTopup}`, {
            noSbg,
            nilaiTopupLama,
            nilaiTopup: nilaiTopup.replace(/,/g, ""),
            userIdUpdate: user.id,
            _id: user.id,
            token: user.token
          });
          setLoading(false);
          navigate(`/daftarTopup/topup/${id}/${idTopup}`);
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
      <h5 style={{ fontWeight: 400 }}>Ubah Topup</h5>
      <hr />
      <Card>
        <Card.Header>Topup</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateTopup}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    No. Kwitansi :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={noKwitansi} disabled readOnly />
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
                    Nilai Topup Rp. :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={nilaiTopup}
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
                        setNilaiTopup(tempNum);
                      }}
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
                    Tgl. Topup :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={tglTopup} disabled readOnly />
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
                    No. Sbg :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={noSbg} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Box>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate(`/daftarTopup/topup/${id}/${idTopup}`)}
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

export default UbahTopup;

const alertBox = {
  width: "100%"
};
