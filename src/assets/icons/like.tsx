import * as React from "react";
import Svg, { Path } from "react-native-svg";
const LikeIcon = (props) => (
  <Svg
    width={24}
    height={22}
    viewBox="0 0 24 22"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <Path
      d="M21.3861 2.44076C18.9392 -0.146742 14.9566 -0.146742 12.509 2.44018L12 2.97737L11.4916 2.44042C9.04376 -0.146839 5.06165 -0.146546 2.61376 2.44042C1.41186 3.71083 0.75 5.3959 0.75 7.18475C0.75 8.97418 1.41186 10.659 2.61394 11.9299L11.4566 21.2591C11.6087 21.42 11.8045 21.5001 12 21.5001C12.1955 21.5001 12.3911 21.4196 12.5434 21.2588L21.3861 11.9299C22.5879 10.6593 23.25 8.97423 23.25 7.18504C23.25 5.3959 22.5879 3.71112 21.3861 2.44076ZM20.2981 10.6578L12 19.4129L3.70211 10.6581C2.81657 9.72229 2.32896 8.48875 2.32896 7.18504C2.32896 5.88133 2.81657 4.64779 3.70211 3.712C4.6258 2.73524 5.83895 2.24718 7.05237 2.24718C8.26605 2.24718 9.47974 2.73583 10.4034 3.71259L11.456 4.8236C11.7608 5.14557 12.2389 5.14557 12.5437 4.8236L13.5966 3.712C15.4442 1.75877 18.4502 1.75877 20.2979 3.712C21.1832 4.64784 21.671 5.88133 21.671 7.18504C21.671 8.48875 21.1832 9.722 20.2981 10.6578Z"
      fill="#333659"
    />
  </Svg>
);
export default LikeIcon;