<?php

namespace App\Http\Controllers\Api\V1\Citizen;

use App\Http\Controllers\Controller;
use App\Http\Requests\Citizen\MissingPerson\ListMissingPersonReportsRequest;
use App\Http\Requests\Citizen\MissingPerson\StoreMissingPersonReport;
use App\Http\Requests\Citizen\MissingPerson\UpdateMissingPersonReport;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class MissingPersonReportController extends Controller
{
    /**
     * 1. Fetch missing person reports using 100% Raw SQL with user JOIN.
     */
    public function index(ListMissingPersonReportsRequest $request): JsonResponse
    {
        $validated = $request->validated();
        $userId = $request->user()->user_id ?? $request->user()->id;

        $reports = DB::select(<<<'SQL'
            SELECT 
                mpr.id,
                mpr.user_id,
                mpr.full_name,
                mpr.age,
                mpr.gender,
                mpr.photo_path,
                mpr.physical_description,
                mpr.distinguishing_features,
                mpr.last_seen_at,
                mpr.last_seen_location,
                mpr.latitude,
                mpr.longitude,
                mpr.contact_phone,
                mpr.status,
                mpr.found_at,
                mpr.closed_at,
                mpr.created_at,
                mpr.updated_at,
                u.full_name AS reporter_name,
                u.email AS reporter_email
            FROM missing_person_reports mpr
            INNER JOIN users u ON mpr.user_id = u.id
            WHERE mpr.user_id = ? AND mpr.deleted_at IS NULL
            ORDER BY mpr.created_at DESC
        SQL, [$userId]);

        return response()->json(['data' => $reports]);
    }

    /**
     * 2. Store missing person report using 100% Raw SQL INSERT.
     */
    public function store(StoreMissingPersonReport $request): JsonResponse
    {
        $validated = $request->validated();
        $userId = $request->user()->user_id ?? $request->user()->id;
        $id = (string) Str::ulid();
        $photoPath = null;

        if ($request->hasFile('photo')) {
            $photoPath = $request->file('photo')->store('missing-persons', 'local');
        }

        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO missing_person_reports (
                id,
                user_id,
                full_name,
                age,
                gender,
                photo_path,
                physical_description,
                distinguishing_features,
                last_seen_at,
                last_seen_location,
                latitude,
                longitude,
                contact_phone,
                status,
                created_at,
                updated_at
            )
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        SQL, [
            $id,
            $userId,
            $validated['full_name'],
            $validated['age'] ?? null,
            $validated['gender'] ?? null,
            $photoPath,
            $validated['physical_description'] ?? null,
            $validated['distinguishing_features'] ?? null,
            $validated['last_seen_at'],
            $validated['last_seen_location'],
            $validated['latitude'] ?? null,
            $validated['longitude'] ?? null,
            $validated['contact_phone'],
            'reported',
            $now,
            $now,
        ]);

        $created = DB::selectOne(<<<'SQL'
            SELECT * FROM missing_person_reports WHERE id = ?
        SQL, [$id]);

        return response()->json(['data' => $created], 201);
    }

    /**
     * 3. Show single report details using 100% Raw SQL with User JOIN.
     */
    public function show(string $missingPersonReport): JsonResponse
    {
        $userId = auth()->id();

        $record = DB::selectOne(<<<'SQL'
            SELECT 
                mpr.*,
                u.full_name AS reporter_name,
                u.email AS reporter_email
            FROM missing_person_reports mpr
            INNER JOIN users u ON mpr.user_id = u.id
            WHERE mpr.id = ? AND mpr.deleted_at IS NULL
        SQL, [$missingPersonReport]);

        if (! $record) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        if ($record->user_id !== $userId && auth()->user()?->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return response()->json(['data' => $record]);
    }

    /**
     * 4. Retrieve photo.
     */
    public function photo(string $missingPersonReport)
    {
        $userId = auth()->id();

        $record = DB::selectOne(<<<'SQL'
            SELECT photo_path, user_id FROM missing_person_reports WHERE id = ? AND deleted_at IS NULL
        SQL, [$missingPersonReport]);

        if (! $record) {
            abort(404, 'Report not found.');
        }

        if ($record->user_id !== $userId && auth()->user()?->role !== 'admin') {
            abort(403, 'Forbidden');
        }

        abort_if(
            $record->photo_path === null || ! Storage::disk('local')->exists($record->photo_path),
            404,
            'Photo not found.',
        );

        return Storage::disk('local')->response(
            $record->photo_path,
            null,
            ['Cache-Control' => 'private, max-age=3600'],
        );
    }

    /**
     * 5. Update missing person report via 100% Raw SQL UPDATE.
     */
    public function update(UpdateMissingPersonReport $request, string $missingPersonReport): JsonResponse
    {
        $userId = auth()->id();
        $validated = $request->validated();

        $existing = DB::selectOne(<<<'SQL'
            SELECT * FROM missing_person_reports WHERE id = ? AND deleted_at IS NULL
        SQL, [$missingPersonReport]);

        if (! $existing) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        if ($existing->user_id !== $userId && auth()->user()?->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (in_array($existing->status, ['located', 'closed', 'rejected'], true)) {
            return response()->json(['message' => 'This missing-person report can no longer be changed.'], 409);
        }

        $photoPath = $existing->photo_path;
        $removePhoto = (bool) ($validated['remove_photo'] ?? false);

        if ($request->hasFile('photo')) {
            if ($photoPath && Storage::disk('local')->exists($photoPath)) {
                Storage::disk('local')->delete($photoPath);
            }
            $photoPath = $request->file('photo')->store('missing-persons', 'local');
        } elseif ($removePhoto && $photoPath) {
            if (Storage::disk('local')->exists($photoPath)) {
                Storage::disk('local')->delete($photoPath);
            }
            $photoPath = null;
        }

        DB::update(<<<'SQL'
            UPDATE missing_person_reports
            SET 
                full_name = COALESCE(?, full_name),
                age = COALESCE(?, age),
                gender = COALESCE(?, gender),
                photo_path = ?,
                physical_description = COALESCE(?, physical_description),
                distinguishing_features = COALESCE(?, distinguishing_features),
                last_seen_at = COALESCE(?, last_seen_at),
                last_seen_location = COALESCE(?, last_seen_location),
                latitude = COALESCE(?, latitude),
                longitude = COALESCE(?, longitude),
                contact_phone = COALESCE(?, contact_phone),
                updated_at = ?
            WHERE id = ?
        SQL, [
            $validated['full_name'] ?? null,
            $validated['age'] ?? null,
            $validated['gender'] ?? null,
            $photoPath,
            $validated['physical_description'] ?? null,
            $validated['distinguishing_features'] ?? null,
            $validated['last_seen_at'] ?? null,
            $validated['last_seen_location'] ?? null,
            $validated['latitude'] ?? null,
            $validated['longitude'] ?? null,
            $validated['contact_phone'] ?? null,
            now(),
            $missingPersonReport,
        ]);

        $updated = DB::selectOne(<<<'SQL'
            SELECT * FROM missing_person_reports WHERE id = ?
        SQL, [$missingPersonReport]);

        return response()->json(['data' => $updated]);
    }

    /**
     * 6. Delete missing person report via 100% Raw SQL (Soft Delete).
     */
    public function destroy(string $missingPersonReport): JsonResponse
    {
        $userId = auth()->id();

        DB::update(<<<'SQL'
            UPDATE missing_person_reports
            SET deleted_at = ?, updated_at = ?
            WHERE id = ? AND user_id = ?
        SQL, [now(), now(), $missingPersonReport, $userId]);

        return response()->json(null, 204);
    }

    /**
     * 7. Close missing person report via 100% Raw SQL UPDATE.
     */
    public function close(Request $request, string $missingPersonReport): JsonResponse
    {
        $userId = auth()->id();

        $existing = DB::selectOne(<<<'SQL'
            SELECT * FROM missing_person_reports WHERE id = ? AND deleted_at IS NULL
        SQL, [$missingPersonReport]);

        if (! $existing) {
            return response()->json(['message' => 'Report not found'], 404);
        }

        if ($existing->user_id !== $userId && auth()->user()?->role !== 'admin') {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        if (in_array($existing->status, ['located', 'closed', 'rejected'], true)) {
            return response()->json(['message' => 'This missing-person report can no longer be changed.'], 409);
        }

        $validated = $request->validate([
            'located' => ['sometimes', 'boolean'],
        ]);
        $located = (bool) ($validated['located'] ?? false);
        $status = $located ? 'located' : 'closed';
        $now = now();

        DB::update(<<<'SQL'
            UPDATE missing_person_reports
            SET status = ?, found_at = ?, closed_at = ?, updated_at = ?
            WHERE id = ?
        SQL, [
            $status,
            $located ? $now : null,
            $now,
            $now,
            $missingPersonReport,
        ]);

        $updated = DB::selectOne(<<<'SQL'
            SELECT * FROM missing_person_reports WHERE id = ?
        SQL, [$missingPersonReport]);

        return response()->json(['data' => $updated]);
    }
}
