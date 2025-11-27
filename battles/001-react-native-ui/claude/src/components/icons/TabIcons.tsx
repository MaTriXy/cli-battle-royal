import React from 'react';
import Svg, { Path, Circle, Rect, G } from 'react-native-svg';
import { colors } from '@theme';

interface IconProps {
  size?: number;
  color?: string;
  focused?: boolean;
}

export const ExploreIcon: React.FC<IconProps> = ({
  size = 24,
  color = colors.tabInactive,
  focused = false
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="12"
      r="9"
      stroke={focused ? colors.tabActive : color}
      strokeWidth="2"
    />
    <Path
      d="M12 8V12L15 15"
      stroke={focused ? colors.tabActive : color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const AnalyticsIcon: React.FC<IconProps> = ({
  size = 24,
  color = colors.tabInactive,
  focused = false
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect
      x="3"
      y="12"
      width="4"
      height="8"
      rx="1"
      fill={focused ? colors.tabActive : color}
    />
    <Rect
      x="10"
      y="8"
      width="4"
      height="12"
      rx="1"
      fill={focused ? colors.tabActive : color}
    />
    <Rect
      x="17"
      y="4"
      width="4"
      height="16"
      rx="1"
      fill={focused ? colors.tabActive : color}
    />
  </Svg>
);

export const IdeasIcon: React.FC<IconProps> = ({
  size = 24,
  color = colors.tabInactive,
  focused = false
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2C8.13 2 5 5.13 5 9C5 11.38 6.19 13.47 8 14.74V17C8 17.55 8.45 18 9 18H15C15.55 18 16 17.55 16 17V14.74C17.81 13.47 19 11.38 19 9C19 5.13 15.87 2 12 2Z"
      stroke={focused ? colors.tabActive : color}
      strokeWidth="2"
      fill={focused ? colors.tabActive : 'none'}
      fillOpacity={focused ? 0.2 : 0}
    />
    <Path
      d="M9 21H15"
      stroke={focused ? colors.tabActive : color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const AccountIcon: React.FC<IconProps> = ({
  size = 24,
  color = colors.tabInactive,
  focused = false
}) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle
      cx="12"
      cy="8"
      r="4"
      stroke={focused ? colors.tabActive : color}
      strokeWidth="2"
      fill={focused ? colors.tabActive : 'none'}
      fillOpacity={focused ? 0.2 : 0}
    />
    <Path
      d="M4 20C4 16.6863 7.58172 14 12 14C16.4183 14 20 16.6863 20 20"
      stroke={focused ? colors.tabActive : color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </Svg>
);

export const WalletIcon: React.FC<IconProps> = ({ size = 24, color = colors.text }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Rect x="2" y="6" width="20" height="14" rx="2" stroke={color} strokeWidth="2" />
    <Path d="M2 10H22" stroke={color} strokeWidth="2" />
    <Circle cx="17" cy="14" r="1.5" fill={color} />
  </Svg>
);

export const SocialIcon: React.FC<IconProps> = ({ size = 24, color = colors.text }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="8" cy="8" r="3" stroke={color} strokeWidth="2" />
    <Circle cx="16" cy="8" r="3" stroke={color} strokeWidth="2" />
    <Circle cx="12" cy="16" r="3" stroke={color} strokeWidth="2" />
    <Path d="M10.5 9.5L13.5 14.5" stroke={color} strokeWidth="1.5" />
    <Path d="M13.5 9.5L10.5 14.5" stroke={color} strokeWidth="1.5" />
  </Svg>
);

export const PaymentIcon: React.FC<IconProps> = ({ size = 24, color = colors.text }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Circle cx="12" cy="12" r="9" stroke={color} strokeWidth="2" />
    <Path d="M12 7V17M9 10H15M9 14H15" stroke={color} strokeWidth="2" strokeLinecap="round" />
  </Svg>
);

export const BellIcon: React.FC<IconProps> = ({ size = 24, color = colors.text }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M18 8C18 6.4087 17.3679 4.88258 16.2426 3.75736C15.1174 2.63214 13.5913 2 12 2C10.4087 2 8.88258 2.63214 7.75736 3.75736C6.63214 4.88258 6 6.4087 6 8C6 15 3 17 3 17H21C21 17 18 15 18 8Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M13.73 21C13.5542 21.3031 13.3019 21.5547 12.9982 21.7295C12.6946 21.9044 12.3504 21.9965 12 21.9965C11.6496 21.9965 11.3054 21.9044 11.0018 21.7295C10.6982 21.5547 10.4458 21.3031 10.27 21"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const ChevronLeftIcon: React.FC<IconProps> = ({ size = 24, color = colors.text }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 18L9 12L15 6"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export const EditIcon: React.FC<IconProps> = ({ size = 24, color = colors.text }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M18.5 2.50001C18.8978 2.10219 19.4374 1.87869 20 1.87869C20.5626 1.87869 21.1022 2.10219 21.5 2.50001C21.8978 2.89784 22.1213 3.4374 22.1213 4.00001C22.1213 4.56262 21.8978 5.10219 21.5 5.50001L12 15L8 16L9 12L18.5 2.50001Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);
