import { useContext, useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { Loader, usePagination } from "../../../components";
import { ShowTableTopup } from "../../../components/ShowTable";
import { Container, Card, Form, Row, Col } from "react-bootstrap";
import { Box, Button, Pagination } from "@mui/material";

const TampilTopup = () => {
  const { screenSize } = useStateContext();
  const { user, setting } = useContext(AuthContext);
  const [noAju, setNoAju] = useState("");
  const [tanggalAju, setTanggalAju] = useState(new Date());
  const [jenisResikoAju, setJenisResikoAju] = useState("");
  const [ketResikoAju, setKetResikoAju] = useState("");
  const [noSbg, setNoSbg] = useState("");
  const [tglKontrak, setTglKontrak] = useState("");
  const [tglJtTempo, setTglJtTempo] = useState("");
  const [bungaPerBulanAju, setBungaPerBulanAju] = useState(0);
  const [pinjamanAju, setPinjamanAju] = useState(0);
  const [biayaAdmAju, setBiayaAdmAju] = useState(0);

  const [cifCustomer, setCifCustomer] = useState("");
  const [nikCustomer, setNikCustomer] = useState("");
  const [namaCustomer, setNamaCustomer] = useState("");
  const [tempatLahirCustomer, setTempatLahirCustomer] = useState("");
  const [tanggalLahirCustomer, setTanggalLahirCustomer] = useState("");
  const [jenisKelaminCustomer, setJenisKelaminCustomer] = useState("");
  const [noTeleponCustomer, setNoTeleponCustomer] = useState("");
  const [alamatCustomer, setAlamatCustomer] = useState("");
  const [kodeKelurahan, setKodeKelurahan] = useState("");
  const [kodeKecamatan, setKodeKecamatan] = useState("");
  const [kodeKabupaten, setKodeKabupaten] = useState("");
  const [kodeProvinsi, setKodeProvinsi] = useState("");
  const [kodePos, setKodePos] = useState("");
  const [statusPerkawinanCustomer, setStatusPerkawinanCustomer] = useState("");
  const [pekerjaanCustomer, setPekerjaanCustomer] = useState("");
  const [kewarganegaraanCustomer, setKewarganegaraanCustomer] = useState("");

  // Topup
  const [bayarPinjamanAju, setBayarPinjamanAju] = useState("");
  const [nilaiTopup, setNilaiTopup] = useState("");
  const [sisaSaldo, setSisaSaldo] = useState(0);

  const [kodeCOA, setKodeCOA] = useState("");
  const [kodeMarketing, setKodeMarketing] = useState("");
  const [namaJenis, setNamaJenis] = useState("");
  const [bungaPerBulanJenis, setBungaPerBulanJenis] = useState("");
  const [topups, setTopups] = useState([]);
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const { id } = useParams();
  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const currentPosts = topups.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(topups.length / PER_PAGE);
  const _DATA = usePagination(topups, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getPengajuanById();
    getTopupsPerPengajuan();
  }, []);

  const getPengajuanById = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/pengajuans/${id}`, {
      _id: user.id,
      token: user.token
    });
    setNoAju(response.data.noAju);
    setTanggalAju(response.data.tanggalAju);
    setJenisResikoAju(response.data.jenisResikoAju);
    setKetResikoAju(response.data.ketResikoAju);
    setNoSbg(response.data.noSbg);

    let newTglKontrak = new Date(response.data.tglKontrak);
    let tempTglKontrak = `${newTglKontrak.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${(newTglKontrak.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${newTglKontrak.getFullYear()}`;
    setTglKontrak(tempTglKontrak);

    let newTglJtTempo = new Date(response.data.tglJtTempo);
    let tempTglJtTempo = `${newTglJtTempo.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${(newTglJtTempo.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${newTglJtTempo.getFullYear()}`;
    setTglJtTempo(tempTglJtTempo);

    setBungaPerBulanAju(response.data.bungaPerBulanAju);
    setPinjamanAju(response.data.pinjamanAju);
    setBiayaAdmAju(response.data.biayaAdmAju);

    setCifCustomer(response.data.customer.cifCustomer);
    setNikCustomer(response.data.customer.nikCustomer);
    setNamaCustomer(response.data.customer.namaCustomer);
    setTempatLahirCustomer(response.data.customer.tempatLahirCustomer);
    let newTglLahir = new Date(response.data.customer.tanggalLahirCustomer);
    let tempTglLahir = `${newTglLahir.getDate().toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${(newTglLahir.getMonth() + 1).toLocaleString("en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false
    })}-${newTglLahir.getFullYear()}`;
    setTanggalLahirCustomer(tempTglLahir);
    setJenisKelaminCustomer(response.data.customer.jenisKelaminCustomer);
    setNoTeleponCustomer(response.data.customer.noTeleponCustomer);
    setAlamatCustomer(response.data.customer.alamatCustomer);

    setKodeKelurahan(
      `${response.data.customer.kelurahan.id} - ${response.data.customer.kelurahan.namaKelurahan}`
    );
    setKodeKecamatan(
      `${response.data.customer.kecamatan.id} - ${response.data.customer.kecamatan.namaKecamatan}`
    );
    setKodeKabupaten(
      `${response.data.customer.kabupaten.id} - ${response.data.customer.kabupaten.namaKabupaten}`
    );
    setKodeProvinsi(
      `${response.data.customer.provinsis.id} - ${response.data.customer.provinsis.namaProvinsi}`
    );
    setKodePos(response.data.customer.kelurahan.kodePos);

    setStatusPerkawinanCustomer(
      response.data.customer.statusPerkawinanCustomer
    );
    setPekerjaanCustomer(response.data.customer.pekerjaanCustomer);
    setKewarganegaraanCustomer(response.data.customer.kewarganegaraanCustomer);

    setKodeCOA(`${response.data.coa.kodeCOA} - ${response.data.coa.namaCOA}`);
    setKodeMarketing(
      `${response.data.marketing.kodeMarketing} - ${response.data.marketing.namaMarketing}`
    );
    setNamaJenis(response.data.jenisjaminan.namaJenis);
    setBungaPerBulanJenis(response.data.jenisjaminan.bungaPerBulanJenis);

    setBayarPinjamanAju(response.data.bayarPinjamanAju);
    setNilaiTopup(response.data.nilaiTopup);

    const findSisaTopup = await axios.post(`${tempUrl}/checkTopupPengajuans`, {
      noSbg: response.data.noSbg,
      _id: user.id,
      token: user.token,
      kodeCabang: user.cabang.id
    });
    setSisaSaldo(findSisaTopup.data);
    setLoading(false);
  };

  const getTopupsPerPengajuan = async () => {
    setLoading(true);
    const response = await axios.post(`${tempUrl}/topupsByPengajuanId`, {
      pengajuanId: id,
      _id: user.id,
      token: user.token
    });
    setTopups(response.data);
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  return (
    <Container>
      <h3>Gadai</h3>
      <h5 style={{ fontWeight: 400 }}>Data Approval</h5>
      <hr />
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => navigate("/daftarTopup")}
        sx={{ marginLeft: 2, marginTop: 4, marginBottom: 4 }}
      >
        {"< Kembali"}
      </Button>
      <Form>
        <Card>
          <Card.Header>Data Nasabah</Card.Header>
          <Card.Body>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    No. Pengajuan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control required value={noAju} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Kel. / Desa :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      required
                      value={kodeKelurahan}
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
                    Tanggal :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={tanggalAju} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Kecamatan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={kodeKecamatan} disabled readOnly />
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
                    NIK / CIF :
                  </Form.Label>
                  <Col sm="4">
                    <Form.Control
                      type="number"
                      value={nikCustomer}
                      disabled
                      readOnly
                    />
                  </Col>
                  <Col sm="4">
                    <Form.Control value={cifCustomer} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Kabupaten / Kota :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={kodeKabupaten} disabled readOnly />
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
                    Nama :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={namaCustomer} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Provinsi :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={kodeProvinsi} disabled readOnly />
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
                    Tempat Lahir :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={tempatLahirCustomer}
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
                  <Form.Label column sm="4" style={textRight}>
                    Kode POS :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={kodePos} disabled readOnly />
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
                    Tgl. Lahir :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={tanggalLahirCustomer}
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
                  <Form.Label column sm="4" style={textRight}>
                    Status Perkawinan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={statusPerkawinanCustomer}
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
                    Jenis Kelamin :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={jenisKelaminCustomer}
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
                  <Form.Label column sm="4" style={textRight}>
                    Pekerjaan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={pekerjaanCustomer} disabled readOnly />
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
                    No. Telp / HP :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={noTeleponCustomer} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Kewarganegaraan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={kewarganegaraanCustomer}
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
                    Alamat :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={alamatCustomer}
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
                  <Form.Label column sm="4" style={textRight}>
                    Marketing :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={kodeMarketing} disabled readOnly />
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
                    Kode Kas :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={kodeCOA} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    Jenis Resiko :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={jenisResikoAju} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col sm={6}></Col>
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
                    <Form.Control value={ketResikoAju} disabled readOnly />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        <Card style={{ marginTop: 10 }}>
          <Card.Header>Data Pinjaman</Card.Header>
          <Card.Body>
            <Row>
              <Col sm={6}>
                <Form.Group
                  as={Row}
                  className="mb-3"
                  controlId="formPlaintextPassword"
                >
                  <Form.Label column sm="4" style={textRight}>
                    No. SBG :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={noSbg} disabled readOnly />
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
                    Tgl. Kontrak :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={tglKontrak} disabled readOnly />
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
                    Tgl. J. Tempo :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={tglJtTempo} disabled readOnly />
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
                    Jenis Jaminan :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control value={namaJenis} disabled readOnly />
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
                    Bunga / Bln (%) :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={`${bungaPerBulanJenis} %`}
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
                    Pinjaman Rp. :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={pinjamanAju.toLocaleString()}
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
                    Sisa Saldo Rp. :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={sisaSaldo.toLocaleString()}
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
                    Bayar Rp. :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={bayarPinjamanAju.toLocaleString()}
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
                    Bunga / Bln Rp. :
                  </Form.Label>
                  <Col sm="8">
                    <Form.Control
                      value={(
                        (bungaPerBulanJenis * pinjamanAju) /
                        100
                      ).toLocaleString()}
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
                    Bi. Administrasi :
                  </Form.Label>
                  <Col sm="4">
                    <Form.Control
                      value={`${biayaAdmAju} %`}
                      disabled
                      readOnly
                    />
                  </Col>
                  <Col sm="4">
                    <Form.Control
                      value={(
                        (biayaAdmAju * pinjamanAju) /
                        100
                      ).toLocaleString()}
                      disabled
                      readOnly
                    />
                  </Col>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Form>
      <Box sx={tableContainer}>
        <ShowTableTopup id={id} currentPosts={currentPosts} topupId={id} />
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

export default TampilTopup;

const tableContainer = {
  pt: 4,
  display: "flex",
  justifyContent: "center"
};
