import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahGroupCOA = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeGroupCOA, setKodeGroupCOA] = useState("");
  const [namaGroupCOA, setNamaGroupCOA] = useState("");
  const [kodeJenisCOA, setKodeJenisCOA] = useState("");

  const [jenisCOAs, setJenisCOAs] = useState([]);
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
    getJenisCOAData();
  }, []);

  const getJenisCOAData = async () => {
    setKodeJenisCOA("");
    const response = await axios.post(`${tempUrl}/jenisCOAs`, {
      _id: user.id,
      token: user.token
    });
    setJenisCOAs(response.data);
    setKodeJenisCOA(response.data[0].kodeJenisCOA);
    const groupCOANextKode = await axios.post(`${tempUrl}/groupCOAsNextKode`, {
      kodeJenisCOA: response.data[0].kodeJenisCOA,
      _id: user.id,
      token: user.token
    });
    setKodeGroupCOA(groupCOANextKode.data);
  };

  const getGroupCOANextKode = async (kodeJenisCOA) => {
    const response = await axios.post(`${tempUrl}/groupCOAsNextKode`, {
      kodeJenisCOA,
      _id: user.id,
      token: user.token
    });
    setKodeGroupCOA(response.data);
  };

  const saveGroupCOA = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveGroupCOA`, {
          kodeGroupCOA,
          namaGroupCOA,
          kodeJenisCOA,
          userIdInput: user.id,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate("/groupCoa");
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
      <h3>Buku Besar</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah Group COA</h5>
      <hr />
      <Card>
        <Card.Header>Group COA</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveGroupCOA}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Jenis COA :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={kodeJenisCOA}
                      onChange={(e) => {
                        setKodeJenisCOA(e.target.value);
                        getGroupCOANextKode(e.target.value);
                      }}
                    >
                      {jenisCOAs.map((jenisCOA, index) => (
                        <option value={jenisCOA.kodeJenisCOA}>
                          {jenisCOA.kodeJenisCOA} - {jenisCOA.namaJenisCOA}
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
                      value={kodeGroupCOA}
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
                      value={namaGroupCOA}
                      onChange={(e) =>
                        setNamaGroupCOA(e.target.value.toUpperCase())
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
                onClick={() => navigate("/groupCOA")}
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

export default TambahGroupCOA;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};
