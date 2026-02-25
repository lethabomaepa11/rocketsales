"use client";

import { createStyles } from "antd-style";

export const useLandingStyles = createStyles(({ token }) => ({
  container: {
    minHeight: "100vh",
    background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryBg} 100%)`,
  },
  header: {
    padding: "24px 48px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "rgba(255, 255, 255, 0.1)",
    backdropFilter: "blur(10px)",
  },
  logoContainer: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  logoText: {
    margin: 0,
    color: "#fff",
  },
  heroSection: {
    padding: "80px 48px",
    textAlign: "center",
  },
  heroTitle: {
    color: "#fff",
    fontSize: 56,
    marginBottom: 24,
  },
  heroDescription: {
    color: "rgba(255,255,255,0.9)",
    fontSize: 20,
    maxWidth: 700,
    margin: "0 auto 40px",
  },
  featuresSection: {
    padding: "80px 48px",
    background: token.colorBgContainer,
  },
  featuresContainer: {
    maxWidth: 1200,
    margin: "0 auto",
  },
  featuresTitle: {
    textAlign: "center",
    marginBottom: 16,
  },
  featuresSubtitle: {
    display: "block",
    textAlign: "center",
    marginBottom: 48,
    fontSize: 16,
  },
  featureCard: {
    height: "100%",
    textAlign: "center",
    padding: "24px",
    borderRadius: 16,
    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
  },
  featureIcon: {
    marginBottom: 24,
  },
  statsSection: {
    padding: "80px 48px",
    background: `linear-gradient(135deg, ${token.colorPrimary} 0%, ${token.colorPrimaryBg} 100%)`,
  },
  statsContainer: {
    maxWidth: 1200,
    margin: "0 auto",
    textAlign: "center",
  },
  statsTitle: {
    color: "#fff",
    marginBottom: 48,
  },
  statNumber: {
    color: "#fff",
    margin: 0,
  },
  statLabel: {
    color: "rgba(255,255,255,0.8)",
  },
  ctaSection: {
    padding: "80px 48px",
    background: token.colorBgContainer,
    textAlign: "center",
  },
  ctaContainer: {
    maxWidth: 600,
    margin: "0 auto",
  },
  ctaDescription: {
    fontSize: 16,
    marginBottom: 32,
  },
  footer: {
    padding: "24px 48px",
    background: token.colorBgLayout,
    textAlign: "center",
  },
  footerText: {
    color: token.colorTextSecondary,
  },
}));
