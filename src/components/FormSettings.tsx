import React from 'react';
import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { FormSettings as FormSettingsType } from '@/types/form';

interface FormSettingsProps {
  settings: FormSettingsType;
  onUpdate: (settings: FormSettingsType) => void;
}

export const FormSettings: React.FC<FormSettingsProps> = ({ settings, onUpdate }) => {
  const updateSetting = (key: keyof FormSettingsType, value: any) => {
    onUpdate({
      ...settings,
      [key]: value
    });
  };

  const addFileType = (type: string) => {
    if (type && !settings.allowedFileTypes.includes(type)) {
      updateSetting('allowedFileTypes', [...settings.allowedFileTypes, type]);
    }
  };

  const removeFileType = (type: string) => {
    updateSetting('allowedFileTypes', settings.allowedFileTypes.filter(t => t !== type));
  };

  const commonFileTypes = ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.jpg', '.jpeg', '.png', '.gif', '.txt', '.csv'];

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* General Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">General Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="progress-bar">Show Progress Bar</Label>
              <p className="text-sm text-muted-foreground">Display completion progress at the top of the form</p>
            </div>
            <Switch
              id="progress-bar"
              checked={settings.showProgressBar}
              onCheckedChange={(checked) => updateSetting('showProgressBar', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="auto-save">Enable Auto-save</Label>
              <p className="text-sm text-muted-foreground">Automatically save form data as users type</p>
            </div>
            <Switch
              id="auto-save"
              checked={settings.enableAutoSave || false}
              onCheckedChange={(checked) => updateSetting('enableAutoSave', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="validation">Enable Real-time Validation</Label>
              <p className="text-sm text-muted-foreground">Validate fields as users complete them</p>
            </div>
            <Switch
              id="validation"
              checked={settings.enableValidation || false}
              onCheckedChange={(checked) => updateSetting('enableValidation', checked)}
            />
          </div>
        </div>
      </Card>

      {/* File Upload Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">File Upload Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label htmlFor="file-uploads">Allow File Uploads</Label>
              <p className="text-sm text-muted-foreground">Enable document upload functionality</p>
            </div>
            <Switch
              id="file-uploads"
              checked={settings.allowFileUploads}
              onCheckedChange={(checked) => updateSetting('allowFileUploads', checked)}
            />
          </div>

          {settings.allowFileUploads && (
            <>
              <div className="space-y-2">
                <Label htmlFor="max-file-size">Maximum File Size (MB)</Label>
                <Input
                  id="max-file-size"
                  type="number"
                  value={settings.maxFileSize}
                  onChange={(e) => updateSetting('maxFileSize', parseInt(e.target.value))}
                  min="1"
                  max="100"
                  className="w-32"
                />
              </div>

              <div className="space-y-3">
                <Label>Allowed File Types</Label>
                <div className="flex flex-wrap gap-2">
                  {settings.allowedFileTypes.map((type) => (
                    <Badge key={type} variant="secondary" className="flex items-center gap-1">
                      {type}
                      <button
                        onClick={() => removeFileType(type)}
                        className="ml-1 text-muted-foreground hover:text-foreground"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm">Quick Add Common Types</Label>
                  <div className="flex flex-wrap gap-2">
                    {commonFileTypes
                      .filter(type => !settings.allowedFileTypes.includes(type))
                      .map((type) => (
                        <button
                          key={type}
                          onClick={() => addFileType(type)}
                          className="px-2 py-1 text-xs border border-border rounded hover:bg-muted transition-colors"
                        >
                          {type}
                        </button>
                      ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom-type">Add Custom File Type</Label>
                  <div className="flex gap-2">
                    <Input
                      id="custom-type"
                      placeholder=".extension"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addFileType((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                      className="flex-1"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Press Enter to add. Include the dot (e.g., .pdf, .docx)
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </Card>

      {/* Security Settings */}
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Security & Access</h3>
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            <p>Additional security settings like access controls, user authentication, and data encryption can be configured here in future updates.</p>
          </div>
        </div>
      </Card>
    </div>
  );
};