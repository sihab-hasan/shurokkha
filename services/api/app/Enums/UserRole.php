<?php

namespace App\Enums;

enum UserRole: string
{
    case Citizen = 'citizen';
    case Donor = 'donor';
    case Volunteer = 'volunteer';
}
