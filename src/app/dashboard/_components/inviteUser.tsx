'use client';
import { emailSchema, requiredStringSchema } from '@/schemas/zod.schemas';
import { MODE } from '@/constants/constants';
import { z } from 'zod';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { JSX } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SelectInput } from '@/components/ui/select';
import { IBaseUser } from '@/types/auth.interface';
import { InviteHospitalStaffRole } from '@/types/hospital-staff.interface';
import { capitalize } from '@/lib/utils';

export type InviteUserForm = IBaseUser & { role?: InviteHospitalStaffRole };

type InviteUserProps = {
  title: string;
  isLoading?: boolean;
  submit: (inviteUser: InviteUserForm) => void;
  buttonTitle: string;
  showRole?: boolean;
};

const baseInviteSchema = z.object({
  firstName: requiredStringSchema(),
  lastName: requiredStringSchema(),
  email: emailSchema,
});

const inviteWithRoleSchema = baseInviteSchema.extend({
  role: z.enum(['doctor', 'admin']),
});

const InviteUser = ({
  isLoading,
  submit,
  title,
  buttonTitle,
  showRole = false,
}: InviteUserProps): JSX.Element => {
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isValid },
  } = useForm<InviteUserForm>({
    resolver: zodResolver(
      showRole ? inviteWithRoleSchema : baseInviteSchema,
    ) as Resolver<InviteUserForm>,
    mode: MODE.ON_TOUCH,
    defaultValues: showRole ? { role: 'doctor' } : undefined,
  });

  const onSubmit = (userData: InviteUserForm): void => {
    const formattedUserData: InviteUserForm = {
      ...userData,
      firstName: capitalize(userData.firstName.trim()),
      lastName: capitalize(userData.lastName.trim()),
    };
    submit(formattedUserData);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-5 flex flex-col items-center justify-center space-y-8"
    >
      <h2 className="text-center text-2xl font-bold">{title}</h2>
      <Input
        labelName="First Name"
        error={errors.firstName?.message || ''}
        placeholder="John"
        {...register('firstName')}
      />
      <Input
        labelName="Last Name"
        error={errors.lastName?.message || ''}
        placeholder="Doe"
        {...register('lastName')}
      />
      <Input
        labelName="Email"
        error={errors.email?.message || ''}
        placeholder="johndoe@gmail.com"
        {...register('email')}
      />
      {showRole && (
        <SelectInput
          ref={register('role').ref}
          control={control}
          name="role"
          label="Role"
          placeholder="Select role"
          error={errors.role?.message || ''}
          className="w-full max-w-sm"
          options={[
            { value: 'doctor', label: 'Doctor' },
            { value: 'admin', label: 'Admin' },
          ]}
        />
      )}
      <Button
        type="submit"
        className="mt-4 w-full max-w-sm"
        child={buttonTitle}
        disabled={!isValid || isLoading}
        isLoading={isLoading}
      />
    </form>
  );
};

export default InviteUser;
