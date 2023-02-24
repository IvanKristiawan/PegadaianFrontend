import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useStateContext, tempUrl } from "../../contexts/ContextProvider";
import { AuthContext } from "../../contexts/AuthContext";
import { Container, Card, Button, Form } from "react-bootstrap";
import { Snackbar, Alert } from "@mui/material";

function Login() {
  const { screenSize } = useStateContext();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { loading, error, dispatch } = useContext(AuthContext);

  const cardContainer = {
    width: screenSize >= 650 ? "23rem" : "18rem"
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };

  const handleClick = async (e) => {
    dispatch({ type: "LOGIN_START" });
    try {
      const res = await axios.post(`${tempUrl}/auth/login`, {
        username,
        password
      });
      const findSetting = await axios.post(`${tempUrl}/lastSetting`, {
        _id: res.data.details.id,
        token: res.data.details.token
      });
      dispatch({
        type: "LOGIN_SUCCESS",
        payload: res.data.details,
        setting: findSetting.data
      });

      navigate("/formInput");
    } catch (err) {
      setOpen(true);
      dispatch({ type: "LOGIN_FAILURE", payload: err });
    }
  };

  return (
    <Container
      style={{
        border: "1px solid black",
        display: "flex",
        justifyContent: "center"
      }}
    >
      <Card style={cardContainer}>
        <Card.Header style={headerContainer}>
          <p style={headerText}>TECHKU</p>
          <p style={headerText}>(SISTEM INFORMASI Pegadaian ONLINE)</p>
          <p style={headerDetail}>Aplikasi Management Pegadaian</p>
        </Card.Header>
        <Card.Body>
          <Card>
            <Card.Header style={headerDetail}>Login Pengguna</Card.Header>
            <Card.Body>
              <Form
                className="d-flex flex-column"
                onSubmit={handleSubmit(handleClick)}
              >
                <Form.Group
                  className="mb-3"
                  controlId="exampleForm.ControlInput1"
                >
                  <Form.Control
                    placeholder="Username"
                    className="mb-3"
                    value={username}
                    {...register("username", {
                      required: "Username harus diisi!"
                    })}
                    error={!!errors?.username}
                    helperText={
                      errors?.username ? errors.username.message : null
                    }
                    onChange={(e) => setUsername(e.target.value.toUpperCase())}
                  />
                  <Form.Control
                    type="password"
                    placeholder="Password"
                    value={password}
                    {...register("password", {
                      required: "Password harus diisi!"
                    })}
                    error={!!errors?.password}
                    helperText={
                      errors?.password ? errors.password.message : null
                    }
                    onChange={(e) => setPassword(e.target.value.toUpperCase())}
                  />
                </Form.Group>
                <Button x type="submit">
                  Login
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Card.Body>
      </Card>
      {error && (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity="error" sx={alertBox}>
            Username atau Password salah!
          </Alert>
        </Snackbar>
      )}
    </Container>
  );
}

export default Login;

const headerContainer = {
  fontWeight: 700,
  textAlign: "center"
};

const headerText = {
  marginBottom: 1
};

const headerDetail = {
  fontSize: 12,
  fontWeight: 500,
  color: "gray"
};

const alertBox = {
  width: "100%"
};
