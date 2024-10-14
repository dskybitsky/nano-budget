import React from 'react';

interface SidebarVersionProps {
    name: string;
    version: string;
}

export const SidebarVersion = ({ name, version }: SidebarVersionProps) => {
    return (
        <div className="text-xs font-medium text-default-500 text-center space-y-1">
            <p>{name}</p>
            <p>{version}</p>
        </div>
    );
};
