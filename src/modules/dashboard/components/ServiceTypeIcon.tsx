import ChatOutlinedIcon from "@mui/icons-material/ChatOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import VideocamOutlinedIcon from "@mui/icons-material/VideocamOutlined";
import { SvgIconProps } from "@mui/material";

import { TNormalizedServiceType } from "../types/task";

const ICONS: Record<TNormalizedServiceType, typeof VideocamOutlinedIcon> = {
  video_call: VideocamOutlinedIcon,
  voice_call: PhoneOutlinedIcon,
  chat: ChatOutlinedIcon,
  unknown: HelpOutlineOutlinedIcon,
};

export function ServiceTypeIcon({
  serviceType,
  ...props
}: { serviceType: TNormalizedServiceType } & SvgIconProps) {
  const Icon = ICONS[serviceType];
  return <Icon fontSize="small" {...props} />;
}
