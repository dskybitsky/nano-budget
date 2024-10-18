import React from 'react';
import { useMainLayoutContext } from '../main-layout-context';
import { StyledBurgerButton } from './navbar.styles';

export const BurguerButton = () => {
    const { collapsed, setCollapsed } = useMainLayoutContext();

    return (
        <div
            className={StyledBurgerButton()}
            // open={collapsed}
            onClick={setCollapsed}
        >
            <div />
            <div />
        </div>
    );
};
