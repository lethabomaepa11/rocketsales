import type { ThemeConfig } from 'antd';
import { theme } from 'antd';

const { defaultAlgorithm, darkAlgorithm } = theme;

// Light theme configuration
export const lightTheme: ThemeConfig = {
  algorithm: defaultAlgorithm,
  token: {
    fontSize: 16,
    colorPrimary: '#DF6D27',
    borderRadius: 15,
  },
};

// Dark theme configuration
export const darkTheme: ThemeConfig = {
  algorithm: darkAlgorithm,
  token: {
    fontSize: 16,
    colorPrimary: '#DF6D27',
    borderRadius: 15,
    colorBgBase: '#141414', // Dark background color
    colorBgContainer: '#1f1f1f', // Container background
    colorTextBase: '#ffffff', // Base text color
    colorTextSecondary: '#bfbfbf', // Secondary text color
    colorBorder: '#434343', // Border color
  },
};

// Default export for backwards compatibility
const themeConfig: ThemeConfig = lightTheme;

export default themeConfig;
