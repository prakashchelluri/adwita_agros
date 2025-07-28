'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { User } from '@/lib/types';
import { useAuth } from '@/hooks/useAuth';

export default function AdminUsersPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/users', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUsers(response.data);
      } catch (err) {
        setError('Failed to load users');
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchUsers();
    }
  }, [token]);

  const [newUser, setNewUser] = useState({
    username: '',
    fullName: '',
    email: '',
    role: '',
    password: '',
  });

  if (loading) return <div>Loading users...</div>;
  if (error) return <div>{error}</div>;

  const handleNewUserChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setNewUser({ ...newUser, [e.target.name]: e.target.value });
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('/users', newUser, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewUser({ username: '', fullName: '', email: '', role: '', password: '' });
      // Refresh user list
      const response = await axios.get('/users', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data);
    } catch (err) {
      alert('Failed to create user');
    }
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50">
      <h1 className="text-2xl font-bold mb-4">Manage Users</h1>

      <form onSubmit={handleCreateUser} className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Create New User</h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={newUser.username}
            onChange={handleNewUserChange}
            required
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={newUser.fullName}
            onChange={handleNewUserChange}
            className="p-2 border border-gray-300 rounded"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={newUser.email}
            onChange={handleNewUserChange}
            required
            className="p-2 border border-gray-300 rounded"
          />
          <select
            name="role"
            value={newUser.role}
            onChange={handleNewUserChange}
            required
            className="p-2 border border-gray-300 rounded"
          >
            <option value="">Select Role</option>
            <option value="ADMIN">Admin</option>
            <option value="OPERATOR">Operator</option>
            <option value="SUPERVISOR">Supervisor</option>
            <option value="TECHNICIAN">Technician</option>
            <option value="MANUFACTURER">Manufacturer</option>
          </select>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={newUser.password}
            onChange={handleNewUserChange}
            required
            className="p-2 border border-gray-300 rounded"
          />
        </div>
        <button
          type="submit"
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Create User
        </button>
      </form>

      <table className="min-w-full bg-white border border-gray-300">
        <thead>
          <tr>
            <th className="py-2 px-4 border-b">Username</th>
            <th className="py-2 px-4 border-b">Full Name</th>
            <th className="py-2 px-4 border-b">Email</th>
            <th className="py-2 px-4 border-b">Role</th>
            <th className="py-2 px-4 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id} className="text-center">
              <td className="py-2 px-4 border-b">{user.username}</td>
              <td className="py-2 px-4 border-b">{user.fullName}</td>
              <td className="py-2 px-4 border-b">{user.email}</td>
              <td className="py-2 px-4 border-b">{user.role}</td>
              <td className="py-2 px-4 border-b">
                <Link href={`/admin/users/${user.id}/edit`} className="text-blue-600 hover:underline">Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
