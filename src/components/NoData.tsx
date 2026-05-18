import { Button, Empty } from "antd";

export const NoData = ({ onReset }: { onReset: () => void }) => (
  <>
    <Empty />
    <Button onClick={onReset}>✕ Reset filters</Button>
  </>
);
