import React, { useState } from 'react';
import { Button, Spinner } from 'react-bootstrap';  // Importe o Spinner do react-bootstrap
import './style.css';  // Certifique-se de que este caminho está correto

export default function DispararMensagem() {
    // Estado para controlar o carregamento
    const [loading, setLoading] = useState(false);

    // Função para disparar a mensagem
    const acionarDisparo = async () => {
        setLoading(true);  // Inicia o carregamento

        try {
            const response = await fetch('http://localhost:3000/api/v1/whatsapp/send-message', {
                method: 'POST',  // Adicionar o método POST, caso seja necessário para enviar dados
                headers: {
                    'Content-Type': 'application/json',  // Se a API requer um tipo específico de conteúdo
                },
                body: JSON.stringify({})  // Se precisar enviar algum dado, passe-o aqui
            });

            if (!response.ok) {
                throw new Error(`Erro na resposta da API: ${response.statusText}`);
            }

            alert('Mensagem disparada com sucesso!');
        } catch (error) {
            console.log(error);
            alert('Erro ao disparar mensagem. Tente novamente!');
        } finally {
            setLoading(false);  // Finaliza o carregamento
        }
    };

    return (
        <div className='disparar-container'>
            {loading ? (
                // Exibe o spinner de carregamento enquanto a mensagem é disparada
                <Spinner animation="border" variant="primary" />
            ) : (
                // Exibe o botão de disparar quando não estiver carregando
                <Button className='disparar-button' onClick={acionarDisparo} style={{ backgroundColor: '#007bff', border: 'none' }}>
                    Disparar
                </Button>
            )}
        </div>
    );
}
