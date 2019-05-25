import React, { Component } from 'react';
import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { ThemeProvider } from 'styled-components';
import { matchPath } from 'react-router';
import { Layout as CoreUILayout, Loader as LoaderCoreUI } from 'core-ui';
import { withRouter, Switch } from 'react-router-dom';
import styled from 'styled-components';

import NodeCreateForm from './NodeCreateForm';
import NodeList from './NodeList';
import NodeInformation from './NodeInformation';
import ClusterStatus from './ClusterStatus';
import Welcome from '../components/Welcome';
import PrivateRoute from './PrivateRoute';
import { logoutAction } from '../ducks/login';
import { toggleSidebarAction } from '../ducks/app/layout';

import { fetchNodesAction } from '../ducks/app/nodes';

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
`;

class Layout extends Component {
  componentDidMount() {
    this.props.fetchNodes();
  }

  render() {
    const applications = [];

    const help = [
      {
        label: this.props.intl.messages.about,
        onClick: () => {
          this.props.history.push('/about');
        }
      }
    ];

    const user = {
      name: this.props.user && this.props.user.username,
      actions: [
        { label: this.props.intl.messages.log_out, onClick: this.props.logout }
      ]
    };

    const sidebar = {
      expanded: this.props.sidebar.expanded,
      actions: [
        {
          label: this.props.intl.messages.cluster_monitoring,
          icon: <i className="fas fa-desktop" />,
          onClick: () => {
            this.props.history.push('/');
          },
          active: matchPath(this.props.history.location.pathname, {
            path: '/',
            exact: true,
            strict: true
          })
        },
        {
          label: this.props.intl.messages.nodes,
          icon: <i className="fas fa-server" />,
          onClick: () => {
            this.props.history.push('/nodes');
          },
          active: matchPath(this.props.history.location.pathname, {
            path: '/nodes',
            exact: false,
            strict: true
          })
        }
      ]
    };

    const navbar = {
      onToggleClick: this.props.toggleSidebar,
      toggleVisible: true,
      productName: this.props.intl.messages.product_name,
      applications,
      help,
      user: this.props.user && user,
      logo: (
        <img
          alt="logo"
          src={process.env.PUBLIC_URL + '/brand/assets/branding.svg'}
        />
      )
    };

    return (
      <ThemeProvider theme={this.props.theme}>
        <CoreUILayout sidebar={sidebar} navbar={navbar}>
          {this.props.loading ? (
            <LoaderContainer>
              <LoaderCoreUI size="massive" />
            </LoaderContainer>
          ) : (
            <Switch>
              <PrivateRoute
                exact
                path="/nodes/create"
                component={NodeCreateForm}
              />
              <PrivateRoute
                exact
                path="/nodes/:id"
                component={NodeInformation}
              />
              <PrivateRoute exact path="/nodes" component={NodeList} />
              <PrivateRoute exact path="/about" component={Welcome} />
              <PrivateRoute exact path="/" component={ClusterStatus} />
            </Switch>
          )}
        </CoreUILayout>
      </ThemeProvider>
    );
  }
}

const mapStateToProps = state => ({
  user: state.login.user,
  sidebar: state.app.layout.sidebar,
  theme: state.config.theme,
  loading: state.app.layout.loading
});

const mapDispatchToProps = dispatch => {
  return {
    logout: () => dispatch(logoutAction()),
    toggleSidebar: () => dispatch(toggleSidebarAction()),
    fetchNodes: () => dispatch(fetchNodesAction())
  };
};

export default injectIntl(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(Layout)
  )
);
