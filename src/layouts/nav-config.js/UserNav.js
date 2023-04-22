// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const UserNav = [
  {
    title: 'home',
    path: '/home',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Medical Schedules',
    path: '/medical-schedules',
    icon: getIcon('mdi:account-warning'),
  },
  {
    title: 'Travel Pass',
    path: '/travel-pass',
    icon: getIcon('healthicons:community-meeting'),
  },
];

export default UserNav;
