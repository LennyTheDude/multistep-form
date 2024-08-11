import React, { ChangeEvent, useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContext, IFormContextType, IFormData } from './FormContext';
import { Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { FormControlFeedback } from 'react-bootstrap';
import { Button } from 'react-bootstrap';

const Step1: React.FC = () => {
  const navigate = useNavigate();
  const formContext = useContext<IFormContextType | undefined>(FormContext);

  if (!formContext) {
    throw new Error('FormContext must be used within a FormProvider');
  }

  const { formData, setFormData } = formContext;
  const [errors, setErrors] = useState<Partial<IFormData>>({});
  const [localData, setLocalData] = useState<Partial<IFormData>>({
    firstName: formData.firstName,
    lastName: formData.lastName,
    telephone: formData.telephone,
    gender: formData.gender
  });

  const formatPhoneNumber = (value: string) => {
    const cleaned = value.replace(/\D/g, "");
    const match = cleaned.match(/^(\d{0,4})(\d{0,3})(\d{0,3})$/);
    if (match) {
      const formattedPhone = `${match[1]}${match[2] ? ` ${match[2]}` : ""}${match[3] ? ` ${match[3]}` : ""}`;
      return formattedPhone;
    }
    return value;
  };


  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | FormControlFeedback>) => {
    const { name, value } = e.target;
    const formattedValue = name == 'telephone' ? formatPhoneNumber(value) : null;
    setLocalData({
      ...localData,
      [name]: formattedValue || value,
    });
  };

  const handleNext = () => {
    const validationErrors = validate(localData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setFormData({
        ...formData,
        ...localData,
      });
      navigate('/step2');
    }
  };

  const validate = (data: Partial<IFormData>) => {
    const errors: Partial<IFormData> = {};

    if (!data.firstName?.trim()) {
      errors.firstName = 'Введите имя';
    }

    if (!data.lastName?.trim()) {
      errors.lastName = 'Введите фамилию';
    }
    if (!data.gender || data.gender == '') {
      errors.gender = 'Выберите пол';
    }

    if (!data.telephone?.trim()) {
      errors.telephone = 'Введите телефон';
    }

    if (data.telephone?.length && (data.telephone.length < 12 || data.telephone[0] !== '0')) {
      errors.telephone = 'Введите корректный номер телефона';
    }

    return errors;
  };


  return (
    <Container>
      <Form>
        <h2>Шаг 1 - Личные данные</h2>
        <Form.Group controlId="telephone">
          <Form.Label>Телефон</Form.Label>
          <Form.Control
            type="text"
            name="telephone"
            value={localData.telephone}
            placeholder="0XXX XXX XXX"
            onChange={handleChange}
            isInvalid={!!errors.telephone}
            maxLength={12}
          />
          <Form.Control.Feedback type="invalid">
            {errors.telephone}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="firstName">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            type="text"
            name="firstName"
            value={localData.firstName}
            placeholder="Ваше имя"
            onChange={handleChange}
            isInvalid={!!errors.firstName}
          />
          <Form.Control.Feedback type="invalid">
            {errors.firstName}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="lastName">
          <Form.Label>Фамилия</Form.Label>
          <Form.Control
            type="text"
            name="lastName"
            value={localData.lastName}
            placeholder="Ваша фамилия"
            onChange={handleChange}
            isInvalid={!!errors.lastName}
          />
          <Form.Control.Feedback type="invalid">
            {errors.lastName}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Пол</Form.Label>
          <Form.Control
            required
            as="select"
            name='gender'
            value={localData.gender}
            onChange={handleChange}
            isInvalid={!!errors.gender}
          >
            <option value="" disabled>Ваш пол?</option>          
            <option value="male">Мужской</option>
            <option value="female">Женский</option>
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.gender}
          </Form.Control.Feedback>
        </Form.Group>
        <Button type="submit" onClick={handleNext}>Далее</Button>
      </Form>
    </Container>
  );
};

export default Step1;