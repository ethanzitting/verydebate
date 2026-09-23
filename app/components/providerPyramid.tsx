'use client';

import { FC, PropsWithChildren } from 'react';
import { PasswordGate } from '@/app/components/authenticate/passwordGate';

export const ProviderPyramid: FC<PropsWithChildren> = ({
  children,
}) => {
  return (
    <PasswordGate>{children}</PasswordGate>
  );
};
