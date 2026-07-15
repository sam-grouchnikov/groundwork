import { useEffect, useRef } from 'react';
import {
  CalendarDays,
  Check,
  ClipboardList,
  FileText,
  GraduationCap,
  Mail,
  Pencil,
  Sparkles,
  Trash2,
  Wand2,
  X,
} from 'lucide-react';
import {
  CLASS_SETUP_SECTION_DEFINITIONS,
  useClassEditorViewModel,
} from '../viewmodel/classEditorViewModel.js';
import TopRow from './home/TopRow/TopRow.jsx';
import './ClassEditor.css';

const SETUP_SECTION_ICONS = {
  general: GraduationCap,
  documents: ClipboardList,
  guidelines: Wand2,
};

function getMasteryIcon(masteryTone) {
  if (masteryTone === 'strong') {
    return Check;
  }

  if (masteryTone === 'good') {
    return Sparkles;
  }

  if (masteryTone === 'watch') {
    return Wand2;
  }

  return X;
}

function EditorField({ field, value, onChange }) {
  const fieldId = `class-editor-${field.id}`;

  if (field.type === 'textarea') {
    return (
      <label className="class-modal-field" htmlFor={fieldId}>
        <span>{field.label}</span>
        <textarea
          id={fieldId}
          onChange={(event) => onChange(field.id, event.target.value)}
          value={value}
        />
      </label>
    );
  }

  return (
    <label className="class-modal-field" htmlFor={fieldId}>
      <span>{field.label}</span>
      <input
        id={fieldId}
        onChange={(event) => onChange(field.id, event.target.value)}
        type="text"
        value={value}
      />
    </label>
  );
}

export default function ClassEditorPage({ students = [], onDeleteStudent }) {
  const selectAllRef = useRef(null);
  const {
    activeSection,
    activeSectionId,
    classDetails,
    isAllSelected,
    isPartiallySelected,
    rosterStudents,
    selectedStudentIds,
    closeSection,
    openSection,
    toggleAllStudents,
    toggleStudent,
    updateActiveField,
  } = useClassEditorViewModel(students);

  useEffect(() => {
    if (selectAllRef.current) {
      selectAllRef.current.indeterminate = isPartiallySelected;
    }
  }, [isPartiallySelected]);

  return (
    <section className="class-editor-page">
      <TopRow />

      <div className="class-editor-content">
        <section className="class-setup-section" aria-labelledby="class-setup-title">
          <h1 id="class-setup-title">Class Setup</h1>
          <div className="class-setup-grid">
            {Object.entries(CLASS_SETUP_SECTION_DEFINITIONS).map(([sectionId, section]) => {
              const Icon = SETUP_SECTION_ICONS[sectionId];

              return (
                <button
                  className="class-setup-card"
                  key={sectionId}
                  onClick={() => openSection(sectionId)}
                  type="button"
                >
                  <Icon className="class-setup-card-icon" size={36} />
                  <span className="class-setup-card-copy">
                    <span>{section.title}</span>
                    <small>{section.subtitle}</small>
                  </span>
                  <Pencil className="class-setup-edit-icon" size={22} />
                </button>
              );
            })}
          </div>
        </section>

        <section className="student-roster-section" aria-labelledby="student-roster-title">
          <h2 id="student-roster-title">Student Roster</h2>
          <div className="student-roster-table-wrap">
            <table className="student-roster-table">
              <thead>
                <tr>
                  <th>
                    <input
                      ref={selectAllRef}
                      type="checkbox"
                      aria-label="Select all students"
                      checked={isAllSelected}
                      onChange={toggleAllStudents}
                    />
                    <span>Students</span>
                  </th>
                  <th>
                    <Mail size={16} />
                    <span>Email</span>
                  </th>
                  <th>
                    <FileText size={16} />
                    <span>Mastery</span>
                  </th>
                  <th>
                    <CalendarDays size={16} />
                    <span>Last Active</span>
                  </th>
                  <th aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {rosterStudents.map((student) => {
                  const MasteryIcon = getMasteryIcon(student.masteryTone);

                  return (
                    <tr key={student.id}>
                      <td>
                        <input
                          type="checkbox"
                          aria-label={`Select ${student.name}`}
                          checked={selectedStudentIds.includes(student.id)}
                          onChange={() => toggleStudent(student.id)}
                        />
                        <span>{student.displayName}</span>
                      </td>
                      <td>{student.email}</td>
                      <td>
                        <span className={`mastery-pill mastery-pill-${student.masteryTone}`}>
                          <MasteryIcon size={13} />
                          {student.mastery}%
                        </span>
                      </td>
                      <td>{student.lastActive}</td>
                      <td>
                        <button
                          className="student-delete-button"
                          onClick={() => onDeleteStudent?.(student.id)}
                          type="button"
                          aria-label={`Remove ${student.name}`}
                          title="Remove student"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      {activeSection && (
        <div
          className="class-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeSection();
            }
          }}
        >
          <section
            className="class-modal"
            aria-labelledby="class-modal-title"
            role="dialog"
            aria-modal="true"
          >
            <div className="class-modal-header">
              <div>
                <p>Edit Class Setup</p>
                <h2 id="class-modal-title">{activeSection.title}</h2>
              </div>
              <button
                className="class-modal-icon-button"
                onClick={closeSection}
                type="button"
                aria-label="Close editor"
              >
                <X size={22} />
              </button>
            </div>

            <div className="class-modal-fields">
              {activeSection.fields.map((field) => (
                <EditorField
                  field={field}
                  key={field.id}
                  onChange={updateActiveField}
                  value={classDetails[activeSectionId][field.id]}
                />
              ))}
            </div>

            <div className="class-modal-actions">
              <button
                className="class-modal-secondary"
                onClick={closeSection}
                type="button"
              >
                Cancel
              </button>
              <button
                className="class-modal-primary"
                onClick={closeSection}
                type="button"
              >
                Save Changes
              </button>
            </div>
          </section>
        </div>
      )}
    </section>
  );
}
