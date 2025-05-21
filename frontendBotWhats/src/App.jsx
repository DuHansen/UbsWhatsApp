import React from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Body from "../src/layout/Body";
import Home from "../src/pages/home";
import Consultas from "../src/pages/consultas";
import Relatorios from "../src/pages/relatorios";



export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Body />}>
          <Route index element={<Home />} />
          <Route path='/consultas' element={<Consultas />} />
          <Route path='/relatorios' element={<Relatorios />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
