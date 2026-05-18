import { Flex, Button, Empty, Card, Spin } from "antd";
import type { ReactNode } from "react";

type DataCartProps<TData> = {
  title: string;
  handleReset: () => void;
  isLoading: boolean;
  data: TData | undefined;
  renderData: (data: TData) => ReactNode;
};

export const DataCard = <TData extends Array<any>>({
  title,
  data,
  isLoading,
  renderData,
  handleReset,
}: DataCartProps<TData>) => {
  return (
    <Card title={title}>
      <Flex
        align="center"
        justify="center"
        vertical
        style={{ minHeight: "500px" }}
        gap="2em"
      >
        {isLoading ? (
          <Spin size="large" />
        ) : !data?.length ? (
          <>
            <Empty />
            <Button onClick={handleReset}>✕ Reset filters</Button>
          </>
        ) : (
          renderData(data)
        )}
      </Flex>
    </Card>
  );
};
