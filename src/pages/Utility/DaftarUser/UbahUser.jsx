import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Colors } from "../../../constants/styles";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Button,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";

const UbahUser = () => {
  const { screenSize } = useStateContext();
  const { user, setting, dispatch } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeCabang, setKodeCabang] = useState("");
  const [namaPeriode, setNamaPeriode] = useState("");
  const [username, setUsername] = useState("");
  const [usernameLama, setUsernameLama] = useState("");
  const [tipeUser, setTipeUser] = useState("");
  const [kodeKwitansi, setKodeKwitansi] = useState("");
  const [coaKasir, setCoaKasir] = useState("");
  const [password, setPassword] = useState("");

  // Akses Master
  const [jaminan, setJaminan] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [bukuBesar, setBukuBesar] = useState(false);
  const [cabang, setCabang] = useState(false);

  // Akses Utility
  const [profilUser, setProfilUser] = useState(false);
  const [daftarUser, setDaftarUser] = useState(false);
  const [tutupPeriode, setTutupPeriode] = useState(false);
  const [gantiPeriode, setGantiPeriode] = useState(false);

  const [cabangs, setCabangs] = useState([]);
  const [coaSubTunais, setCoaSubTunais] = useState([]);
  const [periodesData, setPeriodesData] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  const [openAlert, setOpenAlert] = useState(false);

  const handleClickOpenAlert = () => {
    setOpenAlert(true);
  };

  const handleCloseAlert = () => {
    setOpenAlert(false);
  };

  const tipeUserOption = ["MANAGER", "ADMIN"];
  const tipeUserOptionOwner = ["OWNER", "MANAGER", "ADMIN"];

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  useEffect(() => {
    getPeriodesData();
    getCabangsData();
    getCoaSubTunai();
    getUserById();
  }, []);

  const getPeriodesData = async () => {
    setLoading(true);
    try {
      const allPeriode = await axios.post(`${tempUrl}/tutupPeriodesAsc`, {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabangId
      });
      setPeriodesData(allPeriode.data);
    } catch (err) {
      alert(err);
    }
    setLoading(false);
  };

  const getCabangsData = async (kodeUnit) => {
    setKodeCabang("");
    const response = await axios.post(`${tempUrl}/cabangs`, {
      _id: user.id,
      token: user.token
    });
    setCabangs(response.data);
  };

  const getCoaSubTunai = async (kodeUnit) => {
    setCoaKasir("");
    const response = await axios.post(`${tempUrl}/COAsSubGroup`, {
      _id: user.id,
      token: user.token,
      kodeSubGroupCOA: setting.subGroupCoaKas
    });
    setCoaSubTunais(response.data);
  };

  const getUserById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/findUser/${id}`, {
      tipeAdmin: user.tipeUser,
      _id: user.id,
      token: user.token
    });
    setUsername(response.data.username);
    setUsernameLama(response.data.username);
    setTipeUser(response.data.tipeUser);
    setNamaPeriode(response.data.tutupPeriode.namaPeriode);
    setKodeKwitansi(response.data.kodeKwitansi);
    setCoaKasir(response.data.coaKasir);
    setKodeCabang(response.data.cabang.id);

    // Akses Master
    setJaminan(response.data.akses.jaminan);
    setMarketing(response.data.akses.marketing);
    setBukuBesar(response.data.akses.bukuBesar);
    setCabang(response.data.akses.cabang);

    // Akses Utility
    setProfilUser(response.data.akses.profilUser);
    setDaftarUser(response.data.akses.daftarUser);
    setTutupPeriode(response.data.akses.tutupPeriode);
    setGantiPeriode(response.data.akses.gantiPeriode);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      setLoading(true);
      try {
        let tempUsername = await axios.post(`${tempUrl}/getUsername`, {
          username,
          _id: user.id,
          token: user.token,
          kodeCabang: user.cabang.id
        });
        let isUsernameNotValid =
          tempUsername.data.length > 0 && username !== usernameLama;
        if (isUsernameNotValid) {
          handleClickOpenAlert();
        } else {
          setLoading(true);
          if (password.length === 0) {
            setPassword(user.password);
          }
          await axios.post(`${tempUrl}/users/${id}`, {
            username,
            tipeUser,
            namaPeriode,
            coaKasir,
            password,
            tipeAdmin: user.tipeUser,
            akses: {
              jaminan,
              marketing,
              bukuBesar,
              cabang,
              tutupPeriode,
              gantiPeriode,
              profilUser,
              daftarUser
            },
            cabangId: kodeCabang,
            _id: user.id,
            token: user.token
          });
          setLoading(false);

          if (user.id === id) {
            dispatch({ type: "LOGOUT" });
            navigate("/");
          } else {
            navigate("/daftarUser");
          }
        }
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
      <h3>User</h3>
      <h5 style={{ fontWeight: 400 }}>Ubah User</h5>
      <Dialog
        open={openAlert}
        onClose={handleCloseAlert}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Data Username Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Username ${username} sudah ada, ganti Username!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlert}>Ok</Button>
        </DialogActions>
      </Dialog>
      <hr />
      <Card>
        <Card.Header>User</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={updateUser}>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="3" style={textRight}>
                    Username
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={username}
                      onChange={(e) =>
                        setUsername(e.target.value.toUpperCase())
                      }
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
                    Kode Kwitansi
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      required
                      value={kodeKwitansi}
                      onChange={(e) =>
                        setKodeKwitansi(e.target.value.toUpperCase())
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
                    Tipe User
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={tipeUser}
                      onChange={(e) => {
                        setTipeUser(e.target.value);
                      }}
                    >
                      {user.tipeUser === "OWNER"
                        ? tipeUserOptionOwner.map((tipeUser) => (
                            <option value={tipeUser}>{tipeUser}</option>
                          ))
                        : tipeUserOption.map((tipeUser) => (
                            <option value={tipeUser}>{tipeUser}</option>
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
                    COA Kasir
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={coaKasir}
                      onChange={(e) => {
                        setCoaKasir(e.target.value);
                      }}
                    >
                      {coaSubTunais.map((coaSubTunai) => (
                        <option value={coaSubTunai.kodeCOA}>
                          {coaSubTunai.kodeCOA}
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
                    Periode
                  </Form.Label>
                  <Col sm="9">
                    <Form.Select
                      required
                      value={namaPeriode}
                      onChange={(e) => {
                        setNamaPeriode(e.target.value);
                      }}
                    >
                      {periodesData.map((periode) => (
                        <option value={periode.namaPeriode}>
                          {periode.namaPeriode}
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
                    Password
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value.toUpperCase())
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
                    Cabang
                  </Form.Label>
                  <Col sm="9">
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
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Container style={{ marginTop: 30 }}>
              <h4>Hak Akses User</h4>
              <Box sx={showDataContainer}>
                <Box sx={showDataWrapper}>
                  <p style={checkboxTitle}>Master</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Jaminan"
                      checked={jaminan}
                      onChange={() => setJaminan(!jaminan)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Marketing"
                      checked={marketing}
                      onChange={() => setMarketing(!marketing)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Buku Besar"
                      checked={bukuBesar}
                      onChange={() => setBukuBesar(!bukuBesar)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Cabang"
                      checked={cabang}
                      onChange={() => setCabang(!cabang)}
                    />
                  </Form>
                </Box>
                <Box sx={[showDataWrapper, secondWrapper]}>
                  <p style={checkboxTitle}>Utility</p>
                  <Form>
                    <Form.Check
                      type="checkbox"
                      label="Profil User"
                      checked={profilUser}
                      onChange={() => setProfilUser(!profilUser)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Daftar User"
                      checked={daftarUser}
                      onChange={() => setDaftarUser(!daftarUser)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Tutup Periode"
                      checked={tutupPeriode}
                      onChange={() => setTutupPeriode(!tutupPeriode)}
                    />
                    <Form.Check
                      type="checkbox"
                      label="Ganti Periode"
                      checked={gantiPeriode}
                      onChange={() => setGantiPeriode(!gantiPeriode)}
                    />
                  </Form>
                </Box>
              </Box>
            </Container>
            <Box sx={spacingTop}>
              <Button
                variant="outlined"
                color="secondary"
                onClick={() => navigate("/daftarUser")}
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

export default UbahUser;

const showDataContainer = {
  mt: 4,
  display: "flex",
  flexDirection: {
    xs: "column",
    sm: "row"
  }
};

const showDataWrapper = {
  display: "flex",
  flex: 1,
  flexDirection: "column",
  maxWidth: {
    md: "40vw"
  }
};

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

const secondWrapper = {
  marginLeft: {
    sm: 4
  },
  marginTop: {
    sm: 0,
    xs: 4
  }
};

const checkboxTitle = {
  marginBottom: 0
};
