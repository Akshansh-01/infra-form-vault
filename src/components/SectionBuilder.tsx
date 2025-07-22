import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Plus, Settings, Trash2, GripVertical } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Section, Indicator } from '@/types/form';
import { IndicatorBuilder } from './IndicatorBuilder';

interface SectionBuilderProps {
  section: Section;
  sectionIndex: number;
  onUpdate: (sectionId: string, section: Section) => void;
  onDelete: (sectionId: string) => void;
}

export const SectionBuilder: React.FC<SectionBuilderProps> = ({
  section,
  sectionIndex,
  onUpdate,
  onDelete
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  const addIndicator = () => {
    const newIndicator: Indicator = {
      id: `indicator-${Date.now()}`,
      serialNumber: `${sectionIndex + 1}.${section.indicators.length + 1}`,
      title: 'New Indicator',
      description: 'Indicator description',
      requiredDocs: 'Required documents',
      status: 'pending',
      fields: [
        {
          id: `field-${Date.now()}-1`,
          label: 'A1 - Value 1',
          type: 'number',
          required: true,
          placeholder: 'Enter A1 value'
        },
        {
          id: `field-${Date.now()}-2`,
          label: 'A2 - Value 2',
          type: 'number',
          required: true,
          placeholder: 'Enter A2 value'
        }
      ],
      documentUpload: {
        enabled: true,
        required: false,
        maxFiles: 5,
        acceptedTypes: ['.pdf', '.doc', '.docx', '.jpg', '.png']
      }
    };

    const updatedSection = {
      ...section,
      indicators: [...section.indicators, newIndicator]
    };

    onUpdate(section.id, updatedSection);
  };

  const updateIndicator = (indicatorId: string, updatedIndicator: Indicator) => {
    const updatedSection = {
      ...section,
      indicators: section.indicators.map(indicator => 
        indicator.id === indicatorId ? updatedIndicator : indicator
      )
    };
    onUpdate(section.id, updatedSection);
  };

  const deleteIndicator = (indicatorId: string) => {
    const updatedSection = {
      ...section,
      indicators: section.indicators.filter(indicator => indicator.id !== indicatorId)
    };
    onUpdate(section.id, updatedSection);
  };

  const updateSectionTitle = (title: string) => {
    onUpdate(section.id, { ...section, title });
  };

  const updateSectionDescription = (description: string) => {
    onUpdate(section.id, { ...section, description });
  };

  return (
    <Card className="shadow-builder-md border-builder-border">
      {/* Section Header */}
      <div className="bg-builder-muted border-b border-builder-border p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <GripVertical className="h-5 w-5 text-muted-foreground cursor-move" />
            
            {isEditing ? (
              <div className="flex-1 space-y-2">
                <Input
                  value={section.title}
                  onChange={(e) => updateSectionTitle(e.target.value)}
                  className="font-medium"
                  placeholder="Section title..."
                />
                <Input
                  value={section.description}
                  onChange={(e) => updateSectionDescription(e.target.value)}
                  className="text-sm"
                  placeholder="Section description..."
                />
              </div>
            ) : (
              <div className="flex-1">
                <h3 className="font-medium text-foreground">{section.title}</h3>
                {section.description && (
                  <p className="text-sm text-muted-foreground">{section.description}</p>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(section.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Section Content */}
      {isExpanded && (
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium text-foreground">
              Indicators ({section.indicators.length})
            </h4>
            <Button
              variant="outline"
              size="sm"
              onClick={addIndicator}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Indicator
            </Button>
          </div>

          {section.indicators.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Plus className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p className="text-sm">No indicators yet. Add your first indicator.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {section.indicators.map((indicator, index) => (
                <IndicatorBuilder
                  key={indicator.id}
                  indicator={indicator}
                  indicatorIndex={index}
                  sectionIndex={sectionIndex}
                  onUpdate={updateIndicator}
                  onDelete={deleteIndicator}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};