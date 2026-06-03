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
import { getAccountByIban, getBalance, getTransactions } from '../services/bankService';
import { formatCurrency, formatIban, formatDateTime, validateIban } from '../utils/formatters';
import './AccountDetails.scss';

const AccountDetails = () => {
  const [iban, setIban] = useState('DE89545769475769453536');
  const [accountDetails, setAccountDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setAccountDetails(null);

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

      const balance = await getBalance(account.account_id);
      const transactions = await getTransactions(account.account_id);
      
      // Get latest transaction
      const latestTransaction = transactions.length > 0
        ? transactions.sort((a, b) => new Date(b.booking_ts) - new Date(a.booking_ts))[0]
        : null;

      setAccountDetails({
        ...account,
        balance,
        transactionCount: transactions.length,
        latestTransaction,
      });
    } catch (err) {
      console.error('Account details failed:', err);
      setError(
        err.response?.data?.detail || 
        '계좌 상세 조회에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="account-details">
      <Form onSubmit={handleSubmit}>
        <div className="account-details-form">
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
            {loading ? '조회 중...' : '계좌 상세 조회'}
          </Button>
        </div>
      </Form>

      {error && (
        <InlineNotification
          kind="error"
          title="오류"
          subtitle={error}
          onCloseButtonClick={() => setError('')}
          className="account-notification"
        />
      )}

      {loading && (
        <Tile className="account-result">
          <SkeletonText heading />
          <SkeletonText paragraph lineCount={5} />
        </Tile>
      )}

      {!loading && accountDetails && (
        <Tile className="account-result">
          <h3>계좌 상세 정보</h3>
          
          <div className="account-section">
            <h4>기본 정보</h4>
            <div className="account-info">
              <div className="account-row">
                <span className="label">IBAN:</span>
                <span className="value">{formatIban(accountDetails.iban)}</span>
              </div>
              <div className="account-row">
                <span className="label">계좌 ID:</span>
                <span className="value">{accountDetails.account_id}</span>
              </div>
              <div className="account-row">
                <span className="label">소유자:</span>
                <span className="value">{accountDetails.owner_name}</span>
              </div>
              <div className="account-row">
                <span className="label">계좌 유형:</span>
                <span className="value">{accountDetails.account_type || 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="account-section">
            <h4>잔액 정보</h4>
            <div className="account-info">
              <div className="account-row balance-row">
                <span className="label">현재 잔액:</span>
                <span className="value balance-highlight">
                  {formatCurrency(accountDetails.balance)}
                </span>
              </div>
            </div>
          </div>

          <div className="account-section">
            <h4>거래 정보</h4>
            <div className="account-info">
              <div className="account-row">
                <span className="label">총 거래 건수:</span>
                <span className="value">{accountDetails.transactionCount}건</span>
              </div>
              {accountDetails.latestTransaction && (
                <>
                  <div className="account-row">
                    <span className="label">최근 거래 일시:</span>
                    <span className="value">
                      {formatDateTime(accountDetails.latestTransaction.booking_ts)}
                    </span>
                  </div>
                  <div className="account-row">
                    <span className="label">최근 거래 금액:</span>
                    <span className="value">
                      {formatCurrency(accountDetails.latestTransaction.amount_eur)}
                    </span>
                  </div>
                  <div className="account-row">
                    <span className="label">최근 거래 유형:</span>
                    <span className="value">
                      {accountDetails.latestTransaction.transaction_type || 'N/A'}
                    </span>
                  </div>
                </>
              )}
              {!accountDetails.latestTransaction && (
                <div className="account-row">
                  <span className="value">거래 내역이 없습니다</span>
                </div>
              )}
            </div>
          </div>
        </Tile>
      )}
    </div>
  );
};

export default AccountDetails;

// Made with Bob
