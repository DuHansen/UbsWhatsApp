import React, { useRef } from 'react';
import { Button } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import axios from 'axios';

export default function UploadXLSXButton({ url, onUploadSuccess }) {
  const fileInputRef = useRef(null);

  const handleButtonClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = XLSX.read(data, { type: 'array' });

      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(sheet, {
        header: 1,
        defval: '',
        raw: false,
      });

      const result = json.slice(1).map((row) => {
        const [nome, telefone, descricao, data, horario] = row;

        const telefoneFormatado = String(telefone).split('.')[0];

        let dataFormatada = data;
        if (!isNaN(data)) {
          const excelDate = new Date((data - 25569) * 86400 * 1000);
          const day = String(excelDate.getDate()).padStart(2, '0');
          const month = String(excelDate.getMonth() + 1).padStart(2, '0');
          const year = excelDate.getFullYear();
          dataFormatada = `${day}/${month}/${year}`;
        }

        let horarioFormatado = horario;
        if (!isNaN(horario)) {
          const totalMinutes = Math.round(horario * 24 * 60);
          const hours = String(Math.floor(totalMinutes / 60)).padStart(2, '0');
          const minutes = String(totalMinutes % 60).padStart(2, '0');
          horarioFormatado = `${hours}:${minutes}`;
        }

        return {
          nome,
          telefone: telefoneFormatado,
          descricao,
          data: dataFormatada,
          horario: horarioFormatado,
        };
      });

      try {
        const response = await axios.post(url, result);
        if (onUploadSuccess) onUploadSuccess(response.data);
      } catch (error) {
        console.error('Erro ao enviar para o backend:', error);
      }
    };

    reader.readAsArrayBuffer(file);
  };

  return (
    <div>
      <Button onClick={handleButtonClick}>Adicionar XLSX</Button>
      <input
        type="file"
        ref={fileInputRef}
        accept=".xlsx"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
}
