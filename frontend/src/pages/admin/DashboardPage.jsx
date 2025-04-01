import { Col, Flex, Layout, Row } from "antd";
import CardOverview from "../../components/admin/AccountsManagementPage/CardOverview.jsx";
import { TeamOutlined, VideoCameraOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { viewListUser } from "../../../api_service/admin_service.js";
import CardUserOverview from "../../components/admin/AccountsManagementPage/CardUserOverview.jsx";
import CardBlogOverView from "../../components/admin/AccountsManagementPage/CardBlogOverview.jsx";
import { getBlogs } from "../../../api_service/blog_service.js";
import CardDocumentOverview from "../../components/admin/AccountsManagementPage/CardDocumentOverView.jsx";
import { getDocuments } from "../../../api_service/document_service.js";
import { fetchMeetingsByTutor } from "../../../api_service/meeting_service.js";
import CardMeetingOverview from "../../components/admin/AccountsManagementPage/CardMeetingOverview.jsx";
import { getConversations } from "../../../api_service/mesages_service.js";

const { Content } = Layout;
export default function DashboardPage() {
  const [userList, setUserList] = useState([]);
  const [blogList, setBlogList] = useState([]);
  const [documentList, setDocumentList] = useState([]);
  const [meetingList, setMeetingList] = useState([]);

  useEffect(() => {
    const fetchAllUser = async () => {
      const data = await viewListUser();
      setUserList(data);
    };
    const fetchAllBlog = async () => {
      const data = await getBlogs();
      setBlogList(data);
    };
    const fetchAllDocument = async () => {
      const data = await getDocuments();
      setDocumentList(data);
    };
    const fetchAllMeeting = async () => {
      const data = await fetchMeetingsByTutor();
      setMeetingList(data);
    };
    const fetchConversations = async () => {
      const data = await getConversations();
      console.log("fetchConversations", data);
    };
    fetchAllUser();
    fetchAllBlog();
    fetchAllDocument();
    fetchAllMeeting();
    fetchConversations();
  }, []);

  return (
    <Content style={stylesInline.content}>
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
    </Content>
  );
}

const stylesInline = {
  content: {
    padding: "2rem",
  },
};

{
  /* <Col xs={24} md={12} lg={6}>
          <CardOverview
            iconCard={<UserOutlined />}
            titleCard="Tutors"
            colorChart="#87cefa"
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <CardOverview
            iconCard={<VideoCameraOutlined />}
            titleCard="Meetings"
            colorChart="#90ee90"
          />
        </Col>
        <Col xs={24} md={12} lg={6}>
          <CardOverview
            iconCard={<FolderOpenOutlined />}
            titleCard="Files"
            colorChart="#ffa07a"
          />
        </Col> */
}
