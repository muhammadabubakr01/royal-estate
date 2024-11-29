'use client';
import React, { useOptimistic } from 'react';
import DynamicForm from '@/components/dynamicform';

export default function FormView({ formJson }) {
  const initialValues = formJson.reduce((acc, field) => {
    acc[field.name] =
      field.type === 'checkbox' ? field.checked : field.value || '';
    return acc;
  }, {});
  initialValues.contactMethod = '';

  const [optimisticValue, setOptimisticValue] = useOptimistic(
    initialValues,
    (_, updated) => updated
  );

  return (
    <div className="flex flex-col gap-3">
      <DynamicForm
        optimisticValue={optimisticValue}
        setOptimisticValue={setOptimisticValue}
        formJson={formJson}
      />
    </div>
  );
}
