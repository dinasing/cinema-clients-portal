/* eslint-disable react/jsx-props-no-spreading */
import React, { Component } from 'react';
import { Button, Input, Label, FormGroup } from 'reactstrap';
import { Form, Field } from 'react-final-form';

const required = value => {
  return !value || value === '' ? 'This field is required' : undefined;
};

const allowedPassword = password => {
  const pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,20}$/;
  return pattern.test(String(password))
    ? undefined
    : 'Minimum 8 and maximum 20 characters, at least one uppercase letter, one lowercase letter and one number';
};

const allowedName = name => {
  const pattern = /^[\w'\-,.][^0-9_!¡?÷?¿/\\+=@#$%ˆ&*(){}|~<>;:[\]]{2,}$/;
  return pattern.test(String(name)) ? undefined : 'This name is invalid';
};

const allowedEmail = email => {
  const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(String(email).toLowerCase()) ? undefined : 'This email is invalid';
};

const composeValidators = (...validators) => value =>
  validators.reduce((error, validator) => error || validator(value), undefined);

export default class SignUpForm extends Component {
  render() {
    return (
      <Form
        onSubmit={this.props.handleSubmit}
        render={({ handleSubmit, invalid }) => (
          <form onSubmit={handleSubmit}>
            <FormGroup>
              <Label for="firstName">first name</Label>
              <Field name="firstName" validate={composeValidators(required, allowedName)}>
                {({ input, meta }) => (
                  <>
                    <Input
                      {...input}
                      type="text"
                      placeholder=""
                      invalid={meta.error && meta.touched}
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </>
                )}
              </Field>
            </FormGroup>
            <FormGroup>
              <Label for="lastName">last name</Label>
              <Field name="lastName" validate={composeValidators(required, allowedName)}>
                {({ input, meta }) => (
                  <>
                    <Input {...input} type="text" invalid={meta.error && meta.touched} />
                    {meta.error && meta.touched && <span className="error">{meta.error}</span>}
                  </>
                )}
              </Field>
            </FormGroup>
            <FormGroup>
              <Label for="email">email</Label>
              <Field name="email" validate={composeValidators(required, allowedEmail)}>
                {({ input, meta }) => (
                  <>
                    <Input {...input} type="email" invalid={meta.error && meta.touched} required />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </>
                )}
              </Field>
            </FormGroup>
            <FormGroup>
              <Label for="password">password</Label>
              <Field name="password" validate={composeValidators(required, allowedPassword)}>
                {({ input, meta }) => (
                  <>
                    <Input
                      {...input}
                      type="password"
                      placeholder=""
                      invalid={meta.error && meta.touched}
                    />
                    {meta.error && meta.touched && <span>{meta.error}</span>}
                  </>
                )}
              </Field>
            </FormGroup>

            <Button type="submit" color="primary" disabled={invalid}>
              Submit
            </Button>
          </form>
        )}
      />
    );
  }
}
