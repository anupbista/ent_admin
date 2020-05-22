import React from 'react';
import { Switch, Redirect } from 'react-router-dom';

import { RouteWithLayout } from './components';
import { Main as MainLayout, Minimal as MinimalLayout } from './layouts';

import {
  Dashboard as DashboardView,
  UserList as UserListView,
  MovieList as MovieListView,
  BookList as BookListView,
  GenreList as GenreListView,
  Account as AccountView,
  SignIn as SignInView,
  NotFound as NotFoundView
} from './views';

const Routes = () => {
  return (
    <Switch>
      <Redirect
        exact
        from="/"
        to="/dashboard"
      />
      <RouteWithLayout
        component={DashboardView}
        exact
        authGuard={true}
        layout={MainLayout}
        path="/dashboard"
      />
      <RouteWithLayout
        component={UserListView}
        exact
        authGuard={true}
        layout={MainLayout}
        path="/users"
      />
       <RouteWithLayout
        component={MovieListView}
        exact
        authGuard={true}
        layout={MainLayout}
        path="/movies"
      />
       <RouteWithLayout
        component={GenreListView}
        exact
        authGuard={true}
        layout={MainLayout}
        path="/genre"
      />
       <RouteWithLayout
        component={BookListView}
        exact
        authGuard={true}
        layout={MainLayout}
        path="/books"
      />
      <RouteWithLayout
        component={AccountView}
        exact
        authGuard={true}
        layout={MainLayout}
        path="/account"
      />
       <RouteWithLayout
        component={SignInView}
        exact
        authGuard={false}
        unAuthGuard={true}
        layout={MinimalLayout}
        path="/login"
      />
      <RouteWithLayout
        component={NotFoundView}
        exact
        layout={MinimalLayout}
        path="/not-found"
      />
      <Redirect to="/not-found" />
    </Switch>
  );
};

export default Routes;
