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

const TampilJaminan = () => {
  const { user } = useContext(AuthContext);
  const { id, idJaminan } = useParams();
  const { screenSize } = useStateContext();

  const [isFetchError] = useState(false);
  const [ketJam, setKetJam] = useState("");
  const [hargaTafsirJam, setHargaTafsirJam] = useState("");

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
    getJaminanById();
  }, []);

  const getJaminanById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/jaminans/${idJaminan}`, {
        _id: user.id,
        token: user.token
      });
      setKetJam(response.data.ketJam);
      setHargaTafsirJam(response.data.hargaTafsirJam);
    }
  };

  const deleteJaminan = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteJaminan/${idJaminan}`, {
        _id: user.id,
        token: user.token
      });
      setKetJam("");
      setHargaTafsirJam("");
      navigate(`/daftarPengajuan/pengajuan/${id}`);
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${ketJam} tidak bisa dihapus karena sudah ada data!`);
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
      <h5 style={{ fontWeight: 400 }}>Jaminan</h5>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate(`/daftarPengajuan/pengajuan/${id}`)}
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
              navigate(`/daftarPengajuan/pengajuan/${id}/${idJaminan}/edit`);
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
              {`Yakin ingin menghapus data ${ketJam}?`}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => deleteJaminan(id)}>Ok</Button>
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
                  Keterangan :
                </Form.Label>
                <Col sm="8">
                  <Form.Control value={ketJam} disabled readOnly />
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
                  Harga Tafsir Rp. :
                </Form.Label>
                <Col sm="8">
                  <Form.Control
                    value={hargaTafsirJam.toLocaleString()}
                    disabled
                    readOnly
                  />
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

export default TampilJaminan;

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};
