import { useState } from 'react';
import {
  Form,
  TextInput,
  NumberInput,
  Button,
  InlineNotification,
  Tile,
} from '@carbon/react';
import { DocumentAdd } from '@carbon/icons-react';
import { getAccountByIban } from '../services/bankService';
import { formatCurrency, formatIban, validateIban } from '../utils/formatters';
import './OverdraftRequest.scss';

const OverdraftRequest = () => {
  const [formData, setFormData] = useState({
    iban: 'DE89545769475769453536',
    overdraftAmount: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [requestGenerated, setRequestGenerated] = useState(null);

  const validateForm = () => {
    const newErrors = {};

    if (!validateIban(formData.iban)) {
      newErrors.iban = '유효하지 않은 IBAN 형식입니다';
    }

    const amount = parseFloat(formData.overdraftAmount);
    if (isNaN(amount) || amount <= 0 || amount > 10000) {
      newErrors.overdraftAmount = '0 ~ 10,000 EUR 사이의 금액을 입력하세요';
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
      overdraftAmount: value,
    }));
    if (errors.overdraftAmount) {
      setErrors((prev) => ({
        ...prev,
        overdraftAmount: '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setRequestGenerated(null);

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const account = await getAccountByIban(formData.iban.replace(/\s/g, ''));
      
      if (!account) {
        setError('계좌를 찾을 수 없습니다');
        return;
      }

      // Generate overdraft request message
      const request = {
        iban: account.iban,
        accountId: account.account_id,
        ownerName: account.owner_name,
        overdraftAmount: parseFloat(formData.overdraftAmount),
        requestDate: new Date().toISOString(),
        requestId: `OD-${Date.now()}`,
      };

      setRequestGenerated(request);
    } catch (err) {
      console.error('Overdraft request failed:', err);
      setError(
        err.response?.data?.detail || 
        '마이너스 통장 요청 생성에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="overdraft-request">
      <div className="overdraft-info">
        <InlineNotification
          kind="info"
          title="안내"
          subtitle="마이너스 통장 요청은 백오피스 팀에 전달되어 검토됩니다. 실제 승인은 별도 프로세스를 통해 이루어집니다."
          hideCloseButton
        />
      </div>

      <Form onSubmit={handleSubmit}>
        <TextInput
          id="iban"
          labelText="계좌 IBAN"
          placeholder="예: DE89 5457 6947 5769 4535 36"
          value={formData.iban}
          onChange={handleChange}
          invalid={!!errors.iban}
          invalidText={errors.iban}
          disabled={loading}
        />

        <NumberInput
          id="overdraftAmount"
          label="마이너스 통장 한도 (EUR)"
          helperText="0 ~ 10,000 EUR"
          min={0}
          max={10000}
          step={100}
          value={formData.overdraftAmount}
          onChange={handleAmountChange}
          invalid={!!errors.overdraftAmount}
          invalidText={errors.overdraftAmount}
          disabled={loading}
        />

        <Button
          type="submit"
          kind="primary"
          renderIcon={DocumentAdd}
          disabled={loading}
          className="overdraft-button"
        >
          {loading ? '처리 중...' : '요청 생성'}
        </Button>
      </Form>

      {error && (
        <InlineNotification
          kind="error"
          title="오류"
          subtitle={error}
          onCloseButtonClick={() => setError('')}
          className="overdraft-notification"
        />
      )}

      {requestGenerated && (
        <Tile className="overdraft-result">
          <h3>마이너스 통장 요청 생성됨</h3>
          <div className="overdraft-details">
            <div className="overdraft-row">
              <span className="label">요청 ID:</span>
              <span className="value">{requestGenerated.requestId}</span>
            </div>
            <div className="overdraft-row">
              <span className="label">IBAN:</span>
              <span className="value">{formatIban(requestGenerated.iban)}</span>
            </div>
            <div className="overdraft-row">
              <span className="label">계좌 소유자:</span>
              <span className="value">{requestGenerated.ownerName}</span>
            </div>
            <div className="overdraft-row">
              <span className="label">요청 금액:</span>
              <span className="value">{formatCurrency(requestGenerated.overdraftAmount)}</span>
            </div>
            <div className="overdraft-row">
              <span className="label">요청 일시:</span>
              <span className="value">{new Date(requestGenerated.requestDate).toLocaleString('ko-KR')}</span>
            </div>
          </div>
          <div className="overdraft-message">
            <p>
              <strong>백오피스 팀에게 전달할 메시지:</strong>
            </p>
            <p className="message-text">
              {`계좌 ${formatIban(requestGenerated.iban)}에 대해 ${formatCurrency(requestGenerated.overdraftAmount)} 마이너스 통장 한도 승인을 요청합니다.`}
            </p>
          </div>
        </Tile>
      )}
    </div>
  );
};

export default OverdraftRequest;

// Made with Bob
