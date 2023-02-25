import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader } from "../../../components";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Alert,
  Button,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";

const TambahUser = () => {
  const { screenSize } = useStateContext();
  const { user, setting } = useContext(AuthContext);
  const [open, setOpen] = useState(false);
  const [validated, setValidated] = useState(false);
  const [kodeCabang, setKodeCabang] = useState("");
  const [namaPeriode, setNamaPeriode] = useState("");
  const [username, setUsername] = useState("");
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
  const [loading, setLoading] = useState(false);
  const [openAlertUsername, setOpenAlertUsername] = useState(false);
  const [
    openAlertKodeKwitansiCabang,
    setOpenAlertKodeKwitansiCabang
  ] = useState(false);

  const handleClickOpenAlertUsername = () => {
    setOpenAlertUsername(true);
  };

  const handleCloseAlertUsername = () => {
    setOpenAlertUsername(false);
  };

  const handleClickOpenAlertKodeKwitansiCabang = () => {
    setOpenAlertKodeKwitansiCabang(true);
  };

  const handleCloseAlertKodeKwitansiCabang = () => {
    setOpenAlertKodeKwitansiCabang(false);
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
      if (user.tipeUser === "OWN") {
        setTipeUser(tipeUserOption[0]);
      } else {
        setTipeUser(tipeUserOptionOwner[0]);
      }
      setNamaPeriode(allPeriode.data[0].namaPeriode);
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
    setKodeCabang(response.data[0].id);
  };

  const getCoaSubTunai = async (kodeUnit) => {
    setCoaKasir("");
    const response = await axios.post(`${tempUrl}/COAsSubGroup`, {
      _id: user.id,
      token: user.token,
      kodeSubGroupCOA: setting.subGroupCoaKas
    });
    setCoaSubTunais(response.data);
    setCoaKasir(response.data[0].kodeCOA);
  };

  const saveUser = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const form = e.currentTarget;
    if (form.checkValidity()) {
      try {
        let tempUsername = await axios.post(`${tempUrl}/getUsername`, {
          username,
          _id: user.id,
          token: user.token
        });
        let tempKodeKwitansi = await axios.post(`${tempUrl}/getKodeKwitansi`, {
          kodeKwitansi,
          _id: user.id,
          token: user.token,
          kodeCabang
        });
        const pickedPeriode = await axios.post(
          `${tempUrl}/tutupPeriodeByNamaPeriode`,
          {
            namaPeriode,
            _id: user.id,
            token: user.token,
            kodeCabang: user.cabang.id
          }
        );
        let tempPeriode = await axios.post(`${tempUrl}/tutupPeriodes`, {
          _id: user.id,
          token: user.token,
          kodeCabang: kodeCabang
        });

        if (tempPeriode.data.length === 0) {
          // Create Periode and Neraca Saldo
          await axios.post(`${tempUrl}/saveTutupPeriode`, {
            dariTanggal: pickedPeriode.data.dariTanggal,
            sampaiTanggal: pickedPeriode.data.sampaiTanggal,
            namaPeriode: pickedPeriode.data.namaPeriode,
            _id: user.id,
            token: user.token,
            cabangId: kodeCabang
          });
          function subtractMonths(date, months) {
            date.setMonth(date.getMonth() - months);
            return date;
          }

          const newBulan = new Date(pickedPeriode.data.dariTanggal);

          const minOneBulan = subtractMonths(newBulan, 1);

          // Save 2 months
          await axios.post(`${tempUrl}/saveNeracaSaldo`, {
            bulan: minOneBulan,
            _id: user.id,
            token: user.token,
            cabangId: kodeCabang
          });
          await axios.post(`${tempUrl}/saveNeracaSaldo`, {
            bulan: newBulan,
            _id: user.id,
            token: user.token,
            cabangId: kodeCabang
          });
        }

        let isUsernameAlreadyExist = tempUsername.data.length > 0;
        let isKodeKwitansiCabangAlreadyExist = tempKodeKwitansi.data.length > 0;
        if (isUsernameAlreadyExist) {
          handleClickOpenAlertUsername();
        } else if (isKodeKwitansiCabangAlreadyExist) {
          handleClickOpenAlertKodeKwitansiCabang();
        } else {
          setLoading(true);
          await axios.post(`${tempUrl}/auth/register`, {
            username,
            password,
            tipeUser,
            namaPeriode,
            kodeKwitansi,
            coaKasir,
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
          navigate("/daftarUser");
        }
      } catch (err) {
        console.log(err);
      }
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
      <h3>User</h3>
      <h5 style={{ fontWeight: 400 }}>Tambah User</h5>
      <Dialog
        open={openAlertUsername}
        onClose={handleCloseAlertUsername}
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
          <Button onClick={handleCloseAlertUsername}>Ok</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAlertKodeKwitansiCabang}
        onClose={handleCloseAlertKodeKwitansiCabang}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{`Data Kode Kwitansi Sama`}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {`Kode Kwitansi ${kodeKwitansi} di Cabang ${
              kodeCabang.split(" ", 1)[0]
            } sudah ada, ganti Kode Kwitansi!`}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlertKodeKwitansiCabang}>Ok</Button>
        </DialogActions>
      </Dialog>
      <hr />
      <Card>
        <Card.Header>User</Card.Header>
        <Card.Body>
          <Form noValidate validated={validated} onSubmit={saveUser}>
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
                      {user.tipeUser === "OWN"
                        ? tipeUserOption.map((tipeUser) => (
                            <option value={tipeUser}>{tipeUser}</option>
                          ))
                        : tipeUserOptionOwner.map((tipeUser) => (
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
                      required
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

export default TambahUser;

const spacingTop = {
  mt: 4
};

const alertBox = {
  width: "100%"
};

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
