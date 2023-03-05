import React, { useState, useEffect, useContext, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../../contexts/ContextProvider";
import { ShowTableSubGroupCOA } from "../../../../components/ShowTable";
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

const TampilSubGroupCOA = () => {
  const tableRef = useRef(null);
  const { user, setting } = useContext(AuthContext);
  const location = useLocation();
  const id = location.pathname.split("/")[2];
  const { screenSize } = useStateContext();

  const [isFetchError, setIsFetchError] = useState(false);
  const [kodeSubGroupCOA, setKodeSubGroupCOA] = useState("");
  const [namaSubGroupCOA, setNamaSubGroupCOA] = useState("");
  const [kodeJenisCOA, setKodeJenisCOA] = useState("");
  const [kodeGroupCOA, setKodeGroupCOA] = useState("");

  const [previewPdf, setPreviewPdf] = useState(false);
  const [previewExcel, setPreviewExcel] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [subGroupCOAs, setSubGroupCOAs] = useState([]);
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
  const tempPosts = subGroupCOAs.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.kodeSubGroupCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.namaSubGroupCOA.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.jeniscoa.kodeJenisCOA
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.jeniscoa.namaJenisCOA
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.groupcoa.kodeGroupCOA
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.groupcoa.namaGroupCOA.toUpperCase().includes(searchTerm.toUpperCase())
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(subGroupCOAs, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getSubGroupCOAs();
    id && getSubGroupCOAById();
  }, [id]);

  const getSubGroupCOAs = async () => {
    setLoading(true);
    try {
      const response = await axios.post(`${tempUrl}/subGroupCOAs`, {
        _id: user.id,
        token: user.token
      });
      setSubGroupCOAs(response.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getSubGroupCOAById = async () => {
    if (id) {
      const response = await axios.post(`${tempUrl}/subGroupCOAs/${id}`, {
        _id: user.id,
        token: user.token
      });
      setKodeSubGroupCOA(response.data.kodeSubGroupCOA);
      setNamaSubGroupCOA(response.data.namaSubGroupCOA);
      setKodeJenisCOA(
        `${response.data.jeniscoa.kodeJenisCOA} - ${response.data.jeniscoa.namaJenisCOA}`
      );
      setKodeGroupCOA(
        `${response.data.groupcoa.kodeGroupCOA} - ${response.data.groupcoa.namaGroupCOA}`
      );
    }
  };

  const deleteGroupCOA = async (id) => {
    setLoading(true);
    try {
      await axios.post(`${tempUrl}/deleteSubGroupCOA/${id}`, {
        _id: user.id,
        token: user.token
      });
      getSubGroupCOAs();
      setNamaSubGroupCOA("");
      setKodeSubGroupCOA("");
      setKodeGroupCOA("");

      navigate("/subGroupCoa");
    } catch (error) {
      if (error.response.data.message.includes("foreign key")) {
        alert(`${namaSubGroupCOA} tidak bisa dihapus karena sudah ada data!`);
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
    doc.text(`Daftar Group Sub COA`, 85, 30);
    doc.setFontSize(10);
    doc.text(
      `Dicetak Oleh: ${user.namaSubGroupCOA} | Tanggal : ${current_date} | Jam : ${current_time}`,
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
    doc.save("daftarSubGroupCoa.pdf");
  };

  const { onDownload } = useDownloadExcel({
    currentTableRef: tableRef.current,
    filename: "SubGroupCoa",
    sheet: "DaftarSubGroupCoa"
  });

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
      <h3>Master</h3>
      <h5 style={{ fontWeight: 400 }}>Daftar Sub Group COA</h5>
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
                <th>Jenis COA</th>
                <th>Group COA</th>
              </tr>
            </thead>
            <tbody>
              {subGroupCOAs.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.kodeSubGroupCOA}</td>
                  <td>{user.namaSubGroupCOA}</td>
                  <td>
                    {user.jeniscoa.kodeJenisCOA} - {user.jeniscoa.namaJenisCOA}
                  </td>
                  <td>
                    {user.groupcoa.kodeGroupCOA} - {user.groupcoa.namaGroupCOA}
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
                <th>Jenis COA</th>
                <th>Group COA</th>
              </tr>
              {subGroupCOAs.map((user, index) => (
                <tr key={user.id}>
                  <td>{user.kodeSubGroupCOA}</td>
                  <td>{user.namaSubGroupCOA}</td>
                  <td>
                    {user.jeniscoa.kodeJenisCOA} - {user.jeniscoa.namaJenisCOA}
                  </td>
                  <td>
                    {user.groupcoa.kodeGroupCOA} - {user.groupcoa.namaGroupCOA}
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
          addLink={`/subGroupCoa/tambahSubGroupCoa`}
          editLink={`/subGroupCoa/${id}/edit`}
          deleteUser={deleteGroupCOA}
          nameUser={kodeSubGroupCOA}
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
                    <Form.Control value={kodeSubGroupCOA} disabled readOnly />
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
                    <Form.Control value={namaSubGroupCOA} disabled readOnly />
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
                    Jenis COA :
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
          </Form>
        </Container>
      )}
      <hr />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableSubGroupCOA
          currentPosts={currentPosts}
          searchTerm={searchTerm}
        />
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

export default TampilSubGroupCOA;

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
