import { useState } from 'react';
import {
  Form,
  TextInput,
  Button,
  InlineNotification,
  DataTable,
  Table,
  TableHead,
  TableRow,
  TableHeader,
  TableBody,
  TableCell,
  TableContainer,
  TableToolbar,
  TableToolbarContent,
  TableToolbarSearch,
  DataTableSkeleton,
} from '@carbon/react';
import { Search } from '@carbon/icons-react';
import { getAccountByIban, getTransactions } from '../services/bankService';
import { formatCurrency, formatDateTime, validateIban } from '../utils/formatters';
import './TransactionHistory.scss';

const TransactionHistory = () => {
  const [iban, setIban] = useState('DE89545769475769453536');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const headers = [
    { key: 'booking_ts', header: '거래 일시' },
    { key: 'amount_eur', header: '금액 (EUR)' },
    { key: 'transaction_type', header: '거래 유형' },
    { key: 'description', header: '설명' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setTransactions([]);

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

      const txList = await getTransactions(account.account_id);
      
      // Sort by booking_ts descending (most recent first)
      const sortedTx = txList.sort((a, b) => 
        new Date(b.booking_ts) - new Date(a.booking_ts)
      );

      setTransactions(sortedTx);
    } catch (err) {
      console.error('Transaction history failed:', err);
      setError(
        err.response?.data?.detail || 
        '거래 내역 조회에 실패했습니다. 다시 시도해주세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const rows = transactions.map((tx, index) => ({
    id: `${tx.transaction_id || index}`,
    booking_ts: formatDateTime(tx.booking_ts),
    amount_eur: formatCurrency(tx.amount_eur),
    transaction_type: tx.transaction_type || 'N/A',
    description: tx.description || '-',
  }));

  return (
    <div className="transaction-history">
      <Form onSubmit={handleSubmit}>
        <div className="transaction-history-form">
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
            {loading ? '조회 중...' : '거래 내역 조회'}
          </Button>
        </div>
      </Form>

      {error && (
        <InlineNotification
          kind="error"
          title="오류"
          subtitle={error}
          onCloseButtonClick={() => setError('')}
          className="transaction-notification"
        />
      )}

      {loading && (
        <DataTableSkeleton
          headers={headers}
          aria-label="거래 내역 로딩 중"
          className="transaction-table-skeleton"
        />
      )}

      {!loading && transactions.length > 0 && (
        <DataTable rows={rows} headers={headers} isSortable>
          {({
            rows,
            headers,
            getHeaderProps,
            getRowProps,
            getTableProps,
            getTableContainerProps,
            getToolbarProps,
            onInputChange,
          }) => (
            <TableContainer
              title="거래 내역"
              description={`총 ${transactions.length}건의 거래`}
              {...getTableContainerProps()}
            >
              <TableToolbar {...getToolbarProps()}>
                <TableToolbarContent>
                  <TableToolbarSearch
                    onChange={onInputChange}
                    placeholder="거래 검색..."
                  />
                </TableToolbarContent>
              </TableToolbar>
              <Table {...getTableProps()} aria-label="거래 내역 테이블">
                <TableHead>
                  <TableRow>
                    {headers.map((header) => (
                      <TableHeader
                        key={header.key}
                        {...getHeaderProps({ header })}
                      >
                        {header.header}
                      </TableHeader>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} {...getRowProps({ row })}>
                      {row.cells.map((cell) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </DataTable>
      )}

      {!loading && transactions.length === 0 && !error && iban && (
        <div className="transaction-empty">
          <p>거래 내역이 없습니다.</p>
        </div>
      )}
    </div>
  );
};

export default TransactionHistory;

// Made with Bob
