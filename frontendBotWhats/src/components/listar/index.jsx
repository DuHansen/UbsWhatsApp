import React, { useEffect, useState, useRef } from 'react';
import AOS from 'aos';
import { Container, Table, Button, Card } from 'react-bootstrap';
import './style.css'; // Import the new CSS file
import ApexCharts from 'apexcharts';
import QrCode from '../qrcode';

const Contatos = () => {
    const [contatos, setContatos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Para armazenar os totais
    const [totalOn, setTotalOn] = useState(0);
    const [totalOff, setTotalOff] = useState(0);
    const [totalChamados, setTotalChamados] = useState(0);

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

    useEffect(() => {
        if (totalOn !== undefined && totalOff !== undefined && chartRef.current) {
            const options = {
                series: [totalOn, totalOff],
                chart: {
                    width: 250,
                    height: 250,
                    type: 'donut',
                },
                dataLabels: {
                    enabled: false,
                },
                responsive: [
                    {
                        breakpoint: 480,
                        options: {
                            chart: {
                                width: 200,
                            },
                            legend: {
                                show: true,
                                position: 'bottom',
                                horizontalAlign: 'center',
                                offsetY: 10,
                            },
                        },
                    },
                ],
                legend: {
                    position: 'bottom',
                    horizontalAlign: 'center',
                    offsetY: 20,
                    labels: {
                        useSeriesColors: false,
                        fontSize: '14px',
                        colors: ['black'],
                        fontFamily: '"Roboto", sans-serif',
                        style: {
                            fontWeight: 'bold',
                        },
                    },
                    markers: {
                        fillColors: ['#28a745', '#dc3545'],
                    },
                },
                labels: ['Chamados', 'Não Chamados'],
                colors: ['#28a745', '#dc3545'],
                title: {
                    align: 'center',
                    margin: 20,
                    fontSize: '18px',
                    fontFamily: '"Roboto", sans-serif',
                    style: {
                        fontWeight: 'bold',
                    },
                },
            };
            if (window.chart) {
                window.chart.destroy();
            }
    
            const chart = new ApexCharts(chartRef.current, options);
            chart.render();
    
            window.chart = chart;
        }
    }, [totalOn, totalOff]); 
    
    
    const handleCardClick = (telefone) => {
        const url = `https://wa.me/${telefone}`;
        window.open(url, '_blank');
    };

    if (loading) {
        return <div>Carregando...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div id="contatos">
            <div className='StyledLista'>
            <QrCode></QrCode>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', textAlign: 'center' }}>
                    <h1 style={{ color: "black" }}>CHAMADOS</h1>
                    <div>
                        {loading && <p>Carregando...</p>}
                        {error && <p>{error}</p>}
                        <div ref={chartRef} style={{ width: '100%', maxWidth: '300px', margin: '0 auto' }}></div>
                    </div>
                </div>
                <div className='StyledLista'>
                <table>
                <thead>
                    <tr>
                        <th>Nome</th>
                        <th>Telefone</th>
                        <th>Descricao</th>
                        <th>Data</th>
                        <th>Horario</th>
                        <th>Status</th>
                        <th>WhatsApp</th>
                    </tr>
                </thead>
                <tbody>
                    {contatos.length > 0 ? (
                        contatos.map((contato, index) => (
                            <tr key={index}>
                                <td>{contato.nome}</td>
                                <td>{contato.telefone}</td>
                                <td>{contato.deccricao}</td>
                                <td>{contato.data}</td>
                                <td>{contato.horario}</td>
                                <td>
                                    <span
                                        className={`status-indicator ${contato.status === 'on' ? 'green' : 'red'}`}
                                    ></span>
                                </td>
                                <td>
                                    <Button onClick={() => handleCardClick(contato.telefone)}>Telefone</Button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="8">Nenhum contato encontrado</td>
                        </tr>
                    )}
                </tbody>
            </table>
            </div>
            </div>
        </div>
    );
};

export default Contatos;
