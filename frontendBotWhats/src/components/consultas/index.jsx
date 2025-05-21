import React, { useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import { Button, Modal, Form } from 'react-bootstrap'; // Importando o Modal e o Form do react-bootstrap
import './style.css'; // Import the new CSS file
import UploadXLSXButton from '../buttonUpload';

const Consultas = () => {
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Para armazenar os totais
  const [totalOn, setTotalOn] = useState(0);
  const [totalOff, setTotalOff] = useState(0);
  const [totalChamados, setTotalChamados] = useState(0);

  // Controle do Modal
  const [showModal, setShowModal] = useState(false);
  const [newConsulta, setNewConsulta] = useState({
    nome: '',
    telefone: '',
    descricao: '',
    data: '',
    horario: ''
  });

  // Usando useRef para criar uma referência para o elemento DOM onde o gráfico será renderizado
  const chartRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000 });
    fetchContatos();
  }, []);

  const fetchContatos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:3000/api/v1/clientes/pegar`);
      if (!response.ok) {
        throw new Error(`Erro na resposta da API: ${response.statusText}`);
      }

      const data = await response.json();

      if (data && Array.isArray(data)) {
        setContatos(data);
        calculateTotals(data); // Calcular os totais assim que os dados forem carregados
      } else {
        setError('Dados dos contatos não encontrados.');
        setContatos([]);
      }
    } catch (error) {
      setError('Não foi possível carregar os contatos. Tente novamente mais tarde.');
      setContatos([]);
    } finally {
      setLoading(false);
    }
  };

  const calculateTotals = (data) => {
    let onCount = 0;
    let offCount = 0;

    data.forEach(contato => {
      if (contato.status === "on") {
        onCount++;
      } else if (contato.status === "off") {
        offCount++;
      }
    });

    setTotalOn(onCount);
    setTotalOff(offCount);
    setTotalChamados(data.length);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewConsulta({
      ...newConsulta,
      [name]: value
    });
  };

  // Função para adicionar uma nova consulta via API
  const handleFormSubmit = async (e) => {
    e.preventDefault();

    // Envolvendo os dados em um array, pois a API espera um array de clientes
    const clienteData = [newConsulta];

    try {
      const response = await fetch('http://localhost:3000/api/v1/clientes/adicionar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(clienteData)  // Enviando os dados como array
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Erro ao adicionar consulta: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();
      console.log("Consulta adicionada com sucesso:", data);

      // Atualizar a lista de contatos após adicionar a nova consulta
      setContatos([...contatos, newConsulta]);

      // Fechar o modal
      setShowModal(false);
    } catch (error) {
      setError(`Erro ao adicionar consulta: ${error.message}`);
      console.error(error);
    }
  };

  const handleSuccess = (data) => {
    console.log("Upload finalizado com sucesso!", data);
  };

  // Função para fazer o download do arquivo
  const handleFileDownload = () => {
    // Redireciona para o arquivo na pasta public
    window.location.href = '/Consultas.xlsx'; // Caminho para o arquivo na pasta public
  };

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div id="contatos">
      <div className="StyledLista">
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
          <h1 style={{ color: "black" }}>CONSULTAS</h1>
          
          <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: '20px' }}>
  {/* Botão para upload */}
  <UploadXLSXButton
    url="http://localhost:3000/api/v1/clientes/adicionar"
    onUploadSuccess={handleSuccess}
  />

  {/* Adicionando a div para link de download do arquivo */}
  <div
    onClick={handleFileDownload}
    style={{
      cursor: 'pointer',
      fontSize: '1.2rem',
      fontWeight: '500',
      color: '#102E4A',
      textDecoration: 'underline'
    }}
  >
    Baixar Tabela Exemplo
  </div>

  {/* Botão para abrir o Modal de adicionar consultas */}
  <Button
    onClick={() => setShowModal(true)}
    style={{ fontSize: '1.1rem', fontWeight: '500' }}
  >
    Adicionar Consultas
  </Button>
</div>


          <div>
            {loading && <p>Carregando...</p>}
            {error && <p>{error}</p>}
            <div ref={chartRef} style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}></div>
          </div>
        </div>

        <div className="StyledLista">
          <table>
            <thead>
              <tr>
                <th>Nome</th>
                <th>Telefone</th>
                <th>Descricao</th>
                <th>Data</th>
                <th>Horario</th>
              </tr>
            </thead>
            <tbody>
              {contatos.length > 0 ? (
                contatos.map((contato, index) => (
                  <tr key={index}>
                    <td>{contato.nome}</td>
                    <td>{contato.telefone}</td>
                    <td>{contato.descricao}</td>
                    <td>{contato.data}</td>
                    <td>{contato.horario}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">Nenhum contato encontrado</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal para adicionar consultas */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Adicionar Consulta</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="formNome">
              <Form.Label>Nome</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome"
                name="nome"
                value={newConsulta.nome}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formTelefone">
              <Form.Label>Telefone</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o telefone"
                name="telefone"
                value={newConsulta.telefone}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formDescricao">
              <Form.Label>Descrição</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a descrição"
                name="descricao"
                value={newConsulta.descricao}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formData">
              <Form.Label>Data</Form.Label>
              <Form.Control
                type="date"
                name="data"
                value={newConsulta.data}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group controlId="formHorario">
              <Form.Label>Horário</Form.Label>
              <Form.Control
                type="time"
                name="horario"
                value={newConsulta.horario}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Button variant="primary" type="submit">
              Adicionar Consulta
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Consultas;
