import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Badge } from "./ui/badge";
import { Calendar, Plus, Loader2, Trash2, Edit } from "lucide-react";
import { DiaryEntry } from "@/types";
import { useAuth } from "@/contexts/AuthContext";
import databaseService from "@/services/database";
import { useToast } from "@/hooks/use-toast";

const FieldDiary = () => {
  const [entries, setEntries] = useState<DiaryEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<DiaryEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    activity: 'sowing' as DiaryEntry['activity'],
    crop: '',
    notes: '',
  });

  const { user } = useAuth();
  const { toast } = useToast();

  // Load entries on component mount
  useEffect(() => {
    loadEntries();
  }, [user]);

  const loadEntries = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const diaryEntries = await databaseService.getDiaryEntries(user.id);
      setEntries(diaryEntries);
    } catch (error) {
      console.error('Failed to load diary entries:', error);
      toast({
        title: 'Error',
        description: 'Failed to load diary entries',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const activityColors = {
    sowing: 'bg-primary',
    irrigation: 'bg-secondary',
    fertilizing: 'bg-accent',
    harvesting: 'bg-success',
    other: 'bg-muted',
  };

  const activityLabels = {
    sowing: '🌱 Sowing',
    irrigation: '💧 Irrigation',
    fertilizing: '🌿 Fertilizing',
    harvesting: '🌾 Harvesting',
    other: '📝 Other',
  };

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: 'Error',
        description: 'Please sign in to save diary entries',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);

      const entryData = {
        date: new Date(),
        activity: formData.activity,
        crop: formData.crop || undefined,
        notes: formData.notes,
      };

      let savedEntry: DiaryEntry | null = null;

      if (editingEntry) {
        // Update existing entry
        const success = await databaseService.updateDiaryEntry(
          user.id,
          editingEntry.id,
          entryData
        );
        if (success) {
          await loadEntries(); // Reload entries
          toast({
            title: 'Success',
            description: 'Diary entry updated successfully',
          });
        }
      } else {
        // Create new entry
        savedEntry = await databaseService.createDiaryEntry(user.id, entryData);
        if (savedEntry) {
          setEntries([savedEntry, ...entries]);
          toast({
            title: 'Success',
            description: 'Diary entry created successfully',
          });
        }
      }

      if (savedEntry || editingEntry) {
        setFormData({ activity: 'sowing', crop: '', notes: '' });
        setShowForm(false);
        setEditingEntry(null);
      }
    } catch (error) {
      console.error('Failed to save diary entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to save diary entry',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (entry: DiaryEntry) => {
    setEditingEntry(entry);
    setFormData({
      activity: entry.activity,
      crop: entry.crop || '',
      notes: entry.notes,
    });
    setShowForm(true);
  };

  const handleDelete = async (entryId: string) => {
    if (!user) return;

    try {
      const success = await databaseService.deleteDiaryEntry(user.id, entryId);
      if (success) {
        setEntries(entries.filter(entry => entry.id !== entryId));
        toast({
          title: 'Success',
          description: 'Diary entry deleted successfully',
        });
      }
    } catch (error) {
      console.error('Failed to delete diary entry:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete diary entry',
        variant: 'destructive',
      });
    }
  };

  const handleCancel = () => {
    setFormData({ activity: 'sowing', crop: '', notes: '' });
    setShowForm(false);
    setEditingEntry(null);
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Field Diary</h2>
        {user ? (
          <Button onClick={() => setShowForm(!showForm)} className="gap-2">
            <Plus className="h-4 w-4" />
            {editingEntry ? 'Cancel Edit' : 'New Entry'}
          </Button>
        ) : (
          <p className="text-sm text-muted-foreground">Sign in to add diary entries</p>
        )}
      </div>

      {showForm && (
        <div className="mb-6 p-4 border border-border rounded-lg space-y-4">
          <div>
            <Label htmlFor="activity">Activity</Label>
            <Select
              value={formData.activity}
              onValueChange={(value) => setFormData({ ...formData, activity: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sowing">Sowing</SelectItem>
                <SelectItem value="irrigation">Irrigation</SelectItem>
                <SelectItem value="fertilizing">Fertilizing</SelectItem>
                <SelectItem value="harvesting">Harvesting</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(formData.activity === 'sowing' || formData.activity === 'harvesting') && (
            <div>
              <Label htmlFor="crop">Crop</Label>
              <Input
                id="crop"
                placeholder="e.g., Corn, Wheat, Soybeans"
                value={formData.crop}
                onChange={(e) => setFormData({ ...formData, crop: e.target.value })}
              />
            </div>
          )}

          <div>
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              placeholder="Add details about this activity..."
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSubmit} disabled={submitting}>
              {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingEntry ? 'Update Entry' : 'Save Entry'}
            </Button>
            <Button variant="outline" onClick={handleCancel} disabled={submitting}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      ) : entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">
            {user ? 'No diary entries yet. Add your first entry!' : 'Sign in to view your diary entries'}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className="p-4 border border-border rounded-lg hover:border-primary transition-all"
            >
              <div className="flex items-start justify-between gap-4 mb-2">
                <Badge className={activityColors[entry.activity]}>
                  {activityLabels[entry.activity]}
                </Badge>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    {entry.date.toLocaleDateString()}
                  </div>
                  {user && (
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleEdit(entry)}
                        className="h-8 w-8"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(entry.id)}
                        className="h-8 w-8 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              {entry.crop && (
                <p className="font-semibold mb-1">Crop: {entry.crop}</p>
              )}
              <p className="text-sm text-muted-foreground">{entry.notes}</p>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

export default FieldDiary;
