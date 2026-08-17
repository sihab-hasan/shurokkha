<?php

namespace App\Enums;

enum AssistanceRequestType: string
{
    case Rescue = 'rescue';
    case Medical = 'medical';
    case Essentials = 'essentials';
    case Shelter = 'shelter';
    case Other = 'other';
}
