'use client';

import type { ComponentType, CSSProperties } from 'react';
import { HugeiconsIcon } from '@hugeicons/react';
import {
  Activity03Icon,
  AlertCircleIcon,
  AlertTriangle as AlertTriangleHugeIcon,
  ArrowDownRight01Icon,
  ArrowLeft01Icon,
  ArrowRight01Icon,
  ArrowRight02Icon,
  ArrowUpRight01Icon,
  BarChartIcon,
  BellDotIcon,
  BellRing as BellRingHugeIcon,
  Blockchain05Icon,
  BubbleChatIcon,
  Cancel01Icon,
  CheckmarkCircle01Icon,
  CheckmarkCircle02Icon,
  Checkmark,
  Clock01Icon,
  Clock03Icon,
  Copy01Icon,
  CreditCardIcon,
  DashboardSpeed01Icon,
  Delete02Icon,
  Download01Icon,
  EyeIcon,
  File01Icon,
  FilterHorizontalIcon,
  Globe02Icon,
  Home03Icon,
  InformationCircleIcon,
  LanguageCircleIcon,
  Layers01Icon,
  Layout03Icon,
  LayoutDashboard as LayoutDashboardHugeIcon,
  Link02Icon,
  Loading03Icon,
  LockIcon,
  Logout03Icon,
  Mail01Icon,
  MapPinIcon,
  Maximize01Icon,
  Menu02Icon,
  ComputerIcon,
  MoreVerticalIcon,
  PencilEdit02Icon,
  PieChart03Icon,
  PlusSignIcon,
  RefreshIcon,
  SaveIcon,
  ScrollIcon,
  Search01Icon,
  SentIcon,
  ServerStack01Icon,
  Settings02Icon,
  ShieldCheck as ShieldCheckHugeIcon,
  SparklesIcon,
  SquareArrowUpRightIcon,
  StickerIcon,
  TransactionHistoryIcon,
  UserGroupIcon,
  UserIcon,
  ViewOffIcon,
  WaveIcon,
  Wifi01Icon,
  ZapIcon,
  ZoomInAreaIcon,
  ZoomOutAreaIcon,
} from '@hugeicons/core-free-icons';

type IconSvgObject = Parameters<typeof HugeiconsIcon>[0]['icon'];

type IconProps = {
  className?: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
  style?: CSSProperties;
  title?: string;
  onClick?: (event: any) => void;
  [key: string]: any;
};

function createIcon(icon: IconSvgObject): ComponentType<IconProps> {
  function DashboardHugeIcon({
    className,
    size = 16,
    color = 'currentColor',
    strokeWidth = 1.7,
    ...props
  }: IconProps) {
    return (
      <HugeiconsIcon
        icon={icon}
        size={size}
        color={color}
        strokeWidth={strokeWidth}
        className={className}
        {...props}
      />
    );
  }

  return DashboardHugeIcon;
}

export const Activity = createIcon(Activity03Icon);
export const AlertCircle = createIcon(AlertCircleIcon);
export const AlertTriangle = createIcon(AlertTriangleHugeIcon);
export const ArrowDownRight = createIcon(ArrowDownRight01Icon);
export const ArrowLeft = createIcon(ArrowLeft01Icon);
export const ArrowRight = createIcon(ArrowRight01Icon);
export const ArrowRightStraight = createIcon(ArrowRight02Icon);
export const ArrowUpCircle = createIcon(SquareArrowUpRightIcon);
export const ArrowUpRight = createIcon(ArrowUpRight01Icon);
export const BarChart3 = createIcon(BarChartIcon);
export const Bell = createIcon(BellDotIcon);
export const BellRing = createIcon(BellRingHugeIcon);
export const Blocks = createIcon(Blockchain05Icon);
export const Check = createIcon(Checkmark);
export const CheckCircle2 = createIcon(CheckmarkCircle02Icon);
export const ChevronDown = createIcon(ArrowDownRight01Icon);
export const ChevronLeft = createIcon(ArrowLeft01Icon);
export const ChevronRight = createIcon(ArrowRight01Icon);
export const ChevronUp = createIcon(ArrowUpRight01Icon);
export const Clock = createIcon(Clock01Icon);
export const Clock3 = createIcon(Clock03Icon);
export const Copy = createIcon(Copy01Icon);
export const CreditCard = createIcon(CreditCardIcon);
export const Download = createIcon(Download01Icon);
export const ExternalLink = createIcon(SquareArrowUpRightIcon);
export const Eye = createIcon(EyeIcon);
export const EyeOff = createIcon(ViewOffIcon);
export const FileText = createIcon(File01Icon);
export const Filter = createIcon(FilterHorizontalIcon);
export const Gauge = createIcon(DashboardSpeed01Icon);
export const Globe = createIcon(Globe02Icon);
export const Hash = createIcon(Link02Icon);
export const HelpCircle = createIcon(InformationCircleIcon);
export const History = createIcon(TransactionHistoryIcon);
export const Home = createIcon(Home03Icon);
export const Info = createIcon(InformationCircleIcon);
export const Languages = createIcon(LanguageCircleIcon);
export const Layers = createIcon(Layers01Icon);
export const LayoutDashboard = createIcon(LayoutDashboardHugeIcon);
export const LayoutGrid = createIcon(Layout03Icon);
export const Link2 = createIcon(Link02Icon);
export const Loader2 = createIcon(Loading03Icon);
export const Lock = createIcon(LockIcon);
export const LogOut = createIcon(Logout03Icon);
export const Mail = createIcon(Mail01Icon);
export const MapPin = createIcon(MapPinIcon);
export const Maximize = createIcon(Maximize01Icon);
export const Menu = createIcon(Menu02Icon);
export const MessageSquare = createIcon(BubbleChatIcon);
export const Monitor = createIcon(ComputerIcon);
export const MoreVertical = createIcon(MoreVerticalIcon);
export const Pencil = createIcon(PencilEdit02Icon);
export const PieChart = createIcon(PieChart03Icon);
export const Plus = createIcon(PlusSignIcon);
export const RefreshCw = createIcon(RefreshIcon);
export const Save = createIcon(SaveIcon);
export const ScrollText = createIcon(ScrollIcon);
export const Search = createIcon(Search01Icon);
export const Send = createIcon(SentIcon);
export const Server = createIcon(ServerStack01Icon);
export const Settings = createIcon(Settings02Icon);
export const ShieldCheck = createIcon(ShieldCheckHugeIcon);
export const Sparkles = createIcon(SparklesIcon);
export const Sticker = createIcon(StickerIcon);
export const Trash2 = createIcon(Delete02Icon);
export const User = createIcon(UserIcon);
export const Users = createIcon(UserGroupIcon);
export const Waves = createIcon(WaveIcon);
export const Wifi = createIcon(Wifi01Icon);
export const X = createIcon(Cancel01Icon);
export const Zap = createIcon(ZapIcon);
export const ZoomIn = createIcon(ZoomInAreaIcon);
export const ZoomOut = createIcon(ZoomOutAreaIcon);
