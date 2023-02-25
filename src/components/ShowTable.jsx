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
                val.tutupPeriode.namaPeriode
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
                <TableCell>{user.tutupPeriode.namaPeriode}</TableCell>
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
                val.bungaPerBulanJenis == searchTerm
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
