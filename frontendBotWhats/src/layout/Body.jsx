import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Footer from '../../src/layout/Footer';
import Header from '../../src/layout/Header';

export default function Body() {
  const [isConnected, setIsConnected] = useState(false);

  const handleConnected = (status) => {
    console.log('Estado de conexão atualizado:', status); 
    setIsConnected(status);
  };

  return (
    <>
      <Header />
      <Outlet  context={{ onConnected: handleConnected }} />
      <Footer />
    </>
  );
}
