<?php

namespace App\Enums;

enum UserRole: string
{
    case User = 'user';
    case Admin = 'admin';

    /** @return list<Permission> */
    public function permissions(): array
    {
        return match ($this) {
            self::User, self::Admin => Permission::cases(),
        };
    }

    public function hasPermission(Permission $permission): bool
    {
        return in_array($permission, $this->permissions(), true);
    }
}
