import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Upload, X, FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FormData } from '@/types/form';

interface FormPreviewProps {
  formData: FormData;
}

export const FormPreview: React.FC<FormPreviewProps> = ({ formData }) => {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set([formData.sections[0]?.id]));
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File[]>>({});
  const [documentToggles, setDocumentToggles] = useState<Record<string, boolean>>({});

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormValues(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleFileUpload = (indicatorId: string, files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setUploadedFiles(prev => ({
      ...prev,
      [indicatorId]: [...(prev[indicatorId] || []), ...fileArray]
    }));
  };

  const removeFile = (indicatorId: string, fileIndex: number) => {
    setUploadedFiles(prev => ({
      ...prev,
      [indicatorId]: prev[indicatorId]?.filter((_, index) => index !== fileIndex) || []
    }));
  };

  const toggleDocumentUpload = (indicatorId: string, enabled: boolean) => {
    setDocumentToggles(prev => ({
      ...prev,
      [indicatorId]: enabled
    }));
  };

  const getProgressPercentage = () => {
    const totalFields = formData.sections.reduce((total, section) => 
      total + section.indicators.reduce((sectionTotal, indicator) => 
        sectionTotal + indicator.fields.length, 0), 0);
    
    const filledFields = Object.keys(formValues).length;
    return totalFields > 0 ? Math.round((filledFields / totalFields) * 100) : 0;
  };

  const statusColors = {
    pending: 'bg-status-pending text-white',
    completed: 'bg-status-completed text-white',
    error: 'bg-status-error text-white',
    required: 'bg-status-info text-white'
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="shadow-builder-lg overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-header text-white p-8 text-center">
          <h1 className="text-2xl font-semibold mb-2">{formData.title}</h1>
          <p className="text-gray-300 text-sm">{formData.description}</p>
          
          {formData.settings.showProgressBar && (
            <div className="mt-6">
              <div className="bg-white/20 rounded-full h-2 overflow-hidden">
                <Progress 
                  value={getProgressPercentage()} 
                  className="h-full bg-success"
                />
              </div>
              <p className="text-xs text-gray-300 mt-2">
                {getProgressPercentage()}% Complete
              </p>
            </div>
          )}
        </div>

        {/* Form Content */}
        <div className="p-6 space-y-6">
          {formData.sections.map((section, sectionIndex) => (
            <Card key={section.id} className="border-builder-border overflow-hidden">
              {/* Section Header */}
              <div 
                className="bg-builder-muted border-b border-builder-border p-4 cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => toggleSection(section.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="font-medium text-foreground">
                      {sectionIndex + 1}. {section.title}
                    </h2>
                    {section.description && (
                      <p className="text-sm text-muted-foreground mt-1">{section.description}</p>
                    )}
                  </div>
                  {expandedSections.has(section.id) ? (
                    <ChevronUp className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </div>

              {/* Section Content */}
              {expandedSections.has(section.id) && (
                <div className="divide-y divide-border">
                  {section.indicators.map((indicator) => (
                    <div key={indicator.id} className="p-6 hover:bg-muted/20 transition-colors">
                      {/* Indicator Header */}
                      <div className="grid grid-cols-12 gap-4 items-start mb-6">
                        <div className="col-span-1">
                          <div className="bg-primary text-primary-foreground rounded-lg px-3 py-2 text-sm font-medium text-center">
                            {indicator.serialNumber}
                          </div>
                        </div>
                        
                        <div className="col-span-8">
                          <h3 className="font-medium text-foreground mb-1">{indicator.title}</h3>
                          <p className="text-sm text-muted-foreground mb-1">{indicator.description}</p>
                          <p className="text-xs text-muted-foreground italic">{indicator.requiredDocs}</p>
                        </div>
                        
                        <div className="col-span-3 text-right">
                          <Badge className={statusColors[indicator.status]}>
                            {indicator.status.charAt(0).toUpperCase() + indicator.status.slice(1)}
                          </Badge>
                        </div>
                      </div>

                      {/* Document Upload */}
                      {indicator.documentUpload.enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Document Submitted</label>
                            <div className="flex items-center">
                              <Switch
                                checked={documentToggles[indicator.id] || false}
                                onCheckedChange={(checked) => toggleDocumentUpload(indicator.id, checked)}
                              />
                            </div>
                          </div>

                          {documentToggles[indicator.id] && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Upload Files</label>
                              <div 
                                className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary transition-colors cursor-pointer"
                                onClick={() => {
                                  const input = document.createElement('input');
                                  input.type = 'file';
                                  input.multiple = true;
                                  input.accept = indicator.documentUpload.acceptedTypes?.join(',') || '';
                                  input.onchange = (e) => handleFileUpload(indicator.id, (e.target as HTMLInputElement).files);
                                  input.click();
                                }}
                              >
                                <Upload className="h-6 w-6 mx-auto mb-2 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  Click to upload files
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                  {indicator.documentUpload.acceptedTypes?.join(', ')}
                                </p>
                              </div>

                              {/* File Preview */}
                              {uploadedFiles[indicator.id]?.length > 0 && (
                                <div className="space-y-2">
                                  {uploadedFiles[indicator.id].map((file, index) => (
                                    <div key={index} className="flex items-center justify-between bg-muted rounded-lg p-2">
                                      <div className="flex items-center gap-2">
                                        <FileText className="h-4 w-4 text-muted-foreground" />
                                        <span className="text-sm">{file.name}</span>
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeFile(indicator.id, index)}
                                        className="text-destructive hover:text-destructive h-6 w-6 p-0"
                                      >
                                        <X className="h-3 w-3" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}

                      {/* Form Fields */}
                      {indicator.fields.length > 0 && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-border">
                          {indicator.fields.map((field) => (
                            <div key={field.id} className="space-y-2">
                              <label className="block text-sm font-medium text-foreground">
                                {field.label}
                                {field.required && <span className="text-destructive ml-1">*</span>}
                              </label>
                              
                              {field.type === 'select' ? (
                                <select 
                                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                                  value={formValues[field.id] || ''}
                                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                  required={field.required}
                                >
                                  <option value="">{field.placeholder || 'Select option...'}</option>
                                  {field.options?.map((option) => (
                                    <option key={option} value={option}>{option}</option>
                                  ))}
                                </select>
                              ) : (
                                <input
                                  type={field.type}
                                  className="w-full px-3 py-2 border border-input rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent bg-background"
                                  placeholder={field.placeholder}
                                  value={formValues[field.id] || ''}
                                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                                  required={field.required}
                                  min={field.validation?.min}
                                  max={field.validation?.max}
                                  pattern={field.validation?.pattern}
                                />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </Card>
          ))}

          {/* Submit Section */}
          <div className="text-center py-8 border-t border-border bg-muted/30 rounded-lg">
            <div className="space-y-4">
              <div className="flex justify-center gap-4">
                <Button variant="outline" size="lg">
                  Save Draft
                </Button>
                <Button size="lg" className="bg-gradient-primary hover:opacity-90">
                  Submit Form
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Make sure all required fields are completed before submitting.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};