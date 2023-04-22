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
    title: 'Locally Stranded Individual',
    path: '/locally-stranded-individual',
    icon: getIcon('mdi:account-warning'),
  },
  {
    title: 'Medical Appointments',
    path: '/medical-appointments',
    icon: getIcon('material-symbols:medical-information-outline'),
  },
  {
    title: 'Travel Pass Applications',
    path: '/travel-pass-applications',
    icon: getIcon('heroicons:ticket'),
  },
  {
    title: 'Schedules',
    path: '/schedules',
    icon: getIcon('grommet-icons:schedules'),
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
