import React from 'react';
import { useTheme as useNextTheme } from 'next-themes';
import { Switch } from '@nextui-org/react';
import { MoonIcon, SunIcon } from '@nextui-org/shared-icons';

export const DarkModeSwitch = () => {
    const { setTheme, resolvedTheme } = useNextTheme();
    return (
        <Switch
            isSelected={resolvedTheme === 'dark'}
            size="lg"
            color="secondary"
            onValueChange={(e) => setTheme(e ? 'dark' : 'light')}
            thumbIcon={({ isSelected, className }) =>
                isSelected ? <SunIcon className={className} /> : <MoonIcon className={className} />
            }
        >
            Dark mode
        </Switch>
    );
};
