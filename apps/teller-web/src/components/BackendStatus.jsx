import { useState, useEffect } from 'react';
import { Tag } from '@carbon/react';
import { Checkmark, WarningAlt } from '@carbon/icons-react';
import { checkHealth } from '../services/bankService';
import './BackendStatus.scss';

const BackendStatus = () => {
  const [isOnline, setIsOnline] = useState(null);
  const [lastChecked, setLastChecked] = useState(null);

  const checkBackendHealth = async () => {
    try {
      const healthy = await checkHealth();
      setIsOnline(healthy);
      setLastChecked(new Date());
    } catch (error) {
      setIsOnline(false);
      setLastChecked(new Date());
    }
  };

  useEffect(() => {
    // Initial check
    checkBackendHealth();

    // Set up periodic health checks
    const interval = setInterval(
      checkBackendHealth,
      parseInt(import.meta.env.VITE_HEALTH_CHECK_INTERVAL) || 30000
    );

    return () => clearInterval(interval);
  }, []);

  if (isOnline === null) {
    return (
      <Tag type="gray" size="sm" className="backend-status">
        백엔드 확인 중...
      </Tag>
    );
  }

  return (
    <Tag
      type={isOnline ? 'green' : 'red'}
      size="sm"
      renderIcon={isOnline ? Checkmark : WarningAlt}
      className="backend-status"
      title={lastChecked ? `마지막 확인: ${lastChecked.toLocaleTimeString('ko-KR')}` : ''}
    >
      백엔드 {isOnline ? '온라인' : '오프라인'}
    </Tag>
  );
};

export default BackendStatus;

// Made with Bob
