// tailwind.config.js
import { nextui } from '@nextui-org/react';

/** @type {import('tailwindcss').Config} */
const config = {
    content: [
        // ...
        // make sure it's pointing to the ROOT node_module
        './node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}',
    ],
    theme: {
        extend: {
            colors: {
                border: 'hsl(var(--border))',
            },
        },
    },
    darkMode: 'class',
    plugins: [nextui()],
};

export default config;
