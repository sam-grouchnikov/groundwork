import { useCallback, useEffect, useMemo, useState } from 'react';

export const CLASS_SETUP_SECTION_DEFINITIONS = {
  general: {
    title: 'General',
    subtitle: 'Name, Description, CRN',
    fields: [
      { id: 'name', label: 'Class Name', type: 'text' },
      { id: 'description', label: 'Description', type: 'textarea' },
      { id: 'crn', label: 'CRN', type: 'text' },
    ],
  },
  documents: {
    title: 'Documents',
    subtitle: 'Syllabus, Standards',
    fields: [
      { id: 'syllabus', label: 'Syllabus Link', type: 'text' },
      { id: 'standards', label: 'Standards', type: 'textarea' },
    ],
  },
  guidelines: {
    title: 'Guidelines',
    subtitle: 'Custom Instructions',
    fields: [
      { id: 'tone', label: 'Teaching Tone', type: 'text' },
      { id: 'instructions', label: 'Custom Instructions', type: 'textarea' },
    ],
  },
};

const DEFAULT_CLASS_DETAILS = {
  general: {
    name: "Dr. Sean's AP Calculus BC Class",
    description: 'Fall 2026 advanced placement calculus with weekly practice and mastery checks.',
    crn: 'QR4SF5',
  },
  documents: {
    syllabus: 'AP-Calculus-BC-Syllabus.pdf',
    standards: 'Limits, derivatives, integrals, series, and AP exam practice standards.',
  },
  guidelines: {
    tone: 'Encouraging, concise, and step-by-step',
    instructions: 'Prefer worked examples, scaffolded hints, and mastery-focused feedback.',
  },
};

function fetchClassDetails() {
  return DEFAULT_CLASS_DETAILS;
}

function getMasteryTone(mastery = 0) {
  if (mastery >= 90) {
    return 'strong';
  }

  if (mastery >= 80) {
    return 'good';
  }

  if (mastery >= 70) {
    return 'watch';
  }

  return 'needs-support';
}

function getShortName(name = '') {
  const [firstName = '', lastName = ''] = name.split(' ');
  return `${firstName.charAt(0)}. ${lastName}`.trim();
}

function buildRosterStudent(student, index) {
  return {
    email: `student${index + 1}@dbu.edu`,
    mastery: 0,
    lastActive: 'Not Started',
    ...student,
    displayName: getShortName(student.name),
    masteryTone: getMasteryTone(student.mastery),
  };
}

export function useClassEditorViewModel(students = []) {
  const [classDetails, setClassDetails] = useState(fetchClassDetails);
  const [activeSectionId, setActiveSectionId] = useState('');
  const [selectedStudentIds, setSelectedStudentIds] = useState([]);
  const activeSection = activeSectionId
    ? CLASS_SETUP_SECTION_DEFINITIONS[activeSectionId]
    : null;
  const rosterStudents = useMemo(
    () => students.map(buildRosterStudent),
    [students],
  );
  const rosterStudentIds = useMemo(
    () => rosterStudents.map((student) => student.id),
    [rosterStudents],
  );
  const selectedRosterCount = rosterStudentIds.filter((studentId) =>
    selectedStudentIds.includes(studentId),
  ).length;
  const isAllSelected =
    rosterStudentIds.length > 0 && selectedRosterCount === rosterStudentIds.length;
  const isPartiallySelected =
    selectedRosterCount > 0 && selectedRosterCount < rosterStudentIds.length;

  useEffect(() => {
    setSelectedStudentIds((currentSelectedIds) =>
      currentSelectedIds.filter((studentId) => rosterStudentIds.includes(studentId)),
    );
  }, [rosterStudentIds]);

  const openSection = useCallback((sectionId) => {
    setActiveSectionId(sectionId);
  }, []);

  const closeSection = useCallback(() => {
    setActiveSectionId('');
  }, []);

  const updateActiveField = useCallback((fieldId, value) => {
    setClassDetails((currentDetails) => ({
      ...currentDetails,
      [activeSectionId]: {
        ...currentDetails[activeSectionId],
        [fieldId]: value,
      },
    }));
  }, [activeSectionId]);

  const toggleAllStudents = useCallback(() => {
    setSelectedStudentIds(isAllSelected ? [] : rosterStudentIds);
  }, [isAllSelected, rosterStudentIds]);

  const toggleStudent = useCallback((studentId) => {
    setSelectedStudentIds((currentSelectedIds) =>
      currentSelectedIds.includes(studentId)
        ? currentSelectedIds.filter((selectedId) => selectedId !== studentId)
        : [...currentSelectedIds, studentId],
    );
  }, []);

  return {
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
  };
}
