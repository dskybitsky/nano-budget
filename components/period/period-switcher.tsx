'use client';

import * as React from 'react';

import { Account, Period } from '@prisma/client';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext } from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface PeriodSwitcherProps {
    account: Account;
    periods: Period[];
    periodId?: string;
}

export default function PeriodSwitcher({ account, periods, periodId }: PeriodSwitcherProps) {
    const cookieName = `${account.id}_periodId`;

    const [, setCookie] = useCookies([cookieName]);

    const router = useRouter();

    const currentPeriodIndex = periods.findIndex((p) => p.id === periodId);

    return (
        <div className="flex flex-wrap items-end justify-end w-full">
            {periods.length > 0 && (
                <div className="flex w-full justify-end mr-12 ml-12">
                    <Carousel
                        opts={{
                            align: 'end',
                            startIndex: currentPeriodIndex,
                        }}
                        className="w-full"
                    >
                        <CarouselContent className="-ml-2 justify-center">
                            {periods.map((period) => (
                                <CarouselItem key={period.id} className="pl-4 basis-1/3">
                                    <Card
                                        className={cn(
                                            'border-none shadow-none',
                                            period.id === periodId ? 'font-semibold' : 'cursor-pointer',
                                        )}
                                    >
                                        <CardContent className="h-fit flex items-center justify-center p-2">
                                            <span
                                                onClick={() => {
                                                    setCookie(cookieName, period.id);
                                                    router.refresh();
                                                }}
                                            >
                                                {period.name}
                                            </span>
                                        </CardContent>
                                    </Card>
                                </CarouselItem>
                            ))}
                        </CarouselContent>
                        <CarouselPrevious />
                        <CarouselNext />
                    </Carousel>
                </div>
            )}
        </div>
    );
}
