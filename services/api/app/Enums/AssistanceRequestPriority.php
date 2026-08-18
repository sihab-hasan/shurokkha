<?php

namespace App\Enums;

enum AssistanceRequestPriority: string
{
    case Critical = 'critical';
    case High = 'high';
    case Normal = 'normal';
}
