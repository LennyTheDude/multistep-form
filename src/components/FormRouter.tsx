import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';

const FormRouter: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route index element={<Navigate to="/step1" replace />}  />
        <Route path="/step1" element={<Step1 />} />
        <Route path="/step2" element={<Step2 />} />
        <Route path="/step3" element={<Step3 />} />
      </Routes>
    </Router>
  );
};

export default FormRouter;
