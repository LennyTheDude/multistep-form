import React, { createContext, useState, ReactNode } from 'react';

export interface IFormData {
  firstName: string;
  lastName: string;
  telephone: string;
  gender: string;
  workplace: string;
  address: string;
  loanAmount: number | string;
  loanDuration: number | string;
}

export interface IFormContextType {
  formData: IFormData;
  setFormData: (data: IFormData) => void;
}

export const FormContext = createContext<IFormContextType | undefined>(undefined);

export const FormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formData, setFormData] = useState<IFormData>({
    firstName: '',
    lastName: '',
    telephone: '',
    gender: '',
    workplace: '',
    address: '',
    loanAmount: 0,
    loanDuration: 0
  });

  return (
    <FormContext.Provider value={{ formData, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};
