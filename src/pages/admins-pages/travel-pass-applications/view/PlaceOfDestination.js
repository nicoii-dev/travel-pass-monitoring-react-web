import React, { useState, useEffect } from "react";
// @mui
import {
  regions,
  provinces,
  cities,
  barangays,
} from "select-philippines-address";
import { Stack } from "@mui/material";
import AddressDropDown from "../../../../components/hook-form/AddressDropDown";
import { RHFTextField } from "../../../../components/hook-form";
import _ from "lodash";

// ----------------------------------------------------------------------

export default function PlaceOfDestination({ setValue, destinationAddress }) {
  const [regionData, setRegion] = useState([]);
  const [provinceData, setProvince] = useState([]);
  const [cityData, setCity] = useState([]);
  const [barangayData, setBarangay] = useState([]);

  const [regionAddr, setRegionAddr] = useState("");
  const [provinceAddr, setProvinceAddr] = useState("");
  const [cityAddr, setCityAddr] = useState("");
  const [barangayAddr, setBarangayAddr] = useState("");

  const region = () => {
    regions().then((response) => {
      setRegion(
        response.map((data) => ({
          id: data.id,
          code: data.region_code,
          value: data.region_code,
          label: data.region_name,
        }))
      );
      setRegion((curr) => [
        ...curr,
        {
          id: 0,
          code: 0,
          value: 0,
          label: "Select Region",
        },
      ]);
    });
  };

  const province = (e) => {
    // setRegionAddr(e.target.selectedOptions[0].text);
    provinces(e).then((response) => {
      setProvince(
        response.map((data) => ({
          value: data.province_code,
          label: data.province_name,
        }))
      );
      setCity([]);
      setBarangay([]);
    });
  };

  const city = (e) => {
    // setProvinceAddr(e.target.selectedOptions[0].text);
    cities(e).then((response) => {
      setCity(
        response.map((data) => ({
          value: data.city_code,
          label: data.city_name,
        }))
      );
    });
  };

  const barangay = (e) => {
    // setCityAddr(e.target.selectedOptions[0].text);
    barangays(e).then((response) => {
      setBarangay(
        response.map((data) => ({
          value: data.brgy_code,
          label: data.brgy_name,
        }))
      );
    });
  };

  const brgy = (e) => {
    setBarangayAddr(e);
  };

  useEffect(() => {
    region();
    if (!_.isEmpty(destinationAddress)) {
      province(destinationAddress.destination_region);
      setValue("province", destinationAddress.destination_province, {
        shouldValidate: true,
        shouldDirty: true,
      });
      city(destinationAddress.destination_province);
      setValue("city", destinationAddress.destination_city, {
        shouldValidate: true,
        shouldDirty: true,
      });
      barangay(destinationAddress.destination_city);
      setValue("barangay", destinationAddress.destination_barangay, {
        shouldValidate: true,
        shouldDirty: true,
      });
    }
  }, [destinationAddress]);

  return (
    <>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ marginTop: 5 }}
      >
        <AddressDropDown
          name="destinationRegion"
          label="Region"
          dropDownData={regionData}
          onChangeFunc={province}
          disabled
        />
        <AddressDropDown
          name="destinationProvince"
          label="Province"
          dropDownData={provinceData}
          onChangeFunc={city}
          disabled
        />
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ marginTop: 2 }}
      >
        <AddressDropDown
          name="destinationCity"
          label="City"
          dropDownData={cityData}
          onChangeFunc={barangay}
          disabled
        />
        <AddressDropDown
          name="destinationBarangay"
          label="Barangay"
          dropDownData={barangayData}
          onChangeFunc={brgy}
          disabled
        />
      </Stack>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        sx={{ marginTop: 2 }}
      >
        <RHFTextField name="destinationStreet" label="Street" disabled />
        <RHFTextField name="destinationZipcode" label="Zip Code" disabled/>
      </Stack>
    </>
  );
}
