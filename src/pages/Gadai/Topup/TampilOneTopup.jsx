import React, { useState, useEffect, useContext } from "react";
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
import "jspdf-autotable";

const TampilOneTopup = () => {
  const { user } = useContext(AuthContext);
  const { id, idTopup } = useParams();
  const { screenSize } = useStateContext();

  const [isFetchError] = useState(false);
  const [noKwitansi, setNoKwitansi] = useState("");
  const [nilaiTopup, setNilaiTopup] = useState("");
  const [tglTopup, setTglTopup] = useState("");
  const [noSbg, setNoSbg] = useState("");

  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);

  useEffect(() => {
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
    }
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
      <Box sx={buttonModifierContainer}>
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
