import React, {useState} from 'react';
import {
  Text,
  TextInput,
  StyleSheet,
  Alert,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {Dropdown} from 'react-native-element-dropdown';
import {useTheme} from '@react-navigation/native';
import {validateStudentContactForm} from '../../utils/inputValidationUtils';
import axios from 'axios';
import {
  pick,
  types,
  errorCodes,
  isErrorWithCode,
} from '@react-native-documents/picker';

const StudentsForm = () => {
  const {colors} = useTheme();
  const [name, setName] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [pronouns, setPronouns] = useState<string | null>(null);
  const [program, setProgram] = useState<string | null>(null);
  const [otherProgram, setOtherProgram] = useState<string | null>(null);
  const [major, setMajor] = useState<string | null>(null);
  const [minor, setMinor] = useState<string | null>(null);
  const [year, setYear] = useState<string | null>(null);
  const [graduationYear, setGraduationYear] = useState<string | null>(null);
  const [resume, setResume] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<string | null>(null);
  const [interest, setInterest] = useState<string | null>(null);
  const [skills, setSkills] = useState<string | null>(null);
  const [referral, setReferral] = useState<string | null>(null);
  const [accessNeeds, setAccessNeeds] = useState<string | null>(null);
  const [additionalInfo, setAdditionalInfo] = useState<string | null>(null);
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  const yearOptions = [
    {label: 'Undergrad - Freshman', value: 'Freshman'},
    {label: 'Undergrad - Sophomore', value: 'Sophomore'},
    {label: 'Undergrad - Junior', value: 'Junior'},
    {label: 'Undergrad - Senior', value: 'Senior'},
    {label: 'Master', value: 'Master'},
    {label: 'PhD', value: 'PhD'},
    {label: 'Postdoc', value: 'Postdoc'},
  ];

  const programOptions = [
    {
      label: 'Emory College of Arts and Sciences',
      value: 'Emory College of Arts and Sciences',
    },
    {label: 'Laney Graduate School', value: 'Laney Graduate School'},
    {
      label: 'Rollins School of Public Health',
      value: 'Rollins School of Public Health',
    },
    {label: 'Emory School of Medicine', value: 'Emory School of Medicine'},
    {
      label: 'Nell Hodgson Woodruff School of Nursing',
      value: 'Nell Hodgson Woodruff School of Nursing',
    },
    {label: 'Other', value: 'Other'},
  ];

  const skillsOptions = [
    {label: 'Participant recruitment', value: 'Participant recruitment'},
    {
      label: 'Data collection - survey facilitation',
      value: 'Data collection - survey facilitation',
    },
    {
      label: 'Data collection - biological (blood and urine)',
      value: 'Data collection - biological',
    },
    {
      label: 'Data collection - environmental (soil, paint, dust, other)',
      value: 'Data collection - environmental',
    },
    {
      label: 'Analysis - quantitative survey results',
      value: 'Analysis - quantitative',
    },
    {
      label: 'Analysis - qualitative survey results',
      value: 'Analysis - qualitative',
    },
    {
      label: 'Analysis - lab (e.g. soil drying and sieving)',
      value: 'Analysis - lab',
    },
    {label: 'Analysis - XRF', value: 'Analysis - XRF'},
  ];

  const handleSubmit = async () => {
    try {
      const err = validateStudentContactForm(
        name,
        email,
        pronouns,
        program,
        otherProgram,
        major,
        minor,
        year,
        graduationYear,
        resume,
        transcript,
        interest,
        skills,
        referral,
        accessNeeds,
        additionalInfo,
      );

      if (err) {
        Alert.alert('Error', err);
        return;
      }

      const payload = {
        name,
        email,
        pronouns,
        program,
        otherProgram,
        major,
        minor,
        year,
        graduationYear,
        resume,
        transcript,
        interest,
        skills,
        referral,
        accessNeeds,
        additionalInfo,
      };

      const response = await fetch(
        'https://api1-dot-saikawalab-427516.uc.r.appspot.com/api/v1/student-interest',
        {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(payload),
        },
      );

      if (response.ok) {
        Alert.alert('Success', 'Your information has been submitted!');
        setName('');
        setEmail('');
        setPronouns('');
        setProgram('');
        setOtherProgram('');
        setMajor('');
        setMinor('');
        setYear('');
        setGraduationYear('');
        setResume('');
        setTranscript('');
        setInterest('');
        setSkills('');
        setReferral('');
        setAccessNeeds('');
        setAdditionalInfo('');
        setFocusedInput(null);
      } else {
        const errorResponse = await response.json();
        Alert.alert(
          'Error',
          errorResponse.message || 'Incomplete form. Please fill all fields.',
        );
      }
    } catch (error) {
      console.error('Submission error:', error);
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'An unexpected error occurred.');
      }
    }
  };

  const uploadFile = async (
    fileUri: string,
    name: string,
    fileType: string,
  ) => {
    if (!fileUri) {
      Alert.alert('Error', `${fileType} file is missing.`);
      return null;
    }

    const folder = fileType === 'resume' ? 'resumes' : 'transcripts';
    const timestamp = Date.now();
    const fileName = `${folder}/${name.replace(/\s/g, '')}_${timestamp}.pdf`;

    try {
      const presignedUrlResponse = await axios.get(
        'https://api1-dot-saikawalab-427516.uc.r.appspot.com/api/v1/generate-presigned-url',
        {params: {imageKey: fileName, contentType: 'pdf'}},
      );

      const {presignedUrl} = presignedUrlResponse.data;
      const fileResponse = await fetch(fileUri.replace('file://', ''));
      if (!fileResponse.ok)
        throw new Error(`Failed to fetch file: ${fileResponse.statusText}`);
      const fileBlob = await fileResponse.blob();

      const uploadResponse = await fetch(presignedUrl, {
        method: 'PUT',
        body: fileBlob,
        headers: {'Content-Type': 'application/pdf'},
      });

      if (!uploadResponse.ok) {
        throw new Error(`Upload failed: ${uploadResponse.status}`);
      }

      console.log(`${fileType} uploaded successfully: ${fileName}`);
      return fileName;
    } catch (error) {
      console.error(`Error uploading ${fileType}:`, error);
      Alert.alert('Error', `Failed to upload ${fileType}.`);
      return null;
    }
  };

  const handleFilePick = async () => {
    try {
      const result = await pick({
        type: [types.pdf], // Restricting to PDF files
        allowMultiSelection: false, // Only allow one file
        presentationStyle: 'fullScreen',
      });

      console.log('File selected:', result);

      if (result && result.length > 0 && result[0].uri) {
        return result[0].uri; // Returning the selected file URI
      } else {
        Alert.alert('Error', 'No file was selected.');
        return null;
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        if (error.code === errorCodes.OPERATION_CANCELED) {
          console.log('User canceled file picker'); // Log cancellation only
          return null;
        } else {
          console.error('File picker error:', error); // Log other errors
        }

        switch (error.code) {
          case errorCodes.UNABLE_TO_OPEN_FILE_TYPE:
            Alert.alert('Error', 'Cannot open this file type.');
            break;
          case errorCodes.IN_PROGRESS:
            Alert.alert('Error', 'Another operation is already in progress.');
            break;
          default:
            Alert.alert('Error', 'An unexpected error occurred.');
        }
      } else {
        console.error('File picker error:', error); // Log non-code errors
        Alert.alert('Error', 'Failed to select a file.');
      }
      return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Text style={[styles.label, {color: colors.primary}]}>Name*</Text>
        <TextInput
          style={[
            styles.input,
            {borderColor: focusedInput === 'name' ? colors.primary : '#c4bebe'},
          ]}
          placeholder="Full Name..."
          value={name || ''}
          onChangeText={setName}
          onFocus={() => setFocusedInput('name')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.label, {color: colors.primary}]}>Email*</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor:
                focusedInput === 'email' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholder="example@email.com"
          value={email || ''}
          onChangeText={setEmail}
          onFocus={() => setFocusedInput('email')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.label, {color: colors.primary}]}>Pronouns</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor:
                focusedInput === 'pronouns' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholder="e.g. she/her, he/him, they/them"
          value={pronouns || ''}
          onChangeText={setPronouns}
          onFocus={() => setFocusedInput('pronouns')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.label, {color: colors.primary}]}>Program*</Text>
        <Dropdown
          style={[
            styles.dropdown,
            {
              borderColor:
                focusedInput === 'program' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholderStyle={{fontSize: 14, color: '#c4bebe'}}
          selectedTextStyle={{fontSize: 14, color: '#050000'}}
          data={programOptions}
          maxHeight={190} // height of the dropdown box
          labelField="label"
          valueField="value"
          placeholder="Select your program"
          value={program}
          onChange={item => {
            setProgram(item.value);
            setFocusedInput(null);
          }}
          onFocus={() => setFocusedInput('program')}
        />

        <Text style={[styles.response, {color: colors.primary}]}>
          If you chose "other" for the previous question, please list the name
          of your program here:
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor:
                focusedInput === 'otherProgram' ? colors.primary : '#c4bebe',
            },
          ]}
          value={otherProgram || ''}
          onChangeText={setOtherProgram}
          onFocus={() => setFocusedInput('otherProgram')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.label, {color: colors.primary}]}>Major*</Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor:
                focusedInput === 'major' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholder="e.g. Environmental Sciences"
          value={major || ''}
          onChangeText={setMajor}
          onFocus={() => setFocusedInput('major')}
          onBlur={() => setFocusedInput(null)}
        />
        <Text style={[styles.label, {color: colors.primary}]}>
          Minor (if applicable)
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor:
                focusedInput === 'minor' ? colors.primary : '#c4bebe',
            },
          ]}
          value={minor || ''}
          onChangeText={setMinor}
          onFocus={() => setFocusedInput('minor')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.label, {color: colors.primary}]}>Year*</Text>
        <Dropdown
          style={[
            styles.dropdown,
            {borderColor: focusedInput === 'year' ? colors.primary : '#c4bebe'},
          ]}
          placeholderStyle={{fontSize: 14, color: '#c4bebe'}}
          selectedTextStyle={{fontSize: 14, color: '#050000'}}
          data={yearOptions}
          maxHeight={190} // height of the dropdown box
          labelField="label"
          valueField="value"
          placeholder="Select year"
          value={year}
          onChange={item => {
            setYear(item.value);
            setFocusedInput(null);
          }}
          onFocus={() => setFocusedInput('year')}
        />

        <Text style={[styles.label, {color: colors.primary}]}>
          Graduation Year*
        </Text>
        <TextInput
          style={[
            styles.input,
            {
              borderColor:
                focusedInput === 'gradtionYear' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholder="e.g. 2026"
          value={graduationYear || ''}
          onChangeText={setGraduationYear}
          onFocus={() => setFocusedInput('graduationYear')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.label, {color: colors.primary}]}>
          Upload Resume (pdf only)
        </Text>
        <TouchableOpacity
          style={[styles.uploadButton, {backgroundColor: colors.primary}]}
          onPress={async () => {
            const fileUri = await handleFilePick();
            if (fileUri) {
              const uploadedResume = await uploadFile(
                fileUri,
                name || '',
                'resume',
              );
              setResume(uploadedResume);
            } else {
              console.log('No file selected, skipping upload.');
            }
          }}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>
            {resume ? 'Resume Uploaded' : 'Upload Resume'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.label, {color: colors.primary}]}>
          Upload Transcript (pdf only, unofficial is sufficient)
        </Text>
        <TouchableOpacity
          style={[styles.uploadButton, {backgroundColor: colors.primary}]}
          onPress={async () => {
            const fileUri = await handleFilePick();
            if (fileUri) {
              const uploadedTranscript = await uploadFile(
                fileUri,
                name || '',
                'transcript',
              );
              setTranscript(uploadedTranscript);
            }
          }}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>
            {transcript ? 'Transcript Uploaded' : 'Upload Transcript'}
          </Text>
        </TouchableOpacity>

        <Text style={[styles.response, {color: colors.primary}]}>
          Why are you interested in joining the lab? Which project(s) do you
          want to be involved in? (300 word limit)*
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              borderColor:
                focusedInput === 'interest' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholder="Response..."
          value={interest || ''}
          onChangeText={setInterest}
          multiline
          onFocus={() => setFocusedInput('interest')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.response, {color: colors.primary}]}>
          What soft and hard skill sets do you have proficiency in?*
        </Text>
        <Dropdown
          style={[
            styles.dropdown,
            {
              borderColor:
                focusedInput === 'skill' ? colors.primary : '#c4bebe',
            },
          ]}
          placeholderStyle={{fontSize: 14, color: '#c4bebe'}}
          selectedTextStyle={{fontSize: 14, color: '#050000'}}
          data={skillsOptions}
          maxHeight={190} // height of the dropdown box
          labelField="label"
          valueField="value"
          placeholder="Select your skills"
          value={skills}
          onChange={item => {
            setSkills(item.value);
            setFocusedInput(null);
          }}
          onFocus={() => setFocusedInput('skills')}
        />

        <Text style={[styles.response, {color: colors.primary}]}>
          How did you hear about the lab? If you were referred by a current lab
          member, please list their name.*
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              borderColor:
                focusedInput === 'referral' ? colors.primary : '#c4bebe',
            },
          ]}
          value={referral || ''}
          onChangeText={setReferral}
          multiline
          onFocus={() => setFocusedInput('referral')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.response, {color: colors.primary}]}>
          Do you have any specific access needs you'd like us to take into
          consideration?
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              borderColor:
                focusedInput === 'accessNeeds' ? colors.primary : '#c4bebe',
            },
          ]}
          value={accessNeeds || ''}
          onChangeText={setAccessNeeds}
          multiline
          onFocus={() => setFocusedInput('accessNeeds')}
          onBlur={() => setFocusedInput(null)}
        />

        <Text style={[styles.response, {color: colors.primary}]}>
          If there is anything else you'd like us to know, please indicate in
          the space below:
        </Text>
        <TextInput
          style={[
            styles.textArea,
            {
              borderColor:
                focusedInput === 'additionalInfo' ? colors.primary : '#c4bebe',
            },
          ]}
          value={additionalInfo || ''}
          onChangeText={setAdditionalInfo}
          multiline
          onFocus={() => setFocusedInput('additionalInfo')}
          onBlur={() => setFocusedInput(null)}
        />

        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.primary}]}
          onPress={handleSubmit}
          activeOpacity={0.8}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    marginLeft: 15,
    marginTop: 5,
    fontWeight: 'bold',
  },
  response: {
    fontSize: 13,
    marginBottom: 8,
    marginHorizontal: 15,
    fontWeight: 'bold',
  },
  input: {
    padding: 12,
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
  },
  dropdown: {
    backgroundColor: '#fff',
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 15,
    borderRadius: 8,
    marginBottom: 16,
  },
  textArea: {
    flex: 1,
    padding: 12,
    marginHorizontal: 10,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    height: 140,
  },
  placeholderStyle: {
    fontSize: 16,
  },
  selectedTextStyle: {
    fontSize: 16,
  },
  button: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
    width: 250,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  uploadButton: {
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 15,
  },
});

export default StudentsForm;
