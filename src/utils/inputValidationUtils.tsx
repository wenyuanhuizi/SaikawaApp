export const validateStudentContactForm = (
  name: string | null,
  email: string | null,
  pronouns: string | null,
  program: string | null,
  otherProgram: string | null,
  major: string | null,
  minor: string | null,
  year: string | null,
  graduationYear: string | null,
  resume: string | null,
  transcript: string | null,
  interest: string | null,
  skills: string | null,
  referral: string | null,
  accessNeeds: string | null,
  additionalInfo: string | null,
) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Valid email format
  const nameRegex = /^[a-zA-Z\s.'-]{2,50}$/; // Restricts invalid characters for name
  const grad_yearRegex = /^20(2[4-9]|[3-9]\d)$/; // Graduation year between 2024-2099
  const wordLimit = 300;

  const wordCount = (text: string) => text.trim().split(/\s+/).length;

  // Required Fields
  if (!name || name.trim() === '') {
    return 'Name is required.';
  } else if (!nameRegex.test(name.trim())) {
    return 'Please enter a valid name without special characters.';
  }

  if (!email || email.trim() === '') {
    return 'Email is required.';
  } else if (!emailRegex.test(email.trim())) {
    return 'Invalid email format. Please enter a valid email.';
  }

  if (!program || program.trim() === '') {
    return 'Program is required.';
  }

  if (program === 'Other' && (!otherProgram || otherProgram.trim() === '')) {
    return 'Please specify the other program.';
  }

  if (!major || major.trim() === '') {
    return 'Major is required.';
  }

  if (!year || year.trim() === '') {
    return 'Year Selection is required.';
  }

  if (!graduationYear || graduationYear.trim() === '') {
    return 'Graduation year is required.';
  } else if (!grad_yearRegex.test(graduationYear.trim())) {
    return 'Invalid graduation year. Please enter a valid year like 2025.';
  }

  if (!interest || interest.trim() === '') {
    return 'Interest description is required.';
  } else if (interest.trim().length < 10) {
    return 'Interest description is too short. Please provide more details.';
  } else if (wordCount(interest) > wordLimit) {
    return 'Interest description exceeds the 300-word limit.';
  }

  if (!skills || skills.trim() === '') {
    return 'Skills Selection is required.';
  }

  if (!referral || referral.trim() === '') {
    return 'Referral information is required.';
  } else if (wordCount(referral) > wordLimit) {
    return 'Referral description exceeds the 300-word limit.';
  }

  // Optional Fields Validation
  const optionalFields = {
    pronouns,
    minor,
    resume,
    transcript,
    accessNeeds,
    additionalInfo,
  };

  for (const [key, value] of Object.entries(optionalFields)) {
    if (value) {
      if (wordCount(value) > wordLimit) {
        return `${key.charAt(0).toUpperCase() + key.slice(1)} exceeds the 300-word limit.`;
      }
    }
  }

  return null;
};
