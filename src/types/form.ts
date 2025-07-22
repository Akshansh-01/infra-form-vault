export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'email' | 'tel' | 'date' | 'select';
  required: boolean;
  placeholder?: string;
  options?: string[];
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

export interface Indicator {
  id: string;
  serialNumber: string;
  title: string;
  description: string;
  requiredDocs: string;
  status: 'pending' | 'completed' | 'error' | 'required';
  fields: FormField[];
  documentUpload: {
    enabled: boolean;
    required: boolean;
    maxFiles?: number;
    acceptedTypes?: string[];
  };
}

export interface Section {
  id: string;
  title: string;
  description: string;
  indicators: Indicator[];
  isCollapsible: boolean;
  isExpanded: boolean;
}

export interface FormSettings {
  showProgressBar: boolean;
  allowFileUploads: boolean;
  maxFileSize: number;
  allowedFileTypes: string[];
  enableAutoSave?: boolean;
  enableValidation?: boolean;
}

export interface FormData {
  id: string;
  title: string;
  description: string;
  sections: Section[];
  settings: FormSettings;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FormSubmission {
  id: string;
  formId: string;
  data: Record<string, any>;
  files: Record<string, File[]>;
  submittedAt: Date;
  status: 'draft' | 'submitted' | 'reviewed';
}