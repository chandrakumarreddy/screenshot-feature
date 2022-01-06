import "../styles/globals.css";
import AuthHoc from "./hoc/auth";

function MyApp({ Component, pageProps, ...rest }) {
  return <Component {...pageProps} {...rest} />;
}

export default AuthHoc(MyApp);
