import ChatOutlinedIcon from '@mui/icons-material/ChatOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import VideocamOutlinedIcon from '@mui/icons-material/VideocamOutlined';
import { SvgIconProps } from '@mui/material';

import SERVICE_TYPE from '@/shared/enums/api/tasks/serviceType';

const ICONS: Record<string, typeof VideocamOutlinedIcon> = {
  [SERVICE_TYPE.VIDEO_CALL]: VideocamOutlinedIcon,
  [SERVICE_TYPE.VOICE_CALL]: PhoneOutlinedIcon,
  [SERVICE_TYPE.CHAT]: ChatOutlinedIcon,
};

interface IServiceTypeIconProps extends SvgIconProps {
  serviceType: string;
}

const ServiceTypeIcon = ({ serviceType, ...props }: IServiceTypeIconProps) => {
  const Icon = ICONS[serviceType] ?? HelpOutlineOutlinedIcon;
  return <Icon fontSize="small" {...props} />;
};

export default ServiceTypeIcon;
