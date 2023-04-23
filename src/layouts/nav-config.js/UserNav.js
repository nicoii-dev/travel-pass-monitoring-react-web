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
    icon: getIcon('carbon:reminder-medical'),
  },
  {
    title: 'Travel Pass Schedules',
    path: '/travel-pass-schedules',
    icon: getIcon('streamline:travel-airport-departure-time-travel-plane-trip-airplane-time-off-adventure-timer-take-clock'),
  },
  {
    title: 'My Profile',
    path: '/profile',
    icon: getIcon('carbon:user-profile-alt'),
  },
];

export default UserNav;
