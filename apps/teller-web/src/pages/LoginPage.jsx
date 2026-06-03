import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form,
  TextInput,
  PasswordInput,
  Button,
  InlineNotification,
  Grid,
  Column,
} from '@carbon/react';
import { login } from '../services/authService';
import './LoginPage.scss';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: import.meta.env.VITE_TELLER_USERNAME || '',
    password: import.meta.env.VITE_TELLER_PASSWORD || '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = '사용자 이름을 입력하세요';
    }
    
    if (!formData.password) {
      newErrors.password = '비밀번호를 입력하세요';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    
    try {
      await login(formData.username, formData.password);
      navigate('/dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      setErrorMessage(
        error.response?.data?.detail || 
        '로그인에 실패했습니다. 사용자 이름과 비밀번호를 확인하세요.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
    // Clear error for this field
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: '',
      }));
    }
  };

  return (
    <div className="login-page">
      <Grid>
        <Column sm={4} md={6} lg={8} className="login-column">
          <div className="login-container">
            <div className="login-header">
              <h1>IBM Bank</h1>
              <h2>텔러 포털</h2>
            </div>

            {errorMessage && (
              <InlineNotification
                kind="error"
                title="로그인 오류"
                subtitle={errorMessage}
                onCloseButtonClick={() => setErrorMessage('')}
                className="login-notification"
              />
            )}

            <Form onSubmit={handleSubmit} className="login-form">
              <TextInput
                id="username"
                labelText="사용자 이름"
                placeholder="사용자 이름을 입력하세요"
                value={formData.username}
                onChange={handleChange}
                invalid={!!errors.username}
                invalidText={errors.username}
                disabled={loading}
              />

              <PasswordInput
                id="password"
                labelText="비밀번호"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                invalid={!!errors.password}
                invalidText={errors.password}
                disabled={loading}
              />

              <Button
                type="submit"
                kind="primary"
                disabled={loading}
                className="login-button"
              >
                {loading ? '로그인 중...' : '로그인'}
              </Button>
            </Form>

            <div className="login-footer">
              <p className="login-info">
                테스트 계정: teller1 / password1
              </p>
            </div>
          </div>
        </Column>
      </Grid>
    </div>
  );
};

export default LoginPage;

// Made with Bob
