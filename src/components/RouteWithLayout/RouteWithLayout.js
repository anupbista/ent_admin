import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

const RouteWithLayout = props => {
  const { layout: Layout, component: Component, authGuard,...rest } = props;

  return (
    <Route
      {...rest}
      render={matchProps => {
        if(authGuard){
          if(localStorage.getItem('access_token')){
            return (
              <Layout>
                <Component {...matchProps} />
              </Layout>
            )
          }else{
            return(
              <Redirect to="/login" />
            )
          }
        }else{
          return (
            <Layout>
              <Component {...matchProps} />
            </Layout>
          )
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
