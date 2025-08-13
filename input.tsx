// import React, { useEffect, useState } from 'react';
// import { Input, Form } from 'antd';
// import type { FormInstance } from 'antd';
// import { useMutation } from '@apollo/client';
// import { UPDATE_PART } from '../../../graphQL/versionActions';
// import { toast } from 'react-toastify';
// import { useNavigate, useParams } from 'react-router-dom';

// interface AutoSaveInputProps {
//   form?: FormInstance;
//   name: string;
//   value: string;
//   versionId: number;
//   isAdditional?: boolean;
//   dataType?: string;
//   typeGroup?: string;
//   isPublished?: boolean;
//   refetch?: () => void;
// }

// const AutoSaveInput: React.FC<AutoSaveInputProps> = ({
//   form: formProp,
//   name,
//   value,
//   versionId,
//   isAdditional = false,
//   dataType = 'string',
//   typeGroup = 'custom',
//   isPublished = false,
//   refetch,
// }) => {
//   const formInstance: FormInstance | undefined =
//     formProp || (Form as any).useFormInstance ? (Form as any).useFormInstance() : undefined;

//   const [internalValue, setInternalValue] = useState(value);
//   const [updatePart] = useMutation(UPDATE_PART);
//   const [loading, setLoading] = useState(false);
//   const [draftId, setDraftId] = useState<number | null>(null);
//   const [isCreatingDraft, setIsCreatingDraft] = useState(false);

//   const navigate = useNavigate();
//   const { id, revisionId, versionCode } = useParams<{
//     id: string;
//     revisionId?: string;
//     versionCode?: string;
//   }>();

//   useEffect(() => {
//     setInternalValue(value);
//     if (formInstance) {
//       formInstance.setFieldsValue({ [name]: value });
//     }
//   }, [value, name, formInstance]);

//   // const saveChange = async () => {
//   //   if (!formInstance) {
//   //     console.warn('No form instance found in AutoSaveInput for', name);
//   //     return;
//   //   }

//   //   const currentFormValue = formInstance.getFieldValue(name);
//   //   if (value === internalValue && !isAdditional) {
//   //     return;
//   //   }
//   //   // if (currentFormValue === internalValue && !isAdditional) {
//   //   //   return;
//   //   // }


//   //   formInstance.setFieldsValue({ [name]: internalValue });

//   //   const allFields = formInstance.getFieldsValue(true);

//   //   const standardFields = ['name', 'code', 'description'];

//   //   const inputPayload: any = {
//   //     version_id: versionId,
//   //     additional_fields: []
//   //   };
//   //   standardFields.forEach(field => {
//   //     if (allFields[field] !== undefined) {
//   //       inputPayload[field] = allFields[field];
//   //     }
//   //   });

//   //   Object.keys(allFields).forEach(key => {
//   //     if (!standardFields.includes(key)) {
//   //       inputPayload.additional_fields.push({
//   //         name: key,
//   //         value: allFields[key],
//   //         data_type: dataType,
//   //         type_group: typeGroup
//   //       });
//   //     }
//   //   });


//   //   console.log('allFields', allFields);

//   //   // let additional_payload: any[] = [];

//   //   // if (isAdditional) {
//   //   //   additional_payload = [{
//   //   //     name,
//   //   //     value: internalValue ?? '',
//   //   //     data_type: dataType,
//   //   //     type_group: typeGroup,
//   //   //   }];
//   //   // }


//   //   // const inputPayload: any = {
//   //   //   version_id: versionId,
//   //   // };

//   //   // if (isAdditional) {
//   //   //   inputPayload.additional_fields = additional_payload;
//   //   // } else {
//   //   //   inputPayload[name] = internalValue;
//   //   // }

//   //   console.log('inputPayload', inputPayload);

//   //   setLoading(true);

//   //   try {
//   //     const res = await updatePart({ variables: { input: inputPayload } });
//   //     if ((res as any).errors) throw new Error((res as any).errors[0]?.message || 'Update failed');

//   //     const updated = (res as any).data?.updatePart;
//   //     const returnedCode = updated?.version_code;
//   //     if (returnedCode && returnedCode !== versionCode) {
//   //       navigate(`/parts/modify/${id}/${revisionId}/${returnedCode}`, { replace: true });
//   //     }
//   //     toast.success(`${name} updated`);
//   //     if (refetch) refetch();
//   //   } catch (err) {
//   //     console.error(err);
//   //     toast.error(`Failed to update ${name}`);
//   //   } finally {
//   //     setLoading(false);
//   //   }
//   // };

//   const saveChange = async () => {
//     if (!formInstance) {
//       console.warn('No form instance found in AutoSaveInput for', name);
//       return;
//     }

//     if (isAdditional && (!internalValue || internalValue.trim() === '')) {
//       return;
//     }
//     if (value === internalValue && !isAdditional) {
//       return;
//     }

//     formInstance.setFieldsValue({ [name]: internalValue });

//     const allFields = formInstance.getFieldsValue(true);
//     const standardFields = ['name', 'code', 'description'];

//     const inputPayload: any = {
//       version_id: versionId,
//       additional_fields: []
//     };

//     standardFields.forEach(field => {
//       if (allFields[field] !== undefined) {
//         inputPayload[field] = allFields[field];
//       }
//     });

//     Object.keys(allFields).forEach(key => {
//       if (!standardFields.includes(key)) {
//         inputPayload.additional_fields.push({
//           name: key,
//           value: allFields[key],
//           data_type: dataType,
//           type_group: typeGroup
//         });
//       }
//     });

//     // const additional_payload = Object.keys(allFields).map(key => ({
//     //   name: key,
//     //   value: allFields[key] ?? '',
//     //   data_type: dataType,
//     //   type_group: typeGroup,
//     // }));

//     // const inputPayload: any = {
//     //   version_id: versionId,
//     // };

//     // if (isAdditional) {
//     //   inputPayload.additional_fields = additional_payload;
//     // } else {
//     //   // Nếu là field cơ bản (name, description, ...) gửi trực tiếp
//     //   inputPayload[name] = internalValue;
//     //   // nếu vẫn muốn gửi additional_fields too, có thể thêm
//     // }

//     console.log('inputPayload', inputPayload);

//     try {
//       setLoading(true);
//       if (isPublished && !draftId) {
//         if (!isCreatingDraft) {
//           setIsCreatingDraft(true);
//           const resDraft = await updatePart({ variables: { input: inputPayload } });
//           const updated = resDraft.data?.updatePart;
//           if (updated?.id) {
//             setDraftId(updated.id);
//             inputPayload.version_id = updated.id;
//           }
//           setIsCreatingDraft(false);
//         } else {
//           return; // đang tạo draft thì bỏ qua update này để tránh conflict
//         }
//       }
//       const res = await updatePart({ variables: { input: inputPayload } });
//       if ((res as any).errors) throw new Error((res as any).errors[0]?.message || 'Update failed');

//       // const updated = (res as any).data?.updatePart;
//       // const returnedCode = updated?.version_code;
//       // if (returnedCode && returnedCode !== versionCode) {
//       //   navigate(`/parts/modify/${id}/${revisionId}/${returnedCode}`, { replace: true });
//       // }
//       const updated = res.data?.updatePart;
//       if (updated?.version_code && updated.version_code !== versionCode) {
//         navigate(`/parts/modify/${id}/${revisionId}/${updated.version_code}`, { replace: true });
//       }

//       toast.success(`${name} updated`);
//       if (refetch) refetch();
//     } catch (err) {
//       console.error(err);
//       toast.error(`Failed to update ${name}`);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const v = e.target.value;
//     setInternalValue(v);
//     if (formInstance) {
//       formInstance.setFieldsValue({ [name]: v });
//     }
//   };

//   const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//     if (e.key === 'Escape') {
//       setInternalValue(value);
//       if (formInstance) formInstance.setFieldsValue({ [name]: value });
//     }
//   };

//   return (
//     <Input
//       value={internalValue}
//       onChange={handleChange}
//       onBlur={saveChange}
//       onKeyDown={handleKeyDown}
//       disabled={loading}
//     />
//   );
// };

// export default AutoSaveInput;
