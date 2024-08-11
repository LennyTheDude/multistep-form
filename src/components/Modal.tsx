import { useContext } from "react";
import { FormContext, IFormContextType } from "./FormContext";
import { Modal } from "react-bootstrap";

const EndModal = ({ show }: {show: boolean}) => {
  const showHideClassName = show ? "modal display-block" : "modal display-none";
  const formContext = useContext<IFormContextType | undefined>(FormContext);

  if (!formContext) {
    throw new Error('FormContext must be used within a FormProvider');
  }

  const { firstName, lastName, loanAmount, loanDuration } = formContext.formData;

  return (
    <div className={showHideClassName}>
      <Modal.Dialog>
        <Modal.Body>
          <p>Поздравляем, {firstName} {lastName}. Вам одобрено ${loanAmount} на {loanDuration} дней</p>
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
};

export default EndModal;