<?php

namespace App\Http\Controllers\Api\V1\Document;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Document\UploadDocumentRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

/**
 * Document upload + retrieval. Citizens upload at
 * /v1/auth/me/documents; admins list everything at /v1/admin/documents.
 */
class DocumentController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $isAdmin = $user && $user->role?->value === 'admin';

        if ($isAdmin) {
            $rows = DB::select(<<<'SQL'
                SELECT
                    d.*, u.full_name AS user_name
                FROM documents d
                LEFT JOIN users u ON d.user_id = u.id
                ORDER BY d.created_at DESC
            SQL);
        } else {
            $rows = DB::select(
                'SELECT * FROM documents WHERE user_id = ? ORDER BY created_at DESC',
                [$user->id]
            );
        }

        return response()->json(['data' => $rows]);
    }

    public function show(int|string $document): JsonResponse
    {
        $user = auth()->user();
        $row = DB::selectOne('SELECT * FROM documents WHERE document_id = ?', [(int) $document]);

        if (! $row) {
            return response()->json(['message' => 'Document not found.'], 404);
        }

        // Ownership check: citizens can only see their own docs.
        if ($user && $user->role?->value !== 'admin' && (int) $row->user_id !== (int) $user->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        return response()->json(['data' => $row]);
    }

    public function store(UploadDocumentRequest $request): JsonResponse
    {
        $v = $request->validated();
        $user = $request->user();
        $file = $request->file('file');

        $disk = Storage::disk('local');
        $path = $file->store("documents/{$user->id}", 'local');
        $now = now();

        DB::insert(<<<'SQL'
            INSERT INTO documents
                (user_id, document_type, title, description, file_path, file_name,
                 mime_type, size_bytes, status, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'uploaded', ?, ?)
        SQL, [
            $user->id,
            $v['document_type'],
            $v['title'],
            $v['description'] ?? null,
            $path,
            $file->getClientOriginalName(),
            $file->getClientMimeType() ?? 'application/octet-stream',
            $file->getSize(),
            $now,
            $now,
        ]);

        $id = DB::getPdo()->lastInsertId();
        $row = DB::selectOne('SELECT * FROM documents WHERE document_id = ?', [$id]);

        return response()->json(['data' => $row], 201);
    }

    public function destroy(int|string $document): JsonResponse
    {
        $user = auth()->user();
        $docId = (int) $document;
        $row = DB::selectOne('SELECT user_id, file_path FROM documents WHERE document_id = ?', [$docId]);

        if (! $row) {
            return response()->json(['message' => 'Document not found.'], 404);
        }

        if ($user->role?->value !== 'admin' && (int) $row->user_id !== (int) $user->id) {
            return response()->json(['message' => 'Forbidden.'], 403);
        }

        Storage::disk('local')->delete($row->file_path);
        DB::delete('DELETE FROM documents WHERE document_id = ?', [$docId]);

        return response()->json(null, 204);
    }
}
