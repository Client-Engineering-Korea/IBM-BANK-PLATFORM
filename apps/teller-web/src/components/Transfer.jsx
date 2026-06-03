import { useState } from 'react';
import {
  Form,
  TextInput,
  NumberInput,
  Button,
  InlineNotification,
  ComposedModal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from '@carbon/react';
import { ArrowRight } from '@carbon/icons-react';
import { getAccountByIban, transfer } from '../services/bankService';
import { formatCurrency, formatIban, validateIban, validateAmount } from '../utils/formatters';
import './Transfer.scss';

const Transfer = () => {
  const [formData, setFormData] = useState({
    sourceIban: 'DE89545769475769453536',
    destinationIban: '',
    amount: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [transferDetails, setTransferDetails] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!validateIban(formData.sourceIban)) {
      newErrors.sourceIban = '유효하지 않은 출발 IBAN 형식입니다';
    }

    if (!validateIban(formData.destinationIban)) {
      newErrors.destinationIban = '유효하지 않은 도착 IBAN 형식입니다';
    }

    if (formData.sourceIban === formData.destinationIban) {
      newErrors.destinationIban = '출발 계좌와 도착 계좌가 같을 수 없습니다';
    }

    if (!validateAmount(formData.amount)) {
      newErrors.amount = '유효한 금액을 입력하세요 (0보다 큰 숫자)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: '',
      }));
    }
  };

  const handleAmountChange = (e, { value }) => {
    setFormData((prev) => ({
      ...prev,
      amount: value,
    }));
    if (errors.amount) {
      setErrors((prev) => ({
        ...prev,
        amount: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const sourceAccount = await getAccountByIban(formData.sourceIban.replace(/\s/g, ''));
      const destAccount = await getAccountByIban(formData.destinationIban.replace(/\s/g, ''));

      if (!sourceAccount) {
        setError('출발 계좌를 찾을 수 없습니다');
        setLoading(false);
        return;
      }

      if (!destAccount) {
        setError('도착 계좌를 찾을 수 없습니다');
        setLoading(false);
        return;
      }

      setTransferDetails({
        sourceAccount,
        destAccount,
        amount: parseFloat(formData.amount),
      });
      setShowConfirmModal(true);
      setLoading(false);
    } catch (err) {
      console.error('Transfer validation failed:', err);
      setError(
        err.response?.data?.detail || 
        '계좌 확인에 실패했습니다. 다시 시도해주세요.'
      );
      setLoading(false);
    }
  };

  const handleConfirmTransfer = async () => {
    setLoading(true);
    setShowConfirmModal(false);

    try {
      await transfer(
        transferDetails.sourceAccount.account_id,
        transferDetails.destAccount.account_id,
        transferDetails.amount
      );

      setSuccess(
        `${formatCurrency(transferDetails.amount)} 이체가 완료되었습니다.`
      );
      
      // Reset form
      setFormData({
        sourceIban: formData.sourceIban,
        destinationIban: '',
        amount: '',
      });
      setTransferDetails(null);
    } catch (err) {
      console.error('Transfer failed:', err);
      setError(
        err.response?.data?.detail || 
        '이체에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="transfer">
      <Form onSubmit={handleSubmit}>
        <TextInput
          id="sourceIban"
          labelText="출발 계좌 IBAN"
          placeholder="예: DE89 5457 6947 5769 4535 36"
          value={formData.sourceIban}
          onChange={handleChange}
          invalid={!!errors.sourceIban}
          invalidText={errors.sourceIban}
          disabled={loading}
        />

        <TextInput
          id="destinationIban"
          labelText="도착 계좌 IBAN"
          placeholder="예: DE89 5457 6947 5769 4535 36"
          value={formData.destinationIban}
          onChange={handleChange}
          invalid={!!errors.destinationIban}
          invalidText={errors.destinationIban}
          disabled={loading}
        />

        <NumberInput
          id="amount"
          label="이체 금액 (EUR)"
          min={0}
          step={0.01}
          value={formData.amount}
          onChange={handleAmountChange}
          invalid={!!errors.amount}
          invalidText={errors.amount}
          disabled={loading}
        />

        <Button
          type="submit"
          kind="primary"
          renderIcon={ArrowRight}
          disabled={loading}
          className="transfer-button"
        >
          {loading ? '처리 중...' : '이체 실행'}
        </Button>
      </Form>

      {error && (
        <InlineNotification
          kind="error"
          title="오류"
          subtitle={error}
          onCloseButtonClick={() => setError('')}
          className="transfer-notification"
        />
      )}

      {success && (
        <InlineNotification
          kind="success"
          title="성공"
          subtitle={success}
          onCloseButtonClick={() => setSuccess('')}
          className="transfer-notification"
        />
      )}

      <ComposedModal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
      >
        <ModalHeader title="이체 확인" />
        <ModalBody>
          {transferDetails && (
            <div className="transfer-confirmation">
              <p>다음 이체를 실행하시겠습니까?</p>
              <div className="transfer-details">
                <div className="transfer-detail-row">
                  <span className="label">출발 계좌:</span>
                  <span className="value">{formatIban(transferDetails.sourceAccount.iban)}</span>
                </div>
                <div className="transfer-detail-row">
                  <span className="label">소유자:</span>
                  <span className="value">{transferDetails.sourceAccount.owner_name}</span>
                </div>
                <div className="transfer-detail-row">
                  <span className="label">도착 계좌:</span>
                  <span className="value">{formatIban(transferDetails.destAccount.iban)}</span>
                </div>
                <div className="transfer-detail-row">
                  <span className="label">소유자:</span>
                  <span className="value">{transferDetails.destAccount.owner_name}</span>
                </div>
                <div className="transfer-detail-row transfer-amount">
                  <span className="label">이체 금액:</span>
                  <span className="value">{formatCurrency(transferDetails.amount)}</span>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter
          primaryButtonText="확인"
          secondaryButtonText="취소"
          onRequestSubmit={handleConfirmTransfer}
          onRequestClose={() => setShowConfirmModal(false)}
        />
      </ComposedModal>
    </div>
  );
};

export default Transfer;

// Made with Bob
