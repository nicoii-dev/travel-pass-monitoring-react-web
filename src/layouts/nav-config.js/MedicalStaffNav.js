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
    title: 'Manage SLI',
    path: '/manage-lsi',
    icon: getIcon('mdi:account-warning'),
  },
  {
    title: 'Medical Appointments',
    path: '/medical-appointments',
    icon: getIcon('healthicons:community-meeting'),
  },
  {
    title: 'Schedules',
    path: '/schedule',
    icon: getIcon('healthicons:community-meeting'),
  },
];

export default MedicalStaffNav;
