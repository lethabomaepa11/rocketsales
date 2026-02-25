import { createStyles } from 'antd-style';

export const useSidebarStyles = createStyles(({ css, token }) => ({

  sider: css`
    height: 100vh;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 100;
    background: #0b0f1a !important;
    border-right: 1px solid rgba(255, 255, 255, 0.07);
    display: flex;
    flex-direction: column;

    .ant-layout-sider-children {
      display: flex;
      flex-direction: column;
      height: 100%;
      overflow: hidden;
    }

    .ant-layout-sider-trigger {
      background: #0d1120 !important;
      border-top: 1px solid rgba(255, 255, 255, 0.06);
      color: rgba(255, 255, 255, 0.3);
      font-size: 13px;
      transition: color 0.2s ease;

      &:hover {
        color: rgba(255, 255, 255, 0.75);
      }
    }
  `,

  logoWrap: css`
    padding: 18px 16px 16px;
    flex-shrink: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  `,

  logoInner: css`
    display: flex;
    align-items: center;
    gap: 10px;
    overflow: hidden;
  `,

  logoInnerCollapsed: css`
    justify-content: center;
  `,

  logoMark: css`
    width: 36px;
    height: 36px;
    min-width: 36px;
    border-radius: 9px;
    background: linear-gradient(135deg, #f97316 0%, #c2410c 100%);
    box-shadow: 0 0 18px rgba(249, 115, 22, 0.35);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 800;
    color: #fff;
    letter-spacing: -0.5px;
    font-family: 'Georgia', 'Times New Roman', serif;
    flex-shrink: 0;
  `,

  logoTextGroup: css`
    overflow: hidden;
    display: flex;
    flex-direction: column;
    gap: 2px;
  `,

  logoTitle: css`
    font-size: 13.5px;
    font-weight: 700;
    color: #fff;
    white-space: nowrap;
    line-height: 1;
    letter-spacing: 0.2px;
  `,

  logoSub: css`
    font-size: 9.5px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.28);
    white-space: nowrap;
    letter-spacing: 0.9px;
    text-transform: uppercase;
    line-height: 1;
  `,

  scrollArea: css`
    flex: 1;
    overflow-y: auto;
    overflow-x: hidden;
    padding-bottom: 8px;

    &::-webkit-scrollbar {
      width: 3px;
    }
    &::-webkit-scrollbar-track {
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: rgba(255, 255, 255, 0.08);
      border-radius: 3px;
    }
  `,

  sectionLabel: css`
    padding: 16px 16px 5px;
    font-size: 9.5px;
    font-weight: 700;
    letter-spacing: 1.3px;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.18);
    white-space: nowrap;
    user-select: none;
    line-height: 1;
  `,

  sectionDivider: css`
    height: 1px;
    background: rgba(255, 255, 255, 0.05);
    margin: 10px 14px;
  `,

  menu: css`
    background: transparent !important;
    border-inline-end: none !important;
    padding: 0 8px;

    /* Top-level items and submenu titles */
    .ant-menu-item,
    .ant-menu-submenu-title {
      border-radius: 8px !important;
      margin-block: 2px !important;
      color: rgba(255, 255, 255, 0.48) !important;
      font-size: 13px !important;
      height: 38px !important;
      line-height: 38px !important;
      transition: background 0.15s ease, color 0.15s ease !important;

      &:hover {
        background: rgba(255, 255, 255, 0.06) !important;
        color: rgba(255, 255, 255, 0.9) !important;
      }

      .ant-menu-item-icon {
        font-size: 15px !important;
        color: inherit !important;
        opacity: 0.75;
        transition: opacity 0.15s;
      }

      &:hover .ant-menu-item-icon {
        opacity: 1;
      }
    }

    /* Selected top-level */
    .ant-menu-item-selected {
      background: rgba(249, 115, 22, 0.14) !important;
      color: #fb923c !important;
      font-weight: 600 !important;

      .ant-menu-item-icon {
        opacity: 1;
        color: #fb923c !important;
      }

      &::after {
        border-inline-end: 3px solid #f97316 !important;
        inset-inline-end: 0 !important;
        border-radius: 3px 0 0 3px !important;
      }
    }

    /* Submenu selected title */
    .ant-menu-submenu-selected > .ant-menu-submenu-title {
      color: #fb923c !important;

      .ant-menu-item-icon {
        color: #fb923c !important;
        opacity: 1;
      }
    }

    /* Arrow */
    .ant-menu-submenu-arrow {
      color: rgba(255, 255, 255, 0.2) !important;
      transition: color 0.15s, transform 0.2s !important;
    }

    .ant-menu-submenu:hover > .ant-menu-submenu-title .ant-menu-submenu-arrow,
    .ant-menu-submenu-open > .ant-menu-submenu-title .ant-menu-submenu-arrow {
      color: rgba(255, 255, 255, 0.45) !important;
    }

    /* Sub-menu panel */
    .ant-menu-sub.ant-menu-inline {
      background: transparent !important;
    }

    .ant-menu-sub .ant-menu-item {
      height: 35px !important;
      line-height: 35px !important;
      font-size: 12.5px !important;
      color: rgba(255, 255, 255, 0.38) !important;
      border-radius: 7px !important;
      margin-block: 1px !important;

      &:hover {
        background: rgba(255, 255, 255, 0.05) !important;
        color: rgba(255, 255, 255, 0.8) !important;
      }

      &.ant-menu-item-selected {
        background: rgba(249, 115, 22, 0.12) !important;
        color: #fb923c !important;
        font-weight: 600 !important;

        &::after {
          border-inline-end: 3px solid #f97316 !important;
          inset-inline-end: 0 !important;
          border-radius: 3px 0 0 3px !important;
        }
      }
    }
  `,

  userWrap: css`
    flex-shrink: 0;
    padding: 10px 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.06);
    background: rgba(0, 0, 0, 0.18);
  `,

  userRow: css`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 8px 8px;
    border-radius: 9px;
    cursor: pointer;
    transition: background 0.15s ease;

    &:hover {
      background: rgba(255, 255, 255, 0.06);
    }
  `,

  userRowCollapsed: css`
    justify-content: center;
    padding: 8px;
  `,

  avatar: css`
    width: 32px;
    height: 32px;
    min-width: 32px;
    border-radius: 8px;
    background: linear-gradient(135deg, #f97316 0%, #7c3aed 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 700;
    color: #fff;
    font-family: 'Georgia', serif;
    letter-spacing: 0.3px;
  `,

  userMeta: css`
    overflow: hidden;
    flex: 1;
    min-width: 0;
  `,

  userNameText: css`
    font-size: 12.5px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.85);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    line-height: 1.3;
  `,

  userRoleRow: css`
    display: flex;
    align-items: center;
    gap: 5px;
    margin-top: 2px;
  `,

  roleDot: css`
    width: 5px;
    height: 5px;
    min-width: 5px;
    border-radius: 50%;
    background: #f97316;
  `,

  roleText: css`
    font-size: 10.5px;
    color: rgba(255, 255, 255, 0.3);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  `,

  settingsIcon: css`
    font-size: 14px;
    color: rgba(255, 255, 255, 0.22);
    flex-shrink: 0;
    cursor: pointer;
    transition: color 0.15s;

    &:hover {
      color: rgba(255, 255, 255, 0.65);
    }
  `,

  badge: css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 18px;
    height: 18px;
    border-radius: 9px;
    padding: 0 5px;
    font-size: 10px;
    font-weight: 700;
    line-height: 1;
    margin-left: 6px;
    flex-shrink: 0;
  `,

  badgeRed: css`
    background: rgba(239, 68, 68, 0.18);
    color: #f87171;
  `,

  badgeOrange: css`
    background: rgba(249, 115, 22, 0.15);
    color: #fb923c;
  `,

}));
