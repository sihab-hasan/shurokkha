<?php

namespace App\Http\Controllers\Api\V1\Auth;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Api\V1\Auth\AssignAdminRoleRequest;
use App\Http\Requests\Api\V1\Auth\StoreAdminUserRequest;
use App\Http\Requests\Api\V1\Auth\UpdateAdminUserRequest;
use App\Http\Resources\AdminUserResource;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

/**
 * Admin CRUD over users.
 *
 *   GET    /v1/admin/users                — list (filter by role/status/q)
 *   GET    /v1/admin/users/{id}           — show
 *   POST   /v1/admin/users                — create
 *   PATCH  /v1/admin/users/{id}           — update
 *   DELETE /v1/admin/users/{id}           — soft-delete (status = 'deleted')
 *   POST   /v1/admin/users/{id}/restore   — undelete (status = 'active')
 *   POST   /v1/admin/users/{id}/assign-role — change role + role_id
 */
class AdminUserController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $role = $request->query('role');
        $status = $request->query('status');
        $q = $request->query('q');

        $sql = 'SELECT id, user_id, name, full_name, email, email_verified_at, phone, phone_verified_at, avatar_path, timezone, status, role, role_id, two_factor_confirmed_at, created_at, updated_at FROM users';
        $bindings = [];
        $where = [];

        if (is_string($role) && $role !== '') {
            $where[] = 'role = ?';
            $bindings[] = $role;
        }
        if (is_string($status) && $status !== '') {
            $where[] = 'status = ?';
            $bindings[] = $status;
        }
        if (is_string($q) && $q !== '') {
            $where[] = '(name LIKE ? OR email LIKE ? OR full_name LIKE ?)';
            $like = '%' . $q . '%';
            $bindings[] = $like;
            $bindings[] = $like;
            $bindings[] = $like;
        }

        if (! empty($where)) {
            $sql .= ' WHERE ' . implode(' AND ', $where);
        }
        $sql .= ' ORDER BY id ASC LIMIT 200';

        $rows = DB::select($sql, $bindings);

        return response()->json([
            'data' => collect($rows)->map(
                fn ($row) => (new AdminUserResource($row))->resolve()
            )->all(),
        ]);
    }

    public function show(int|string $user): JsonResponse
    {
        $row = $this->find($user);

        return response()->json([
            'data' => (new AdminUserResource($row))->resolve(),
        ]);
    }

    public function store(StoreAdminUserRequest $request): JsonResponse
    {
        $v = $request->validated();
        $now = now();
        $role = $v['role'] ?? UserRole::User->value;
        $roleId = $v['role_id'] ?? ($role === UserRole::Admin->value ? 1 : 2);

        $id = DB::table('users')->insertGetId([
            'name' => $v['name'],
            'full_name' => $v['full_name'] ?? $v['name'],
            'email' => $v['email'],
            'phone' => $v['phone'] ?? null,
            'password' => Hash::make($v['password']),
            'role' => $role,
            'role_id' => $roleId,
            'timezone' => 'Asia/Dhaka',
            'status' => 'active',
            'email_verified_at' => $now,
            'created_at' => $now,
            'updated_at' => $now,
        ]);

        // Mirror the id into user_id so the User model's booted hook is consistent.
        DB::table('users')->where('id', $id)->update(['user_id' => $id]);

        $row = $this->find($id);

        return response()->json([
            'data' => (new AdminUserResource($row))->resolve(),
        ], 201);
    }

    public function update(UpdateAdminUserRequest $request, int|string $user): JsonResponse
    {
        $userId = (int) $user;
        $existing = $this->find($userId);
        if (! $existing) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $v = $request->validated();
        $sets = [];
        $params = [];

        $allowed = ['name', 'full_name', 'email', 'phone', 'role', 'role_id', 'status'];
        foreach ($allowed as $field) {
            if (array_key_exists($field, $v)) {
                $sets[] = "{$field} = ?";
                $params[] = $v[$field];
            }
        }
        if (array_key_exists('password', $v) && $v['password']) {
            $sets[] = 'password = ?';
            $params[] = Hash::make($v['password']);
        }

        if (! empty($sets)) {
            $sets[] = 'updated_at = ?';
            $params[] = now();
            $params[] = $userId;
            DB::update('UPDATE users SET ' . implode(', ', $sets) . ' WHERE id = ?', $params);
        }

        $row = $this->find($userId);

        return response()->json([
            'data' => (new AdminUserResource($row))->resolve(),
        ]);
    }

    public function destroy(int|string $user): JsonResponse
    {
        $userId = (int) $user;
        $existing = $this->find($userId);
        if (! $existing) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        DB::update(
            'UPDATE users SET status = ?, updated_at = ? WHERE id = ?',
            ['deleted', now(), $userId]
        );

        return response()->json(null, 204);
    }

    public function restore(int|string $user): JsonResponse
    {
        $userId = (int) $user;
        $existing = $this->find($userId);
        if (! $existing) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        DB::update(
            'UPDATE users SET status = ?, updated_at = ? WHERE id = ?',
            ['active', now(), $userId]
        );

        return $this->show($userId);
    }

    public function assignRole(AssignAdminRoleRequest $request, int|string $user): JsonResponse
    {
        $userId = (int) $user;
        $existing = $this->find($userId);
        if (! $existing) {
            return response()->json(['message' => 'User not found.'], 404);
        }

        $v = $request->validated();
        $roleId = $v['role_id'] ?? ($v['role'] === UserRole::Admin->value ? 1 : 2);

        DB::update(
            'UPDATE users SET role = ?, role_id = ?, updated_at = ? WHERE id = ?',
            [$v['role'], $roleId, now(), $userId]
        );

        return $this->show($userId);
    }

    private function find(int|string $user): ?object
    {
        return DB::selectOne(
            'SELECT id, user_id, name, full_name, email, email_verified_at, phone, phone_verified_at, avatar_path, timezone, status, role, role_id, two_factor_confirmed_at, created_at, updated_at FROM users WHERE id = ?',
            [(int) $user]
        );
    }
}
