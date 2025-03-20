import { Card, Flex, Input, Select } from "antd";
const selectSubject = [
  {
    value: "empty",
    label: "Select Subject",
  },
  {
    value: "math",
    label: "Math",
  },
  {
    value: "literature",
    label: "Literature",
  },
];

const selectStatus = [
  {
    value: "empty",
    label: "Select Status",
  },
  {
    value: "newest",
    label: "Newest",
  },
  {
    value: "oldest",
    label: "Oldest",
  },
];

export default function BlogActionBar() {
  const onSearch = (value, _e, info) => console.log(info?.source, value);
  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };
  return (
    <Card>
      <Flex gap="middle" justify="space-between" wrap>
        <Input.Search
          placeholder="Search File"
          onSearch={onSearch}
          style={{
            maxWidth: "60rem",
          }}
          enterButton
        />
        <Flex gap="middle" wrap>
          <Select
            defaultValue="empty"
            style={{
              width: 200,
            }}
            placement="bottomLeft"
            onChange={handleChange}
            options={selectSubject}
          />
          <Select
            defaultValue="empty"
            style={{
              width: 200,
            }}
            placement="bottomLeft"
            onChange={handleChange}
            options={selectStatus}
          />
        </Flex>
      </Flex>
    </Card>
  );
}
