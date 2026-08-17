<?php

namespace App\Enums;

enum AssistanceRequestStatus: string
{
    case Submitted = 'submitted';
    case Verified = 'verified';
    case Assigned = 'assigned';
    case InProgress = 'in_progress';
    case Resolved = 'resolved';
    case Rejected = 'rejected';
    case Cancelled = 'cancelled';
}
