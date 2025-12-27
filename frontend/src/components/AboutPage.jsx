import React from 'react';
import { Card, Typography, Divider, Row, Col } from 'antd';
import { BulbOutlined, CheckCircleOutlined, LineChartOutlined } from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const AboutPage = () => {
    return (
        <div style={{ padding: '40px 20px', display: 'flex', justifyContent: 'center', width: '100%' }}>
            <Card
                bordered={false}
                style={{
                    maxWidth: '1000px',
                    width: '100%',
                    borderRadius: '16px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    backgroundColor: 'rgba(255, 255, 255, 0.95)', // Slight transparency for glass feel if needed, or solid white
                }}
            >
                {/* Başlık Alanı */}
                <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                    <Title level={2} style={{ color: '#001529', marginBottom: '16px' }}>
                        Veriye Dayalı Başarı: Yeni Nesil Sınav Analiz ve Takip Platformu
                    </Title>
                    <Divider style={{ borderColor: '#1890ff', borderTopWidth: '4px', width: '60px', minWidth: '60px', margin: '16px auto' }} />
                </div>

                {/* İçerik Bölümleri */}
                <Row gutter={[40, 40]}>
                    {/* Biz Kimiz? */}
                    <Col span={24}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <BulbOutlined style={{ fontSize: '32px', color: '#1890ff', marginTop: '4px' }} />
                            <div>
                                <Title level={3} style={{ color: '#001529', marginTop: 0 }}>Biz Kimiz?</Title>
                                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#595959' }}>
                                    Eğitimde başarının doğru veriyi yorumlamaktan geçtiğine inanan, teknolojiyi eğitimle
                                    buluşturan bir kolektifiz. Türkiye genelinde LGS ve YKS hazırlık sürecindeki öğrencilerin
                                    potansiyellerini en üst seviyeye çıkarmaları için veri odaklı çözümler üretiyoruz.
                                    Ezbere dayalı değil, analize dayalı bir çalışma modelini benimsiyoruz.
                                </Paragraph>
                            </div>
                        </div>
                    </Col>

                    {/* Projemizin Amacı */}
                    <Col span={24}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <CheckCircleOutlined style={{ fontSize: '32px', color: '#1890ff', marginTop: '4px' }} />
                            <div>
                                <Title level={3} style={{ color: '#001529', marginTop: 0 }}>Projemizin Amacı</Title>
                                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#595959' }}>
                                    Karmaşık sınav verilerini somut, anlaşılır ve eyleme dökülebilir içgörülere dönüştürmek temel amacımızdır.
                                </Paragraph>
                                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                                    <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', fontSize: '16px', color: '#595959' }}>
                                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '10px' }} />
                                        Otomatik net ve puan hesaplama ile zaman kaybını önleme.
                                    </li>
                                    <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', fontSize: '16px', color: '#595959' }}>
                                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '10px' }} />
                                        Kişiselleştirilmiş performans izleme ve gelişim raporları.
                                    </li>
                                    <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', fontSize: '16px', color: '#595959' }}>
                                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: '10px' }} />
                                        Nokta atışı konu analizi ile eksikleri anında tespit etme.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Col>

                    {/* Neyi Hedefliyoruz? */}
                    <Col span={24}>
                        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                            <LineChartOutlined style={{ fontSize: '32px', color: '#1890ff', marginTop: '4px' }} />
                            <div>
                                <Title level={3} style={{ color: '#001529', marginTop: 0 }}>Neyi Hedefliyoruz?</Title>
                                <Paragraph style={{ fontSize: '16px', lineHeight: '1.8', color: '#595959' }}>
                                    Eğitimde fırsat eşitliğini teknolojiyle desteklemeyi ve her öğrencinin kendi hızında
                                    gelişebileceği bir ekosistem yaratmayı hedefliyoruz. Öğretmenlerimizin üzerindeki
                                    analiz yükünü alarak, onların asıl işi olan "rehberlik" ve "öğretim" süreçlerine
                                    daha fazla zaman ayırmalarını sağlamayı vizyon edindik.
                                </Paragraph>
                            </div>
                        </div>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default AboutPage;
