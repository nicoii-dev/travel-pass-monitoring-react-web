// component
import Iconify from '../../components/Iconify';

// ----------------------------------------------------------------------

const getIcon = (name) => <Iconify icon={name} width={22} height={22} />;

const MedicalStaffNav = [
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
    title: 'Medical Applications',
    path: '/medical-applications',
    icon: getIcon('material-symbols:medical-information-outline'),
  },
  {
    title: 'Schedules',
    path: '/schedules',
    icon: getIcon('grommet-icons:schedules'),
  },
];

export default MedicalStaffNav;
