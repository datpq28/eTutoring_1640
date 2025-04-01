import { Avatar, Card, Space, Typography } from "antd";
import { VideoCameraOutlined } from "@ant-design/icons";
const { Title } = Typography;
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  Tooltip,
  ResponsiveContainer,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

export default function CardMeetingOverview({ meetingList }) {
  const data = [
    {
      meeting: meetingList?.length || 1,
    },
  ];
  return (
    <Card
      title={
        <Space size="middle" align="center">
          <Title level={5} style={{ color: "#4a586b", margin: 0 }}>
            Meeting
          </Title>
        </Space>
      }
      style={{ flex: 1 }}
      extra={
        <Avatar
          shape="square"
          icon={<VideoCameraOutlined />}
          style={{
            backgroundColor: "#f1f5f9",
            color: "#4a586b",
          }}
        />
      }
    >
      <ResponsiveContainer width="100%" height={200}>
        <BarChart width="100%" height="100%" data={data} margin={{ left: -40 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />

          <Bar
            dataKey="meeting"
            fill="#82ca9d"
            activeBar={<Rectangle fill="white" stroke="#87cefa" />}
          />
        </BarChart>
      </ResponsiveContainer>
    </Card>
  );
}

// const CustomTooltip = ({ active, payload }) => {
//   if (active && payload && payload.length) {
//     const dataItem = payload[0].payload; // 📌 Truy cập vào object data

//     return (
//       <Card size="small">
//         <Flex vertical gap="small">
//           <Text>Quantity: {dataItem.quantity}</Text>
//         </Flex>
//       </Card>
//     );
//   }
//   return null;
// };
