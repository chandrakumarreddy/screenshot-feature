import React, { useEffect, useState } from "react";

export default function AuthHoc(Component) {
  function RenderComponent(props) {
    const [login, setLogin] = useState(false);

    useEffect(() => {
      setTimeout(() => {
        setLogin(true);
      }, 3000);
    }, []);

    return <Component {...props} login={login} setLogin={setLogin} />;
  }

  return RenderComponent;
}
