<?php

namespace App\Enums;

enum ProfileVisibility: string
{
    case Public = 'public';
    case Helpers = 'helpers';
    case Private = 'private';

    public function label(): string
    {
        return match ($this) {
            self::Public => 'Public — anyone can see your profile',
            self::Helpers => 'Helpers only — verified responders',
            self::Private => 'Private — only you',
        };
    }
}
