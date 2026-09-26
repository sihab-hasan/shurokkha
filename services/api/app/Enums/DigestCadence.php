<?php

namespace App\Enums;

enum DigestCadence: string
{
    case Never = 'never';
    case Daily = 'daily';
    case Weekly = 'weekly';

    public function label(): string
    {
        return match ($this) {
            self::Never => 'Never',
            self::Daily => 'Daily digest',
            self::Weekly => 'Weekly digest',
        };
    }
}
