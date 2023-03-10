import * as React from "react";
import { useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { makeStyles } from "@mui/styles";
import { Colors } from "../constants/styles";

const useStyles = makeStyles({
  root: {
    "& .MuiTableCell-head": {
      color: "white",
      backgroundColor: Colors.blue700
    }
  },
  tableRightBorder: {
    borderWidth: 0,
    borderRightWidth: 1,
    borderColor: "white",
    borderStyle: "solid"
  }
});

export function ShowTableUser({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Username
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Tipe User
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Periode
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode Kwitansi
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No Terakhir
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Cabang</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.username.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.tipeUser.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.tutupperiode.namaPeriode
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.kodeKwitansi
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.noTerakhir
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.cabang.id
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.cabang.namaCabang
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarUser/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.username}
                </TableCell>
                <TableCell>{user.tipeUser}</TableCell>
                <TableCell>{user.tutupperiode.namaPeriode}</TableCell>
                <TableCell>{user.kodeKwitansi}</TableCell>
                <TableCell>{user.noTerakhir}</TableCell>
                <TableCell>
                  {user.cabang.id} - {user.cabang.namaCabang}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableKategoriJaminan({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Bunga/Bulan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.namaKategori
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.bungaPerBulanKategori == searchTerm
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/kategoriJaminan/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.namaKategori}
                </TableCell>
                <TableCell>{user.bungaPerBulanKategori}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableJenisJaminan({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Bunga/Bulan
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Lama Jatuh Tempo
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Kategori</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.namaJenis
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.kategorijaminan.namaKategori
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.bungaPerBulanJenis == searchTerm ||
                val.lamaJatuhTempo == searchTerm
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/jenisJaminan/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.namaJenis}
                </TableCell>
                <TableCell>{user.bungaPerBulanJenis}</TableCell>
                <TableCell>{user.lamaJatuhTempo}</TableCell>
                <TableCell>{user.kategorijaminan.namaKategori}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableMarketing({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Telepon</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.kodeMarketing
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.namaMarketing
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.teleponMarketing
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/marketing/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.kodeMarketing}
                </TableCell>
                <TableCell>{user.namaMarketing}</TableCell>
                <TableCell>{user.teleponMarketing}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableJenisCOA({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Nama</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.kodeJenisCOA
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.namaJenisCOA
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/jenisCoa/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.kodeJenisCOA}
                </TableCell>
                <TableCell>{user.namaJenisCOA}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableGroupCOA({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Jenis COA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.kodeGroupCOA
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.namaGroupCOA
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.jeniscoa.kodeJenisCOA
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.jeniscoa.namaJenisCOA
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/groupCoa/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.kodeGroupCOA}
                </TableCell>
                <TableCell>{user.namaGroupCOA}</TableCell>
                <TableCell>
                  {user.jeniscoa.kodeJenisCOA} - {user.jeniscoa.namaJenisCOA}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableSubGroupCOA({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Jenis COA
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Group COA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.kodeSubGroupCOA
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.namaSubGroupCOA
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
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
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/subGroupCoa/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.kodeSubGroupCOA}
                </TableCell>
                <TableCell>{user.namaSubGroupCOA}</TableCell>
                <TableCell>
                  {user.jeniscoa.kodeJenisCOA} - {user.jeniscoa.namaJenisCOA}
                </TableCell>
                <TableCell>
                  {user.groupcoa.kodeGroupCOA} - {user.groupcoa.namaGroupCOA}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableCOA({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Jenis Saldo
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kas Bank
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kelompok COA
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Group COA
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Sub Group COA</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
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
                val.coa.kodeCOA
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.coa.namaCOA.toUpperCase().includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/coa/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.kodeCOA}
                </TableCell>
                <TableCell>{user.namaCOA}</TableCell>
                <TableCell>{user.jenisSaldo}</TableCell>
                <TableCell>{user.kasBank}</TableCell>
                <TableCell>
                  {user.jeniscoa.kodeJenisCOA} - {user.jeniscoa.namaJenisCOA}
                </TableCell>
                <TableCell>
                  {user.groupcoa.kodeGroupCOA} - {user.groupcoa.namaGroupCOA}
                </TableCell>
                <TableCell>
                  {user.subgroupcoa.kodeSubGroupCOA} -{" "}
                  {user.subgroupcoa.namaSubGroupCOA}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableCabang({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Alamat
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Telepon
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>PIC</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.id.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.namaCabang
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.alamatCabang
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.teleponCabang
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.picCabang.toUpperCase().includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/cabang/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.namaCabang}</TableCell>
                <TableCell>{user.alamatCabang}</TableCell>
                <TableCell>{user.teleponCabang}</TableCell>
                <TableCell>{user.picCabang}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableGantiPeriode({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Dari Tanggal
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Sampai Tanggal
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.namaPeriode
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.dariTanggal
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.sampaiTanggal
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/gantiPeriode/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.namaPeriode}
                </TableCell>
                <TableCell>{user.dariTanggal}</TableCell>
                <TableCell>{user.sampaiTanggal}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableKategoriProvinsi({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Nama</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.id.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.namaProvinsi
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/provinsi/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.namaProvinsi}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableKabupaten({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Provinsi</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.id.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.namaKabupaten
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.provinsis.id
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.provinsis.namaProvinsi
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/kabupaten/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.namaKabupaten}</TableCell>
                <TableCell>
                  {user.provinsis.id} - {user.provinsis.namaProvinsi}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableKecamatan({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Provinsi
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Kabupaten</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.id.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.namaKecamatan
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.provinsis.id
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.provinsis.namaProvinsi
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.kabupaten.id
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.kabupaten.namaKabupaten
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/kecamatan/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.namaKecamatan}</TableCell>
                <TableCell>
                  {user.provinsis.id} - {user.provinsis.namaProvinsi}
                </TableCell>
                <TableCell>
                  {user.kabupaten.id} - {user.kabupaten.namaKabupaten}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableKelurahan({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Provinsi
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kabupaten
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Kecamatan</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.id.toUpperCase().includes(searchTerm.toUpperCase()) ||
                val.namaKelurahan
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.provinsis.id
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.provinsis.namaProvinsi
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.kabupaten.id
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.kabupaten.namaKabupaten
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.kecamatan.id
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.kecamatan.namaKecamatan
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/kelurahan/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.id}
                </TableCell>
                <TableCell>{user.namaKelurahan}</TableCell>
                <TableCell>
                  {user.provinsis.id} - {user.provinsis.namaProvinsi}
                </TableCell>
                <TableCell>
                  {user.kabupaten.id} - {user.kabupaten.namaKabupaten}
                </TableCell>
                <TableCell>
                  {user.kecamatan.id} - {user.kecamatan.namaKecamatan}
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableCustomer({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Alamat
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>No. Telp / HP</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.namaCustomer
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.alamatCustomer
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.noTeleponCustomer
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/customer/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.namaCustomer}
                </TableCell>
                <TableCell>{user.alamatCustomer}</TableCell>
                <TableCell>{user.noTeleponCustomer}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableDaftarPengajuan({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No. Aju
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Tgl. Aju
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Atas Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Alamat
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode Kas
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Pinjaman
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Kasir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.noAju
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.tanggalAju
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.customer.namaCustomer
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.customer.alamatCustomer
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.coa.kodeCOA
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.pinjamanAju == searchTerm ||
                val.user.username
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarPengajuan/pengajuan/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.noAju}
                </TableCell>
                <TableCell>{user.tanggalAju}</TableCell>
                <TableCell>{user.customer.namaCustomer}</TableCell>
                <TableCell>{user.customer.alamatCustomer}</TableCell>
                <TableCell>{user.coa.kodeCOA}</TableCell>
                <TableCell>{user.pinjamanAju.toLocaleString()}</TableCell>
                <TableCell>{user.user.username}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableJaminan({ currentPosts, pengajuanId }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama Jaminan
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Harga Rp.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts.map((user, index) => (
            <TableRow
              key={user.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": { bgcolor: Colors.grey300 },
                cursor: "pointer"
              }}
              onClick={() => {
                navigate(
                  `/daftarPengajuan/pengajuan/${pengajuanId}/${user.id}`
                );
              }}
            >
              <TableCell component="th" scope="row">
                {user.ketJam}
              </TableCell>
              <TableCell>{user.hargaTafsirJam.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableDaftarApproval({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No. Sbg
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No. Aju
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Tgl. Aju
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Atas Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Alamat
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode Kas
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Pinjaman
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Kasir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.noSbg
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.noAju
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.tanggalAju
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.customer.namaCustomer
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.customer.alamatCustomer
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.coa.kodeCOA
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.pinjamanAju == searchTerm ||
                val.user.username
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarApproval/approval/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.noSbg}
                </TableCell>
                <TableCell>{user.noAju}</TableCell>
                <TableCell>{user.tanggalAju}</TableCell>
                <TableCell>{user.customer.namaCustomer}</TableCell>
                <TableCell>{user.customer.alamatCustomer}</TableCell>
                <TableCell>{user.coa.kodeCOA}</TableCell>
                <TableCell>{user.pinjamanAju.toLocaleString()}</TableCell>
                <TableCell>{user.user.username}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableApproval({ currentPosts, pengajuanId }) {
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nama Jaminan
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Harga Rp.</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts.map((user, index) => (
            <TableRow
              key={user.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": { bgcolor: Colors.grey300 }
              }}
            >
              <TableCell component="th" scope="row">
                {user.ketJam}
              </TableCell>
              <TableCell>{user.hargaTafsirJam.toLocaleString()}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableDaftarBuktiPencairan({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No. Sbg
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No. Aju
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Tgl. Aju
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Atas Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Alamat
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode Kas
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Pinjaman
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Kasir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.noSbg
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.noAju
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.tanggalAju
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.customer.namaCustomer
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.customer.alamatCustomer
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.coa.kodeCOA
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.pinjamanAju == searchTerm ||
                val.user.username
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarBuktiPencairan/buktiPencairan/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.noSbg}
                </TableCell>
                <TableCell>{user.noAju}</TableCell>
                <TableCell>{user.tanggalAju}</TableCell>
                <TableCell>{user.customer.namaCustomer}</TableCell>
                <TableCell>{user.customer.alamatCustomer}</TableCell>
                <TableCell>{user.coa.kodeCOA}</TableCell>
                <TableCell>{user.pinjamanAju.toLocaleString()}</TableCell>
                <TableCell>{user.user.username}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableDaftarTopUp({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No. Sbg
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No. Aju
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Tgl. Aju
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Atas Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Alamat
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode Kas
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Pinjaman
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Kasir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.noSbg
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.noAju
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.tanggalAju
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.customer.namaCustomer
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.customer.alamatCustomer
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.coa.kodeCOA
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.pinjamanAju == searchTerm ||
                val.user.username
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarTopup/topup/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.noSbg}
                </TableCell>
                <TableCell>{user.noAju}</TableCell>
                <TableCell>{user.tanggalAju}</TableCell>
                <TableCell>{user.customer.namaCustomer}</TableCell>
                <TableCell>{user.customer.alamatCustomer}</TableCell>
                <TableCell>{user.coa.kodeCOA}</TableCell>
                <TableCell>{user.pinjamanAju.toLocaleString()}</TableCell>
                <TableCell>{user.user.username}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableDaftarApprovalTopUp({ currentPosts, searchTerm }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No. Sbg
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No. Aju
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Tgl. Aju
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Atas Nama
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Alamat
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Kode Kas
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Pinjaman
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Kasir</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts
            .filter((val) => {
              if (searchTerm === "") {
                return val;
              } else if (
                val.noSbg
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.noAju
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.tanggalAju
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.customer.namaCustomer
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.customer.alamatCustomer
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.coa.kodeCOA
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase()) ||
                val.pinjamanAju == searchTerm ||
                val.user.username
                  .toString()
                  .toUpperCase()
                  .includes(searchTerm.toUpperCase())
              ) {
                return val;
              }
            })
            .map((user, index) => (
              <TableRow
                key={user.id}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  "&:hover": { bgcolor: Colors.grey300 },
                  cursor: "pointer"
                }}
                onClick={() => {
                  navigate(`/daftarTopup/topup/${user.id}`);
                }}
              >
                <TableCell component="th" scope="row">
                  {user.noSbg}
                </TableCell>
                <TableCell>{user.noAju}</TableCell>
                <TableCell>{user.tanggalAju}</TableCell>
                <TableCell>{user.customer.namaCustomer}</TableCell>
                <TableCell>{user.customer.alamatCustomer}</TableCell>
                <TableCell>{user.coa.kodeCOA}</TableCell>
                <TableCell>{user.pinjamanAju.toLocaleString()}</TableCell>
                <TableCell>{user.user.username}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export function ShowTableTopup({ currentPosts, topupId }) {
  let navigate = useNavigate();
  const classes = useStyles();
  return (
    <TableContainer component={Paper} sx={{ width: "100%" }}>
      <Table aria-label="simple table">
        <TableHead className={classes.root}>
          <TableRow>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              No Kwitansi
            </TableCell>
            <TableCell
              sx={{ fontWeight: "bold" }}
              className={classes.tableRightBorder}
            >
              Nilai Topup
            </TableCell>
            <TableCell sx={{ fontWeight: "bold" }}>Tgl. Topup</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {currentPosts.map((user, index) => (
            <TableRow
              key={user.id}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                "&:hover": { bgcolor: Colors.grey300 },
                cursor: "pointer"
              }}
              onClick={() => {
                navigate(`/daftarTopup/topup/${topupId}/${user.id}`);
              }}
            >
              <TableCell component="th" scope="row">
                {user.noKwitansi}
              </TableCell>
              <TableCell>{user.nilaiTopup.toLocaleString()}</TableCell>
              <TableCell>{user.tglTopup}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
