/**
 * Subject Grade Mapping Enum
 * Maps report subject IDs to their corresponding grade categories
 */
export const SubjectGradeMapping = {
  // 9th grade and above officers
  NINTH_GRADE_ALL: 1,
  NINTH_GRADE_SINGLE: 2,
  NINTH_GRADE_SUBJECT_BASED: 3,

  // 10th grade officers
  TENTH_GRADE_ALL: 4,
  TENTH_GRADE_SINGLE: 5,
  TENTH_GRADE_SUBJECT_BASED: 6,

  // 11th-18th grade staff
  ELEVENTH_TO_EIGHTEENTH_GRADE_ALL: 7,
  ELEVENTH_TO_EIGHTEENTH_GRADE_SINGLE: 8,
  ELEVENTH_TO_EIGHTEENTH_GRADE_SUBJECT_BASED: 9,

  // 19th-20th grade staff
  NINETEENTH_TO_TWENTIETH_GRADE_ALL: 10,
  NINETEENTH_TO_TWENTIETH_GRADE_SINGLE: 11,
  NINETEENTH_TO_TWENTIETH_GRADE_SUBJECT_BASED: 12,

  // Project based
  PROJECT_BASED: 13
}

/**
 * Grade Category Enum
 * Defines the different grade categories used in the system
 */
export const GradeCategory = {
  GRADE_9: 'grade-9',           // Up to 9th grade
  GRADE_10: 'grade-10',         // 10th grade
  GRADE_11_18: 'grade-11-18',   // 11th to 18th grade
  GRADE_19_20: 'grade-19-20'    // 19th to 20th grade
}

/**
 * Subject to Grade Mapping
 * Maps each subject ID to its corresponding grade category
 */
export const SUBJECT_GRADE_MAP = {
  [SubjectGradeMapping.NINTH_GRADE_ALL]: GradeCategory.GRADE_9,
  [SubjectGradeMapping.NINTH_GRADE_SINGLE]: GradeCategory.GRADE_9,
  [SubjectGradeMapping.NINTH_GRADE_SUBJECT_BASED]: GradeCategory.GRADE_9,

  [SubjectGradeMapping.TENTH_GRADE_ALL]: GradeCategory.GRADE_10,
  [SubjectGradeMapping.TENTH_GRADE_SINGLE]: GradeCategory.GRADE_10,
  [SubjectGradeMapping.TENTH_GRADE_SUBJECT_BASED]: GradeCategory.GRADE_10,

  [SubjectGradeMapping.ELEVENTH_TO_EIGHTEENTH_GRADE_ALL]: GradeCategory.GRADE_11_18,
  [SubjectGradeMapping.ELEVENTH_TO_EIGHTEENTH_GRADE_SINGLE]: GradeCategory.GRADE_11_18,
  [SubjectGradeMapping.ELEVENTH_TO_EIGHTEENTH_GRADE_SUBJECT_BASED]: GradeCategory.GRADE_11_18,

  [SubjectGradeMapping.NINETEENTH_TO_TWENTIETH_GRADE_ALL]: GradeCategory.GRADE_19_20,
  [SubjectGradeMapping.NINETEENTH_TO_TWENTIETH_GRADE_SINGLE]: GradeCategory.GRADE_19_20,
  [SubjectGradeMapping.NINETEENTH_TO_TWENTIETH_GRADE_SUBJECT_BASED]: GradeCategory.GRADE_19_20,

  [SubjectGradeMapping.PROJECT_BASED]: null // No specific grade filter
}

/**
 * Report Type Categories
 * Defines which subjects require employee selection vs training selection
 */
export const ReportTypeCategory = {
  EMPLOYEE_REQUIRED: [
    SubjectGradeMapping.NINTH_GRADE_SINGLE,
    SubjectGradeMapping.TENTH_GRADE_SINGLE,
    SubjectGradeMapping.ELEVENTH_TO_EIGHTEENTH_GRADE_SINGLE,
    SubjectGradeMapping.NINETEENTH_TO_TWENTIETH_GRADE_SINGLE
  ],

  TRAINING_REQUIRED: [
    SubjectGradeMapping.NINTH_GRADE_SUBJECT_BASED,
    SubjectGradeMapping.TENTH_GRADE_SUBJECT_BASED,
    SubjectGradeMapping.ELEVENTH_TO_EIGHTEENTH_GRADE_SUBJECT_BASED,
    SubjectGradeMapping.NINETEENTH_TO_TWENTIETH_GRADE_SUBJECT_BASED
  ],

  GRADE_WISE_ALL: [
    SubjectGradeMapping.NINTH_GRADE_ALL,
    SubjectGradeMapping.NINTH_GRADE_SUBJECT_BASED,
    SubjectGradeMapping.TENTH_GRADE_ALL,
    SubjectGradeMapping.TENTH_GRADE_SUBJECT_BASED,
    SubjectGradeMapping.ELEVENTH_TO_EIGHTEENTH_GRADE_ALL,
    SubjectGradeMapping.ELEVENTH_TO_EIGHTEENTH_GRADE_SUBJECT_BASED,
    SubjectGradeMapping.NINETEENTH_TO_TWENTIETH_GRADE_ALL,
    SubjectGradeMapping.NINETEENTH_TO_TWENTIETH_GRADE_SUBJECT_BASED
  ],

  SINGLE_EMPLOYEE: [
    SubjectGradeMapping.NINTH_GRADE_SINGLE,
    SubjectGradeMapping.TENTH_GRADE_SINGLE,
    SubjectGradeMapping.ELEVENTH_TO_EIGHTEENTH_GRADE_SINGLE,
    SubjectGradeMapping.NINETEENTH_TO_TWENTIETH_GRADE_SINGLE
  ]
}

/**
 * Helper Functions
 */
export const SubjectGradeHelper = {
  /**
   * Get grade category for a subject ID
   * @param {number} subjectId
   * @returns {string|null}
   */
  getGradeCategory: (subjectId) => {
    return SUBJECT_GRADE_MAP[subjectId] || null
  },

  /**
   * Check if subject requires employee selection
   * @param {number} subjectId
   * @returns {boolean}
   */
  requiresEmployee: (subjectId) => {
    return ReportTypeCategory.EMPLOYEE_REQUIRED.includes(subjectId)
  },

  /**
   * Check if subject requires training selection
   * @param {number} subjectId
   * @returns {boolean}
   */
  requiresTraining: (subjectId) => {
    return ReportTypeCategory.TRAINING_REQUIRED.includes(subjectId)
  },

  /**
   * Check if subject is grade-wise all employee report
   * @param {number} subjectId
   * @returns {boolean}
   */
  isGradeWiseAllReport: (subjectId) => {
    return ReportTypeCategory.GRADE_WISE_ALL.includes(subjectId)
  },

  /**
   * Check if subject is single employee report
   * @param {number} subjectId
   * @returns {boolean}
   */
  isSingleEmployeeReport: (subjectId) => {
    return ReportTypeCategory.SINGLE_EMPLOYEE.includes(subjectId)
  }
}
