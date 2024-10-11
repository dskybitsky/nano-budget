import React from 'react';
import { useLayoutContext } from '../layout/layout-context';
import { StyledBurgerButton } from './navbar.styles';

export const BurguerButton = () => {
    const { collapsed, setCollapsed } = useLayoutContext();

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
