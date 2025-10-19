
export interface FormData {
    name: string;
    dob: string;
    mobile: string;
    email: string;
    expectedSalary: string;
    bio: string;
    comfortableTraveling: 'Yes' | 'No' | '';
    hasRestrictions: 'Yes' | 'No' | '';
    restrictionsReason: string;
    agreement: boolean;
}

export interface FormFiles {
    cv: File | null;
    passportPhoto: File | null;
    additionalPhotos: File[];
    workplacePhoto: File | null;
}

export interface FormErrors {
    [key: string]: string | undefined;
}
