<?php

namespace App\Http\Requests\AssistanceRequest;

use App\Enums\AssistanceRequestPriority;
use App\Enums\AssistanceRequestStatus;
use App\Enums\AssistanceRequestType;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ListAssistanceRequestsRequest extends FormRequest
{
    /**
     * Whitelist of sortable columns. Kept in sync with the controller's
     * belt-and-braces $allowedSort guard.
     */
    public const SORTABLE_FIELDS = [
        'created_at',
        'submitted_at',
        'priority',
        'status',
        'type',
        'affected_people_count',
    ];

    public function authorize(): bool
    {
        return true;
    }

    public function rules(): array
    {
        return [
            'search' => ['sometimes', 'string', 'max:120'],

            // Multi-value filters. Accept either a single value (Laravel's
            // automatic ?status=in_progress) or a comma-separated string
            // (?status=in_progress,assigned). We normalize below in
            // validatedFilters() before passing to whereIn().
            'status' => ['sometimes'],
            'status.*' => [Rule::enum(AssistanceRequestStatus::class)],

            'type' => ['sometimes'],
            'type.*' => [Rule::enum(AssistanceRequestType::class)],

            'priority' => ['sometimes'],
            'priority.*' => [Rule::enum(AssistanceRequestPriority::class)],

            'sort' => ['sometimes', 'string', 'in:'.implode(',', self::SORTABLE_FIELDS)],
            'dir' => ['sometimes', 'string', 'in:asc,desc'],

            'page' => ['sometimes', 'integer', 'min:1'],
            'per_page' => ['sometimes', 'integer', 'min:1', 'max:50'],
        ];
    }

    /**
     * Returns the validated filter values as normalized arrays so callers
     * can pass them straight into whereIn() without re-validating.
     *
     * @return array{
     *   search: ?string,
     *   status: array<int,string>,
     *   type: array<int,string>,
     *   priority: array<int,string>,
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
            'priority' => $this->normalizeList($raw['priority'] ?? null),
            'sort' => isset($raw['sort']) ? (string) $raw['sort'] : null,
            'dir' => isset($raw['dir']) ? (string) $raw['dir'] : null,
            'page' => isset($raw['page']) ? (int) $raw['page'] : null,
            'per_page' => isset($raw['per_page']) ? (int) $raw['per_page'] : null,
        ];
    }

    /**
     * Coerce a filter param into a flat array of strings.
     *
     * Accepts:
     *  - null / missing → []
     *  - "a,b,c"          → ["a","b","c"]
     *  - "a"              → ["a"]
     *  - ["a","b"]        → ["a","b"]
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
