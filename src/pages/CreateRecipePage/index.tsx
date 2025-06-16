import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import type { FormikHelpers } from 'formik';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../../api';
import getUserFromLocalStorage from '../../utils/getUserFromLocalStorage';
import { useNotificationContext } from '../../context/notificationContext';
import * as Yup from 'yup';

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  ingredients: Yup.string().required('Ingredients are required'),
  steps: Yup.string().required('Steps are required'),
  tags: Yup.string(),
  imageUrl: Yup.string().url('Must be a valid URL'),
});

const initialValues = {
  title: '',
  ingredients: '',
  steps: '',
  tags: '',
  imageUrl: '',
};

const CreateRecipePage: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: FormikHelpers<typeof initialValues>,
  ): Promise<void> => {
    try {
      const user = getUserFromLocalStorage();
      if (!user?.userId) throw new Error('User not authenticated');

      const response = await createRecipe({
        ...values,
        ingredients: values.ingredients.split(',').map((i) => i.trim()),
        tags: values.tags ? values.tags.split(',').map((t) => t.trim()) : [],
        author: user.userId,
      });

      if (response.status === 201) {
        addNotification('success', response.data.message);
        navigate('/');
      } else {
        addNotification('error', response.data.message);
      }
    } catch (error) {
      console.error('Error:', error);
      addNotification('error', 'Something went wrong!');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 dark:text-white mb-6">
          Create a New Recipe
        </h2>

        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {[
                { name: 'title', label: 'Title', type: 'text' },
                {
                  name: 'ingredients',
                  label: 'Ingredients (comma separated)',
                  as: 'textarea',
                },
                {
                  name: 'steps',
                  label: 'Steps',
                  as: 'textarea',
                },
                {
                  name: 'tags',
                  label: 'Tags (optional, comma separated)',
                  type: 'text',
                },
                {
                  name: 'imageUrl',
                  label: 'Image URL (optional)',
                  type: 'text',
                },
              ].map(({ name, label, type = 'text', as }) => (
                <div key={name}>
                  <label
                    htmlFor={name}
                    className="block mb-1 text-sm font-medium text-gray-700 dark:text-gray-200"
                  >
                    {label}
                  </label>
                  <Field
                    name={name}
                    type={type}
                    as={as}
                    className="w-full px-4 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none text-gray-900 dark:text-white dark:bg-gray-700 dark:border-gray-600"
                  />
                  <ErrorMessage
                    name={name}
                    component="div"
                    className="text-sm text-red-500 mt-1"
                  />
                </div>
              ))}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition"
              >
                {isSubmitting ? 'Submitting...' : 'Create Recipe'}
              </button>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateRecipePage;
