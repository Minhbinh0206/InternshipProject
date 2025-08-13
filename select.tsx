// import React, { useEffect, useState } from 'react';
// import { Select, message } from 'antd';
// import { useMutation } from '@apollo/client';
// import { UPDATE_PART } from '../../../graphQL/versionActions';
// import { toast } from 'react-toastify';
// import { useNavigate, useParams } from 'react-router-dom';
// import { useRef } from 'react';

// const DEBOUNCE_MS = 500;
// const { Option } = Select;

// interface AutoSaveSelectProps {
//   name: string;
//   value: string;
//   versionId: number;
//   options: { label: string; value: string }[];
//   isAdditional?: boolean;
//   dataType?: string;
//   typeGroup?: string;
// }

// const AutoSaveSelect: React.FC<AutoSaveSelectProps> = ({
//   name,
//   value,
//   versionId,
//   options,
//   isAdditional = false,
//   dataType = 'string',
//   typeGroup = 'custom',
// }) => {
//   const [selected, setSelected] = useState(value);
//   const [updatePart] = useMutation(UPDATE_PART);
//   const [loading, setLoading] = useState(false);

//   const navigate = useNavigate();
//   const { id, revisionId, versionCode } = useParams<{
//     id: string;
//     revisionId?: string;
//     versionCode?: string;
//   }>();

//   useEffect(() => {
//     setSelected(value);
//   }, [value]);

//   const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

//   const handleChange = (newValue: string) => {
//     setSelected(newValue);

//     if (timer.current) {
//       clearTimeout(timer.current);
//     }
//     // const inputPayload: any = {
//     //   version_id: versionId,
//     // };

//     // if (isAdditional) {
//     //   inputPayload.additional_fields = [
//     //     {
//     //       name,
//     //       value: newValue,
//     //       data_type: dataType,
//     //       type_group: typeGroup,
//     //     },
//     //   ];
//     // } else {
//     //   inputPayload[name] = newValue;
//     // }
//     // setLoading(true);
//     // updatePart({
//     //   variables: {
//     //     input: inputPayload,
//     //   },
//     // })
//     //   // .then(() => toast.success(`${name} updated`))
//     //   // .catch(() => toast.error(`Failed to update ${name}`));
//     //   .then((res) => {
//     //     if (res.errors) {
//     //       throw new Error(res.errors[0]?.message || 'Update failed');
//     //     }

//     //     const updated = res?.data?.updatePart;
//     //     const returnedCode = updated?.version_code;

//     //     if (returnedCode && returnedCode !== versionCode) {
//     //       navigate(`/parts/modify/${id}/${revisionId}/${returnedCode}`, { replace: true });
//     //     }

//     //     toast.success(`${name} updated`);
//     //   })
//     //   .catch((err) => {
//     //     console.error(err);
//     //     toast.error(`Failed to update ${name}`);
//     //   })
//     //   .finally(() => setLoading(false));
//     timer.current = setTimeout(() => {
//       const inputPayload: any = {
//         version_id: versionId,
//       };

//       if (isAdditional) {
//         inputPayload.additional_fields = [
//           {
//             name,
//             value: newValue,
//             data_type: dataType,
//             type_group: typeGroup,
//           },
//         ];
//       } else {
//         inputPayload[name] = newValue;
//       }

//       setLoading(true);
//       updatePart({
//         variables: { input: inputPayload },
//       })
//         .then((res) => {
//           if (res.errors) {
//             throw new Error(res.errors[0]?.message || 'Update failed');
//           }
//           const updated = res?.data?.updatePart;
//           const returnedCode = updated?.version_code;

//           if (returnedCode && returnedCode !== versionCode) {
//             navigate(`/parts/modify/${id}/${revisionId}/${returnedCode}`, { replace: true });
//           }

//           toast.success(`${name} updated`);
//         })
//         .catch((err) => {
//           console.error(err);
//           toast.error(`Failed to update ${name}`);
//         })
//         .finally(() => setLoading(false));
//     }, DEBOUNCE_MS);
//   }

//   return (
//     <Select value={selected} onChange={handleChange}>
//       {options.map((opt) => (
//         <Option key={opt.value} value={opt.value}>
//           {opt.label}
//         </Option>
//       ))}
//     </Select>
//   );
// };

// export default AutoSaveSelect;
