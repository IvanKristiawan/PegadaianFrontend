import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../contexts/AuthContext";
import { useStateContext } from "../../../contexts/ContextProvider";
import { Container, Button, Form, Row, Col } from "react-bootstrap";
import EditIcon from "@mui/icons-material/Edit";

const ProfilUser = () => {
  const { screenSize } = useStateContext();
  const { user, dispatch } = useContext(AuthContext);
  const navigate = useNavigate();

  const textRight = {
    textAlign: screenSize >= 650 && "right"
  };

  return (
    <Container>
      <h3>Utility</h3>
      <h5 style={{ fontWeight: 400 }}>Profil User</h5>
      <Container className="d-flex justify-content-center">
        <Button
          variant="primary"
          onClick={() => {
            navigate(`/profilUser/${user.id}/edit`);
          }}
        >
          <EditIcon style={iconButtonStyle} /> Ubah Password
        </Button>
      </Container>
      <hr />
      <Container>
        <Form>
          <Row>
            <Col sm={6}>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextPassword"
              >
                <Form.Label column sm="3" style={textRight}>
                  Username
                </Form.Label>
                <Col sm="9">
                  <Form.Control value={user.username} disabled readOnly />
                </Col>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextPassword"
              >
                <Form.Label column sm="3" style={textRight}>
                  Kode Kwitansi
                </Form.Label>
                <Col sm="9">
                  <Form.Control value={user.kodeKwitansi} disabled readOnly />
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
                  Tipe User
                </Form.Label>
                <Col sm="9">
                  <Form.Control value={user.tipeUser} disabled readOnly />
                </Col>
              </Form.Group>
            </Col>
            <Col sm={6}>
              <Form.Group
                as={Row}
                className="mb-3"
                controlId="formPlaintextPassword"
              >
                <Form.Label column sm="3" style={textRight}>
                  No Terakhir
                </Form.Label>
                <Col sm="9">
                  <Form.Control value={user.noTerakhir} disabled readOnly />
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
                  Periode
                </Form.Label>
                <Col sm="9">
                  <Form.Control value={user.periodeId} disabled readOnly />
                </Col>
              </Form.Group>
            </Col>
          </Row>
        </Form>
      </Container>
    </Container>
  );
};

export default ProfilUser;

const iconButtonStyle = {
  fontSize: 18,
  marginTop: -4,
  marginRight: 6
};
