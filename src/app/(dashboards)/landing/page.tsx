"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button, Card, Typography, Row, Col, Space } from "antd";
import {
  RocketOutlined,
  TeamOutlined,
  DollarOutlined,
  FileTextOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useAuthState } from "@/providers/authProvider";
import { useLandingStyles } from "./landingStyles";

const { Title, Text, Paragraph } = Typography;

const LandingPage = () => {
  const router = useRouter();
  const { user, isSuccess } = useAuthState();
  const { styles } = useLandingStyles();

  useEffect(() => {
    if (isSuccess && user) {
      router.push("/dashboard");
    }
  }, [isSuccess, user, router]);

  const features = [
    {
      icon: <TeamOutlined style={{ fontSize: 48 }} />,
      title: "Client Management",
      description:
        "Manage your clients and contacts efficiently with our comprehensive CRM tools.",
    },
    {
      icon: <DollarOutlined style={{ fontSize: 48 }} />,
      title: "Sales Pipeline",
      description:
        "Track opportunities and monitor your sales pipeline with real-time analytics.",
    },
    {
      icon: <FileTextOutlined style={{ fontSize: 48 }} />,
      title: "Proposals & Contracts",
      description:
        "Create professional proposals and manage contracts seamlessly.",
    },
  ];

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.logoContainer}>
          <RocketOutlined style={{ fontSize: 32, color: "#fff" }} />
          <Title level={3} className={styles.logoText}>
            RocketSales
          </Title>
        </div>
        <Space>
          <Button
            ghost
            style={{ color: "#fff", borderColor: "#fff" }}
            onClick={() => router.push("/login")}
          >
            Login
          </Button>
          <Button
            type="primary"
            style={{ background: "#fff", border: "none" }}
            onClick={() => router.push("/register")}
          >
            Get Started
          </Button>
        </Space>
      </div>

      {/* Hero Section */}
      <div className={styles.heroSection}>
        <Title level={1} className={styles.heroTitle}>
          Supercharge Your Sales Pipeline
        </Title>
        <Paragraph className={styles.heroDescription}>
          RocketSales helps you manage clients, track opportunities, and close
          deals faster with powerful CRM tools designed for modern sales teams.
        </Paragraph>
        <Space size="large">
          <Button
            type="primary"
            size="large"
            style={{ padding: "8px 32px", height: 56 }}
            onClick={() => router.push("/register")}
          >
            Start Free Trial <ArrowRightOutlined />
          </Button>
          <Button
            size="large"
            ghost
            style={{
              color: "#fff",
              borderColor: "#fff",
              padding: "8px 32px",
              height: 56,
            }}
            onClick={() => router.push("/login")}
          >
            View Demo
          </Button>
        </Space>
      </div>

      {/* Features Section */}
      <div className={styles.featuresSection}>
        <div className={styles.featuresContainer}>
          <Title level={2} className={styles.featuresTitle}>
            Everything You Need to Sell More
          </Title>
          <Text type="secondary" className={styles.featuresSubtitle}>
            Powerful features to help your team succeed
          </Text>
          <Row gutter={[32, 32]}>
            {features.map((feature, index) => (
              <Col xs={24} md={8} key={index}>
                <Card hoverable className={styles.featureCard}>
                  <div className={styles.featureIcon}>{feature.icon}</div>
                  <Title level={4}>{feature.title}</Title>
                  <Text type="secondary">{feature.description}</Text>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>

      {/* Stats Section */}
      <div className={styles.statsSection}>
        <div className={styles.statsContainer}>
          <Title level={2} className={styles.statsTitle}>
            Trusted by Sales Teams Worldwide
          </Title>
          <Row gutter={[48, 32]} justify="center">
            <Col xs={12} md={6}>
              <Title level={2} className={styles.statNumber}>
                500+
              </Title>
              <Text className={styles.statLabel}>Active Users</Text>
            </Col>
            <Col xs={12} md={6}>
              <Title level={2} className={styles.statNumber}>
                $50M+
              </Title>
              <Text className={styles.statLabel}>Deals Closed</Text>
            </Col>
            <Col xs={12} md={6}>
              <Title level={2} className={styles.statNumber}>
                98%
              </Title>
              <Text className={styles.statLabel}>Customer Satisfaction</Text>
            </Col>
            <Col xs={12} md={6}>
              <Title level={2} className={styles.statNumber}>
                24/7
              </Title>
              <Text className={styles.statLabel}>Support</Text>
            </Col>
          </Row>
        </div>
      </div>

      {/* CTA Section */}
      <div className={styles.ctaSection}>
        <div className={styles.ctaContainer}>
          <Title level={2}>Ready to Get Started?</Title>
          <Paragraph className={styles.ctaDescription}>
            Join thousands of sales professionals who trust RocketSales to grow
            their business.
          </Paragraph>
          <Button
            type="primary"
            size="large"
            style={{ padding: "8px 48px", height: 56 }}
            onClick={() => router.push("/register")}
          >
            Create Free Account
          </Button>
        </div>
      </div>

      {/* Footer */}
      <div className={styles.footer}>
        <Text className={styles.footerText}>
          © 2024 RocketSales. All rights reserved.
        </Text>
      </div>
    </div>
  );
};

export default LandingPage;
