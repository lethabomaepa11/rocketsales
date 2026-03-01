"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Typography, Row, Col, Space } from "antd";
import {
  RocketOutlined,
  TeamOutlined,
  DollarOutlined,
  FileTextOutlined,
  LockOutlined,
} from "@ant-design/icons";
import { useAuthState } from "@/providers/authProvider";
import { useStyles } from "./style/page.style";

const { Title, Text, Paragraph } = Typography;

const LandingPage = () => {
  const router = useRouter();
  const { user, isSuccess } = useAuthState();
  const { styles } = useStyles();

  useEffect(() => {
    if (isSuccess && user) {
      router.push("/dashboard");
    }
  }, [isSuccess, user, router]);

  const features = [
    {
      icon: <TeamOutlined className={styles.featureIconSize} />,
      title: "Client Management",
      description:
        "Centralized client and contact management for your organization. Keep track of all customer interactions in one place.",
    },
    {
      icon: <DollarOutlined className={styles.featureIconSize} />,
      title: "Sales Pipeline",
      description:
        "Visual pipeline management to track opportunities from lead to close. Monitor deal progress and team performance.",
    },
    {
      icon: <FileTextOutlined className={styles.featureIconSize} />,
      title: "Proposals & Contracts",
      description:
        "Generate professional proposals and manage contracts efficiently. Streamline your sales documentation process.",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <RocketOutlined className={styles.logoIcon} />
          <Title level={3} className={styles.logoText}>
            RocketSales
          </Title>
        </div>
        <Space>
          <Button
            type="primary"
            className={styles.loginButton}
            icon={<LockOutlined />}
            onClick={() => router.push("/login")}
          >
            Login to System
          </Button>
        </Space>
      </div>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <Title level={1} className={styles.heroTitle}>
          Sales Management Platform
        </Title>
        <Paragraph className={styles.heroDescription}>
          A comprehensive internal system for managing client relationships,
          tracking sales opportunities, and streamlining your organization's
          sales processes.
        </Paragraph>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            className={styles.heroPrimaryButton}
            icon={<LockOutlined />}
            onClick={() => router.push("/login")}
          >
            Access System
          </Button>
        </Space>
      </div>

      {/* Features Section */}
      <div className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <Title level={2} className={styles.featuresTitle}>
            Platform Features
          </Title>
          <Text type="secondary" className={styles.featuresSubtitle}>
            Tools designed to support your sales team
          </Text>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} md={8} key={index}>
                <Card className={styles.featureCard}>
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <Title level={4}>{feature.title}</Title>
                  <Text type="secondary">{feature.description}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <Title level={2}>Authorized Access Only</Title>
          <Paragraph className={styles.ctaDescription}>
            This is an internal system. Please log in with your company
            credentials to access the platform.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            className={styles.ctaButton}
            icon={<LockOutlined />}
            onClick={() => router.push("/login")}
          >
            Login to System
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <Text className={styles.footerText}>© 2026 RocketSales.</Text>
      </div>
    </div>
  );
};

export default LandingPage;
