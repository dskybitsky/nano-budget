'use client';

import React from 'react';
import { ThemeProvider } from 'next-themes';
import { ThemeProviderProps } from 'next-themes/dist/types';

const NextThemeProvider = (props: ThemeProviderProps) => {
    return <ThemeProvider {...props}>{props.children}</ThemeProvider>;
};

export default NextThemeProvider;
