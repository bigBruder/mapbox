import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

const BackRotatedIcon: React.FC<SvgProps> = (props) => (
  <Svg width={24} height={24} viewBox="0 0 24 24" fill="none" {...props}>
    <Path
      d="M8.34375 4.08594C8.53125 3.89844 8.73047 3.89844 8.9414 4.08594L16.2891 11.4688C16.5 11.6563 16.5 11.8438 16.2891 12.0313L8.94141 19.4141C8.73047 19.6016 8.53125 19.6016 8.34375 19.4141L7.64062 18.7109C7.42969 18.5234 7.42969 18.3242 7.64062 18.1133L14.0039 11.75L7.64062 5.38672C7.42969 5.17578 7.42969 4.97656 7.64062 4.78906L8.34375 4.08594Z"
      fill="#8386A5"
    />
  </Svg>
);
export default BackRotatedIcon;
