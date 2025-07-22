import React, { useState } from 'react';
import { Settings, Trash2, Plus, Minus, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Indicator, FormField } from '@/types/form';

interface IndicatorBuilderProps {
  indicator: Indicator;
  indicatorIndex: number;
  sectionIndex: number;
  onUpdate: (indicatorId: string, indicator: Indicator) => void;
  onDelete: (indicatorId: string) => void;
}

export const IndicatorBuilder: React.FC<IndicatorBuilderProps> = ({
  indicator,
  indicatorIndex,
  sectionIndex,
  onUpdate,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const statusColors = {
    pending: 'bg-status-pending text-white',
    completed: 'bg-status-completed text-white',
    error: 'bg-status-error text-white',
    required: 'bg-status-info text-white'
  };

  const addField = () => {
    const newField: FormField = {
      id: `field-${Date.now()}`,
      label: `A${indicator.fields.length + 1} - Value ${indicator.fields.length + 1}`,
      type: 'number',
      required: true,
      placeholder: `Enter A${indicator.fields.length + 1} value`
    };

    onUpdate(indicator.id, {
      ...indicator,
      fields: [...indicator.fields, newField]
    });
  };

  const updateField = (fieldId: string, updatedField: FormField) => {
    onUpdate(indicator.id, {
      ...indicator,
      fields: indicator.fields.map(field => 
        field.id === fieldId ? updatedField : field
      )
    });
  };

  const deleteField = (fieldId: string) => {
    onUpdate(indicator.id, {
      ...indicator,
      fields: indicator.fields.filter(field => field.id !== fieldId)
    });
  };

  const updateIndicatorProperty = (property: keyof Indicator, value: any) => {
    onUpdate(indicator.id, {
      ...indicator,
      [property]: value
    });
  };

  return (
    <Card className="border-l-4 border-l-primary">
      {/* Indicator Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <div className="bg-primary text-primary-foreground rounded px-2 py-1 text-sm font-medium">
              {indicator.serialNumber}
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-foreground">{indicator.title}</h4>
              <p className="text-sm text-muted-foreground">{indicator.description}</p>
            </div>
            <Badge className={statusColors[indicator.status]}>
              {indicator.status}
            </Badge>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(indicator.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Indicator Configuration */}
      {isExpanded && (
        <div className="p-4 space-y-6 bg-muted/30">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="title">Indicator Title</Label>
              <Input
                id="title"
                value={indicator.title}
                onChange={(e) => updateIndicatorProperty('title', e.target.value)}
                placeholder="Enter indicator title..."
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={indicator.status}
                onValueChange={(value) => updateIndicatorProperty('status', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="error">Error</SelectItem>
                  <SelectItem value="required">Required</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={indicator.description}
                onChange={(e) => updateIndicatorProperty('description', e.target.value)}
                placeholder="Enter indicator description..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requiredDocs">Required Documents</Label>
              <Input
                id="requiredDocs"
                value={indicator.requiredDocs}
                onChange={(e) => updateIndicatorProperty('requiredDocs', e.target.value)}
                placeholder="Enter required documents..."
              />
            </div>
          </div>

          {/* Document Upload Settings */}
          <Card className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4" />
              <Label className="text-sm font-medium">Document Upload Settings</Label>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="upload-enabled">Enable Document Upload</Label>
                <Switch
                  id="upload-enabled"
                  checked={indicator.documentUpload.enabled}
                  onCheckedChange={(checked) => 
                    updateIndicatorProperty('documentUpload', {
                      ...indicator.documentUpload,
                      enabled: checked
                    })
                  }
                />
              </div>

              {indicator.documentUpload.enabled && (
                <>
                  <div className="flex items-center justify-between">
                    <Label htmlFor="upload-required">Required</Label>
                    <Switch
                      id="upload-required"
                      checked={indicator.documentUpload.required}
                      onCheckedChange={(checked) => 
                        updateIndicatorProperty('documentUpload', {
                          ...indicator.documentUpload,
                          required: checked
                        })
                      }
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="max-files">Max Files</Label>
                      <Input
                        id="max-files"
                        type="number"
                        value={indicator.documentUpload.maxFiles || 5}
                        onChange={(e) => 
                          updateIndicatorProperty('documentUpload', {
                            ...indicator.documentUpload,
                            maxFiles: parseInt(e.target.value)
                          })
                        }
                        min="1"
                        max="20"
                      />
                    </div>
                  </div>
                </>
              )}
            </div>
          </Card>

          {/* Form Fields */}
          <Card className="p-4">
            <div className="flex items-center justify-between mb-4">
              <Label className="text-sm font-medium">Form Fields ({indicator.fields.length})</Label>
              <Button
                variant="outline"
                size="sm"
                onClick={addField}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Field
              </Button>
            </div>

            <div className="space-y-3">
              {indicator.fields.map((field, index) => (
                <Card key={field.id} className="p-3 border-dashed">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                    <div className="space-y-2">
                      <Label className="text-xs">Label</Label>
                      <Input
                        value={field.label}
                        onChange={(e) => updateField(field.id, { ...field, label: e.target.value })}
                        placeholder="Field label..."
                        className="text-sm"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Type</Label>
                      <Select
                        value={field.type}
                        onValueChange={(value) => updateField(field.id, { ...field, type: value as FormField['type'] })}
                      >
                        <SelectTrigger className="text-sm">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="tel">Phone</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs">Placeholder</Label>
                      <Input
                        value={field.placeholder || ''}
                        onChange={(e) => updateField(field.id, { ...field, placeholder: e.target.value })}
                        placeholder="Placeholder text..."
                        className="text-sm"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Switch
                          checked={field.required}
                          onCheckedChange={(checked) => updateField(field.id, { ...field, required: checked })}
                          className="scale-75"
                        />
                        <Label className="text-xs">Required</Label>
                      </div>
                      
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteField(field.id)}
                        className="text-destructive hover:text-destructive p-1"
                      >
                        <Minus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              {indicator.fields.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  <Plus className="h-6 w-6 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No fields yet. Add your first field.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      )}
    </Card>
  );
};