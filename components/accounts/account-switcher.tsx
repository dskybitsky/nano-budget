'use client';

import * as React from 'react';
import { CaretSortIcon, CheckIcon, PlusCircledIcon } from '@radix-ui/react-icons';

import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from '@/components/ui/command';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Account, AccountType } from '@prisma/client';
import { AccountForm } from '@/components/accounts/account-form';
import { useCookies } from 'react-cookie';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

type PopoverTriggerProps = React.ComponentPropsWithoutRef<typeof PopoverTrigger>;

interface AccountSwitcherProps extends PopoverTriggerProps {
    accounts: Account[];
    accountId?: string;
}

export const AccountSwitcher = ({ accounts, accountId, className }: AccountSwitcherProps) => {
    const [, setCookie] = useCookies(['accountId']);

    const router = useRouter();

    const account = accountId ? accounts.find((account) => account.id === accountId) : undefined;

    const accountGroups = accounts.reduce((groups, account) => {
        if (!groups.has(account.type)) {
            groups.set(account.type, []);
        }

        groups.get(account.type)?.push(account);

        return groups;
    }, new Map<AccountType, Account[]>());

    const [open, setOpen] = React.useState(false);
    const [showDialog, setShowDialog] = React.useState(false);
    const [selectedAccount, setSelectedAccount] = React.useState<Account | null>(account ?? null);

    useEffect(() => {
        setSelectedAccount(account ?? null);
    }, [account]);

    const closeDialog = () => setShowDialog(false);

    return (
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select an account"
                        className={cn('w-[200px] justify-between', className)}
                    >
                        {selectedAccount && (
                            <>
                                <Avatar className="mr-2 h-5 w-5">
                                    <AvatarImage
                                        src={`https://avatar.vercel.sh/${selectedAccount.type}.png`}
                                        alt={selectedAccount.name}
                                        className="grayscale"
                                    />
                                    <AvatarFallback>SC</AvatarFallback>
                                </Avatar>
                                {selectedAccount.name}
                            </>
                        )}
                        {!selectedAccount && <p>None</p>}
                        <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandInput placeholder="Search account..." />
                        <CommandList>
                            <CommandEmpty>No account found.</CommandEmpty>
                            {Array.from(accountGroups, ([type, accounts]) => (
                                <CommandGroup key={type} heading={<AccountTypeLabel type={type} />}>
                                    {accounts.map((account) => (
                                        <CommandItem
                                            key={account.id}
                                            onSelect={() => {
                                                setSelectedAccount(account);
                                                setCookie('accountId', account.id);
                                                router.refresh();
                                                setOpen(false);
                                            }}
                                            className="text-sm"
                                        >
                                            <Avatar className="mr-2 h-5 w-5">
                                                <AvatarImage
                                                    src={`https://avatar.vercel.sh/${account.type}.png`}
                                                    alt={account.name}
                                                    className="grayscale"
                                                />
                                                <AvatarFallback>SC</AvatarFallback>
                                            </Avatar>
                                            {account.name}
                                            <CheckIcon
                                                className={cn(
                                                    'ml-auto h-4 w-4',
                                                    selectedAccount?.id === account.id ? 'opacity-100' : 'opacity-0',
                                                )}
                                            />
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            ))}
                        </CommandList>
                        <CommandSeparator />
                        <CommandList>
                            <CommandGroup>
                                <DialogTrigger asChild>
                                    <CommandItem
                                        onSelect={() => {
                                            setOpen(false);
                                            setShowDialog(true);
                                        }}
                                    >
                                        <PlusCircledIcon className="mr-2 h-5 w-5" />
                                        Create Account
                                    </CommandItem>
                                </DialogTrigger>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Account</DialogTitle>
                    <DialogDescription>Add a new account entry to be able to budget and track it.</DialogDescription>
                </DialogHeader>
                <AccountForm formElementId="switcher-account-create-form" onValid={closeDialog} />
                <DialogFooter>
                    <Button variant="outline" onClick={closeDialog}>
                        Cancel
                    </Button>
                    <Button type="submit" form="switcher-account-create-form">
                        Continue
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const AccountTypeLabel = ({ type }: { type: AccountType }) => {
    switch (type) {
        case AccountType.checking:
            return <span>Checking</span>;
        case AccountType.credit:
            return <span>Credit</span>;
        case AccountType.savings:
            return <span>Savings</span>;
    }
};
