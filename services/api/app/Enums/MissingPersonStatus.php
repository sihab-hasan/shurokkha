<?php

namespace App\Enums;

enum MissingPersonStatus: string
{
    case Reported = 'reported';
    case UnderReview = 'under_review';
    case Verified = 'verified';
    case Searching = 'searching';
    case Located = 'located';
    case Closed = 'closed';
    case Rejected = 'rejected';
}
