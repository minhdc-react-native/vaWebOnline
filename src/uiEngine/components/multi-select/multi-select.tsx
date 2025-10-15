'use client';

import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button, ButtonArrow } from '@/components/ui/button';
import {
    Command,
    CommandCheck,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useT } from '@/i18n/config';
import { cn } from '@/lib/utils';

interface IProgs {
    name: string;
    value: string;
    source: IData[];
    placeholder?: string;
    placeholderSearch?: string;
    disabled?: boolean;
    display?: { fId?: string, fValue?: string, fDisplay?: string };
    className?: string;
    onChange?: (value: string | null) => void;
}
export default function MultiSelect({ value = '', source, placeholder, placeholderSearch, disabled, display = {}, className, onChange }: IProgs) {
    const _ = useT();
    display = { ...display, fId: display.fId ?? 'id', fValue: display.fValue ?? 'value', fDisplay: display.fDisplay ?? 'value' };

    const [open, setOpen] = React.useState(false);
    const valueSplit = (value ?? '').split(',');

    const toggleSelection = (item: IData) => {
        const itemValue = item[display.fId!].toString();
        const arr = valueSplit
            .map((v) => v.trim())
            .filter(Boolean);

        let newValues: string[];

        if (arr.includes(itemValue)) {
            newValues = arr.filter((v) => v !== itemValue);
        } else {
            newValues = [...arr, itemValue];
        }
        onChange?.(newValues.join(','));
    };



    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    mode="input"
                    disabled={disabled}
                    placeholder={valueSplit.length === 0}
                    className={cn("w-full", className)}
                >
                    {valueSplit.length > 0 ? (
                        <span className='truncate'>
                            {`${_('CHON')} `}
                            <Badge variant="outline" size="sm" className='font-bold text-primary'>
                                {valueSplit.length}
                            </Badge>{' '}
                        </span>
                    ) : (
                        <span className='text-muted-foreground'>{placeholder}</span>
                    )}
                    <ButtonArrow />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-(--radix-popper-anchor-width) p-0">
                <Command>
                    <CommandInput placeholder={placeholderSearch} />
                    <CommandList>
                        <CommandEmpty>No item.</CommandEmpty>
                        <CommandGroup>
                            {source.map((item) => (
                                <CommandItem key={item[display.fId!]} value={item[display.fValue!]} onSelect={() => toggleSelection(item)}>
                                    <span className="truncate">{item[display.fDisplay!]}</span>
                                    {valueSplit.includes(item[display.fId!].toString()) && <CommandCheck />}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
}
