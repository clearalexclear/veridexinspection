import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import logo from '@/assets/inspectra-logo.png';
import {
  Upload, FileText, Loader2, ArrowLeft, Sparkles, X, AlertTriangle,
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export default function UploadReport() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, roleLoading } = useRole();
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (!authLoading && !user) navigate('/auth');
  }, [user, authLoading, navigate]);

  const acceptedTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const handleFile = useCallback((f: File) => {
    if (!acceptedTypes.includes(f.type)) {
      toast({ title: 'Invalid file type', description: 'Please upload a PDF or DOCX file.', variant: 'destructive' });
      return;
    }
    if (f.size > 10 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Maximum file size is 10 MB.', variant: 'destructive' });
      return;
    }
    setFile(f);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, [handleFile]);

  const readFileAsText = async (f: File): Promise<string> => {
    // For now, read as text. PDF binary will be sent as base64 hint.
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = () => resolve(`[Unable to read file: ${f.name}]`);
      if (f.type === 'application/pdf') {
        // Send raw text extraction attempt
        reader.readAsText(f);
      } else {
        reader.readAsText(f);
      }
    });
  };

  const handleUploadAndParse = async () => {
    if (!file || !user) return;
    setParsing(true);

    try {
      // Upload to storage
      const filePath = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage
        .from('inspection-uploads')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Read file content for AI parsing
      const fileContent = await readFileAsText(file);

      // Call AI parsing edge function
      const { data, error } = await supabase.functions.invoke('parse-inspection', {
        body: { fileContent, fileName: file.name },
      });

      if (error) throw error;

      // Navigate to review page with parsed data
      navigate('/review-report', { state: { parsedData: data, fileName: file.name, filePath } });
    } catch (err: any) {
      console.error('Upload/parse error:', err);
      toast({
        title: 'Processing failed',
        description: err.message || 'Could not parse the uploaded file. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setParsing(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <img src={logo} alt="Inspectra" className="w-7 h-7" />
            <span className="font-semibold text-foreground text-sm">Inspectra</span>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="w-4 h-4 mr-1" /> Dashboard
          </Button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-foreground">Upload Inspection Report</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Upload a raw inspection report and we'll transform it into a structured Inspectra decision report.
          </p>
        </div>

        {/* Upload zone */}
        <Card className="mb-6">
          <CardContent className="p-0">
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-xl p-12 text-center transition-all duration-200 cursor-pointer
                ${dragOver ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground/40'}
                ${file ? 'bg-success/5 border-success/30' : ''}
              `}
              onClick={() => {
                if (!file) document.getElementById('file-input')?.click();
              }}
            >
              <input
                id="file-input"
                type="file"
                accept=".pdf,.docx"
                className="hidden"
                onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              />

              {file ? (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center">
                    <FileText className="w-6 h-6 text-success" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">{file.name}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={(e) => { e.stopPropagation(); setFile(null); }}
                  >
                    <X className="w-3 h-3 mr-1" /> Remove
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
                    <Upload className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground text-sm">
                      Drop your inspection report here
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      PDF or DOCX — max 10 MB
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Browse Files
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info */}
        <Card className="mb-8 border-warning/20 bg-warning/5">
          <CardContent className="p-4 flex gap-3">
            <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
            <div className="text-xs text-muted-foreground">
              <p className="font-medium text-foreground mb-1">How it works</p>
              <p>Our AI reads your inspection report and extracts key data — defects, measurements, AQL results, and more. You'll review and edit everything before generating your Inspectra report.</p>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <Button
          size="lg"
          className="w-full"
          disabled={!file || parsing}
          onClick={handleUploadAndParse}
        >
          {parsing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Analyzing report with AI…
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 mr-2" />
              Upload & Parse Report
            </>
          )}
        </Button>

        {/* Accepted formats */}
        <div className="flex items-center justify-center gap-2 mt-4">
          <Badge variant="outline" className="text-xs">.pdf</Badge>
          <Badge variant="outline" className="text-xs">.docx</Badge>
        </div>
      </main>
    </div>
  );
}
