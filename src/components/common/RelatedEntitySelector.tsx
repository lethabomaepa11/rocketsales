"use client";

import { useEffect, useState } from "react";
import { Select, Spin } from "antd";
import { getAxiosInstance } from "@/utils/axiosInstance";
import { RelatedToType } from "@/providers/activityProvider/types";
import { useStyles } from "./style/RelatedEntitySelector.style";

interface EntityOption {
  id: string;
  title: string;
  subtitle?: string;
}

interface RelatedEntitySelectorProps {
  relatedToType?: RelatedToType;
  disabled?: boolean;
  style?: React.CSSProperties;
  value?: string;
  onChange?: (value: string | undefined) => void;
}

const RelatedEntitySelector: React.FC<RelatedEntitySelectorProps> = ({
  relatedToType,
  disabled = false,
  style,
  value,
  onChange,
}) => {
  const { styles } = useStyles();
  const [entities, setEntities] = useState<EntityOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!relatedToType) {
        setEntities([]);
        return;
      }

      setLoading(true);
      // Reset value when type changes
      onChange?.(undefined);

      try {
        const instance = getAxiosInstance();
        let response;
        let items: EntityOption[] = [];

        switch (relatedToType) {
          case RelatedToType.Client:
            response = await instance.get("/clients", {
              params: { pageSize: 100 },
            });
            items = (response.data.items || response.data || []).map(
              (item: { id: string; name: string; industry?: string }) => ({
                id: item.id,
                title: item.name,
                subtitle: item.industry,
              }),
            );
            break;
          case RelatedToType.Opportunity:
            response = await instance.get("/opportunities", {
              params: { pageSize: 100 },
            });
            items = (response.data.items || response.data || []).map(
              (item: { id: string; title: string; clientName?: string }) => ({
                id: item.id,
                title: item.title,
                subtitle: item.clientName,
              }),
            );
            break;
          case RelatedToType.Proposal:
            response = await instance.get("/proposals", {
              params: { pageSize: 100 },
            });
            items = (response.data.items || response.data || []).map(
              (item: { id: string; title: string; clientName?: string }) => ({
                id: item.id,
                title: item.title,
                subtitle: item.clientName,
              }),
            );
            break;
          case RelatedToType.Contract:
            response = await instance.get("/contracts", {
              params: { pageSize: 100 },
            });
            items = (response.data.items || response.data || []).map(
              (item: { id: string; title: string; clientName?: string }) => ({
                id: item.id,
                title: item.title,
                subtitle: item.clientName,
              }),
            );
            break;
          case RelatedToType.PricingRequest:
            response = await instance.get("/pricingrequests", {
              params: { pageSize: 100 },
            });
            items = (response.data.items || response.data || []).map(
              (item: { id: string; title: string; clientName?: string }) => ({
                id: item.id,
                title: item.title,
                subtitle: item.clientName,
              }),
            );
            break;
        }

        setEntities(items);
      } catch (error) {
        setEntities([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [relatedToType]);

  const getPlaceholder = () => {
    if (!relatedToType) return "Select related type first";
    switch (relatedToType) {
      case RelatedToType.Client:
        return "Select a client...";
      case RelatedToType.Opportunity:
        return "Select an opportunity...";
      case RelatedToType.Proposal:
        return "Select a proposal...";
      case RelatedToType.Contract:
        return "Select a contract...";
      case RelatedToType.PricingRequest:
        return "Select a pricing request...";
      default:
        return "Select an item...";
    }
  };

  const entityOptions = entities.map((entity) => ({
    label: (
      <div className={styles.entityOption}>
        <span className={styles.entityTitle}>{entity.title}</span>
        {entity.subtitle && (
          <span className={styles.entitySubtitle}>{entity.subtitle}</span>
        )}
      </div>
    ),
    value: entity.id,
    title: entity.title,
  }));

  return (
    <Select
      showSearch
      placeholder={
        relatedToType ? getPlaceholder() : "Select related type first"
      }
      disabled={disabled || !relatedToType}
      className={styles.selector}
      style={style}
      loading={loading}
      notFoundContent={loading ? <Spin size="small" /> : "No items found"}
      allowClear
      options={entityOptions}
      value={value}
      onChange={onChange}
    />
  );
};

export default RelatedEntitySelector;
