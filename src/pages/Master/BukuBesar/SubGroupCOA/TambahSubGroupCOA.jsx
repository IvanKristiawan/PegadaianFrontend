import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahSubGroupCOA = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeSubGroupCOA, setKodeSubGroupCOA] = useState("");
  const [namaSubGroupCOA, setNamaSubGroupCOA] = useState("");
  const [kodeGroupCOA, setKodeGroupCOA] = useState("");

  const [groupCOAs, setGroupCOAs] = useState([]);
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
    getGroupCOAData();
  }, []);

  const getGroupCOAData = async () => {
    setKodeGroupCOA("");
    const response = await axios.post(`${tempUrl}/groupCOAs`, {
      _id: user.id,
      token: user.token
    });
    setGroupCOAs(response.data);
    setKodeGroupCOA(response.data[0].kodeGroupCOA);
    const groupCOANextKode = await axios.post(
      `${tempUrl}/subGroupCOAsNextKode`,
      {
        kodeGroupCOA: response.data[0].kodeGroupCOA,
        _id: user.id,
        token: user.token
      }
    );
    setKodeSubGroupCOA(groupCOANextKode.data);
  };

  const getSubGroupCOANextKode = async (kodeGroupCOA) => {
    const response = await axios.post(`${tempUrl}/subGroupCOAsNextKode`, {
      kodeGroupCOA,
      _id: user.id,
      token: user.token
    });
    setKodeSubGroupCOA(response.data);
  };

  const saveSubGroupCOA = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveSubGroupCOA`, {
          kodeSubGroupCOA,
          namaSubGroupCOA,
          kodeGroupCOA,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate("/subGroupCoa");
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
      <h5 style={{ fontWeight: 400 }}>Tambah Sub Group COA</h5>
      <hr />
      <Card>
        <Card.Header>Sub Group COA</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveSubGroupCOA}>
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
                    <Form.Select
                      required
                      value={kodeGroupCOA}
                      onChange={(e) => {
                        setKodeGroupCOA(e.target.value);
                        getSubGroupCOANextKode(e.target.value);
                      }}
                    >
                      {groupCOAs.map((groupCOA, index) => (
                        <option value={groupCOA.kodeGroupCOA}>
                          {groupCOA.kodeGroupCOA}
                        </option>
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
                    Kode
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
                    Nama
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={namaSubGroupCOA}
                      onChange={(e) =>
                        setNamaSubGroupCOA(e.target.value.toUpperCase())
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
                onClick={() => navigate("/subGroupCOA")}
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

export default TambahSubGroupCOA;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};
