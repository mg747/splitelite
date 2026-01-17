'use client';

import { useState, useRef } from 'react';
import { useStore } from '@/store';
import { extractReceiptData, ExtractedReceiptData } from '@/lib/ocr';
import { 
  Camera, 
  Upload, 
  X, 
  Loader2, 
  Check, 
  AlertCircle,
  Image as ImageIcon,
  Sparkles
} from 'lucide-react';

interface ReceiptScannerProps {
  groupId: string;
  onClose: () => void;
  onExpenseCreated: () => void;
}

export default function ReceiptScanner({ groupId, onClose, onExpenseCreated }: ReceiptScannerProps) {
  const { user, groups, addExpense } = useStore();
  const [image, setImage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedReceiptData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const group = groups.find(g => g.id === groupId);
  
  // Form state for editing extracted data
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [paidBy, setPaidBy] = useState(group?.members[0]?.id || '');

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('Image must be less than 10MB');
      return;
    }

    setError(null);
    setIsProcessing(true);

    try {
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => setImage(e.target?.result as string);
      reader.readAsDataURL(file);

      // Extract data with OCR
      const data = await extractReceiptData(file);
      setExtractedData(data);

      // Pre-fill form with extracted data
      if (data.merchant) setDescription(data.merchant);
      if (data.total) setAmount(data.total.toString());
      if (data.date) setDate(data.date);
    } catch (err: any) {
      setError(err.message || 'Failed to process receipt');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!group || !description || !amount) return;

    const amountNum = parseFloat(amount);
    if (isNaN(amountNum) || amountNum <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    // Create expense with equal split
    addExpense({
      groupId,
      description,
      amount: amountNum,
      currency: group.currency,
      paidBy,
      splitBetween: group.members.map(m => ({
        memberId: m.id,
        amount: amountNum / group.members.length,
        isPaid: false,
      })),
      category: 'other',
      date: new Date(date),
      receiptUrl: image || undefined,
    });

    onExpenseCreated();
    onClose();
  };

  if (!user?.isPremium) {
    return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-dark-900 rounded-2xl w-full max-w-md border border-dark-700 shadow-2xl p-8 text-center">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Pro Feature</h2>
          <p className="text-dark-400 mb-6">
            Receipt scanning is available for Pro members. Upgrade to automatically extract expense details from photos.
          </p>
          <div className="flex gap-3">
            <button onClick={onClose} className="btn-secondary flex-1">
              Cancel
            </button>
            <button className="btn-primary flex-1">
              Upgrade to Pro
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-dark-900 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto border border-dark-700 shadow-2xl animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-dark-700">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-primary-500/20">
              <Camera className="w-5 h-5 text-primary-400" />
            </div>
            <h2 className="text-xl font-semibold text-white">Scan Receipt</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-dark-700 text-dark-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Upload Area */}
          {!image && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-dark-600 rounded-2xl p-12 text-center cursor-pointer hover:border-primary-500 hover:bg-primary-500/5 transition-all"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div className="w-16 h-16 rounded-2xl bg-dark-800 flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-dark-400" />
              </div>
              <p className="text-white font-medium mb-2">
                Upload receipt image
              </p>
              <p className="text-dark-400 text-sm">
                Take a photo or select from gallery
              </p>
            </div>
          )}

          {/* Processing State */}
          {isProcessing && (
            <div className="text-center py-12">
              <Loader2 className="w-12 h-12 text-primary-400 animate-spin mx-auto mb-4" />
              <p className="text-white font-medium">Processing receipt...</p>
              <p className="text-dark-400 text-sm mt-1">
                Extracting expense details with AI
              </p>
            </div>
          )}

          {/* Image Preview & Form */}
          {image && !isProcessing && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Image Preview */}
              <div className="relative">
                <img
                  src={image}
                  alt="Receipt"
                  className="w-full h-48 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImage(null);
                    setExtractedData(null);
                  }}
                  className="absolute top-2 right-2 p-2 rounded-lg bg-dark-900/80 text-white hover:bg-dark-900 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
                {extractedData && (
                  <div className="absolute bottom-2 left-2 px-3 py-1 rounded-lg bg-dark-900/80 text-xs">
                    <span className="text-dark-400">Confidence: </span>
                    <span className={extractedData.confidence > 70 ? 'text-green-400' : 'text-amber-400'}>
                      {Math.round(extractedData.confidence)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Extracted Data Notice */}
              {extractedData && (
                <div className="flex items-start gap-3 p-4 rounded-xl bg-primary-500/10 border border-primary-500/20">
                  <Check className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-primary-300 font-medium text-sm">
                      Data extracted successfully
                    </p>
                    <p className="text-primary-400/70 text-xs mt-1">
                      Review and edit the details below
                    </p>
                  </div>
                </div>
              )}

              {/* Form Fields */}
              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Description
                </label>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="What was this expense for?"
                  className="input"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    step="0.01"
                    min="0"
                    className="input"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-dark-300 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Paid by
                </label>
                <select
                  value={paidBy}
                  onChange={(e) => setPaidBy(e.target.value)}
                  className="input"
                >
                  {group?.members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Error */}
              {error && (
                <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20">
                  <AlertCircle className="w-5 h-5 text-red-400" />
                  <p className="text-red-400 text-sm">{error}</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={onClose} className="btn-secondary flex-1">
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!description || !amount}
                  className="btn-primary flex-1 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Expense
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
