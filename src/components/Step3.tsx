import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormContext, IFormContextType, IFormData } from './FormContext';
import { Button, ButtonGroup, Container, Form } from 'react-bootstrap';
import { FormControlFeedback } from 'react-bootstrap';
import EndModal from './Modal';

const Step3: React.FC = () => {
  const navigate = useNavigate();
  const formContext = useContext<IFormContextType | undefined>(FormContext);

  if (!formContext) {
    throw new Error('FormContext must be used within a FormProvider');
  }

  const { formData, setFormData } = formContext;
  const [localData, setLocalData] = useState<Partial<IFormData>>({
    loanAmount: formData.loanAmount,
    loanDuration: formData.loanDuration
  });
  const [errors, setErrors] = useState<Partial<IFormData>>({});

  const [showModal, setShowModal] = useState<boolean>(false)

  const handlePrevious = () => {
    setFormData({
      ...formData,
      ...localData,
    });
    navigate('/step2');
  };

  const handleSubmit = () => {
    const validationErrors = validate(localData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setFormData({
        ...formData,
        ...localData,
      });
      fetch('https://dummyjson.com/products/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'BMW Pencil', // TODO: с данными {"title": firstName + ' ' + lastName}
        })
      })
      .then(res => res.json())
      .then(() => toggleModal());
    }
  };

  const validate = (data: Partial<IFormData>) => {
    const errors: Partial<IFormData> = {};
    if (data.loanAmount == 0) {
      errors.loanAmount = 'Выберите сумму займа';
    }
    if (data.loanDuration == 0) {
      errors.loanDuration = 'Выберите срок займа';
    }
    return errors;
  };

  const toggleModal = () => {
    setShowModal(!showModal);
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
        <h2>Шаг 3 - Параметры займа</h2>
        <Form.Group>
          <Form.Label>Сумма займа: ${localData.loanAmount}</Form.Label>
          <Form.Range
            name='loanAmount'
            value={localData.loanAmount}
            onChange={handleChange}
            className={errors.loanAmount ? 'is-invalid' : ''}
            min={200}
            max={1000}
          />
          <Form.Control.Feedback type="invalid">
            {errors.loanAmount}
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group>
          <Form.Label>Срок займа: {localData.loanDuration} дней</Form.Label>
          <Form.Range
            name='loanDuration'
            value={localData.loanDuration}
            onChange={handleChange}
            className={errors.loanDuration ? 'is-invalid' : ''}
            min={10}
            max={30}
          />
          <Form.Control.Feedback type="invalid">
            {errors.loanDuration}
          </Form.Control.Feedback>
        </Form.Group>
        <ButtonGroup>
          <Button type="button" onClick={handlePrevious}>Назад</Button>
          <Button type="button" onClick={handleSubmit}>Подать заявку</Button>
        </ButtonGroup>
        <EndModal show={showModal} />
      </Form>
    </Container>
  );
};

export default Step3;
