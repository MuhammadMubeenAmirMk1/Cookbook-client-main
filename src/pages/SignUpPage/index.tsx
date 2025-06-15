import React from 'react';
import CookbookIcon from '../../svg/cookbookIcon';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { register } from '../../api';
import { useNavigate } from 'react-router-dom';
import { useNotificationContext } from '../../context/notificationContext';
import * as Yup from 'yup';

type SetSubmittingFunction = (value: boolean) => void;

const validationSchema = Yup.object().shape({
  name: Yup.string().required('Name is required'),
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const initialValues = { name: '', email: '', password: '' };

const SignUp: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: SetSubmittingFunction },
  ): Promise<void> => {
    try {
      const response = await register(values);

      if (response.status === 201) {
        setSubmitting(false);
        addNotification('success', response.data.message);
        navigate('/signin');
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
        <a
          href="/signup"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <CookbookIcon className="w-8 h-8 mr-2" />
          Cook Book
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Create an account
            </h1>
            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 md:space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your name
                    </label>
                    <Field
                      type="text"
                      name="name"
                      id="name"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="John Doe"
                      required
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Your email
                    </label>
                    <Field
                      type="email"
                      name="email"
                      id="email"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="name@company.com"
                      required
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="password"
                      className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      id="password"
                      placeholder="••••••••"
                      className="bg-gray-50 border border-gray-300 text-gray-900 sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      required
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full text-center py-3 rounded bg-green-600 text-white hover:dark:bg-green-900 focus:outline-none my-1"
                  >
                    {isSubmitting ? 'Submitting...' : 'Create Account'}
                  </button>
                  <p className="text-sm font-light dark:text-gray-400">
                    Already have an account?
                    <a
                      href="/signin"
                      className="font-medium text-white hover:underline ml-1"
                    >
                      Login here
                    </a>
                  </p>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
