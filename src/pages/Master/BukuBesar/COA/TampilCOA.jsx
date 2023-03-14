import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { ShowTableCOA } from "../../../../components/ShowTable";
import { FetchErrorHandling } from "../../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../../components";
import { Container, Form, Row, Col } from "react-bootstrap";
import { Box, Pagination, Button, ButtonGroup } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { useDownloadExcel } from "react-export-table-to-excel";
import DownloadIcon from "@mui/icons-material/Download";
import PrintIcon from "@mui/icons-material/Print";

const TampilCOA = () => {
  const tableRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeCOA, setKodeCOA] = useState("");
  const [namaCOA, setNamaCOA] = useState("");
  const [jenisSaldo, setJenisSaldo] = useState("");
  const [kasBank, setKasBank] = useState("");
  const [kodeJenisCOA, setKodeJenisCOA] = useState("");
  const [kodeGroupCOA, setKodeGroupCOA] = useState("");
  const [kodeSubGroupCOA, setKodeSubGroupCOA] = useState("");

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [COAs, setCOAs] = useState([]);
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = COAs.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kodeCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jeniscoa.kodeJenisCOA
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.jeniscoa.namaJenisCOA
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.groupcoa.kodeGroupCOA
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.groupcoa.namaGroupCOA
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.coa.kodeCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.coa.namaCOA.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(COAs, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getCOAs();
    id && getCOAById();
  }, [id]);

  const getCOAs = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/COAs`, {
        _id: user.id,
        token: user.token
      });
      setCOAs(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getCOAById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/COAs/${id}`, {
        _id: user.id,
        token: user.token
      });
      setKodeCOA(response.data.kodeCOA);
      setNamaCOA(response.data.namaCOA);
      setJenisSaldo(response.data.jenisSaldo);
      setKasBank(response.data.kasBank);
      setKodeJenisCOA(
        `${response.data.jeniscoa.kodeJenisCOA} - ${response.data.jeniscoa.namaJenisCOA}`
      );
      setKodeGroupCOA(
        `${response.data.groupcoa.kodeGroupCOA} - ${response.data.groupcoa.namaGroupCOA}`
      );
      setKodeSubGroupCOA(
        `${response.data.subgroupcoa.kodeSubGroupCOA} - ${response.data.subgroupcoa.namaSubGroupCOA}`
      );
    }
  };

  const deleteCOA = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteCOA/${id}`, {
        _id: user.id,
        token: user.token
      });
      getCOAs();
      setNamaCOA("");
      setKodeCOA("");
      setJenisSaldo("");
      setKasBank("");
      setKodeGroupCOA("");

      navigate("/coa");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${namaCOA} tidak bisa dihapus karena sudah ada data!`);
      }
    }
    setLoading(false);
  };

  const downloadPdf = () => {
    var date = new Date();
    var current_date =
      date.getDate().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      (date.getMonth() + 1).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      "-" +
      date.getFullYear();
    var current_time =
      date.getHours().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      ":" +
      date.getMinutes().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      }) +
      ":" +
      date.getSeconds().toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false
      });
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text(`${setting.namaPerusahaan} - ${setting.kotaPerusahaan}`, 15, 10);
    doc.text(`${setting.alamatPerusahaan}`, 15, 15);
    doc.setFontSize(16);
    doc.text(`Daftar COA`, 75, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.username} | Tanggal : ${current_date} | Jam : ${current_time}`,
      15,
      290
    );
    doc.autoTable({
      html: "#table",
      startY: doc.pageCount > 1 ? doc.autoTableEndPosY() + 20 : 45,
      headStyles: {
        fillColor: [117, 117, 117],
        color: [0, 0, 0]
      }
    });
    doc.save("daftarCoa.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "Coa",
    sheet: "DaftarCoa"
  });

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

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Container>
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar COA</h5>
      <Box sx={downloadButtons}>
        <ButtonGroup variant="outlined" color="secondary">
          <Button
            color="primary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewPdf(!previewPdf);
              setPreviewExcel(false);
            }}
          >
            PDF
          </Button>
          <Button
            color="secondary"
            startIcon={<SearchIcon />}
            onClick={() => {
              setPreviewExcel(!previewExcel);
              setPreviewPdf(false);
            }}
          >
            Excel
          </Button>
        </ButtonGroup>
      </Box>
      {previewPdf && (
        <div>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => downloadPdf()}
          >
            CETAK
          </Button>
          <table class="table" id="table">
            <thead>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>Jenis Saldo</th>
                <th>Kas Bank</th>
                <th>Kelompok COA</th>
                <th>Group COA</th>
                <th>Sub Group COA</th>
              </tr>
            </thead>
            <tbody>
              {COAs.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.kodeCOA}</td>
                  <td>{user.namaCOA}</td>
                  <td>{user.jenisSaldo}</td>
                  <td>{user.kasBank}</td>
                  <td>
                    {user.jeniscoa.kodeJenisCOA} - {user.jeniscoa.namaJenisCOA}
                  </td>
                  <td>
                    {user.groupcoa.kodeGroupCOA} - {user.groupcoa.namaGroupCOA}
                  </td>
                  <td>
                    {user.subgroupcoa.kodeSubGroupCOA} -{" "}
                    {user.subgroupcoa.namaSubGroupCOA}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <div>
        {previewExcel && (
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onDownload}
          >
            EXCEL
          </Button>
        )}
        <table ref={tableRef}>
          {previewExcel && (
            <tbody>
              <tr>
                <th>Kode</th>
                <th>Nama</th>
                <th>Jenis Saldo</th>
                <th>Kas Bank</th>
                <th>Kelompok COA</th>
                <th>Group COA</th>
                <th>Sub Group COA</th>
              </tr>
              {COAs.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.kodeCOA}</td>
                  <td>{user.namaCOA}</td>
                  <td>{user.jenisSaldo}</td>
                  <td>{user.kasBank}</td>
                  <td>
                    {user.jeniscoa.kodeJenisCOA} - {user.jeniscoa.namaJenisCOA}
                  </td>
                  <td>
                    {user.groupcoa.kodeGroupCOA} - {user.groupcoa.namaGroupCOA}
                  </td>
                  <td>
                    {user.subgroupcoa.kodeSubGroupCOA} -{" "}
                    {user.subgroupcoa.namaSubGroupCOA}
                  </td>
                </tr>
              ))}
            </tbody>
          )}
        </table>
      </div>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={id}
          kode={id}
          addLink={`/coa/tambahCoa`}
          editLink={`/coa/${id}/edit`}
          deleteUser={deleteCOA}
          nameUser={kodeCOA}
        />
      </Box>
      {id && (
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
                  <Form.Label column sm="3" style={textRight}>
                    Kode :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={kodeCOA} disabled readOnly />
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
                    <Form.Control value={namaCOA} disabled readOnly />
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
                    <Form.Control value={jenisSaldo} disabled readOnly />
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
                    Kas Bank :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={kasBank} disabled readOnly />
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
                    Kelompok COA :
                  </Form.Label>
                  <Col sm="9">
                    <Form.Control value={kodeJenisCOA} disabled readOnly />
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
                    <Form.Control value={kodeGroupCOA} disabled readOnly />
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
                    <Form.Control value={kodeSubGroupCOA} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      )}
      <hr />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableCOA currentPosts={currentPosts} searchTerm={searchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <Pagination
          count={count}
          page={page}
          onChange={handleChange}
          color="primary"
          size={screenSize <= 600 ? "small" : "large"}
        />
      </Box>
    </Container>
  );
};

export default TampilCOA;

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const downloadButtons = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const searchBarContainer = {
  pt: 6,
  display: "flex",
  justifyContent: "center"
};

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center"
};
