import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async () => {
    // Provide a static locale, fetch a user setting,
    // read from `cookies()`, `headers()`, etc.
    const locale = 'en';

    return {
        locale,
        messages: (await import(`../messages/${locale}.json`)).default,
        formats: {
            dateTime: {
                short: {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                    hour: 'numeric',
                    minute: 'numeric',
                    hourCycle: 'h23',
                },
            },
            number: {
                precise: {
                    maximumFractionDigits: 5,
                },
            },
            list: {
                enumeration: {
                    style: 'long',
                    type: 'conjunction',
                },
            },
        },
        timeZone: 'Canada/Eastern',
    };
});
