import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { Loader } from "../../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Alert, Button, Snackbar } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahJenisCOA = () => {
  const { screenSize } = useStateContext();
  const { user } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeJenisCOA, setKodeJenisCOA] = useState("");
  const [namaJenisCOA, setNamaJenisCOA] = useState("");

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
    getJenisCOANextKode();
  }, []);

  const getJenisCOANextKode = async () => {
    const response = await axios.post(`${tempUrl}/jenisCOAsNextKode`, {
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setKodeJenisCOA(response.data);
  };

  const saveJenisCOA = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        setLoading(true);
        await axios.post(`${tempUrl}/saveJenisCOA`, {
          kodeJenisCOA,
          namaJenisCOA,
          _id: user.id,
          token: user.token
        });
        setLoading(false);
        navigate("/jenisCoa");
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
      <h5 style={{ fontWeight: 400 }}>Tambah Kategori COA</h5>
      <hr />
      <Card>
        <Card.Header>Kategori COA</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveJenisCOA}>
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
                      value={kodeJenisCOA}
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
                  <Form.Label column sm="3" style={textRight}>
                    Nama
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={namaJenisCOA}
                      onChange={(e) =>
                        setNamaJenisCOA(e.target.value.toUpperCase())
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
                onClick={() => navigate("/jenisCoa")}
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

export default TambahJenisCOA;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};
