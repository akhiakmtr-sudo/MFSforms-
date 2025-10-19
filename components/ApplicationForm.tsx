import React, { useState, useEffect, useCallback } from 'react';
import type { FormData, FormFiles, FormErrors } from '../types';
import ProgressBar from './ProgressBar';
// NOTE: The S3 client and direct upload functionality have been removed.
// Storing credentials and managing uploads directly from the client-side is insecure.
// This has been replaced with a mock function to simulate the upload process.
// For a production application, use a backend service to generate pre-signed URLs for secure uploads.

/**
 * Simulates uploading a file to a cloud storage service.
 * In a real application, this would be replaced by a secure upload mechanism.
 * @param file The file to "upload".
 * @returns A promise that resolves with a mock file key.
 */
const mockUploadFile = async (file: File): Promise<string> => {
    // Simulate a network delay to mimic a real upload.
    await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1000));
    
    const key = `mock-uploads/${Date.now()}-${file.name.replace(/\s/g, '_')}`;
    console.log(`Mock upload successful for ${file.name}. Key: ${key}`);
    return key;
};


const ApplicationForm: React.FC = () => {
    const [formData, setFormData] = useState<FormData>({
        name: '',
        dob: '',
        mobile: '',
        email: '',
        expectedSalary: '',
        bio: '',
        comfortableTraveling: '',
        hasRestrictions: '',
        restrictionsReason: '',
        agreement: false,
    });

    const [files, setFiles] = useState<FormFiles>({
        cv: null,
        passportPhoto: null,
        additionalPhotos: [],
        workplacePhoto: null,
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [progress, setProgress] = useState(0);
    const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');

    const calculateProgress = useCallback(() => {
        let completedFields = 0;
        
        const isCompleted = (value: any) => {
            if (typeof value === 'string') return value.trim() !== '';
            if (typeof value === 'boolean') return value === true;
            if (Array.isArray(value)) return value.length > 0;
            return value !== null && value !== '';
        };

        let totalFields = 9; // Initial non-file fields
        if (isCompleted(formData.name)) completedFields++;
        if (isCompleted(formData.dob)) completedFields++;
        if (isCompleted(formData.mobile)) completedFields++;
        if (isCompleted(formData.email)) completedFields++;
        if (isCompleted(formData.expectedSalary)) completedFields++;
        if (isCompleted(formData.bio)) completedFields++;
        if (isCompleted(formData.comfortableTraveling)) completedFields++;
        if (isCompleted(formData.hasRestrictions)) completedFields++;
        if (formData.hasRestrictions === 'Yes') {
            totalFields++;
            if(isCompleted(formData.restrictionsReason)) completedFields++;
        }
        if (isCompleted(formData.agreement)) completedFields++;

        totalFields += 4; // File fields
        if (files.cv) completedFields++;
        if (files.passportPhoto) completedFields++;
        if (files.additionalPhotos.length > 0) completedFields++;
        if (files.workplacePhoto) completedFields++;

        setProgress((completedFields / totalFields) * 100);
    }, [formData, files]);


    useEffect(() => {
        calculateProgress();
    }, [calculateProgress]);
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        
        if (type === 'checkbox') {
            const isChecked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: isChecked }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };
    
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files: inputFiles } = e.target;
        if (inputFiles && inputFiles.length > 0) {
            if (name === 'additionalPhotos') {
                setFiles(prev => ({ ...prev, [name]: Array.from(inputFiles) }));
            } else {
                setFiles(prev => ({ ...prev, [name]: inputFiles[0] }));
            }
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        if (!formData.name.trim()) newErrors.name = "Name is required";
        if (!formData.dob) newErrors.dob = "Date of birth is required";
        if (!formData.mobile.match(/^[0-9]{10}$/)) newErrors.mobile = "Enter a valid 10-digit mobile number";
        if (!formData.email.match(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/)) newErrors.email = "Enter a valid email address";
        if (!formData.expectedSalary) newErrors.expectedSalary = "Expected salary is required";
        if (!formData.bio.trim() || formData.bio.length < 50) newErrors.bio = "Bio must be at least 50 characters";
        if (!formData.comfortableTraveling) newErrors.comfortableTraveling = "This field is required";
        if (!formData.hasRestrictions) newErrors.hasRestrictions = "This field is required";
        if (formData.hasRestrictions === 'Yes' && !formData.restrictionsReason.trim()) newErrors.restrictionsReason = "Please provide an explanation";
        if (!files.cv) newErrors.cv = "CV is required";
        if (!files.passportPhoto) newErrors.passportPhoto = "Passport photo is required";
        if (files.additionalPhotos.length < 2) newErrors.additionalPhotos = "At least two additional photos are required";
        if (!files.workplacePhoto) newErrors.workplacePhoto = "Workplace photo is required";
        if (!formData.agreement) newErrors.agreement = "You must agree to the terms";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submissionStatus === 'uploading' || submissionStatus === 'success') {
            return;
        }

        if (!validateForm()) {
            console.log("Form validation failed", errors);
            alert('Please fill out all required fields correctly.');
            return;
        }

        setSubmissionStatus('uploading');

        try {
            const [cvKey, passportPhotoKey, workplacePhotoKey, additionalPhotosKeys] = await Promise.all([
                files.cv ? mockUploadFile(files.cv) : Promise.resolve(null),
                files.passportPhoto ? mockUploadFile(files.passportPhoto) : Promise.resolve(null),
                files.workplacePhoto ? mockUploadFile(files.workplacePhoto) : Promise.resolve(null),
                Promise.all(files.additionalPhotos.map(file => mockUploadFile(file))),
            ]);

            const submissionData = {
                ...formData,
                files: {
                    cv: cvKey,
                    passportPhoto: passportPhotoKey,
                    workplacePhoto: workplacePhotoKey,
                    additionalPhotos: additionalPhotosKeys,
                }
            };
            
            console.log("Form Submitted Successfully!");
            console.log("This data (with mock file keys) would now be sent to your backend:", submissionData);

            setSubmissionStatus('success');
            alert('Application submitted successfully!');

        } catch (error) {
            console.error("Submission failed due to mock upload error", error);
            setSubmissionStatus('error');
            alert('There was an error uploading your files. Please try again.');
        }
    };

    const isSubmittable =
        !!formData.name.trim() &&
        !!formData.dob &&
        !!formData.mobile.trim() &&
        !!formData.email.trim() &&
        !!formData.expectedSalary &&
        formData.bio.trim().length >= 50 &&
        !!formData.comfortableTraveling &&
        !!formData.hasRestrictions &&
        (formData.hasRestrictions === 'No' || (formData.hasRestrictions === 'Yes' && !!formData.restrictionsReason.trim())) &&
        !!files.cv &&
        !!files.passportPhoto &&
        files.additionalPhotos.length >= 2 &&
        !!files.workplacePhoto &&
        formData.agreement;

    const FileInput = ({ name, label, multiple = false, error }: { name: keyof FormFiles, label: string, multiple?: boolean, error?: string }) => (
        <div className="flex flex-col">
            <label htmlFor={name} className="mb-1 font-medium text-slate-700">{label}<span className="text-red-500 ml-1">*</span></label>
            <input
                id={name}
                name={name}
                type="file"
                multiple={multiple}
                onChange={handleFileChange}
                disabled={submissionStatus === 'uploading' || submissionStatus === 'success'}
                className={`file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 text-slate-500 text-sm disabled:opacity-50 ${error ? 'border-red-500' : 'border-slate-300'}`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
    
    return (
        <section>
             <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">Application Form</h2>
             <p className="text-sm text-slate-500 mb-2">Completion Progress</p>
             <ProgressBar progress={progress} />
             <form onSubmit={handleSubmit} className="space-y-6 mt-6" noValidate>
                <fieldset disabled={submissionStatus === 'uploading' || submissionStatus === 'success'} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-slate-700">Name<span className="text-red-500 ml-1">*</span></label>
                            <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} required className={`mt-1 block w-full rounded-md border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-black ${errors.name ? 'border-red-500' : 'border-slate-300'}`} />
                            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                        </div>
                         <div>
                            <label htmlFor="dob" className="block text-sm font-medium text-slate-700">Date of birth<span className="text-red-500 ml-1">*</span></label>
                            <input type="date" name="dob" id="dob" value={formData.dob} onChange={handleChange} required className={`mt-1 block w-full rounded-md border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-black ${errors.dob ? 'border-red-500' : 'border-slate-300'}`} />
                            {errors.dob && <p className="text-red-500 text-sm mt-1">{errors.dob}</p>}
                        </div>
                         <div>
                            <label htmlFor="mobile" className="block text-sm font-medium text-slate-700">Mobile Number<span className="text-red-500 ml-1">*</span></label>
                            <input type="tel" name="mobile" id="mobile" value={formData.mobile} onChange={handleChange} required className={`mt-1 block w-full rounded-md border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-black ${errors.mobile ? 'border-red-500' : 'border-slate-300'}`} />
                             {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
                        </div>
                         <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700">Email Id<span className="text-red-500 ml-1">*</span></label>
                            <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} required className={`mt-1 block w-full rounded-md border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-black ${errors.email ? 'border-red-500' : 'border-slate-300'}`} />
                            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                        </div>
                         <div>
                            <label htmlFor="expectedSalary" className="block text-sm font-medium text-slate-700">Expected Salary (Monthly)<span className="text-red-500 ml-1">*</span></label>
                            <input type="number" name="expectedSalary" id="expectedSalary" value={formData.expectedSalary} onChange={handleChange} required className={`mt-1 block w-full rounded-md border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-black ${errors.expectedSalary ? 'border-red-500' : 'border-slate-300'}`} />
                            {errors.expectedSalary && <p className="text-red-500 text-sm mt-1">{errors.expectedSalary}</p>}
                        </div>
                    </div>
                     <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-slate-700">A bio About You (min. 50 characters)<span className="text-red-500 ml-1">*</span></label>
                        <textarea name="bio" id="bio" rows={4} value={formData.bio} onChange={handleChange} required className={`mt-1 block w-full rounded-md border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-black ${errors.bio ? 'border-red-500' : 'border-slate-300'}`}></textarea>
                        {errors.bio && <p className="text-red-500 text-sm mt-1">{errors.bio}</p>}
                    </div>
                    
                     <div>
                        <p className="text-sm font-medium text-slate-700">Are you comfortable traveling with Managing Director once or twice a month if needed?<span className="text-red-500 ml-1">*</span></p>
                        <div className="mt-2 space-x-4">
                            <label className="inline-flex items-center"><input type="radio" name="comfortableTraveling" value="Yes" checked={formData.comfortableTraveling === 'Yes'} onChange={handleChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300" /> <span className="ml-2">Yes</span></label>
                            <label className="inline-flex items-center"><input type="radio" name="comfortableTraveling" value="No" checked={formData.comfortableTraveling === 'No'} onChange={handleChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300" /> <span className="ml-2">No</span></label>
                        </div>
                         {errors.comfortableTraveling && <p className="text-red-500 text-sm mt-1">{errors.comfortableTraveling}</p>}
                    </div>
                    
                    <div>
                         <label htmlFor="hasRestrictions" className="block text-sm font-medium text-slate-700">Do you have any family or personal restrictions that may limit occasional travel?<span className="text-red-500 ml-1">*</span></label>
                         <select name="hasRestrictions" id="hasRestrictions" value={formData.hasRestrictions} onChange={handleChange} className={`mt-1 block w-full rounded-md border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-black ${errors.hasRestrictions ? 'border-red-500' : 'border-slate-300'}`}>
                            <option value="">Select an option</option>
                            <option value="Yes">Yes</option>
                            <option value="No">No</option>
                        </select>
                        {errors.hasRestrictions && <p className="text-red-500 text-sm mt-1">{errors.hasRestrictions}</p>}
                    </div>
                    
                    {formData.hasRestrictions === 'Yes' && (
                        <div>
                            <label htmlFor="restrictionsReason" className="block text-sm font-medium text-slate-700">Please explain<span className="text-red-500 ml-1">*</span></label>
                            <textarea name="restrictionsReason" id="restrictionsReason" rows={3} value={formData.restrictionsReason} onChange={handleChange} className={`mt-1 block w-full rounded-md border-2 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm bg-white text-black ${errors.restrictionsReason ? 'border-red-500' : 'border-slate-300'}`}></textarea>
                            {errors.restrictionsReason && <p className="text-red-500 text-sm mt-1">{errors.restrictionsReason}</p>}
                        </div>
                    )}
                    
                    <div className="space-y-4 p-4 border border-slate-200 rounded-lg">
                         <h3 className="text-lg font-medium text-slate-800">Uploads</h3>
                         <FileInput name="cv" label="Upload CV" error={errors.cv} />
                         <FileInput name="passportPhoto" label="Upload a Passport size photo" error={errors.passportPhoto} />
                         <FileInput name="additionalPhotos" label="Upload any two additional recent photos" multiple={true} error={errors.additionalPhotos}/>
                         <FileInput name="workplacePhoto" label="Upload Workplace or professional look" error={errors.workplacePhoto}/>
                    </div>

                    <div className="flex items-start">
                        <div className="flex items-center h-5">
                            <input id="agreement" name="agreement" type="checkbox" checked={formData.agreement} onChange={handleChange} className="focus:ring-blue-500 h-4 w-4 text-blue-600 border-slate-300 rounded" />
                        </div>
                        <div className="ml-3 text-sm">
                            <label htmlFor="agreement" className="font-medium text-slate-700">I agree to the terms and conditions<span className="text-red-500 ml-1">*</span></label>
                            {errors.agreement && <p className="text-red-500 text-sm">{errors.agreement}</p>}
                        </div>
                    </div>
                </fieldset>

                <div>
                    <button type="submit" disabled={!isSubmittable || submissionStatus === 'uploading' || submissionStatus === 'success'} className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors">
                        {submissionStatus === 'uploading' && (
                            <>
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading...
                            </>
                        )}
                        {submissionStatus === 'idle' && 'Submit Application'}
                        {submissionStatus === 'success' && 'Application Submitted!'}
                        {submissionStatus === 'error' && 'Submission Failed - Retry'}
                    </button>
                    {submissionStatus === 'error' && <p className="text-red-500 text-sm mt-2 text-center">An error occurred during upload. Please try again.</p>}
                </div>
            </form>
        </section>
    );
};

export default ApplicationForm;
