import React, { useState } from 'react';
import './ClassManagement.css';

const ClassManagement = () => {
    // Demo data - in a real app this would come from a database
    const [students, setStudents] = useState([
        { id: 1, name: 'Ali', surname: 'Yılmaz', username: 'ali.yilmaz', password: '123' },
        { id: 2, name: 'Ayşe', surname: 'Demir', username: 'ayse.demir', password: '456' },
    ]);

    const [newStudent, setNewStudent] = useState({
        name: '',
        surname: '',
        username: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewStudent(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddStudent = (e) => {
        e.preventDefault();
        if (!newStudent.name || !newStudent.surname || !newStudent.username || !newStudent.password) {
            alert('Lütfen tüm alanları doldurun!');
            return;
        }

        const studentToAdd = {
            id: Date.now(), // simple unique id
            ...newStudent
        };

        setStudents([...students, studentToAdd]);
        setNewStudent({ name: '', surname: '', username: '', password: '' });
    };

    const handleDeleteStudent = (id) => {
        if (window.confirm('Bu öğrenciyi silmek istediğinize emin misiniz?')) {
            setStudents(students.filter(student => student.id !== id));
        }
    };

    return (
        <div className="class-management-container fade-in">
            <div className="section-header">
                <h2>Sınıf Yönetimi</h2>
                <p>Yeni öğrenci ekleyin ve sınıf listenizi yönetin.</p>
            </div>

            <div className="management-grid">
                {/* ADD STUDENT FORM */}
                <div className="add-student-card">
                    <h3>➕ Yeni Öğrenci Ekle</h3>
                    <form onSubmit={handleAddStudent}>
                        <div className="form-group">
                            <label>Ad</label>
                            <input
                                type="text"
                                name="name"
                                value={newStudent.name}
                                onChange={handleInputChange}
                                placeholder="Örn: Mehmet"
                            />
                        </div>
                        <div className="form-group">
                            <label>Soyad</label>
                            <input
                                type="text"
                                name="surname"
                                value={newStudent.surname}
                                onChange={handleInputChange}
                                placeholder="Örn: Kaya"
                            />
                        </div>
                        <div className="form-group">
                            <label>Kullanıcı Adı</label>
                            <input
                                type="text"
                                name="username"
                                value={newStudent.username}
                                onChange={handleInputChange}
                                placeholder="Örn: mehmet.kaya"
                            />
                        </div>
                        <div className="form-group">
                            <label>Şifre</label>
                            <input
                                type="text" // Text type to see password while creating
                                name="password"
                                value={newStudent.password}
                                onChange={handleInputChange}
                                placeholder="Şifre belirleyin"
                            />
                        </div>
                        <button type="submit" className="add-btn">Öğrenci Ekle</button>
                    </form>
                </div>

                {/* STUDENT LIST */}
                <div className="student-list-card">
                    <h3>📋 Sınıf Listesi ({students.length} Öğrenci)</h3>

                    {students.length === 0 ? (
                        <div className="empty-state">Henüz öğrenci eklenmemiş.</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="student-table">
                                <thead>
                                    <tr>
                                        <th>Ad Soyad</th>
                                        <th>Kullanıcı Adı</th>
                                        <th>Şifre</th>
                                        <th>İşlem</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map(student => (
                                        <tr key={student.id}>
                                            <td>{student.name} {student.surname}</td>
                                            <td><span className="badge-user">{student.username}</span></td>
                                            <td><span className="badge-pass">{student.password}</span></td>
                                            <td>
                                                <button
                                                    className="delete-btn"
                                                    onClick={() => handleDeleteStudent(student.id)}
                                                >
                                                    Sil
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ClassManagement;
