// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const PoliceNav = [
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
    title: 'Medical Applications',
    path: '/medical-applications',
    icon: getIcon('material-symbols:medical-information-outline'),
  },
  {
    title: 'Travel Pass Appointments',
    path: '/travel-pass-appointments',
    icon: getIcon('heroicons:ticket'),
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
];

export default PoliceNav;
