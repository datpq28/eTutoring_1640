import {
  Avatar,
  Button,
  Card,
  Form,
  Input,
  Layout,
  Typography,
  message,
  Row,
  Col,
} from "antd";
import { EditOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";

import { updatePasswordLoggedIn } from "../../../api_service/auth_service";
//import { getUserById, updateUser } from "../../../api_service/user_service"; // Import các hàm API cần thiết

const { Content } = Layout;
const userId = localStorage.getItem("userId");
const loggedInUserEmail = localStorage.getItem("loggedInUser");

export default function ProfilePage() {
  const [isEditProfile, setIsEditProfile] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [userData, setUserData] = useState(null);
  const [formProfile] = Form.useForm();
  const [formPassword] = Form.useForm();

  useEffect(() => {
      const fetchUserData = async () => {
          setLoadingProfile(true);
          try {
              const res = await getUserById(userId);
              if (res.success && res.data) {
                  setUserData(res.data);
                  formProfile.setFieldsValue({
                      firstname: res.data.firstname,
                      lastname: res.data.lastname,
                      phone: res.data.phone,
                      email: res.data.email,
                      role: res.data.role,
                  });
              } else {
                  message.error("Failed to fetch user data.");
              }
          } catch (err) {
              message.error("Something went wrong while fetching user data.");
              console.error("Error fetching user data:", err);
          } finally {
              setLoadingProfile(false);
          }
      };

      fetchUserData();
  }, [formProfile, userId]);

  const onFinishProfile = async (values) => {
      setLoadingProfile(true);
      try {
          const res = await updateUser(userId, values);
          if (res.success) {
              message.success("Profile updated successfully!");
              setUserData({ ...userData, ...values });
              setIsEditProfile(false);
          } else {
              message.error(res.message || "Failed to update profile");
          }
      } catch (err) {
          message.error("Something went wrong while updating profile.");
          console.error("Error updating profile:", err);
      } finally {
          setLoadingProfile(false);
      }
  };

  const handleEnableEditProfile = () => {
      setIsEditProfile(true);
  };

  const handleDisableEditProfile = () => {
      setIsEditProfile(false);
  };

  const onChangePassword = async (values) => {
    setLoadingPassword(true);
    try {
        const res = await updatePasswordLoggedIn(
            loggedInUserEmail,
            values.old_password,
            values.new_password
        );
        if (res && res.message) {
            message.success("Password updated successfully!");
            formPassword.resetFields();
        } else if (res && res.error) { // Kiểm tra nếu có lỗi trong response
            message.error(res.error); // Hiển thị trực tiếp thông báo lỗi từ backend
        } else {
            message.error("Failed to update password"); // Xử lý các trường hợp lỗi khác (nếu có)
        }
    } catch (err) {
        message.error("Old password is incorrect");
        console.error("Error updating password:", err);
    } finally {
        setLoadingPassword(false);
    }
};

  return (
      <Content style={stylesInline.content}>
          <Card style={{ width: "80rem" }}>
              <Typography.Title level={4}>Account Management</Typography.Title>
              <div style={{ display: "flex", justifyContent: "center", marginBottom: "1rem" }}>
                  <Avatar
                      size={150}
                      src={`https://api.dicebear.com/7.x/miniavs/svg?seed=${userId}`}
                      style={{ border: "1px solid #ccc" }}
                      shape="square"
                  />
              </div>

              <Row gutter={24}>
                  <Col span={12}>
                      <Typography.Title level={5}>Change Password</Typography.Title>
                      <Form
                          layout="vertical"
                          form={formPassword}
                          onFinish={onChangePassword}
                      >
                          <Form.Item
                              label="Old Password"
                              name="old_password"
                              rules={[{ required: true, message: "Please enter old password" }]}
                          >
                              <Input.Password placeholder="Old Password" />
                          </Form.Item>
                          <Form.Item
                              label="New Password"
                              name="new_password"
                              rules={[
                                  { required: true, message: "Please enter new password" },
                                  ({ getFieldValue }) => ({
                                      validator(_, value) {
                                          if (!value || getFieldValue("old_password") !== value) {
                                              return Promise.resolve();
                                          }
                                          return Promise.reject(
                                              new Error("New password cannot be the same as the old password!")
                                          );
                                      },
                                  }),
                              ]}
                          >
                              <Input.Password placeholder="New Password" />
                          </Form.Item>
                          <Form.Item
                              label="Confirm New Password"
                              name="confirm_new_password"
                              dependencies={["new_password"]}
                              rules={[
                                  { required: true, message: "Please confirm your new password!" },
                                  ({ getFieldValue }) => ({
                                      validator(_, value) {
                                          if (!value || getFieldValue("new_password") === value) {
                                              return Promise.resolve();
                                          }
                                          return Promise.reject(
                                              new Error("The two passwords that you entered do not match!")
                                          );
                                      },
                                  }),
                              ]}
                          >
                              <Input.Password placeholder="Confirm New Password" />
                          </Form.Item>
                          <Button
                              type="primary"
                              htmlType="submit"
                              style={{ width: "100%" }}
                              loading={loadingPassword}
                          >
                              Change Password
                          </Button>
                      </Form>
                  </Col>
                  <Col span={12}>
                      <Typography.Title level={5}>Personal Information</Typography.Title>
                      {userData && !isEditProfile ? (
                          <div>
                              <p>
                                  <strong>First Name:</strong> {userData.firstname}
                              </p>
                              <p>
                                  <strong>Last Name:</strong> {userData.lastname}
                              </p>
                              <p>
                                  <strong>Phone:</strong> {userData.phone}
                              </p>
                              <p>
                                  <strong>Email:</strong> {userData.email}
                              </p>
                              <p>
                                  <strong>Role:</strong> {userData.role}
                              </p>
                              <Button icon={<EditOutlined />} onClick={handleEnableEditProfile}>
                                  Edit Profile
                              </Button>
                          </div>
                      ) : (
                          <Form
                              layout="vertical"
                              form={formProfile}
                              initialValues={userData}
                              onFinish={onFinishProfile}
                          >
                              <Form.Item
                                  label="First Name"
                                  name="firstname"
                                  rules={[{ required: true, message: "Please enter your first name" }]}
                              >
                                  <Input />
                              </Form.Item>
                              <Form.Item
                                  label="Last Name"
                                  name="lastname"
                                  rules={[{ required: true, message: "Please enter your last name" }]}
                              >
                                  <Input />
                              </Form.Item>
                              <Form.Item
                                  label="Phone"
                                  name="phone"
                                  rules={[{ required: true, message: "Please enter your phone number" }]}
                              >
                                  <Input />
                              </Form.Item>
                              <Form.Item
                                  label="Email"
                                  name="email"
                                  rules={[
                                      { required: true, message: "Please enter your email" },
                                      { type: "email", message: "Please enter a valid email" },
                                  ]}
                              >
                                  <Input disabled /> {/* Không cho phép chỉnh sửa email */}
                              </Form.Item>
                              <Form.Item
                                  label="Role"
                                  name="role"
                                  rules={[{ required: true, message: "Role is required" }]}
                              >
                                  <Input disabled /> {/* Không cho phép chỉnh sửa role */}
                              </Form.Item>
                              <Form.Item style={{ marginBottom: 0 }}>
                                  <Button
                                      type="primary"
                                      htmlType="submit"
                                      loading={loadingProfile}
                                      style={{ marginRight: 8 }}
                                  >
                                      Save
                                  </Button>
                                  <Button onClick={handleDisableEditProfile}>Cancel</Button>
                              </Form.Item>
                          </Form>
                      )}
                  </Col>
              </Row>
          </Card>
      </Content>
  );
}

const stylesInline = {
  content: {
      padding: "2rem",
      display: "flex",
      justifyContent: "center",
  },
};