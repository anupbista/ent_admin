import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, authGuard, unAuthGuard, ...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => {
        const isAuthenticated = (localStorage.getItem('access_token') && localStorage.getItem('access_token') !== undefined && localStorage.getItem('access_token') !== 'null') && ((localStorage.getItem('userid') && localStorage.getItem('userid') !== undefined && localStorage.getItem('userid') !== 'null'));
        if(authGuard){
          if(isAuthenticated){
            return (
              <Layout>
                <Component {...matchProps} />
              </Layout>
            )
          }else{
            localStorage.clear();
            return(
              <Redirect to="/login" />
            )
          }
        }else{
          if(unAuthGuard && isAuthenticated){
            return(
              <Redirect to="/dashboard" />
            )
          }else{
            return (
              <Layout>
                <Component {...matchProps} />
              </Layout>
            )
          }
        }
      }}
    />
  );
};

RouteWithLayout.propTypes = {
  component: PropTypes.any.isRequired,
  layout: PropTypes.any.isRequired,
  path: PropTypes.string
};

export default RouteWithLayout;
