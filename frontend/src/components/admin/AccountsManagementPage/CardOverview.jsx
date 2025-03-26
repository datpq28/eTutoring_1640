import { Avatar, Card, Flex, Space, Typography } from "antd";
import ArrowDownRightIcon from "../../customIcon/ArrowDownRightIcon.jsx";
import { TeamOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
const { Title, Text } = Typography;
export default function CardOverview({
  iconCard = <TeamOutlined />,
  titleCard = "Students",
  colorChart = "#9370db",
  data = [
    {
      date: "Mon",
      quantity: 2400,
    },
    {
      date: "Tue",
      quantity: 1398,
    },
    {
      date: "Wed",
      quantity: 9800,
    },
    {
      date: "Thus",
      quantity: 3908,
    },
    {
      date: "Fri",
      quantity: 4800,
    },
    {
      date: "Sat",
      quantity: 3800,
    },
    {
      date: "Sun",
      quantity: 4300,
    },
  ],
}) {
  return (
    <Card
      title={
        <Space size="middle" align="center">
          <Avatar
            shape="square"
            icon={iconCard}
            style={{
              backgroundColor: "#f1f5f9",
              color: "#4a586b",
            }}
          />
          <Title level={5} style={{ color: "#4a586b", margin: 0 }}>
            {titleCard}
          </Title>
        </Space>
      }
      extra={<ArrowDownRightIcon style={{ marginTop: "1rem" }} />}
    >
      <Title level={3} style={{ margin: 0 }}>
        1000
      </Title>
      <Text>
        <Text type="success">+12%</Text> compared to last week
      </Text>
      <ResponsiveContainer width="100%" height={100}>
        <BarChart data={data}>
          <XAxis
            dataKey="quantity"
            padding="gap"
            tick={{ fontSize: "1.2rem", dy: 6 }}
            axisLine={false}
            tickLine={false}
            // angle={-45}
            tickFormatter={(value, index) => data[index].date}
            interval={0} // Hiển thị tất cả nhãn
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar
            dataKey="quantity"
            fill={colorChart}
            activeBar={<Rectangle fill="pink" stroke="blue" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const dataItem = payload[0].payload; // 📌 Truy cập vào object data

    return (
      <Card size="small">
        <Flex vertical gap="small">
          <Title level={5}>Date: {dataItem.date}</Title>
          <Text>Quantity: {dataItem.quantity}</Text>
        </Flex>
      </Card>
    );
  }
  return null;
};
