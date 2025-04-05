import { Card, Col, Flex, Layout, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import { viewListUser } from "../../../api_service/admin_service.js";
import CardUserOverview from "../../components/admin/AccountsManagementPage/CardUserOverview.jsx";
import CardBlogOverView from "../../components/admin/AccountsManagementPage/CardBlogOverview.jsx";
import { getBlogs } from "../../../api_service/blog_service.js";
import CardDocumentOverview from "../../components/admin/AccountsManagementPage/CardDocumentOverView.jsx";
import { getDocuments } from "../../../api_service/document_service.js";
import { fetchMeetingsByTutor } from "../../../api_service/meeting_service.js";
import CardMeetingOverview from "../../components/admin/AccountsManagementPage/CardMeetingOverview.jsx";
import { getAllMessages } from "../../../api_service/mesages_service.js";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import LoadingSection from "../../components/common/LoadingSection.jsx";

const { Content } = Layout;
const { Title, Text } = Typography;
export default function DashboardPage() {
  const [userList, setUserList] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [meetingList, setMeetingList] = useState([]);
  const [messageList, setMessageList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const activityMonday =
    userList?.students?.length +
    userList?.tutors?.length +
    blogList?.filter((blog) => blog.createdAt === "Monday").length +
    documentList?.filter((document) => document.createdAt === "Monday").length +
    messageList?.filter((message) => message.timestamp === "Monday").length;

  const activityTuesday =
    userList?.students?.length +
    userList?.tutors?.length +
    blogList?.filter((blog) => blog.createdAt === "Tuesday").length +
    documentList?.filter((document) => document.createdAt === "Tuesday")
      .length +
    messageList?.filter((message) => message.timestamp === "Tuesday").length;

  const activityWednesday =
    userList?.students?.length +
    userList?.tutors?.length +
    blogList?.filter((blog) => blog.createdAt === "Wednesday").length +
    documentList?.filter((document) => document.createdAt === "Wednesday")
      .length +
    messageList?.filter((message) => message.timestamp === "Wednesday").length;

  const activityThursday =
    userList?.students?.length +
    userList?.tutors?.length +
    blogList?.filter((blog) => blog.createdAt === "Thursday").length +
    documentList?.filter((document) => document.createdAt === "Thursday")
      .length +
    messageList?.filter((message) => message.timestamp === "Thursday").length;

  const activityFriday =
    userList?.students?.length +
    userList?.tutors?.length +
    blogList?.filter((blog) => blog.createdAt === "Friday").length +
    documentList?.filter((document) => document.createdAt === "Friday").length +
    messageList?.filter((message) => message.timestamp === "Friday").length;

  const activitySaturday =
    userList?.students?.length +
    userList?.tutors?.length +
    blogList?.filter((blog) => blog.createdAt === "Saturday").length +
    documentList?.filter((document) => document.createdAt === "Saturday")
      .length +
    messageList?.filter((message) => message.timestamp === "Saturday").length;

  const activitySunday =
    userList?.students?.length +
    userList?.tutors?.length +
    blogList?.filter((blog) => blog.createdAt === "Sunday").length +
    documentList?.filter((document) => document.createdAt === "Sunday").length +
    messageList?.filter((message) => message.timestamp === "Sunday").length;

  console.log("documentList", documentList);
  const data = [
    {
      name: "Monday",
      activity: activityMonday,
    },
    {
      name: "Tuesday",
      activity: activityTuesday,
    },
    {
      name: "Wednesday",
      activity: activityWednesday,
    },
    {
      name: "Thursday",
      activity: activityThursday,
    },
    {
      name: "Friday",
      activity: activityFriday,
    },
    {
      name: "Saturday",
      activity: activitySaturday,
    },
    {
      name: "Sunday",
      activity: activitySunday,
    },
  ];
  useEffect(() => {
    setIsLoading(true);
    const fetchAllUser = async () => {
      const data = await viewListUser();
      setUserList(data);
    };
    const fetchAllBlog = async () => {
      const data = await getBlogs();
      const newData = data.map((blog) => {
        const date = new Date(blog.createdAt);
        const dayName = date.toLocaleString("en-US", { weekday: "long" });
        return {
          ...blog,
          createdAt: dayName,
        };
      });
      setBlogList(newData);
    };
    const fetchAllDocument = async () => {
      const data = await getDocuments();
      const updatedDocumentList = data.map((document) => {
        const date = new Date(document.createdAt);
        const dayName = date.toLocaleString("en-US", { weekday: "long" });
        return {
          ...document,
          createdAt: dayName,
        };
      });
      setDocumentList(updatedDocumentList);
    };
    const fetchAllMeeting = async () => {
      const data = await fetchMeetingsByTutor();
      setMeetingList(data);
    };
    const fetchConversations = async () => {
      const data = await getAllMessages();
      const allContents = data.data
        .map((message) => message.contents.map((content) => content))
        .flat();
      const newContents = allContents.map((content) => {
        const date = new Date(content.timestamp);
        const dayName = date.toLocaleString("en-US", { weekday: "long" });
        return {
          ...content,
          timestamp: dayName,
        };
      });
      setMessageList(newContents);
      console.log("newContents:", newContents);
    };
    fetchAllUser();
    fetchAllBlog();
    fetchAllDocument();
    fetchAllMeeting();
    fetchConversations();
    setIsLoading(false);
  }, []);

  return (
    <Content style={stylesInline.content}>
      {isLoading ? (
        <LoadingSection length={3} />
      ) : (
        <Flex vertical gap="middle">
          <Row gutter={[16, 16]} wrap>
            <Col xs={24} md={12} lg={6}>
              <CardUserOverview userList={userList} />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <CardBlogOverView blogList={blogList} />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <CardDocumentOverview documentList={documentList} />
            </Col>
            <Col xs={24} md={12} lg={6}>
              <CardMeetingOverview meetingList={meetingList} />
            </Col>
          </Row>
          <Card
            title={
              <Flex vertical gap="small">
                <Title level={3} style={{ margin: 0 }}>
                  System Activity
                </Title>
                <Text style={{ margin: 0, color: "#7b889c" }}>
                  Messages, meetings, and document uploads over the past week
                </Text>
              </Flex>
            }
            classNames={{
              header: "my-card",
            }}
            styles={{
              header: {
                color: "white",
                width: "100%",
                paddingTop: "1.6rem",
                paddingBottom: "1.6rem",
              },
            }}
          >
            <ResponsiveContainer width="100%" height={500}>
              <AreaChart
                width={500}
                height={300}
                data={data}
                margin={{
                  top: 5,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />

                <Area
                  type="monotone"
                  dataKey="activity"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Flex>
      )}
    </Content>
  );
}

const stylesInline = {
  content: {
    padding: "2rem",
  },
};
