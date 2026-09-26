<?php

namespace App\Enums;

enum Permission: string
{
    case AssistanceAccess = 'assistance.access';
    case MissingPersonsAccess = 'missing-persons.access';
}