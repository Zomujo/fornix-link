'use client';
import { Button } from '@/components/ui/button';
import { MODE } from '@/constants/constants';
import { emailSchema, hospitalNameSchema, requiredStringSchema } from '@/schemas/zod.schemas';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { ChangeEvent, JSX, useEffect, useRef, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { IUserSignUp, IHospitalSignUp } from '@/types/auth.interface';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { signUp, initiateGoogleOAuth, hospitalSignUp } from '@/lib/features/auth/authThunk';
import { selectThunkState } from '@/lib/features/auth/authSelector';
import { Role } from '@/types/shared.enum';
import { ImageVariant, Modal } from '@/components/ui/dialog';
import Location, { Option } from '@/components/location/location';
import { ISelected } from '@/components/ui/dropdown-menu';
import UserSignUp, { UserSignUpMethods } from '@/app/(auth)/_components/userSignUp';
import GoogleOAuthButton from '@/components/ui/googleOAuthButton';
import { useSearchParams } from 'next/navigation';
import { PLACEHOLDER_HOSPITAL_NAME } from '@/constants/branding.constant';

const roleOptions: ISelected[] = [
  {
    label: 'Patient',
    value: Role.Patient,
  },
  { label: 'Doctor', value: Role.Doctor },
  { label: 'Hospital', value: Role.Hospital },
];

export type SignUpFormProps = {
  hasBookingInfo: boolean;
  doctorId?: string;
  slotId?: string;
};

const parseOptionalCoordinate = (
  value: string | undefined,
  min: number,
  max: number,
  label: string,
): number | undefined => {
  const trimmed = value?.trim();
  if (!trimmed) {
    return undefined;
  }
  const num = Number(trimmed);
  if (Number.isNaN(num)) {
    throw new Error(`${label} must be a number`);
  }
  if (num < min || num > max) {
    throw new Error(`${label} must be between ${min} and ${max}`);
  }
  return num;
};


const hospitalSignUpSchema = z
  .object({
    email: emailSchema,
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
    hospitalName: hospitalNameSchema,
    location: requiredStringSchema(),
    lat: z.string().optional(),
    long: z.string().optional(),
    gpsLink: requiredStringSchema(),
    phone: z.string().optional(),
  })
  .refine(({ password, confirmPassword }) => password === confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })
  .superRefine(({ lat, long }, ctx) => {
    const latProvided = Boolean(lat?.trim());
    const longProvided = Boolean(long?.trim());

    if (latProvided !== longProvided) {
      ctx.addIssue({
        code: 'custom',
        message: 'Provide both latitude and longitude, or leave both empty',
        path: ['lat'],
      });
      return;
    }

    if (!latProvided) {
      return;
    }

    try {
      parseOptionalCoordinate(lat, -90, 90, 'Latitude');
      parseOptionalCoordinate(long, -180, 180, 'Longitude');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Invalid coordinate';
      const path = message.startsWith('Latitude') ? 'lat' : 'long';
      ctx.addIssue({ code: 'custom', message, path: [path] });
    }
  });

type HospitalSignUpFormValues = z.infer<typeof hospitalSignUpSchema>;

const SignUpForm = ({ hasBookingInfo, slotId, doctorId }: SignUpFormProps): JSX.Element => {
  const userSignUpRef = useRef<UserSignUpMethods>(null);

  const searchParams = useSearchParams();
  const roleParam = searchParams.get('role');

  const {
    register: registerHospital,
    handleSubmit: handleSubmitHospital,
    watch: watchHospital,
    setValue: setValueHospital,
    reset: resetHospital,
    formState: { errors: errorsHospital, isValid: isValidHospital },
  } = useForm<HospitalSignUpFormValues>({
    resolver: zodResolver(hospitalSignUpSchema),
    mode: MODE.ON_TOUCH,
    defaultValues: { lat: '', long: '' },
  });

  const hospitalLocation = watchHospital('location');

  const dispatch = useAppDispatch();
  const [role, setRole] = useState<Role>(Role.Patient);
  const [successMessage, setSuccessMessage] = useState('');
  const { isLoading, isOAuthLoading, errorMessage } = useAppSelector(selectThunkState);

  const onSubmit = async (userCredentials: IUserSignUp): Promise<void> => {
    setSuccessMessage('');
    const payload = await dispatch(signUp({ ...userCredentials, role, doctorId, slotId })).unwrap();
    if (payload) {
      setSuccessMessage(payload as string);
      userSignUpRef.current?.resetUserSignUp();
    }

    setOpenModal(true);
  };

  const onHospitalSubmit = async (hospitalCredentials: HospitalSignUpFormValues): Promise<void> => {
    setSuccessMessage('');
    const { lat, long, ...rest } = hospitalCredentials;
    const parsedLat = parseOptionalCoordinate(lat, -90, 90, 'Latitude');
    const parsedLong = parseOptionalCoordinate(long, -180, 180, 'Longitude');
    const formattedCredentials: IHospitalSignUp = {
      ...rest,
      hospitalName: hospitalCredentials.hospitalName.trim(),
      ...(parsedLat != null && parsedLong != null ? { lat: parsedLat, long: parsedLong } : {}),
    };
    const payload = await dispatch(hospitalSignUp(formattedCredentials)).unwrap();
    if (payload) {
      setSuccessMessage(payload as string);
      resetHospital();
    }

    setOpenModal(true);
  };

  const [openModal, setOpenModal] = useState(false);

  const handleHospitalLocationValue = ({ value }: Option): void => {
    const gpsLink = `https://maps.google.com/?q=${encodeURIComponent(value.description)}`;
    setValueHospital('gpsLink', gpsLink, { shouldValidate: true });
    setValueHospital('location', value.description, { shouldValidate: true });
  };

  const handleRoleChange = ({ target }: ChangeEvent<HTMLInputElement>): void =>
    setRole(target.value as Role);

  const handleGoogleSignUp = async (): Promise<void> => {
    await dispatch(initiateGoogleOAuth({ doctorId, slotId, role }));
  };

  const getRoleDescription = (roleValue: Role): string => {
    switch (roleValue) {
      case Role.Patient:
        return 'Book appointments and manage your health';
      case Role.Doctor:
        return 'Provide healthcare services and manage patients';
      case Role.Hospital:
        return 'Manage hospital operations and view appointments';
      default:
        return '';
    }
  };

  useEffect(() => {
    if (roleParam) {
      setRole(roleParam as Role);
    }
  }, [roleParam]);

  return (
    <div className="mx-auto w-full max-w-sm">
      <div className="mt-4">
        {successMessage ? (
          <Modal
            open={openModal}
            content={successMessage}
            showImage={true}
            imageVariant={ImageVariant.Email}
            showClose={true}
            setState={setOpenModal}
          />
        ) : (
          <Modal
            open={openModal}
            content={errorMessage}
            showImage={true}
            imageVariant={ImageVariant.Error}
            showClose={true}
            setState={setOpenModal}
          />
        )}
      </div>
      {!hasBookingInfo && (
        <div className="mb-6">
          <h3 className="mb-3 text-center text-lg font-semibold text-gray-900">
            I want to sign up as a:
          </h3>
          <div className="space-y-3">
            {roleOptions.map(({ label, value }) => (
              <label
                key={value}
                className={`hover:border-primary hover:bg-primary/5 flex cursor-pointer items-center justify-between rounded-lg border-2 p-4 transition-all ${
                  role === value ? 'border-primary bg-primary/10' : 'border-gray-200 bg-white'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <input
                    type="radio"
                    value={value}
                    className="accent-primary h-5 w-5"
                    checked={role === value}
                    onChange={handleRoleChange}
                  />
                  <div>
                    <span className="block font-medium text-gray-900">{label}</span>
                    <span className="text-sm text-gray-500">
                      {getRoleDescription(value as Role)}
                    </span>
                  </div>
                </div>
                {role === value && (
                  <svg className="text-primary h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                )}
              </label>
            ))}
          </div>
        </div>
      )}
      {role !== Role.Hospital && (
        <>
          <GoogleOAuthButton
            onClick={handleGoogleSignUp}
            isLoading={isOAuthLoading}
            text="Sign up with Google"
          />
          <div className="my-6 flex items-center gap-4">
            <div className="h-px flex-1 bg-gray-300"></div>
            <span className="text-sm text-gray-500">OR</span>
            <div className="h-px flex-1 bg-gray-300"></div>
          </div>
          <UserSignUp
            ref={userSignUpRef}
            role={role}
            isLoading={isLoading}
            submit={onSubmit}
            hasBookingInfo={hasBookingInfo}
          />
        </>
      )}
      {role === Role.Hospital && (
        <form onSubmit={handleSubmitHospital(onHospitalSubmit)} className="mt-8 space-y-6">
          <div className="space-y-4">
            <Input
              labelName="Email"
              error={errorsHospital.email?.message}
              placeholder="contact@yourhospital.com"
              {...registerHospital('email')}
            />
            <Input
              labelName="Password"
              error={errorsHospital.password?.message}
              placeholder="••••••••"
              type="password"
              {...registerHospital('password')}
            />
            <Input
              labelName="Confirm Password"
              error={errorsHospital.confirmPassword?.message}
              placeholder="••••••••"
              type="password"
              {...registerHospital('confirmPassword')}
            />
            <Input
              labelName="Hospital Name"
              error={errorsHospital.hospitalName?.message}
              placeholder={PLACEHOLDER_HOSPITAL_NAME}
              {...registerHospital('hospitalName')}
            />
            <Location
              placeHolder="Liberation Road, Accra"
              error={errorsHospital.location?.message || ''}
              value={hospitalLocation || ''}
              onChange={(value) => {
                setValueHospital('location', value, { shouldValidate: true });
              }}
              handleLocationValue={handleHospitalLocationValue}
              onBlur={() => {
                if (!hospitalLocation) {
                  setValueHospital('location', '', { shouldTouch: true, shouldValidate: true });
                }
              }}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                labelName="Latitude (Optional)"
                error={errorsHospital.lat?.message}
                placeholder="5.6037"
                type="number"
                step="any"
                {...registerHospital('lat')}
              />
              <Input
                labelName="Longitude (Optional)"
                error={errorsHospital.long?.message}
                placeholder="-0.1870"
                type="number"
                step="any"
                {...registerHospital('long')}
              />
            </div>
            <Input
              labelName="Phone (Optional)"
              error={errorsHospital.phone?.message}
              placeholder="+233 24 123 4567"
              {...registerHospital('phone')}
            />
          </div>
          <Button
            type="submit"
            className="mt-4 w-full"
            child="Create Hospital Account"
            disabled={!isValidHospital || isLoading}
            isLoading={isLoading}
          />
        </form>
      )}
      <div className="mt-4 text-center">
        <span>Already have an account?</span>
        <Link href="/login" className="text-primary pl-1">
          Login
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
