import React, { Suspense, type ReactNode } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PageLoader from '../components/loader';
import Navbar from '../components/navbar';
import getUserFromLocalStorage from '../utils/getUserFromLocalStorage';

interface PrivateWrapperProps {
  children: ReactNode;
}

const SignIn = React.lazy(async () => await import('../pages/SignInPage'));
const SignUp = React.lazy(async () => await import('../pages/SignUpPage'));
const Home = React.lazy(async () => await import('../pages/HomePage'));
const CreateRecipe = React.lazy(
  async () => await import('../pages/CreateRecipePage'),
);

const isAuthenticated = (): boolean => {
  const user = getUserFromLocalStorage();

  if (user) {
    return true;
  } else {
    return false;
  }
};

const PrivateWrapper = ({
  children,
}: PrivateWrapperProps): JSX.Element | null => {
  const isUserAuthenticated = isAuthenticated();
  return isUserAuthenticated ? (
    <>{children}</>
  ) : (
    <Navigate to="/signin" replace />
  );
};

const Router = (): JSX.Element => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/"
            element={
              <PrivateWrapper>
                <Home />
              </PrivateWrapper>
            }
          />
          <Route
            path="/create-recipe"
            element={
              <PrivateWrapper>
                <CreateRecipe />
              </PrivateWrapper>
            }
          />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default Router;
