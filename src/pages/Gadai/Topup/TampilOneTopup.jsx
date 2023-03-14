import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import { Loader } from "../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import {
  Box,
  Button,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import jsPDF from "jspdf";
import "jspdf-autotable";
import SearchIcon from "@mui/icons-material/Search";
import PrintIcon from "@mui/icons-material/Print";

const TampilOneTopup = () => {
  const { user, setting } = useContext(AuthContext);
  const { id, idTopup } = useParams();
  const { screenSize } = useStateContext();
  const reportTemplateRef = useRef(null);

  const [isFetchError] = useState(false);
  const [noKwitansi, setNoKwitansi] = useState("");
  const [nilaiTopup, setNilaiTopup] = useState("");
  const [tglTopup, setTglTopup] = useState("");
  const [namaCustomer, setNamaCustomer] = useState("");
  const [noSbg, setNoSbg] = useState("");
  const [isPost, setIsPost] = useState("");

  const navigate = useNavigate();
  const [previewPdf, setPreviewPdf] = useState(false);

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);

  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "px"
    });

    doc.html(reportTemplateRef.current, {
      async callback(doc) {
        await doc.save("BuktiTopup");
      },
      html2canvas: { scale: 0.5 }
    });
  };

  useEffect(() => {
    getPengajuanById();
    getTopupById();
  }, []);

  const getTopupById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/topups/${idTopup}`, {
        _id: user.id,
        token: user.token
      });
      setNoKwitansi(response.data.noKwitansi);
      setNilaiTopup(response.data.nilaiTopup);

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
      setIsPost(response.data.isPost);
    }
  };

  const getPengajuanById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/pengajuans/${id}`, {
      _id: user.id,
      token: user.token
    });
    setNamaCustomer(response.data.customer.namaCustomer);
    setLoading(false);
  };

  const deleteTopup = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteTopup/${idTopup}`, {
        noSbg,
        _id: user.id,
        token: user.token
      });
      setNoKwitansi("");
      setNilaiTopup("");
      navigate(`/daftarTopup/topup/${id}`);
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${noKwitansi} tidak bisa dihapus karena sudah ada data!`);
      }
    }
    setLoading(false);
  };

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <h3>Gadai</h3>
      <h5 style={{ fontWeight: 400 }}>Data Topup</h5>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate(`/daftarTopup/topup/${id}`)}
        sx={{ marginLeft: 2, marginTop: 4 }}
      >
        {"< Kembali"}
      </Button>

      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewPdf(!previewPdf);
            }}
          >
            PDF
          </Button>
        </ButtonGroup>
      </Box>

      {previewPdf && (
        <div>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={handleGeneratePdf}
          >
            CETAK
          </Button>
          <div ref={reportTemplateRef} style={cetakContainer}>
            <p style={cetakCenter}>{setting.namaPerusahaan}</p>
            <p style={cetakCenterMoreWordSpacing}>{setting.alamatPerusahaan}</p>
            <p style={cetakCenterMoreWordSpacing}>({setting.kotaPerusahaan})</p>
            <p style={cetakCenter}>{setting.provinsiPerusahaan}</p>
            <p style={cetakCenter}>NO. TELP. {setting.teleponPerusahaan}</p>
            <hr />
            <p style={cetakCenterMoreWordSpacing}>BUKTI PEMBAYARAN GADAI</p>
            <p style={cetakCenter}>{namaCustomer.split(" ")[0]}</p>
            <p style={cetakCenter}>No. Kwitansi : {noKwitansi}</p>
            <p style={cetakCenter}>Tgl. Topup : {tglTopup}</p>
            <p style={cetakCenterBold}>SBG No. {noSbg}</p>
            <hr />
            <div style={cetakWrapper}>
              <p>Keterangan</p>
              <p>Nominal</p>
            </div>
            <hr />
            <div style={cetakWrapper}>
              <p>Topup Rp.</p>
              <p>{nilaiTopup.toLocaleString()}</p>
            </div>
            <hr />
            <div style={cetakWrapperTotal}>
              <p>Total.</p>
              <p>{nilaiTopup.toLocaleString()}</p>
            </div>
            <div style={cetakWrapperText}>
              <p>Customer,</p>
              <p>{setting.namaPerusahaan} ,</p>
            </div>
            <div style={{ height: "40px" }}></div>
            <div style={{ display: "flex" }}>
              <p style={{ marginLeft: "20px" }}>{namaCustomer.split(" ")[0]}</p>
              <p style={{ marginLeft: "90px" }}>{user.username}</p>
            </div>
          </div>
        </div>
      )}

      <Box sx={buttonModifierContainer}>
        {isPost === false && (
          <>
            <ButtonGroup variant="contained">
              <Button
                color="primary"
                startIcon={<EditIcon />}
                sx={{ textTransform: "none" }}
                onClick={() => {
                  navigate(`/daftarTopup/topup/${id}/${idTopup}/edit`);
                }}
              >
                Ubah
              </Button>
              <Button
                color="error"
                startIcon={<DeleteOutlineIcon />}
                sx={{ textTransform: "none" }}
                onClick={handleClickOpen}
              >
                Hapus
              </Button>
            </ButtonGroup>
            <Dialog
              open={open}
              onClose={handleClose}
              aria-labelledby="alert-dialog-title"
              aria-describedby="alert-dialog-description"
            >
              <DialogTitle id="alert-dialog-title">{`Hapus Data`}</DialogTitle>
              <DialogContent>
                <DialogContentText id="alert-dialog-slide-description">
                  {`Yakin ingin menghapus data ${noKwitansi}?`}
                </DialogContentText>
              </DialogContent>
              <DialogActions>
                <Button onClick={() => deleteTopup(id)}>Ok</Button>
                <Button onClick={handleClose}>Cancel</Button>
              </DialogActions>
            </Dialog>
          </>
        )}
      </Box>
      <Container>
        <hr />
        <Form>
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
                    value={nilaiTopup.toLocaleString()}
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
        </Form>
      </Container>
      <hr />
    </Container>
  );
};

export default TampilOneTopup;

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const downloadButtons = {
  mt: 4,
  mb: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const cetakContainer = {
  width: "300px",
  fontSize: "16px"
};

const cetakWrapper = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "-10px",
  marginBottom: "-20px"
};

const cetakWrapperTotal = {
  display: "flex",
  justifyContent: "space-between",
  marginTop: "-10px",
  marginBottom: "10px"
};

const cetakWrapperText = {
  display: "flex",
  justifyContent: "space-around"
};

const cetakCenter = {
  textAlign: "center",
  marginTop: "0px",
  marginBottom: "0px",
  wordSpacing: "2px"
};

const cetakCenterMoreWordSpacing = {
  textAlign: "center",
  marginTop: "0px",
  marginBottom: "0px",
  wordSpacing: "8px"
};

const cetakCenterBold = {
  textAlign: "center",
  marginTop: "0px",
  marginBottom: "0px",
  fontWeight: "700",
  wordSpacing: "4px"
};
