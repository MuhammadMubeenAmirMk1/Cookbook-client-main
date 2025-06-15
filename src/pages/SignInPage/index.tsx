import React from 'react';
import UserIcon from '../../svg/userIcon';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useNavigate } from 'react-router';
import { login } from '../../api';
import parseJwt from '../../utils/parseJwt';
import { useNotificationContext } from '../../context/notificationContext';
import * as Yup from 'yup';

type SetSubmittingFunction = (value: boolean) => void;

const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

const initalValues = { email: '', password: '' };

const SignIn: React.FC = () => {
  const navigate = useNavigate();
  const { addNotification } = useNotificationContext();

  const handleSubmit = async (
    values: any,
    { setSubmitting }: { setSubmitting: SetSubmittingFunction },
  ): Promise<void> => {
    try {
      const response = await login(values);
      const data = response.data;

      if (response.status === 200) {
        const parsedToken = parseJwt(data.payload.token);
        const modifiedToken = { ...parsedToken, token: data.payload.token };
        localStorage.setItem('user', JSON.stringify(modifiedToken));
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
    <div className="bg-gray-50 dark:bg-gray-900">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto h-screen">
        <a
          href="/signin"
          className="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
        >
          <UserIcon className="w-8 h-8 mr-2" />
          Cookbook
        </a>
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
              Log in
            </h1>
            <Formik
              initialValues={initalValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4 md:space-y-6">
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
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </button>
                  <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                    Does not have an account ?{' '}
                    <a
                      href="/signup"
                      className="font-medium text-white hover:underline ml-1"
                    >
                      Click here
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

export default SignIn;
