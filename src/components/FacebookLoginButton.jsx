import { LoginSocialFacebook } from "reactjs-social-login";
import { FacebookLoginButton } from "react-social-login-buttons";

const LoginWithFaceBook = () => {
  const APP_ID = import.meta.env.VITE_FACEBOOK_APP_ID;

  return (
    <LoginSocialFacebook
      key={APP_ID}
      appId={APP_ID}
      onResolve={(response) => {
        console.log(response);
      }}
      onReject={(error) => console.log(error)}
    >
      <FacebookLoginButton
        style={{ fontSize: ".8rem" }}
        text="Continue with facebook"
      />
    </LoginSocialFacebook>
  );
};

export default LoginWithFaceBook;
