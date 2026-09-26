<?php

namespace App\Enums;

enum LocationSharing: string
{
    case Never = 'never';
    case WhileUsing = 'while_using';
    case Always = 'always';

    public function label(): string
    {
        return match ($this) {
            self::Never => 'Never share location',
            self::WhileUsing => 'Only while using the app',
            self::Always => 'Always share location',
        };
    }
}
