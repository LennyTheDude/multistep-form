import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContext, IFormContextType, IFormData } from './FormContext';
import { ButtonGroup, Container } from 'react-bootstrap';
import { Form } from 'react-bootstrap';
import { Button } from 'react-bootstrap';
import { FormControlFeedback } from 'react-bootstrap';

const Step2: React.FC = () => {
  const navigate = useNavigate();
  const formContext = useContext<IFormContextType | undefined>(FormContext);

  if (!formContext) {
    throw new Error('FormContext must be used within a FormProvider');
  }

  const { formData, setFormData } = formContext;

  const [options, setOptions] = useState<string[]>([])
  const [errors, setErrors] = useState<Partial<IFormData>>({});
  const [localData, setLocalData] = useState<Partial<IFormData>>({
    address: formData.address,
    workplace: formData.workplace
  });


  useEffect(() => {
    fetchSelectData();
  }, []);

  const fetchSelectData = async () => {
    fetch('https://dummyjson.com/products/category-list')
      .then(res => res.json())
      .then(setOptions);
  };


  const handlePrevious = () => {
    setFormData({
      ...formData,
      ...localData,
    });
    navigate('/step1');
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
      navigate('/step3');
    }
  };

  const validate = (data: Partial<IFormData>) => {
    const errors: Partial<IFormData> = {};
    if (!data.workplace) {
      errors.workplace = 'Выберите место работы';
    }
    if (!data.address?.trim()) {
      errors.address = 'Введите адрес';
    }
    return errors;
  };


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | FormControlFeedback>) => {
    const { name, value } = e.target;
    setLocalData({
      ...localData,
      [name]: value,
    });
  };

  return (
    <Container>
      <Form>
        <h2>Шаг 2 - Адрес и место работы</h2>
        <Form.Group>
          <Form.Label>Место работы:</Form.Label>
          <Form.Control
            required
            as="select"
            name='workplace'
            value={localData.workplace}
            onChange={handleChange}
            isInvalid={!!errors.workplace}
          >
            <option value="" disabled>Выберите место работы</option>
            {options.map(option => {
              return <option value={option} key={option}>{option}</option>
            })}
          </Form.Control>
          <Form.Control.Feedback type="invalid">
            {errors.workplace}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group controlId="address">
          <Form.Label>Имя</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={localData.address}
            placeholder="Ваш адрес"
            onChange={handleChange}
            isInvalid={!!errors.address}
          />
          <Form.Control.Feedback type="invalid">
            {errors.address}
          </Form.Control.Feedback>
        </Form.Group>
        <ButtonGroup>
          <Button type="button" onClick={handlePrevious}>Назад</Button>
          <Button type="button" onClick={handleNext}>Далее</Button>
        </ButtonGroup>
      </Form>
    </Container>
  );
};

export default Step2;