<?php

namespace App\Http\Requests\Donation;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Query-string validation for `GET /v1/donations`.
 *
 * Single-select on the UI today, but the controller's `whereIn()` will
 * accept arrays just in case the frontend migrates to multi-select later.
 *
 * Whitelist of enums mirrors the values exported by
 * `@shurokkha/contracts` `donation.ts` so the API never sees an unknown
 * value (which would silently return zero results).
 */
class IndexDonationsRequest extends FormRequest
{
    public const SORTABLE_FIELDS = [
        'created_at',
        'amount',
        'campaign_title',
    ];

    public const STATUSES = [
        'pending',
        'processing',
        'completed',
        'failed',
        'refunded',
    ];

    public const TYPES = [
        'one_time',
        'recurring',
        'zakat',
        'sadaqah',
        'general',
    ];

    public const PAYMENT_METHODS = [
        'bkash',
        'nagad',
        'rocket',
        'bank',
        'card',
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['sometimes', 'string', 'max:120'],

            'status' => ['sometimes'],
            'status.*' => ['string', 'in:'.implode(',', self::STATUSES)],

            'type' => ['sometimes'],
            'type.*' => ['string', 'in:'.implode(',', self::TYPES)],

            'payment_method' => ['sometimes'],
            'payment_method.*' => ['string', 'in:'.implode(',', self::PAYMENT_METHODS)],

            'sort' => ['sometimes', 'string', 'in:'.implode(',', self::SORTABLE_FIELDS)],
            'dir' => ['sometimes', 'string', 'in:asc,desc'],

            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ];
    }

    /**
     * @return array{
     *   search: ?string,
     *   status: array<int,string>,
     *   type: array<int,string>,
     *   payment_method: array<int,string>,
     *   sort: ?string,
     *   dir: ?string,
     *   page: ?int,
     *   per_page: ?int,
     * }
     */
    public function validatedFilters(): array
    {
        /** @var array<string,mixed> $raw */
        $raw = $this->validated();

        return [
            'search' => isset($raw['search']) ? (string) $raw['search'] : null,
            'status' => $this->normalizeList($raw['status'] ?? null),
            'type' => $this->normalizeList($raw['type'] ?? null),
            'payment_method' => $this->normalizeList($raw['payment_method'] ?? null),
            'sort' => isset($raw['sort']) ? (string) $raw['sort'] : null,
            'dir' => isset($raw['dir']) ? (string) $raw['dir'] : null,
            'page' => isset($raw['page']) ? (int) $raw['page'] : null,
            'per_page' => isset($raw['per_page']) ? (int) $raw['per_page'] : null,
        ];
    }

    /**
     * Coerce ?status=… into a flat array of strings. Accepts:
     *  - missing → []
     *  - "a,b,c"  → ["a","b","c"]
     *  - "a"      → ["a"]
     *  - ["a","b"] → ["a","b"]
     *
     * @return array<int,string>
     */
    private function normalizeList(mixed $value): array
    {
        if ($value === null || $value === '') {
            return [];
        }

        if (is_array($value)) {
            $flat = [];
            foreach ($value as $item) {
                foreach ($this->normalizeList($item) as $inner) {
                    $flat[] = $inner;
                }
            }

            return array_values(array_unique(array_filter($flat, static fn ($v) => $v !== '')));
        }

        if (is_string($value)) {
            return array_values(array_filter(array_map('trim', explode(',', $value)), static fn ($v) => $v !== ''));
        }

        return [];
    }
}
