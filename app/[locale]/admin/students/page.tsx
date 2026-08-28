'use client';

import { useState, useEffect, useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { Plus, Pencil, Trash2, Users, Loader2 } from 'lucide-react';
import Image from 'next/image';
import StudentProfileForm from '@/components/admin/StudentProfileForm';
import { StudentProfileData } from '@/lib/types';

export default function ManageStudentsPage() {
  const t = useTranslations('admin');
  const tCommon = useTranslations('common');
  const [students, setStudents] = useState<StudentProfileData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentProfileData | undefined>();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/students', { cache: 'no-store' });
      if (res.ok) setStudents(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchStudents(); }, [fetchStudents]);

  const handleSuccess = (student: StudentProfileData) => {
    setStudents((prev) => {
      const exists = prev.find((s) => s._id === student._id);
      if (exists) {
        return prev.map((s) => (s._id === student._id ? student : s));
      }
      return [student, ...prev];
    });
    setShowForm(false);
    setEditingStudent(undefined);
  };

  const handleDelete = async (id: string) => {
    if (!confirm(t('confirm_delete'))) return;
    setDeletingId(id);
    try {
      const res = await fetch(`/api/students/${id}`, { method: 'DELETE' });
      if (res.ok) setStudents((prev) => prev.filter((s) => s._id !== id));
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-extrabold text-gray-900">{t('manage_students')}</h1>
          <p className="text-gray-500 text-sm mt-1">{students.length} students registered</p>
        </div>
        <button
          onClick={() => { setEditingStudent(undefined); setShowForm(true); }}
          className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-200 transition-all text-sm"
        >
          <Plus className="w-4 h-4" />
          {t('add_student')}
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
        </div>
      ) : students.length === 0 ? (
        <div className="text-center py-24">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <p className="text-gray-500">No students yet. Add the first one!</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600">Student</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden md:table-cell">Batch</th>
                <th className="text-left px-5 py-3.5 font-semibold text-gray-600 hidden lg:table-cell">Roll</th>
                <th className="text-right px-5 py-3.5 font-semibold text-gray-600">{tCommon('actions')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {students.map((student) => (
                <tr key={student._id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl overflow-hidden bg-gradient-to-br from-indigo-100 to-violet-100 shrink-0">
                        {student.imageUrl ? (
                          <Image
                            src={student.imageUrl}
                            alt={student.nameEn}
                            width={36}
                            height={36}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-indigo-600 font-bold text-sm">
                            {student.nameEn.charAt(0)}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 leading-tight">{student.nameEn}</p>
                        <p className="text-gray-400 text-xs">{student.nameBn}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 hidden md:table-cell">
                    <div>
                      <p className="text-gray-700">{student.batchEn}</p>
                      <p className="text-gray-400 text-xs">{student.batchBn}</p>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-gray-600 hidden lg:table-cell">{student.rollNumber}</td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => { setEditingStudent(student); setShowForm(true); }}
                        className="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        title={tCommon('edit')}
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(student._id)}
                        disabled={deletingId === student._id}
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                        title={tCommon('delete')}
                      >
                        {deletingId === student._id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && (
        <StudentProfileForm
          initial={editingStudent}
          mode={editingStudent ? 'edit' : 'add'}
          onSuccess={handleSuccess}
          onCancel={() => { setShowForm(false); setEditingStudent(undefined); }}
        />
      )}
    </div>
  );
}
