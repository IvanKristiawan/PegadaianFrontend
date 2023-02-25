import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahCOA = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeCOA, setKodeCOA] = useState("");
  const [namaCOA, setNamaCOA] = useState("");
  const [jenisSaldo, setJenisSaldo] = useState("");
  const [kasBank, setKasBank] = useState("");
  const [kodeJenisCOA, setKodeJenisCOA] = useState("");
  const [kodeGroupCOA, setKodeGroupCOA] = useState("");
  const [kodeSubGroupCOA, setKodeSubGroupCOA] = useState("");

  const [subGroupCOAs, setSubGroupCOAs] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const jenisSaldoOption = ["DEBET", "KREDIT"];
  const kasBankOption = ["KAS", "BANK", "NON KAS BANK"];

  useEffect(() => {
    getSubGroupCOAData();
  }, []);

  const getSubGroupCOAData = async () => {
    setKodeSubGroupCOA("");
    const response = await axios.post(`${tempUrl}/subGroupCOAs`, {
      _id: user.id,
      token: user.token
    });
    setSubGroupCOAs(response.data);
    setKodeSubGroupCOA(response.data[0].kodeSubGroupCOA);
    setKodeJenisCOA(
      `${response.data[0].jeniscoa.kodeJenisCOA} - ${response.data[0].jeniscoa.namaJenisCOA}`
    );
    setKodeGroupCOA(
      `${response.data[0].groupcoa.kodeGroupCOA} - ${response.data[0].groupcoa.namaGroupCOA}`
    );
    const COANextKode = await axios.post(`${tempUrl}/COAsNextKode`, {
      kodeSubGroupCOA: response.data[0].kodeSubGroupCOA,
      _id: user.id,
      token: user.token
    });
    setKodeCOA(COANextKode.data);
    setJenisSaldo(jenisSaldoOption[0]);
    setKasBank(kasBankOption[0]);
  };

  const getCOANextKode = async (kodeSubGroupCOA) => {
    const response = await axios.post(`${tempUrl}/COAsNextKode`, {
      kodeSubGroupCOA,
      _id: user.id,
      token: user.token
    });
    setKodeCOA(response.data);
    const findSubGroupCOA = await axios.post(`${tempUrl}/subGroupCOAByKode`, {
      kodeSubGroupCOA,
      _id: user.id,
      token: user.token
    });
    setKodeJenisCOA(
      `${findSubGroupCOA.data.jeniscoa.kodeJenisCOA} - ${findSubGroupCOA.data.jeniscoa.namaJenisCOA}`
    );
    setKodeGroupCOA(
      `${findSubGroupCOA.data.groupcoa.kodeGroupCOA} - ${findSubGroupCOA.data.groupcoa.namaGroupCOA}`
    );
  };

  const saveCOA = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveCOA`, {
          kodeCOA,
          namaCOA,
          jenisSaldo,
          kasBank,
          kodeSubGroupCOA,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate("/coa");
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
      <h5 style={{ fontWeight: 400 }}>Tambah COA</h5>
      <hr />
      <Card>
        <Card.Header>COA</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveCOA}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Jenis COA
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={kodeJenisCOA}
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
                    Group COA
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
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Sub Group COA
                  </Form.Label>
                  <Col sm="8">
                    <Form.Select
                      required
                      value={kodeSubGroupCOA}
                      onChange={(e) => {
                        setKodeSubGroupCOA(e.target.value);
                        getCOANextKode(e.target.value);
                      }}
                    >
                      {subGroupCOAs.map((subGroupCOA, index) => (
                        <option value={subGroupCOA.kodeSubGroupCOA}>
                          {subGroupCOA.kodeSubGroupCOA} -{" "}
                          {subGroupCOA.namaSubGroupCOA}
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
                    Kode
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control required value={kodeCOA} disabled readOnly />
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
                    Nama
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={namaCOA}
                      onChange={(e) => setNamaCOA(e.target.value.toUpperCase())}
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
                    Jenis Saldo
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={jenisSaldo}
                      onChange={(e) => {
                        setJenisSaldo(e.target.value);
                      }}
                    >
                      {jenisSaldoOption.map((jenisSaldo) => (
                        <option value={jenisSaldo}>{jenisSaldo}</option>
                      ))}
                    </Form.Select>
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
                    Kas / Bank
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={kasBank}
                      onChange={(e) => {
                        setKasBank(e.target.value);
                      }}
                    >
                      {kasBankOption.map((kasBank) => (
                        <option value={kasBank}>{kasBank}</option>
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
                onClick={() => navigate("/coa")}
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

export default TambahCOA;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};
