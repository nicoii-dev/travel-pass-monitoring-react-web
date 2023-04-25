import * as yup from 'yup';

export const TravelPassApplicationSchema = yup
  .object({
    dateOfTravel: yup.string().required('Date of Travel is required'),
    originRegion: yup.string().required('Region is required'),
    originProvince: yup.string().required('Province is required'),
    originCity: yup.string().required('City is required'),
    originBarangay: yup.string().required('Barangay is required'),
    originStreet: yup.string().required('Street is required'),
    originZipcode: yup.string().required('Zip Code is required'),
    
    destinationRegion: yup.string().required('Region is required'),
    destinationProvince: yup.string().required('Province is required'),
    destinationCity: yup.string().required('City is required'),
    destinationBarangay: yup.string().required('Barangay is required'),
    destinationStreet: yup.string().required('Street is required'),
    destinationZipcode: yup.string().required('Zip Code is required')
  })
  .required();
