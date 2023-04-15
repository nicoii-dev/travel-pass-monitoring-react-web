// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const AdminNav = [
  {
    title: 'dashboard',
    path: '/dashboard',
    icon: getIcon('eva:pie-chart-2-fill'),
  },
  {
    title: 'Manage LSI',
    path: '/manage-lsi',
    icon: getIcon('mdi:account-warning'),
  },
  {
    title: 'Medical Reservations',
    path: '/medical-reservations',
    icon: getIcon('healthicons:community-meeting'),
  },
  {
    title: 'Travel Pass Applications',
    path: '/travel-pass-applications',
    icon: getIcon('material-symbols:receipt-long'),
  },
  {
    title: 'Users',
    path: '/user',
    icon: getIcon('eva:people-fill'),
  },
  {
    title: 'Reports',
    path: '/reports',
    icon: getIcon('iconoir:reports'),
  },
];

export default AdminNav;
