import { useState } from 'react';
import {
  Form,
  TextInput,
  Button,
  InlineNotification,
  Tile,
  SkeletonText,
} from '@carbon/react';
import { Search } from '@carbon/icons-react';
import { getAccountByIban, getBalance } from '../services/bankService';
import { formatCurrency, formatIban, validateIban } from '../utils/formatters';
import './BalanceInquiry.scss';

const BalanceInquiry = () => {
  const [iban, setIban] = useState('DE89545769475769453536');
  const [balance, setBalance] = useState(null);
  const [accountInfo, setAccountInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setBalance(null);
    setAccountInfo(null);

    if (!validateIban(iban)) {
      setError('유효하지 않은 IBAN 형식입니다');
      return;
    }

    setLoading(true);

    try {
      const account = await getAccountByIban(iban.replace(/\s/g, ''));
      
      if (!account) {
        setError('계좌를 찾을 수 없습니다');
        return;
      }

      const accountBalance = await getBalance(account.account_id);
      setBalance(accountBalance);
      setAccountInfo(account);
    } catch (err) {
      console.error('Balance inquiry failed:', err);
      setError(
        err.response?.data?.detail || 
        '잔액 조회에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="balance-inquiry">
      <Form onSubmit={handleSubmit}>
        <div className="balance-inquiry-form">
          <TextInput
            id="iban"
            labelText="IBAN"
            placeholder="예: DE89 5457 6947 5769 4535 36"
            value={iban}
            onChange={(e) => setIban(e.target.value)}
            disabled={loading}
          />
          <Button
            type="submit"
            kind="primary"
            renderIcon={Search}
            disabled={loading}
          >
            {loading ? '조회 중...' : '잔액 조회'}
          </Button>
        </div>
      </Form>

      {error && (
        <InlineNotification
          kind="error"
          title="오류"
          subtitle={error}
          onCloseButtonClick={() => setError('')}
          className="balance-notification"
        />
      )}

      {loading && (
        <Tile className="balance-result">
          <SkeletonText heading />
          <SkeletonText paragraph lineCount={3} />
        </Tile>
      )}

      {!loading && balance !== null && accountInfo && (
        <Tile className="balance-result">
          <h3>계좌 정보</h3>
          <div className="balance-details">
            <div className="balance-row">
              <span className="balance-label">IBAN:</span>
              <span className="balance-value">{formatIban(accountInfo.iban)}</span>
            </div>
            <div className="balance-row">
              <span className="balance-label">계좌 ID:</span>
              <span className="balance-value">{accountInfo.account_id}</span>
            </div>
            <div className="balance-row">
              <span className="balance-label">소유자:</span>
              <span className="balance-value">{accountInfo.owner_name}</span>
            </div>
            <div className="balance-row balance-amount">
              <span className="balance-label">현재 잔액:</span>
              <span className="balance-value balance-highlight">
                {formatCurrency(balance)}
              </span>
            </div>
          </div>
        </Tile>
      )}
    </div>
  );
};

export default BalanceInquiry;

// Made with Bob
