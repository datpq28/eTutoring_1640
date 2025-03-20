import { Button, Card, Flex, Form, Input } from "antd";
import { Link } from "react-router";

export default function BlogList() {
  const onFinish = (values) => {
    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);
  };
  return (
    <Card title="Blog & Nhật ký học tập" extra={<Link>See All</Link>}>
      <Flex gap="middle" vertical>
        <Card title="5 phương pháp học hiệu quả" size="small">
          <h3>Đăng bởi: Trần Thị B | 15/03/2025</h3>
          <p>
            Trong bài viết này, chúng ta sẽ tìm hiểu về 5 phương pháp học tập
            hiệu quả giúp cải thiện kết quả...
          </p>
          <Link>Đọc tiếp</Link>
        </Card>
        <Card title="5 phương pháp học hiệu quả" size="small">
          <h3>Đăng bởi: Trần Thị B | 15/03/2025</h3>
          <p>
            Trong bài viết này, chúng ta sẽ tìm hiểu về 5 phương pháp học tập
            hiệu quả giúp cải thiện kết quả...
          </p>
          <Link>Đọc tiếp</Link>
        </Card>
        <Card title="5 phương pháp học hiệu quả" size="small">
          <h3>Đăng bởi: Trần Thị B | 15/03/2025</h3>
          <p>
            Trong bài viết này, chúng ta sẽ tìm hiểu về 5 phương pháp học tập
            hiệu quả giúp cải thiện kết quả...
          </p>
          <Link>Đọc tiếp</Link>
        </Card>
        <Card title="5 phương pháp học hiệu quả" size="small">
          <h3>Đăng bởi: Trần Thị B | 15/03/2025</h3>
          <p>
            Trong bài viết này, chúng ta sẽ tìm hiểu về 5 phương pháp học tập
            hiệu quả giúp cải thiện kết quả...
          </p>
          <Link>Đọc tiếp</Link>
        </Card>
        <Form
          name="basic"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item label={null}>
            <Input.TextArea
              rows={4}
              placeholder="Viết nhật kí học tập của bạn"
            />
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Flex>
    </Card>
  );
}
