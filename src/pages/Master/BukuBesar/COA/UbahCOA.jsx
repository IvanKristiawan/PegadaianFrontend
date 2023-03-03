import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Snackbar, Alert } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahCOA = () => {
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

  const jenisSaldoOption = ["DEBET", "KREDIT"];
  const kasBankOption = ["KAS", "BANK", "NON KAS BANK"];

  useEffect(() => {
    getCOAById();
  }, []);

  const getCOAById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/COAs/${id}`, {
      _id: user.id,
      token: user.token
    });
    setKodeCOA(response.data.kodeCOA);
    setNamaCOA(response.data.namaCOA);
    setJenisSaldo(response.data.jenisSaldo);
    setKasBank(response.data.kasBank);
    setKodeSubGroupCOA(
      `${response.data.subgroupcoa.kodeSubGroupCOA} - ${response.data.subgroupcoa.namaSubGroupCOA}`
    );
    setKodeJenisCOA(
      `${response.data.jeniscoa.kodeJenisCOA} - ${response.data.jeniscoa.namaJenisCOA}`
    );
    setKodeGroupCOA(
      `${response.data.groupcoa.kodeGroupCOA} - ${response.data.groupcoa.namaGroupCOA}`
    );
    setLoading(false);
  };

  const updateCOA = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        try {
          setLoading(true);
          await axios.post(`${tempUrl}/updateCOA/${id}`, {
            namaCOA,
            jenisSaldo,
            kasBank,
            userIdUpdate: user.id,
            _id: user.id,
            token: user.token
          });
          setLoading(false);
          navigate(`/coa/${id}`);
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

  const textRightSmall = {
    textAlign: screenSize >= 650 && "right",
    fontSize: "13px"
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah COA</h5>
      <hr />
      <Card>
        <Card.Header>COA</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateCOA}>
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
                    Group COA :
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
                  <Form.Label column sm="3" style={textRightSmall}>
                    Sub Group COA :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={kodeSubGroupCOA}
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
                    Kode :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control required value={kodeCOA} disabled readOnly />
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
                    Jenis Saldo :
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
            </Row>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Kas / Bank :
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
            <Box>
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

export default UbahCOA;

const alertBox = {
  width: "100%"
};
