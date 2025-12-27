import React, { useState } from 'react';
import { Form, Input, Button, Checkbox, Card, Typography, theme } from 'antd';
import { UserOutlined, LockOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import './Login.css';

const { Title, Text } = Typography;

const Login = ({ userType, onLogin, onBack }) => {
    const [loading, setLoading] = useState(false);
    const isStudent = userType === 'Öğrenci';

    const onFinish = (values) => {
        setLoading(true);
        // Simulate network request
        setTimeout(() => {
            console.log('Success:', values);
            onLogin(values.username);
            setLoading(false);
        }, 1000);
    };

    return (
        <div className="login-container fade-in">
            <Card
                className={`login-card-antd ${isStudent ? 'student-theme' : 'teacher-theme'}`}
                bordered={false}
            >
                <div className="login-header">
                    <span className="login-emoji">{isStudent ? '🎓' : '👨‍🏫'}</span>
                    <Title level={2} style={{ marginBottom: 0, color: '#2D3748' }}>
                        {userType} Girişi
                    </Title>
                    <Text type="secondary">
                        Devam etmek için bilgilerinizi giriniz.
                    </Text>
                </div>

                <Form
                    name="normal_login"
                    className="login-form"
                    initialValues={{ remember: true }}
                    onFinish={onFinish}
                    size="large"
                    layout="vertical"
                >
                    <Form.Item
                        name="username"
                        rules={[{ required: true, message: 'Lütfen kullanıcı adınızı girin!' }]}
                    >
                        <Input
                            prefix={<UserOutlined className="site-form-item-icon" />}
                            placeholder="Kullanıcı Adı"
                            autoFocus
                        />
                    </Form.Item>

                    <Form.Item
                        name="password"
                        rules={[{ required: true, message: 'Lütfen şifrenizi girin!' }]}
                    >
                        <Input.Password
                            prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                            placeholder="Şifre"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Form.Item name="remember" valuePropName="checked" noStyle>
                            <Checkbox>Beni Hatırla</Checkbox>
                        </Form.Item>

                        <a className="login-form-forgot" href="#forgot" onClick={(e) => e.preventDefault()}>
                            Şifremi Unuttum
                        </a>
                    </Form.Item>

                    <Form.Item>
                        <Button
                            type="primary"
                            htmlType="submit"
                            className="login-form-button"
                            block
                            loading={loading}
                        >
                            Giriş Yap
                        </Button>
                    </Form.Item>
                </Form>

                <Button
                    type="link"
                    icon={<ArrowLeftOutlined />}
                    onClick={onBack}
                    className="back-button-antd"
                >
                    Ana Sayfaya Dön
                </Button>
            </Card>
        </div>
    );
};

export default Login;
