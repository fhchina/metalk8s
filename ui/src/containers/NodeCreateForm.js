import React from 'react';
import { connect } from 'react-redux';
import { DebounceInput } from 'react-debounce-input';
import classnames from 'classnames';
import styled from 'styled-components';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import { withRouter } from 'react-router-dom';
import { injectIntl } from 'react-intl';

import { Button, Checkbox } from 'core-ui';
import {
  gray,
  fontSize,
  padding,
  brand,
  warmRed
} from 'core-ui/dist/style/theme';
import {
  createNodeAction,
  clearCreateNodeErrorAction
} from '../ducks/app/nodes';

const CreateNodeLayout = styled.div`
  height: 100%;
  overflow: auto;
  padding: ${padding.larger};
  form {
    width: 450px;
    padding: 0 ${padding.larger};
  }
`;

const PageHeader = styled.h2`
  margin-top: 0;
`;

const CreateNodeFormContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  margin: ${padding.base} 0;

  input[type='checkbox'] {
    margin: 0;
  }
  input {
    padding: ${padding.small};
    font-size: ${fontSize.large};
    display: block;
    border-radius: 4px;
    border: 1px solid ${gray};
  }

  input:focus {
    border-color: #007eff;
    box-shadow: inset 0 1px 1px rgba(0, 0, 0, 0.075),
      0 0 0 3px rgba(0, 126, 255, 0.1);
    outline: none;
  }

  .input-feedback {
    color: ${warmRed};
    margin: ${padding.smaller} ${padding.base};
    font-size: ${fontSize.small};
  }
`;

const LabelStyle = styled.div`
  display: flex;
  align-items: center;
  width: 200px;
`;

const ActionContainer = styled.div`
  display: flex;
  margin: ${padding.larger} 0;
  justify-content: flex-end;

  button {
    margin-right: ${padding.larger};
  }
`;

const ErrorMessage = styled.span`
  margin-top: ${padding.base};
  color: ${brand.danger};
`;

const FormTitle = styled.h3`
  margin-top: ${padding.larger};
`;

const InputFeedback = ({ error }) =>
  error ? <div className="input-feedback">{error}</div> : null;

const Label = ({ error, className, children, ...props }) => {
  return (
    <LabelStyle className="label" {...props}>
      {children}
    </LabelStyle>
  );
};

const TextInput = ({
  type,
  id,
  label,
  error,
  value,
  onChange,
  className,
  ...props
}) => {
  const classes = classnames(
    'input-group',
    {
      'animated shake error': !!error
    },
    className
  );
  return (
    <CreateNodeFormContainer className={classes}>
      <Label htmlFor={id} error={error}>
        <span>{label}</span>
      </Label>
      {type === 'checkbox' ? (
        <Checkbox
          id={id}
          type={type}
          value={value}
          onChange={onChange ? onChange : null}
          {...props}
        />
      ) : (
        <DebounceInput
          minLength={1}
          debounceTimeout={300}
          id={id}
          className="text-input"
          type={type}
          value={value}
          onChange={onChange ? onChange : null}
          {...props}
        />
      )}
      <InputFeedback error={error} />
    </CreateNodeFormContainer>
  );
};

const initialValues = {
  name: '',
  ssh_user: '',
  hostName_ip: '',
  ssh_port: '',
  ssh_key_path: '',
  sudo_required: false,
  workload_plane: true,
  control_plane: false
};

const validationSchema = Yup.object().shape({
  name: Yup.string().required(),
  ssh_user: Yup.string().required(),
  hostName_ip: Yup.string().required(),
  ssh_port: Yup.string().required(),
  ssh_key_path: Yup.string().required(),
  sudo_required: Yup.boolean().required(),
  workload_plane: Yup.boolean().required(),
  control_plane: Yup.boolean().required()
});

class NodeCreateForm extends React.Component {
  componentWillUnmount() {
    this.props.clearCreateNodeError();
  }

  render() {
    const { intl, asyncErrors } = this.props;
    return (
      <CreateNodeLayout>
        <PageHeader>{intl.messages.create_new_node}</PageHeader>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          validateOnBlur={false}
          validateOnChange={false}
          onSubmit={this.props.createNode}
        >
          {props => {
            const { values, handleChange, isValid, touched, errors } = props;
            return (
              <Form>
                <TextInput
                  name="name"
                  label={intl.messages.name}
                  value={values.name}
                  onChange={handleChange}
                  error={touched.name && errors.name}
                />
                <TextInput
                  name="ssh_user"
                  label={intl.messages.ssh_user}
                  value={values.ssh_user}
                  onChange={handleChange}
                  error={touched.ssh_user && errors.ssh_user}
                />
                <TextInput
                  name="hostName_ip"
                  label={intl.messages.hostName_ip}
                  value={values.hostName_ip}
                  onChange={handleChange}
                  error={touched.hostName_ip && errors.hostName_ip}
                />
                <TextInput
                  name="ssh_port"
                  label={intl.messages.ssh_port}
                  value={values.ssh_port}
                  onChange={handleChange}
                  error={touched.ssh_port && errors.ssh_port}
                />
                <TextInput
                  name="ssh_key_path"
                  label={intl.messages.ssh_key_path}
                  value={values.ssh_key_path}
                  onChange={handleChange}
                  error={touched.ssh_key_path && errors.ssh_key_path}
                />
                <TextInput
                  name="sudo_required"
                  type="checkbox"
                  label={intl.messages.sudo_required}
                  value={values.sudo_required}
                  checked={values.sudo_required}
                  onChange={handleChange}
                />
                <FormTitle>{intl.messages.roles}</FormTitle>
                <TextInput
                  type="checkbox"
                  name="workload_plane"
                  label={intl.messages.workload_plane}
                  checked={values.workload_plane}
                  value={values.workload_plane}
                  onChange={handleChange}
                  error={
                    values.workload_plane || values.control_plane
                      ? ''
                      : intl.messages.role_values_error
                  }
                />
                <TextInput
                  type="checkbox"
                  name="control_plane"
                  label={intl.messages.control_plane}
                  checked={values.control_plane}
                  value={values.control_plane}
                  onChange={handleChange}
                  error={
                    values.workload_plane || values.control_plane
                      ? ''
                      : intl.messages.role_values_error
                  }
                />
                <ActionContainer>
                  <Button
                    text={intl.messages.cancel}
                    type="button"
                    outlined
                    onClick={() => this.props.history.push('/nodes')}
                  />
                  <Button
                    text={intl.messages.create}
                    type="submit"
                    disabled={
                      !isValid ||
                      !(values.workload_plane || values.control_plane) //TODO: TO BE IMPROVED
                    }
                  />
                </ActionContainer>

                {asyncErrors && asyncErrors.create_node ? (
                  <ErrorMessage>{asyncErrors.create_node}</ErrorMessage>
                ) : null}
              </Form>
            );
          }}
        </Formik>
      </CreateNodeLayout>
    );
  }
}

const mapStateToProps = state => ({
  asyncErrors: state.app.nodes.errors
});

const mapDispatchToProps = dispatch => {
  return {
    createNode: body => dispatch(createNodeAction(body)),
    clearCreateNodeError: () => dispatch(clearCreateNodeErrorAction())
  };
};

export default injectIntl(
  withRouter(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(NodeCreateForm)
  )
);