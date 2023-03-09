import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableDaftarPengajuan } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../components";
import { Box, Typography, Divider, Pagination } from "@mui/material";

const TampilDaftarPengajuan = () => {
  const { user } = useContext(AuthContext);
  const { screenSize } = useStateContext();
  const [isFetchError, setIsFetchError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pengajuansData, setPengajuansData] = useState([]);
  const kode = null;

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = pengajuansData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.noAju.toString().toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tanggalAju.toUpperCase().includes(searchTerm.toUpperCase()) ||
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
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(pengajuansData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    getPengajuansData();
  }, []);

  const getPengajuansData = async () => {
    setLoading(true);
    try {
      const allPengajuan = await axios.post(`${tempUrl}/pengajuansPerCabang`, {
        _id: user.id,
        token: user.token,
        kodeCabang: user.cabang.id
      });
      setPengajuansData(allPengajuan.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  if (loading) {
    return <Loader />;
  }

  if (isFetchError) {
    return <FetchErrorHandling />;
  }

  return (
    <Box sx={container}>
      <Typography color="#757575">Gadai</Typography>
      <Typography variant="h4" sx={subTitleText}>
        Daftar Pengajuan
      </Typography>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={"/"}
          kode={kode}
          addLink={`/daftarPengajuan/pengajuan/tambahPengajuan`}
          editLink={`/`}
          deleteUser={"/"}
        />
      </Box>
      <Divider sx={dividerStyle} />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableDaftarPengajuan
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
    </Box>
  );
};

export default TampilDaftarPengajuan;

const container = {
  p: 4
};

const subTitleText = {
  fontWeight: "900"
};

const buttonModifierContainer = {
  mt: 4,
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "center"
};

const dividerStyle = {
  pt: 4
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
