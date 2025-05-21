import { Card, Col, Container, Row } from "react-bootstrap";

export default function Footer() {
  return (
    <Container>
    <Card style={{backgroundColor: '#f8f9fa', marginTop: 50, padding: 20, border: 'none'}}>
      <Row >
        <Col lg={4} sm={12}>
        
        </Col>
        <Col lg={4} sm={12}>
          <div style={{justifyContent: 'center', alignItems: 'center', textAlign: 'center'}}>
          <h6 style={{color: "#102E4A"}}>Desenvolvido por Eduardo Hansen</h6>
          </div>
          
        </Col>
        <Col lg={4} sm={12}>
        </Col>
      </Row>
    </Card>
    </Container>
  );
}
