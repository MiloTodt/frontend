import React, { Component } from 'react';
import Cookies from 'js-cookie';
import RegistrationsComponent from './../components/Registrations';
import validator from 'validator';
import history from 'main/history';
import { getSession } from 'libs/user-session';
import axios from 'libs/axios';

export default class RegistrationsContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      email: '',
      password: '',
      password_confirmation: '',
      errors: {},
      isLoading: false,
      registered: false,
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.isInputInvalid = this.isInputInvalid.bind(this);
    if (getSession()) {
      history.push('/');
    }
  }

  validateEmailInput(target) {
    const { name, value } = target;
    if (name === 'email' && value.length > 0 && value.includes('@') === false) {
      return this.setState({
        [`${name}-error`]: true,
      });
    }
  }

  validatePasswordInput(target) {
    const { name, value } = target;
    if (name === 'password' && value.length < 6) {
      return this.setState({
        [`${name}-error`]: true,
      });
    }
  }

  purgeErrorStates(name) {
    const currentState = this.state;
    delete currentState[`${name}-error`];
    this.setState(currentState);
  }

  validateInput = event => {
    const isValid = element => element.checkValidity();
    const { target } = event;
    const { name } = target;
    if (!isValid(target)) {
      this.validateEmailInput(target);
      this.validatePasswordInput(target);
    }

    this.purgeErrorStates(name);
  };

  isInputInvalid(name) {
    return this.state[name + '-error'];
  }

  parseRegister = async () => {
    if (this.state.password !== this.state.password_confirmation) {
      this.setState({ errors: { message: 'Password does not match' } });
      return;
    }
    if (this.state.password.length < 8) {
      this.setState({
        errors: { message: 'Password must be at least 8 characters long' },
      });
      return;
    }
    if (this.state.password.length > 127) {
      this.setState({
        errors: { message: 'Password must be less than 128 characters long' },
      });
      return;
    }
    if (this.state.username.length < 4) {
      this.setState({
        errors: { message: 'Username must be at least 4 characters long' },
      });
      return;
    }
    if (!validator.isEmail(this.state.email)) {
      this.setState({
        errors: { message: 'Please enter a valid email address' },
      });
      return;
    }
    const email = this.state.email.toLowerCase();
    try {
      this.setState({
        isLoading: true,
        errors: {},
      });

      const cookieReferrerId = 'please_referrer_id';
      let referrer = Cookies.get(cookieReferrerId);

      await axios.post('/users/signup', {
        username: this.state.username,
        email,
        password: this.state.password,
        referrerCode: referrer,
      });

      this.setState({
        isLoading: false,
        registered: true,
      });
    } catch (error) {
      const errorMessage =
        error.response && error.response.data && error.response.data.code === 'invalid_password'
          ? `Password requirements are:
            ${error.response.data.policy.split('↵').join('\n')}`
          : (error.response &&
              error.response.data &&
              (error.response.data.message ||
                error.response.data.error_description ||
                error.response.data.description)) ||
            error.message;

      this.setState({
        isLoading: false,
        errors: {
          message: errorMessage,
        },
      });
    }
  };

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value,
    });
  }

  render() {
    return (
      <div className="RegistrationsContainer">
        <RegistrationsComponent
          username={this.state.username}
          email={this.state.email}
          isLoading={this.state.isLoading}
          registered={this.state.registered}
          password={this.state.password}
          password_confirmation={this.state.password_confirmation}
          stateErrors={this.state.errors}
          handleInputChange={this.handleInputChange}
          onSubmitRegistration={this.parseRegister}
          validateInput={this.validateInput}
          isInputInvalid={this.isInputInvalid}
          from={this.props.from}
          message={this.props.message}
          action={this.props.action}
        />
      </div>
    );
  }
}
