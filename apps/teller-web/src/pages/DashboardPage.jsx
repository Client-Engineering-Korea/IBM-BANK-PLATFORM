import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Header,
  HeaderName,
  HeaderGlobalBar,
  HeaderGlobalAction,
  Content,
  Grid,
  Column,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
} from '@carbon/react';
import { Logout, User } from '@carbon/icons-react';
import { logout, getCurrentUser } from '../services/authService';
import BackendStatus from '../components/BackendStatus';
import BalanceInquiry from '../components/BalanceInquiry';
import TransactionHistory from '../components/TransactionHistory';
import Transfer from '../components/Transfer';
import OverdraftRequest from '../components/OverdraftRequest';
import AccountDetails from '../components/AccountDetails';
import './DashboardPage.scss';

const DashboardPage = () => {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const [selectedTab, setSelectedTab] = useState(0);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="dashboard-page">
      <Header aria-label="IBM Bank Teller Portal">
        <HeaderName prefix="IBM">
          Bank
        </HeaderName>
        <HeaderGlobalBar>
          <BackendStatus />
          <HeaderGlobalAction
            aria-label="User"
            tooltipAlignment="end"
          >
            <User size={20} />
            <span className="user-name">{currentUser}</span>
          </HeaderGlobalAction>
          <HeaderGlobalAction
            aria-label="Logout"
            tooltipAlignment="end"
            onClick={handleLogout}
          >
            <Logout size={20} />
          </HeaderGlobalAction>
        </HeaderGlobalBar>
      </Header>

      <Content className="dashboard-content">
        <Grid>
          <Column sm={4} md={8} lg={16}>
            <div className="dashboard-header">
              <h1>텔러 포털</h1>
              <p>IBM Bank 텔러 업무 시스템</p>
            </div>
          </Column>
        </Grid>

        <Grid>
          <Column sm={4} md={8} lg={16}>
            <Tabs
              selectedIndex={selectedTab}
              onChange={(e) => setSelectedTab(e.selectedIndex)}
            >
              <TabList aria-label="Teller operations">
                <Tab>잔액 조회</Tab>
                <Tab>거래 내역</Tab>
                <Tab>계좌 이체</Tab>
                <Tab>마이너스 통장 요청</Tab>
                <Tab>계좌 상세</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <BalanceInquiry />
                </TabPanel>
                <TabPanel>
                  <TransactionHistory />
                </TabPanel>
                <TabPanel>
                  <Transfer />
                </TabPanel>
                <TabPanel>
                  <OverdraftRequest />
                </TabPanel>
                <TabPanel>
                  <AccountDetails />
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Column>
        </Grid>
      </Content>
    </div>
  );
};

export default DashboardPage;

// Made with Bob
