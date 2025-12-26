
'use client';

import * as React from 'react';
import {ThemeProvider as NextThemesProvider} from 'next-themes';
import {type ThemeProviderProps} from 'next-themes/dist/types';
import {Themes} from '@/components/themes';

export function ThemeProvider({children, ...props}: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <div vaul-drawer-wrapper="">{children}</div>
    </NextThemesProvider>
  );
}
