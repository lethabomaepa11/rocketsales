import { createStyles } from "antd-style";

export const useStyles = createStyles(({ token, css }) => ({
  kanbanContainer: css`
    display: flex;
    gap: 16px;
    overflow-x: auto;
    padding: 16px 0;
    min-height: 600px;
  `,

  kanbanColumn: css`
    min-width: 280px;
    max-width: 320px;
    flex: 1;
    background: ${token.colorFillTertiary};
    border-radius: ${token.borderRadiusLG}px;
    display: flex;
    flex-direction: column;
    max-height: 70vh;
  `,

  columnHeader: css`
    padding: 16px;
    border-bottom: 1px solid ${token.colorBorderSecondary};
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: ${token.colorFillSecondary};
    border-radius: ${token.borderRadiusLG}px ${token.borderRadiusLG}px 0 0;
  `,

  columnTitle: css`
    font-weight: 600;
    font-size: 14px;
    display: flex;
    align-items: center;
    gap: 8px;
  `,

  columnCount: css`
    background: ${token.colorPrimary};
    color: ${token.colorWhite};
    padding: 2px 8px;
    border-radius: ${token.borderRadiusSM}px;
    font-size: 12px;
    font-weight: 600;
  `,

  columnContent: css`
    flex: 1;
    overflow-y: auto;
    padding: 12px;
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-height: 100px;
  `,

  kanbanCard: css`
    background: ${token.colorBgContainer};
    border: 1px solid ${token.colorBorder};
    border-radius: ${token.borderRadius}px;
    padding: 12px;
    cursor: grab;
    transition: all 0.2s ease;
    box-shadow: ${token.boxShadowTertiary};

    &:hover {
      box-shadow: ${token.boxShadowSecondary};
      border-color: ${token.colorPrimaryBorder};
    }

    &:active {
      cursor: grabbing;
    }
  `,

  cardDragging: css`
    opacity: 0.5;
    transform: rotate(2deg);
    box-shadow: ${token.boxShadow};
  `,

  cardTitle: css`
    font-weight: 600;
    font-size: 14px;
    margin-bottom: 8px;
    color: ${token.colorTextHeading};
    line-height: 1.4;
  `,

  cardMeta: css`
    display: flex;
    flex-direction: column;
    gap: 6px;
    font-size: 12px;
    color: ${token.colorTextSecondary};
  `,

  cardMetaRow: css`
    display: flex;
    align-items: center;
    gap: 6px;
  `,

  cardValue: css`
    font-weight: 600;
    color: ${token.colorPrimary};
  `,

  cardProbability: css`
    margin-top: 8px;
  `,

  columnDroppable: css`
    min-height: 100px;
    border-radius: ${token.borderRadius}px;
    transition: background 0.2s ease;

    &.isOver {
      background: ${token.colorPrimaryBg};
      border: 2px dashed ${token.colorPrimaryBorder};
    }
  `,

  viewToggle: css`
    display: flex;
    gap: 8px;
    align-items: center;
  `,

  emptyColumn: css`
    text-align: center;
    padding: 32px 16px;
    color: ${token.colorTextTertiary};
    font-size: 13px;
  `,

  cardFooter: css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 12px;
    padding-top: 12px;
    border-top: 1px solid ${token.colorBorderSecondary};
  `,

  cardOwner: css`
    font-size: 11px;
    color: ${token.colorTextTertiary};
  `,

  dragHandle: css`
    color: ${token.colorTextTertiary};
    cursor: grab;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 4px;
    border-radius: ${token.borderRadiusSM}px;

    &:hover {
      background: ${token.colorFillSecondary};
      color: ${token.colorTextSecondary};
    }
  `,
}));
