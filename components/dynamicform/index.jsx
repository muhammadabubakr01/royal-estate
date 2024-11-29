import React, { startTransition, useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import toast from 'react-hot-toast';

export default function DynamicForm({
  optimisticValue,
  setOptimisticValue,
  formJson,
}) {
  const [fieldInteractions, setFieldInteractions] = useState(
    formJson.reduce((acc, field) => {
      acc[field.name] = 0;
      return acc;
    }, {})
  );

  const incrementInteractionCount = (fieldName) => {
    setFieldInteractions((prev) => ({
      ...prev,
      [fieldName]: prev[fieldName] + 1,
    }));
  };

  const validationSchema = Yup.object(
    formJson.reduce((acc, field) => {
      if (field.required) {
        if (field.type === 'text') {
          acc[field.name] = Yup.string().required(`${field.label} is required`);
        } else if (field.type === 'number') {
          acc[field.name] = Yup.number()
            .typeError(`${field.label} must be a number`)
            .required(`${field.label} is required`);
        } else if (field.type === 'checkbox') {
          acc[field.name] = Yup.boolean().oneOf(
            [true],
            `${field.label} must be accepted`
          );
        }
      }
      return acc;
    }, {})
  );
  console.log(optimisticValue);
  const submitData = async (data, setSubmitting) => {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    };

    fetch(`${process.env.TEST_SERVER_API}/posts`, options)
      .then((response) => response.json())
      .then((data) => {
        console.log(data.id);
        toast.success(data.id);
        setSubmitting(false);
      })
      .catch((error) => {
        setSubmitting(false);
        startTransition(() => {
          setOptimisticValue(() => null);
        });
        toast.error(error.message);
      });
  };

  const handleSubmit = (values, { setSubmitting }) => {
    startTransition(() => {
      setOptimisticValue(values);
    });
    submitData(values, setSubmitting);
  };

  return (
    <Formik
      initialValues={optimisticValue}
      validationSchema={validationSchema}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue, values, isSubmitting, touched, resetForm }) => (
        <Form>
          {formJson.map((field, index) => {
            switch (field.variant) {
              case 'Input':
                return (
                  <div key={index}>
                    <label htmlFor={field.name}>{field.label}</label>
                    <Field name={field.name}>
                      {({ field: formikField }) => (
                        <Input
                          {...formikField}
                          id={field.name}
                          type={field.type}
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                          onFocus={() => incrementInteractionCount(field.name)}
                        />
                      )}
                    </Field>
                    <ErrorMessage name={field.name} component="div" />
                    <span className='text-sm'>Interactions: {fieldInteractions[field.name]}</span>
                    {field.description && touched.description && (
                      <small className='text-sm'>{field.description}</small>
                    )}
                  </div>
                );
              case 'Checkbox':
                return (
                  <div key={index}>
                    <Field name={field.name}>
                      {({ field: formikField }) => (
                        <Checkbox
                          id={field.name}
                          checked={formikField.value}
                          onCheckedChange={(checked) => {
                            setFieldValue(field.name, checked);
                            incrementInteractionCount(field.name);
                          }}
                        >
                          {field.label}
                        </Checkbox>
                      )}
                    </Field>
                    <ErrorMessage name={field.name} component="div" />
                    <span className='text-sm'>Interactions: {fieldInteractions[field.name]}</span>
                  </div>
                );
              default:
                return null;
            }
          })}

          {values.age_12345 > 18 && (
            <div>
              <label htmlFor="contactMethod">Preferred Contact Method</label>
              <Field as="select" name="contactMethod" id="contactMethod">
                <option value="">Select</option>
                <option value="email">Email</option>
                <option value="phone">Phone</option>
              </Field>
              <ErrorMessage name="contactMethod" component="div" />
            </div>
          )}

          <div className="flex gap-4">
            <button
              type="submit"
              disabled={isSubmitting ? true : false}
              className="bg-green-400"
            >
              {!isSubmitting ? 'Submit' : 'isSubmitting...'}
            </button>
            <button type="button" onClick={() => resetForm()}>
              Reset
            </button>
          </div>
        </Form>
      )}
    </Formik>
  );
}
