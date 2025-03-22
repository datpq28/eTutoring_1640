import { useReducer } from "react";
import { Link as LinkRouter } from "react-router";
import { Flex, Image, Typography } from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import auth_01 from "../../assets/imgs/auth-01.png";
import styles from "../../assets/css/LoginPage.module.css";
import AuthLabel from "../../components/auth/AuthLabel";
import AuthDescription from "../../components/auth/AuthDescription";
import AuthCheckBox from "../../components/auth/AuthCheckBox";
import AuthButton from "../../components/auth/AuthButton";
import TextInputGroup from "../../components/auth/TextInputGroup";
import PasswordInputGroup from "../../components/auth/PasswordInputGroup";
import AssistanceLink from "../../components/auth/AssistanceLink";
const { Link } = Typography;

function formReducer(state, action) {
  switch (action.type) {
    case "CHANGE_VALUE_INPUT": {
      return {
        ...state,
        [action.field]: { value: action.value, error: "" },
      };
    }
    case "CHECKED": {
      return {
        ...state,
        [action.field]: { checked: action.checked },
      };
    }
    default: {
      return state;
    }
  }
}

const initialState = {
  email: { value: "", error: "" },
  password: { value: "", error: "" },
  remember: { checked: false },
};

export default function LoginPage() {
  const [dataForm, dispatch] = useReducer(formReducer, initialState);

  const { email, password, remember } = dataForm;
  // console.log(">>>email : ", email.value);
  // console.log(">>>password : ", password.value);
  function handleChangeInputValue(e) {
    dispatch({
      type: "CHANGE_VALUE_INPUT",
      field: e.target.name,
      value: e.target.value,
    });
  }
  function handleCheckedValue(e) {
    dispatch({
      type: "CHECKED",
      field: e.target.name,
      checked: e.target.checked,
    });
  }
  function handleSubmitForm() {
    console.log("handle submit form");
  }
  return (
    <Flex
      justify="space-between"
      align="center"
      className={styles.screenContainer}
    >
      <Flex vertical={true} style={stylesInline.form}>
        <AuthLabel>Login</AuthLabel>
        <AuthDescription>
          Login to access your travelwise account
        </AuthDescription>

        <TextInputGroup
          style={{
            marginTop: "2.68rem",
          }}
          inputStyle={{
            borderColor: email.error ? "red" : "#000",
          }}
          allowClear={{
            clearIcon: <CloseCircleOutlined style={stylesInline.clearIcon} />,
          }}
          placeholder="Email"
          value={email.value}
          name="email"
          onChange={handleChangeInputValue}
          autoComplete="off"
        />

        <PasswordInputGroup
          style={{
            marginTop: "3rem",
          }}
          inputStyle={{
            borderColor: password.error ? "red" : "#000",
          }}
          allowClear={{
            clearIcon: <CloseCircleOutlined style={stylesInline.clearIcon} />,
          }}
          placeholder="Password"
          value={password.value}
          name="password"
          onChange={handleChangeInputValue}
        />
        <Flex
          justify="space-between"
          align="center"
          style={{ marginTop: "2.3rem" }}
        >
          <AuthCheckBox
            textStyle={stylesInline.textCheckBox}
            name="remember"
            checked={remember.value}
            onChange={handleCheckedValue}
          >
            Remember me
          </AuthCheckBox>
          <LinkRouter
            to="/auth/forgot-password"
            component={Link}
            style={stylesInline.linkText}
          >
            Forgot password
          </LinkRouter>
        </Flex>
        <AuthButton onClick={handleSubmitForm} style={{ marginTop: "4.4rem" }}>
          Login
        </AuthButton>
        <AssistanceLink
          text=" Don't have an account?"
          link="Sign up"
          path="/auth/register"
          style={stylesInline.link}
        />
      </Flex>
      <Image src={auth_01} width={500} alt="auth image" preview={false} />
    </Flex>
  );
}

const stylesInline = {
  form: {
    width: "60.3rem",
  },
  textCheckBox: {
    color: "#000",
    fontFamily: "Poppins",
    fontSize: "1.6rem",
    fontWeight: 400,
    lineHeight: "normal",
    marginLeft: ".7rem",
  },
  linkText: {
    color: "#D51D1D",
    fontFamily: "Poppins",
    fontSize: "1.6rem",
    fontWeight: 400,
    lineHeight: "normal",
  },
  link: {
    textAlign: "center",
  },
};
