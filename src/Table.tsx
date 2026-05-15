import { Table as AntDesignTable } from "antd";

type ColumnDataIndex<T extends string> = { [K in T]: number | string };

export const Table = ({ rows }: { rows: any }) => {
  const sortByDataIndex =
    (dataIndex: string) =>
    (
      a: ColumnDataIndex<typeof dataIndex>,
      b: ColumnDataIndex<typeof dataIndex>,
    ) => {
      if (
        typeof a[dataIndex] === "number" &&
        typeof b[dataIndex] === "number"
      ) {
        return a[dataIndex] - b[dataIndex];
      } else {
        return (a[dataIndex] as string).localeCompare(b[dataIndex] as string);
      }
    };

  const columns = [
    {
      title: "Quarter",
      dataIndex: "period",
      key: "shot",
      sorter: sortByDataIndex("period"),
    },
    {
      title: "Shot X",
      dataIndex: "x",
      key: "shot_x",
      sorter: sortByDataIndex("x"),
    },
    {
      title: "Shot Y",
      dataIndex: "y",
      key: "shot_y",
      sorter: sortByDataIndex("y"),
    },
    {
      title: "Player",
      dataIndex: "shooter_name",
      key: "shooter_name",
      sorter: sortByDataIndex("shooter_name"),
    },
  ];

  return (
    <AntDesignTable
      dataSource={rows}
      columns={columns}
      pagination={{ pageSize: 25 }}
      size="small"
      rowKey={(row) =>
        `${row.shooter_id}-${row.year}-${row.month}-${row.day}-${row.start_game_clock}`
      }
      scroll={{ y: "80vh", x: "100%" }}
    />
  );
};
