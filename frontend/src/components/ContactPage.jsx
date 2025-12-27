import React from 'react';
import { Form, Input, Button, Layout, Row, Col, Typography, message, Card } from 'antd';
import { MailOutlined, PhoneOutlined, EnvironmentOutlined, SendOutlined } from '@ant-design/icons';

const { Content } = Layout;
const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;

const ContactPage = () => {
    const [form] = Form.useForm();

    const onFinish = (values) => {
        console.log('Received values of form: ', values);
        message.success('Mesajınız başarıyla iletildi!');
        form.resetFields();
    };

    return (
        <Content style={{ padding: '50px 20px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
            <Row gutter={[32, 32]} style={{ maxWidth: '1200px', width: '100%', margin: '0' }}>

                {/* Sol Sütun: Bilgi Kartı */}
                <Col xs={24} md={12} lg={10}>
                    <Card
                        bordered={false}
                        style={{
                            height: '100%',
                            backgroundColor: '#001529',
                            color: '#ffffff',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center'
                        }}
                    >
                        <div style={{ marginBottom: '40px' }}>
                            <Title level={2} style={{ color: '#ffffff', marginBottom: '16px' }}>Bize Ulaşın</Title>
                            <Paragraph style={{ color: 'rgba(255,255,255,0.85)', fontSize: '16px' }}>
                                Sorularınız, görüşleriniz veya önerileriniz için bizimle iletişime geçmekten çekinmeyin.
                            </Paragraph>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <MailOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                <Text style={{ color: '#ffffff', fontSize: '16px' }}>destek@izlem.com</Text>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <PhoneOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                <Text style={{ color: '#ffffff', fontSize: '16px' }}>+90 850 000 00 00</Text>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <EnvironmentOutlined style={{ fontSize: '24px', color: '#1890ff' }} />
                                <Text style={{ color: '#ffffff', fontSize: '16px' }}>
                                    Gaziantep İzlem Ofis
                                </Text>
                            </div>
                        </div>
                    </Card>
                </Col>

                {/* Sağ Sütun: İletişim Formu */}
                <Col xs={24} md={12} lg={14}>
                    <Card
                        bordered={false}
                        style={{
                            height: '100%',
                            borderRadius: '16px',
                            padding: '24px',
                            boxShadow: '0 8px 30px rgba(0,0,0,0.1)',
                            backgroundColor: '#ffffff'
                        }}
                    >
                        <Title level={3} style={{ marginBottom: '32px', color: '#001529' }}>İletişim Formu</Title>
                        <Form
                            form={form}
                            layout="vertical"
                            onFinish={onFinish}
                            size="large"
                        >
                            <Form.Item
                                name="name"
                                label="Ad Soyad"
                                rules={[{ required: true, message: 'Lütfen adınızı ve soyadınızı giriniz!' }]}
                            >
                                <Input placeholder="Adınız ve Soyadınız" />
                            </Form.Item>

                            <Form.Item
                                name="email"
                                label="E-posta"
                                rules={[
                                    { type: 'email', message: 'Geçerli bir E-posta giriniz!' },
                                    { required: true, message: 'Lütfen E-posta adresinizi giriniz!' }
                                ]}
                            >
                                <Input placeholder="ornek@domain.com" />
                            </Form.Item>

                            <Form.Item
                                name="subject"
                                label="Konu"
                                rules={[{ required: true, message: 'Lütfen mesaj konusunu giriniz!' }]}
                            >
                                <Input placeholder="Mesajınızın konusu" />
                            </Form.Item>

                            <Form.Item
                                name="message"
                                label="Mesaj"
                                rules={[{ required: true, message: 'Lütfen mesajınızı giriniz!' }]}
                            >
                                <TextArea rows={5} placeholder="Bize iletmek istediğiniz mesaj..." />
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit" size="large" icon={<SendOutlined />} block style={{ marginTop: '16px', height: '50px', fontSize: '16px' }}>
                                    Gönder
                                </Button>
                            </Form.Item>
                        </Form>
                    </Card>
                </Col>
            </Row>
        </Content>
    );
};

export default ContactPage;
