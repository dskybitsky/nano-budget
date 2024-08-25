import * as React from 'react';

interface PageProps extends React.HTMLAttributes<HTMLElement> {
    title: string;
    sideBlock?: React.ReactNode;
}

export const Page = async ({ title, sideBlock, children }: PageProps) => {
    return (
        <div className="flex-1 space-y-4 p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
                <h2 className="text-3xl font-bold tracking-tight">{title}</h2>
                {sideBlock && <div className="flex items-center space-x-2">{sideBlock}</div>}
            </div>
            {children}
        </div>
    );
};
