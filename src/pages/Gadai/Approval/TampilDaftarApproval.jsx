import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../../../contexts/AuthContext";
import { tempUrl, useStateContext } from "../../../contexts/ContextProvider";
import { ShowTableDaftarApproval } from "../../../components/ShowTable";
import { FetchErrorHandling } from "../../../components/FetchErrorHandling";
import {
  SearchBar,
  Loader,
  usePagination,
  ButtonModifier
} from "../../../components";
import { Box, Typography, Divider, Pagination } from "@mui/material";

const TampilDaftarApproval = () => {
  const { user } = useContext(AuthContext);
  const { screenSize } = useStateContext();
  const [isFetchError, setIsFetchError] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [approvalsData, setApprovalsData] = useState([]);
  const kode = null;

  const [loading, setLoading] = useState(false);
  let [page, setPage] = useState(1);
  const PER_PAGE = 20;

  // Get current posts
  const indexOfLastPost = page * PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - PER_PAGE;
  const tempPosts = approvalsData.filter((val) => {
    if (searchTerm === "") {
      return val;
    } else if (
      val.noSbg.toString().toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.noAju.toString().toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tanggalAju.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.tglApproval.toUpperCase().includes(searchTerm.toUpperCase()) ||
      val.customer.namaCustomer
        .toString()
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.coa.kodeCOA
        .toString()
        .toUpperCase()
        .includes(searchTerm.toUpperCase()) ||
      val.pinjamanAju + val.nilaiTopup == searchTerm
    ) {
      return val;
    }
  });
  const currentPosts = tempPosts.slice(indexOfFirstPost, indexOfLastPost);

  const count = Math.ceil(tempPosts.length / PER_PAGE);
  const _DATA = usePagination(approvalsData, PER_PAGE);

  const handleChange = (e, p) => {
    setPage(p);
    _DATA.jump(p);
  };

  useEffect(() => {
    if (user.tipeUser === "ADMIN") {
      getApprovalsDataAdmin();
    } else {
      getApprovalsDataManager();
    }
  }, []);

  const getApprovalsDataManager = async () => {
    setLoading(true);
    try {
      const allApproval = await axios.post(`${tempUrl}/pengajuansApproved`, {
        _id: user.id,
        token: user.token
      });
      setApprovalsData(allApproval.data);
    } catch (err) {
      setIsFetchError(true);
    }
    setLoading(false);
  };

  const getApprovalsDataAdmin = async () => {
    setLoading(true);
    try {
      const allApproval = await axios.post(
        `${tempUrl}/pengajuansPerCabangApproved`,
        {
          _id: user.id,
          token: user.token,
          kodeCabang: user.cabang.id
        }
      );
      setApprovalsData(allApproval.data);
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
        Daftar Approval
      </Typography>
      <Box sx={buttonModifierContainer}>
        <ButtonModifier
          id={"/"}
          kode={kode}
          addLink={`/daftarApproval/approval/tambahApproval`}
          editLink={`/`}
          deleteUser={"/"}
        />
      </Box>
      <Divider sx={dividerStyle} />
      <Box sx={searchBarContainer}>
        <SearchBar setSearchTerm={setSearchTerm} />
      </Box>
      <Box sx={tableContainer}>
        <ShowTableDaftarApproval
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

export default TampilDaftarApproval;

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
