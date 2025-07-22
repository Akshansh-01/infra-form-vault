import React, { useState } from 'react';
import { Plus, Settings, Eye, Download, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SectionBuilder } from './SectionBuilder';
import { FormPreview } from './FormPreview';
import { FormSettings } from './FormSettings';
import { FormData, Section } from '@/types/form';
import { useToast } from '@/hooks/use-toast';

export const FormBuilder: React.FC = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    id: 'form-1',
    title: 'Infrastructure Assessment Form',
    description: 'Complete assessment across all infrastructure sectors',
    sections: [],
    settings: {
      showProgressBar: true,
      allowFileUploads: true,
      maxFileSize: 10,
      allowedFileTypes: ['.pdf', '.doc', '.docx', '.jpg', '.png', '.xlsx', '.csv']
    }
  });

  const [activeTab, setActiveTab] = useState('builder');

  const addSection = () => {
    const newSection: Section = {
      id: `section-${Date.now()}`,
      title: `Section ${formData.sections.length + 1}`,
      description: '',
      indicators: [],
      isCollapsible: true,
      isExpanded: false
    };
    
    setFormData(prev => ({
      ...prev,
      sections: [...prev.sections, newSection]
    }));
    
    toast({
      title: 'Section Added',
      description: 'New section has been added to your form.',
    });
  };

  const updateSection = (sectionId: string, updatedSection: Section) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.map(section => 
        section.id === sectionId ? updatedSection : section
      )
    }));
  };

  const deleteSection = (sectionId: string) => {
    setFormData(prev => ({
      ...prev,
      sections: prev.sections.filter(section => section.id !== sectionId)
    }));
    
    toast({
      title: 'Section Deleted',
      description: 'Section has been removed from your form.',
      variant: 'destructive'
    });
  };

  const saveForm = () => {
    // Save form data (implement actual save logic)
    console.log('Saving form:', formData);
    toast({
      title: 'Form Saved',
      description: 'Your form has been saved successfully.',
    });
  };

  const exportForm = () => {
    // Export form as JSON
    const blob = new Blob([JSON.stringify(formData, null, 2)], {
      type: 'application/json'
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.title.replace(/\s+/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);

    toast({
      title: 'Form Exported',
      description: 'Form configuration has been downloaded as JSON.',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-surface">
      {/* Header */}
      <div className="bg-gradient-header shadow-builder-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div>
              <h1 className="text-xl font-semibold text-white">Form Builder</h1>
              <p className="text-sm text-gray-300">Create professional assessment forms</p>
            </div>
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={saveForm}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={exportForm}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="builder" className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Builder
            </TabsTrigger>
            <TabsTrigger value="preview" className="flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="builder" className="space-y-6">
            {/* Form Title */}
            <Card className="p-6 shadow-builder-md">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Form Title
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter form title..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Form Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder="Enter form description..."
                  />
                </div>
              </div>
            </Card>

            {/* Sections */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Form Sections</h2>
                <Button onClick={addSection} className="bg-gradient-primary hover:opacity-90">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Section
                </Button>
              </div>

              {formData.sections.length === 0 ? (
                <Card className="p-12 text-center shadow-builder-md">
                  <div className="text-muted-foreground">
                    <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <h3 className="text-lg font-medium mb-2">No sections yet</h3>
                    <p className="text-sm">Add your first section to start building your form</p>
                  </div>
                </Card>
              ) : (
                <div className="space-y-4">
                  {formData.sections.map((section, index) => (
                    <SectionBuilder
                      key={section.id}
                      section={section}
                      sectionIndex={index}
                      onUpdate={updateSection}
                      onDelete={deleteSection}
                    />
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview">
            <FormPreview formData={formData} />
          </TabsContent>

          <TabsContent value="settings">
            <FormSettings 
              settings={formData.settings}
              onUpdate={(settings) => setFormData(prev => ({ ...prev, settings }))}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};