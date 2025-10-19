import React, { useState, useEffect, useCallback } from 'react';
import type { FormData, FormFiles } from '../types';
import ProgressBar from './ProgressBar';

// All backend and submission functionality has been removed.
// This is a UI-only component for demonstration purposes.

const InputField = ({ name, label, value, onChange, type = 'text', required = true, ...props }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
        <input
            id={name}
            name={name}
            type={type}
            value={value}
            onChange={onChange}
            className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-300"
            {...props}
        />
    </div>
);

const FileInputField = ({ name, label, onChange, accept, multiple = false, required = true }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-slate-700 mb-1">{label}{required && <span className="text-red-500">*</span>}</label>
        <input
            id={name}
            name={name}
            type="file"
            onChange={onChange}
            accept={accept}
            multiple={multiple}
            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
    </div>
);


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

    const [progress, setProgress] = useState(0);

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

        setProgress(Math.round((completedFields / totalFields) * 100));
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
    
    return (
        <section>
            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-6">Application Form</h2>
            
            <div className="mb-6">
                <p className="text-sm text-slate-600 mb-2">Form Completion</p>
                <ProgressBar progress={progress} />
            </div>

            <form noValidate className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <InputField name="name" label="Full Name" value={formData.name} onChange={handleChange} />
                    <InputField name="dob" label="Date of Birth" type="date" value={formData.dob} onChange={handleChange} />
                    <InputField name="mobile" label="Mobile Number" type="tel" value={formData.mobile} onChange={handleChange} />
                    <InputField name="email" label="Email Address" type="email" value={formData.email} onChange={handleChange} />
                    <InputField name="expectedSalary" label="Expected Salary (per month)" value={formData.expectedSalary} onChange={handleChange} />
                </div>

                <div>
                    <label htmlFor="bio" className="block text-sm font-medium text-slate-700 mb-1">About Yourself <span className="text-red-500">*</span></label>
                    <textarea id="bio" name="bio" rows={4} value={formData.bio} onChange={handleChange} className="w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-slate-300" placeholder="Tell us about yourself, your skills, and why you are a good fit for this role (min. 50 characters)."></textarea>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Are you comfortable with occasional travel? <span className="text-red-500">*</span></label>
                        <div className="flex gap-4">
                           <label className="flex items-center"><input type="radio" name="comfortableTraveling" value="Yes" checked={formData.comfortableTraveling === 'Yes'} onChange={handleChange} className="mr-2" /> Yes</label>
                           <label className="flex items-center"><input type="radio" name="comfortableTraveling" value="No" checked={formData.comfortableTraveling === 'No'} onChange={handleChange} className="mr-2" /> No</label>
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">Do you have any restrictions? <span className="text-red-500">*</span></label>
                         <div className="flex gap-4">
                           <label className="flex items-center"><input type="radio" name="hasRestrictions" value="Yes" checked={formData.hasRestrictions === 'Yes'} onChange={handleChange} className="mr-2" /> Yes</label>
                           <label className="flex items-center"><input type="radio" name="hasRestrictions" value="No" checked={formData.hasRestrictions === 'No'} onChange={handleChange} className="mr-2" /> No</label>
                        </div>
                    </div>
                </div>
                
                {formData.hasRestrictions === 'Yes' && (
                    <div>
                         <label htmlFor="restrictionsReason" className="block text-sm font-medium text-slate-700 mb-1">Reason for Restrictions <span className="text-red-500">*</span></label>
                        <textarea id="restrictionsReason" name="restrictionsReason" rows={2} value={formData.restrictionsReason} onChange={handleChange} className="w-full px-3 py-2 border rounded-md shadow-sm border-slate-300" placeholder="Please explain your restrictions."></textarea>
                    </div>
                )}
                
                <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 space-y-4">
                    <p className="text-sm font-medium text-slate-700">Please upload the following documents. <span className="font-normal text-slate-500">(Max file size: 35 KB each)</span></p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FileInputField name="cv" label="CV / Resume" onChange={handleFileChange} accept=".pdf,.doc,.docx" />
                        <FileInputField name="passportPhoto" label="Passport Size Photo" onChange={handleFileChange} accept="image/*" />
                        <FileInputField name="additionalPhotos" label="Additional Photos (3-4)" onChange={handleFileChange} accept="image/*" multiple={true} />
                        <FileInputField name="workplacePhoto" label="Your Workplace Photo" onChange={handleFileChange} accept="image/*" />
                    </div>
                </div>

                <div>
                    <label className="flex items-start">
                        <input type="checkbox" name="agreement" checked={formData.agreement} onChange={handleChange} className="mt-1 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500" />
                        <span className="ml-2 text-sm text-slate-600">I hereby declare that all the information provided in this application form is true and correct to the best of my knowledge. <span className="text-red-500">*</span></span>
                    </label>
                </div>

                <div className="pt-4">
                    <button type="button" disabled className="w-full bg-slate-400 text-white font-bold py-3 px-4 rounded-lg cursor-not-allowed">
                        Submit (Functionality Disabled)
                    </button>
                </div>
            </form>
        </section>
    );
};

export default ApplicationForm;