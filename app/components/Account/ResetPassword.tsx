import {useEffect, useState} from 'react';
import {useNavigate} from '@remix-run/react';

import {LoadingDots, Link} from '~/components';
import {useCustomerPasswordReset} from '~/lib/customer';
import {useLocale, useSettings} from '~/hooks';

export function ResetPassword() {
  const {errors, resetPassword, status} = useCustomerPasswordReset();
  const navigate = useNavigate();
  const {account} = useSettings();
  const {pathPrefix} = useLocale();

  const [buttonText, setButtonText] = useState('Reset Password');

  const {heading, subtext} = {...account?.reset};

  useEffect(() => {
    if (status.success) {
      setButtonText('Password Reset!');
      setTimeout(() => navigate(`${pathPrefix}/account/login`), 3000);
    }
  }, [status.success]);

  return (
    <div className="flex flex-col items-center">
      <div className="mx-auto flex w-full max-w-md flex-col items-center rounded border border-border px-3 py-6 md:px-6 md:py-10">
        <div className="mb-6 flex flex-col gap-4">
          <h1 className="text-title-h3 text-center">{heading}</h1>

          {subtext && <p className="max-w-xs text-center text-sm">{subtext}</p>}
        </div>

        <form
          className="mx-auto flex w-full max-w-[25rem] flex-col gap-4"
          onSubmit={resetPassword}
        >
          <label htmlFor="password">
            <span className="text-title-h6 block pb-1 pl-5">Password</span>
            <input
              className="input-text"
              name="password"
              placeholder="••••••••"
              required
              type="password"
            />
          </label>

          <label htmlFor="passwordConfirm">
            <span className="text-title-h6 block pb-1 pl-5">
              Confirm Password
            </span>
            <input
              className="input-text"
              name="passwordConfirm"
              placeholder="••••••••"
              required
              type="password"
            />
          </label>

          <button
            aria-label="Submit to reset password"
            className={`btn-primary mt-3 min-w-40 self-center ${
              status.started ? 'cursor-default' : ''
            }`}
            type="submit"
          >
            {status.started ? <LoadingDots color="white" /> : buttonText}
          </button>
        </form>

        <Link
          aria-label="Go back to login page"
          className="text-underline mt-4 text-center text-sm font-bold"
          to="/account/login"
        >
          Cancel
        </Link>

        {errors?.length > 0 && (
          <ul className="mt-4 flex flex-col items-center gap-1">
            {errors.map((error, index) => {
              return (
                <li key={index} className="text-center text-sm text-red-500">
                  {error}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}

ResetPassword.displayName = 'ResetPassword';
