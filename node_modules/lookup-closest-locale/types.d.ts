declare function lookupClosestLocale(locale: string | string[] | undefined, available: { [key: string]: any }): string | undefined;

export = lookupClosestLocale;
