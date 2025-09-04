import * as React from "react";

type IconProps = React.SVGProps<SVGSVGElement> & { className?: string };

const BaseIcon: React.FC<IconProps> = ({ className, ...props }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    width="1em"
    height="1em"
    {...props}
  >
    <circle cx="12" cy="12" r="10" opacity="0.15" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

export const ArrowRight = BaseIcon;
export const BarChart3 = BaseIcon;
export const Calculator = BaseIcon;
export const FileDown = BaseIcon;
export const Database = BaseIcon;
export const TrendingUp = BaseIcon;
export const FileSpreadsheet = BaseIcon;
export const FileText = BaseIcon;
export const Download = BaseIcon;
export const MoreHorizontal = BaseIcon;
export const ChevronLeft = BaseIcon;
export const ChevronRight = BaseIcon;
export const ChevronDownIcon = BaseIcon;
export const Linkedin = BaseIcon;
export const Slack = BaseIcon;
export const FlaskConical = BaseIcon;
export const Atom = BaseIcon;
export const PlayCircle = BaseIcon;
export const Newspaper = BaseIcon;
export const Code = BaseIcon;
export const PanelLeftIcon = BaseIcon;
export const GripVerticalIcon = BaseIcon;
export const CircleIcon = BaseIcon;
export const CheckIcon = BaseIcon;
export const Chrome = BaseIcon;
export const Moon = BaseIcon;
export const Sun = BaseIcon;
export const PenTool = BaseIcon;
export const User = BaseIcon;
export const Crown = BaseIcon;
export const Lock = BaseIcon;
export const Upload = BaseIcon;
export const AlertCircle = BaseIcon;
export const Loader2 = BaseIcon;

export default BaseIcon;


