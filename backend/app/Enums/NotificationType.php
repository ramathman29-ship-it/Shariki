<?php

namespace App\Enums;

enum NotificationType: string
{
    case NEW_REQUEST = 'new_request';
    case REQUEST_ACCEPTED = 'request_accepted';
    case REQUEST_REJECTED = 'request_rejected';
    case CONTRACT_UPLOADED = 'contract_uploaded';
    case REQUEST_PENDING_APPROVAL = 'request_pending_approval';
    case PROPERTY_APPROVED = 'property_approved';
}
