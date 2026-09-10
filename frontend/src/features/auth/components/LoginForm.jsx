import { useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';

import Button from '../../../components/ui/Button';
import Checkbox from '../../../components/ui/Checkbox';
import Input from '../../../components/ui/Input';
import Modal from '../../../components/ui/Modal';
import AlertBanner from '../../../components/feedback/AlertBanner';
import SuccessMessage from '../../../components/feedback/SuccessMessage';

import { roleOptions } from '../../../constants/roles';
import { setDemoSession } from '../demoSession';
import RoleSelector from './RoleSelector';

import apiClient from '../../../services/apiClient';
import { API_ENDPOINTS } from '../../../services/endpoints';


export default function LoginForm() {
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    employeeId: '',
    password: '',
    role: '',
  });

  const [errors, setErrors] = useState({});
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberDevice, setRememberDevice] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [successfulRole, setSuccessfulRole] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState('');


  function updateField(event) {
    const { name, value } = event.target;

    setFields((current) => ({
      ...current,
      [name]: value,
    }));

    setErrors((current) => ({
      ...current,
      [name]: undefined,
    }));

    setSuccessfulRole('');
    setServerError('');
  }


  async function handleSubmit(event) {
    event.preventDefault();

    const form = event.currentTarget;
    const nextErrors = {};

    const selectedRole = roleOptions.find(
      (role) => role.value === fields.role
    );


    // ----------------------------------------------------
    // Client-side validation
    // ----------------------------------------------------

    if (!fields.employeeId.trim()) {
      nextErrors.employeeId =
        'Enter your employee ID.';
    }

    if (!fields.password.trim()) {
      nextErrors.password =
        'Enter your password.';
    }

    if (!selectedRole) {
      nextErrors.role =
        'Select the role you are signing in as.';
    }


    setErrors(nextErrors);
    setSuccessfulRole('');
    setServerError('');


    const firstInvalid =
      Object.keys(nextErrors)[0];

    if (firstInvalid) {
      requestAnimationFrame(() => {
        form.elements
          .namedItem(firstInvalid)
          ?.focus();
      });

      return;
    }


    // ----------------------------------------------------
    // Login request
    // ----------------------------------------------------

    setIsLoading(true);

    try {
      const response = await apiClient.post(
        API_ENDPOINTS.AUTH.LOGIN,
        {
          username: fields.employeeId.trim(),
          password: fields.password,
        }
      );


      // --------------------------------------------------
      // Store JWT
      // --------------------------------------------------

      if (!response?.access_token) {
        throw new Error(
          'Login succeeded but no access token was returned.'
        );
      }

      localStorage.setItem(
        'access_token',
        response.access_token
      );


      // --------------------------------------------------
      // Store basic demo session information
      // --------------------------------------------------

      setDemoSession(
        selectedRole.value
      );


      // --------------------------------------------------
      // Success
      // --------------------------------------------------

      setSuccessfulRole(
        selectedRole.label
      );

      setFields((current) => ({
        ...current,
        employeeId: '',
        password: '',
      }));

      setPasswordVisible(false);


      // --------------------------------------------------
      // Navigate according to selected UI role
      // --------------------------------------------------

      const destinations = {
        admin: '/admin',
        'surveillance-officer':
          '/surveillance',
        'duty-officer':
          '/duty-officer/dashboard',
      };

      navigate(
        destinations[selectedRole.value]
        || '/login'
      );

    } catch (error) {

      console.error(
        'Login failed:',
        error
      );

      setServerError(
        error?.message ||
        'Unable to sign in. Please check your credentials.'
      );

    } finally {

      setIsLoading(false);
    }
  }


  const hasErrors =
    Object.values(errors).some(Boolean);

  const PasswordIcon =
    passwordVisible
      ? EyeOff
      : Eye;


  return (
    <>
      <form
        noValidate
        onSubmit={handleSubmit}
        aria-labelledby="sign-in-title"
        className="space-y-4"
      >

        <p
          id="demo-credentials-note"
          className="border-l-2 border-default pl-3 text-caption text-muted"
        >
          Demo access only. Use the authorized prototype
          credentials provided for this system.
        </p>


        {hasErrors && (
          <AlertBanner
            variant="danger"
            title="Check the highlighted fields."
            announce
          >
            Complete the required information
            to continue.
          </AlertBanner>
        )}


        {serverError && (
          <AlertBanner
            variant="danger"
            title="Sign-in failed."
            announce
          >
            {serverError}
          </AlertBanner>
        )}


        {successfulRole && (
          <SuccessMessage
            title="Sign-in successful."
            announce
          >
            Selected role: {successfulRole}.
            Authenticated session created.
          </SuccessMessage>
        )}


        <Input
          id="login-employee-id"
          name="employeeId"
          label="Employee ID"
          placeholder="Enter your employee ID"
          value={fields.employeeId}
          onChange={updateField}
          error={errors.employeeId}
          aria-describedby="demo-credentials-note"
          autoComplete="username"
          autoCapitalize="none"
          autoCorrect="off"
          spellCheck={false}
          required
        />


        <Input
          id="login-password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          type={
            passwordVisible
              ? 'text'
              : 'password'
          }
          value={fields.password}
          onChange={updateField}
          error={errors.password}
          autoComplete="current-password"
          spellCheck={false}
          required
          endAdornment={
            <Button
              type="button"
              variant="ghost"
              size="small"
              className="px-2"
              aria-label={
                passwordVisible
                  ? 'Hide password'
                  : 'Show password'
              }
              aria-controls="login-password"
              onClick={() =>
                setPasswordVisible(
                  (current) => !current
                )
              }
            >
              <PasswordIcon
                aria-hidden="true"
                className="icon-md"
              />
            </Button>
          }
        />


        <RoleSelector
          id="login-role"
          name="role"
          value={fields.role}
          onChange={updateField}
          error={errors.role}
        />


        <div className="space-y-2">

          <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-2">

            <Checkbox
              label="Remember this device"
              checked={rememberDevice}
              onChange={(event) =>
                setRememberDevice(
                  event.target.checked
                )
              }
              aria-describedby="remember-device-note"
            />

            <Button
              type="button"
              variant="ghost"
              size="small"
              className="px-0 hover:underline"
              onClick={() =>
                setHelpOpen(true)
              }
            >
              Forgot password?
            </Button>

          </div>


          <p
            id="remember-device-note"
            className="text-caption text-muted"
          >
            Demo only; this preference is not saved.
          </p>

        </div>


        <Button
          type="submit"
          className="w-full"
          disabled={isLoading}
        >
          {isLoading
            ? 'Signing in...'
            : 'Sign In'}

          {!isLoading && (
            <ArrowRight
              aria-hidden="true"
              className="icon-sm"
            />
          )}
        </Button>

      </form>


      <Modal
        open={helpOpen}
        onClose={() =>
          setHelpOpen(false)
        }
        title="Password assistance"
        description="Password recovery is not connected in this demo."
        size="small"
        footer={
          <Button
            onClick={() =>
              setHelpOpen(false)
            }
          >
            Return to sign in
          </Button>
        }
      >
        <p className="text-body text-muted">
          In a deployed system, contact your
          authorized system administrator for
          access assistance. Do not share your
          password.
        </p>
      </Modal>
    </>
  );
}