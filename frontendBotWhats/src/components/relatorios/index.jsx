import React, { useState } from 'react';
import ApexCharts from 'react-apexcharts';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import dayjs from 'dayjs';

 
const Relatorios = () => {
  const [period, setPeriod] = useState('week'); // Default period is week
  const [startDate, setStartDate] = useState(dayjs().startOf('week').toDate());
  const [endDate, setEndDate] = useState(dayjs().endOf('week').toDate());

  // Função para atualizar os dados do gráfico com base no período selecionado
  const getChartData = (period, startDate, endDate) => {
    // Gerar dados com base na data selecionada
    switch (period) {
      case 'week':
        return [120, 190, 150, 200, 250, 300, 180]; // Dados de exemplo para a semana
      case 'month':
        return [500, 600, 450, 700, 800, 650, 600, 700, 800, 750, 900, 950]; // Dados de exemplo para o mês
      case 'year':
        return [2000, 2400, 2200, 2600, 2800, 3000, 3200, 3500, 3700, 3900, 4000, 4200]; // Dados de exemplo para o ano
      default:
        return [];
    }
  };

  const options = {
    chart: {
      height: 350,
      type: 'line',
      zoom: { enabled: false }
    },
    series: [{
      name: 'Consultas',
      data: getChartData(period, startDate, endDate), // Use os dados apropriados com base no período selecionado
    }],
    xaxis: {
      categories: period === 'week'
        ? ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab'] // Semana
        : period === 'month'
        ? ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] // Mês
        : ['2021', '2022', '2023', '2024', '2025'], // Ano
      labels: {
        style: {
          colors: '#000',
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
        }
      }
    },
    title: {
      text: `Consultas de ${startDate.toLocaleDateString()} a ${endDate.toLocaleDateString()}`,
      align: 'center',
      style: {
        fontSize: '18px',
        fontWeight: 'bold',
        color: '#000'
      }
    },
    stroke: {
      curve: 'smooth',
      width: 4
    },
    markers: {
      size: 6,
      colors: '#fff',
      strokeColor: '#0b8d9e',
      strokeWidth: 3,
      hover: { size: 7 }
    },
    colors: ['#0b8d9e'],
    tooltip: {
      y: { formatter: (val) => `${val} consultas` }
    }
  };

  return (
    <div style={{ maxWidth: '900px', margin: '35px auto' }}>
      <h1 style={{ textAlign: 'center' }}>Gerenciamento de Consultas</h1>

      {/* Filtros */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <button onClick={() => setPeriod('week')}>Semana</button>
        <button onClick={() => setPeriod('month')}>Mês</button>
        <button onClick={() => setPeriod('year')}>Ano</button>
      </div>

      {/* Selecionar o intervalo de datas */}
      <div style={{ textAlign: 'center', marginBottom: '20px' }}>
        <label>Selecione o Período: </label>
        <DatePicker
          selected={startDate}
          onChange={(date) => setStartDate(date)}
          selectsStart
          startDate={startDate}
          endDate={endDate}
          dateFormat="dd/MM/yyyy"
        />
        <span> até </span>
        <DatePicker
          selected={endDate}
          onChange={(date) => setEndDate(date)}
          selectsEnd
          startDate={startDate}
          endDate={endDate}
          minDate={startDate}
          dateFormat="dd/MM/yyyy"
        />
      </div>

      <ApexCharts
        options={options}
        series={options.series}
        type="line"
        height={350}
      />
    </div>
  );
}
 
export default Relatorios;