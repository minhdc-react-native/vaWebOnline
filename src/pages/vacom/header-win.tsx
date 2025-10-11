'use client';

import { IWindowConfig } from './type';
import { useCallback, useMemo } from 'react';
import { ButtonField } from '@/uiEngine/components/button-field';
import { useT } from '@/i18n/config';
import { useAuth } from '@/auth/context/auth-context';
import { useWinContext } from './win-context';

interface IHeadeWin {
    permission: {
        new: boolean,
        edit: boolean,
        delete: boolean
    }
}
export default function HeaderWin({ permission }: IHeadeWin) {
    const _ = useT();
    const { currentMenuSelected } = useAuth();

    const { handleAction } = useWinContext();

    return (
        <div className="w-full space-y-6">
            <div className="flex flex-wrap items-center lg:items-end justify-between gap-1">
                <span>{`${currentMenuSelected?.value} (${currentMenuSelected?.details})`}</span>
            </div>
            <div className="flex flex-wrap items-center lg:items-end justify-start gap-1">
                <ButtonField
                    btn={
                        {
                            type: "button",
                            label: _('REFRESH'),
                            iconLeft: "refresh-ccw",
                            variant: "outline",
                            hotkey: "F5",
                            handleClick: "onRefresh"
                        }
                    }
                    handleAction={handleAction}
                />
                {permission.new &&
                    <ButtonField
                        btn={
                            {
                                type: "button",
                                label: _('THEM'),
                                iconLeft: "plus",
                                variant: "outline",
                                hotkey: "F4",
                                handleClick: "onNew"
                            }
                        }
                        handleAction={handleAction}
                    />}
                {permission.edit &&
                    <ButtonField
                        btn={
                            {
                                type: "button",
                                label: _('SUA'),
                                iconLeft: "edit",
                                variant: "outline",
                                hotkey: "F3",
                                handleClick: "onEdit"
                            }
                        }
                        handleAction={handleAction}
                    />}
                {permission.delete &&
                    <ButtonField
                        btn={
                            {
                                type: "button",
                                label: _('XOA'),
                                iconLeft: "delete",
                                variant: "outline",
                                hotkey: "F8",
                                handleClick: "onEdit"
                            }
                        }
                        handleAction={handleAction}
                    />}
                {permission.new &&
                    <ButtonField
                        btn={
                            {
                                type: "button",
                                label: _('COPY'),
                                iconLeft: "copy",
                                variant: "outline",
                                hotkey: "F9",
                                handleClick: "onNew"
                            }
                        }
                        handleAction={handleAction}
                    />}
            </div>
        </div>
    );
}
