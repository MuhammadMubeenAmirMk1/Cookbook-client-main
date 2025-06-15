import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router-dom';
import { createRecipe } from '../../api'; // Make sure your API has createRecipe method
import getUserFromLocalStorage from '../../utils/getUserFromLocalStorage';
import { useNotificationContext } from '../../context/notificationContext';
import * as Yup from 'yup';

type SetSubmittingFunction = (value: boolean) => void;

const validationSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  ingredients: Yup.string().required('Ingredients are required'),
  steps: Yup.string().required('Steps are required'),
  tags: Yup.string(), // comma separated
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
    { setSubmitting }: { setSubmitting: SetSubmittingFunction }
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
        setSubmitting(false);
        addNotification('success', response.data.message);
        navigate('/');
      } else {
        addNotification('error', response.data.message);
        setSubmitting(false);
      }
    } catch (error) {
      console.error('Error:', error);
      addNotification('error', 'Something went wrong!');
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 overflow-auto">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen">
        <h2 className="mb-6 text-2xl font-semibold text-gray-900 dark:text-white">
          Create Recipe
        </h2>
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 md:space-y-6">
                  <div>
                    <label htmlFor="title" className="form-label">Title</label>
                    <Field name="title" type="text" className="form-input" />
                    <ErrorMessage name="title" component="div" className="text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="ingredients" className="form-label">Ingredients (comma separated)</label>
                    <Field name="ingredients" as="textarea" className="form-input" />
                    <ErrorMessage name="ingredients" component="div" className="text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="steps" className="form-label">Steps</label>
                    <Field name="steps" as="textarea" className="form-input" />
                    <ErrorMessage name="steps" component="div" className="text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="tags" className="form-label">Tags (optional, comma separated)</label>
                    <Field name="tags" type="text" className="form-input" />
                    <ErrorMessage name="tags" component="div" className="text-red-500" />
                  </div>

                  <div>
                    <label htmlFor="imageUrl" className="form-label">Image URL (optional)</label>
                    <Field name="imageUrl" type="text" className="form-input" />
                    <ErrorMessage name="imageUrl" component="div" className="text-red-500" />
                  </div>

                  <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
                    {isSubmitting ? 'Submitting...' : 'Create Recipe'}
                  </button>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateRecipePage;
