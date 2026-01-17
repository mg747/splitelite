/**
 * Receipt OCR Module
 * Extracts expense data from receipt images
 */

export interface ExtractedReceiptData {
  merchant: string | null;
  total: number | null;
  date: string | null;
  items: { description: string; amount: number }[];
  rawText: string;
  confidence: number;
}

/**
 * Extract data from a receipt image using Tesseract.js
 */
export async function extractReceiptData(imageFile: File): Promise<ExtractedReceiptData> {
  // Dynamic import to avoid SSR issues
  const Tesseract = await import('tesseract.js');
  
  const result = await Tesseract.recognize(imageFile, 'eng', {
    logger: (m) => {
      if (m.status === 'recognizing text') {
        console.log(`OCR Progress: ${Math.round(m.progress * 100)}%`);
      }
    },
  });

  const text = result.data.text;
  const confidence = result.data.confidence;

  return {
    merchant: extractMerchant(text),
    total: extractTotal(text),
    date: extractDate(text),
    items: extractLineItems(text),
    rawText: text,
    confidence,
  };
}

/**
 * Extract merchant name from receipt text
 */
function extractMerchant(text: string): string | null {
  const lines = text.split('\n').filter(line => line.trim());
  
  // Usually the merchant name is in the first few lines
  for (let i = 0; i < Math.min(3, lines.length); i++) {
    const line = lines[i].trim();
    // Skip lines that look like addresses or phone numbers
    if (line.length > 3 && 
        !line.match(/^\d{3}[-.]?\d{3}[-.]?\d{4}$/) && // phone
        !line.match(/^\d+\s+\w+\s+(st|street|ave|avenue|rd|road|blvd)/i)) { // address
      return line;
    }
  }
  
  return null;
}

/**
 * Extract total amount from receipt text
 */
function extractTotal(text: string): number | null {
  // Common patterns for total
  const patterns = [
    /total[:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /grand\s*total[:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /amount\s*due[:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /balance\s*due[:\s]*\$?\s*(\d+[.,]\d{2})/i,
    /\btotal\b.*?(\d+[.,]\d{2})/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      const amount = parseFloat(match[1].replace(',', '.'));
      if (!isNaN(amount) && amount > 0) {
        return amount;
      }
    }
  }

  // Fallback: find the largest dollar amount (likely the total)
  const amounts = text.match(/\$?\d+[.,]\d{2}/g) || [];
  const parsedAmounts = amounts
    .map(a => parseFloat(a.replace(/[$,]/g, '')))
    .filter(a => !isNaN(a) && a > 0);
  
  if (parsedAmounts.length > 0) {
    return Math.max(...parsedAmounts);
  }

  return null;
}

/**
 * Extract date from receipt text
 */
function extractDate(text: string): string | null {
  // Common date patterns
  const patterns = [
    /(\d{1,2}[\/\-]\d{1,2}[\/\-]\d{2,4})/,  // MM/DD/YYYY or DD/MM/YYYY
    /(\d{4}[\/\-]\d{1,2}[\/\-]\d{1,2})/,     // YYYY/MM/DD
    /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{1,2},?\s+\d{4}/i,
    /\d{1,2}\s+(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        const date = new Date(match[0]);
        if (!isNaN(date.getTime())) {
          return date.toISOString().split('T')[0];
        }
      } catch {
        // Continue to next pattern
      }
    }
  }

  return null;
}

/**
 * Extract line items from receipt text
 */
function extractLineItems(text: string): { description: string; amount: number }[] {
  const items: { description: string; amount: number }[] = [];
  const lines = text.split('\n');

  for (const line of lines) {
    // Look for lines with a description and price
    const match = line.match(/^(.+?)\s+\$?(\d+[.,]\d{2})\s*$/);
    if (match) {
      const description = match[1].trim();
      const amount = parseFloat(match[2].replace(',', '.'));
      
      // Filter out totals, subtotals, tax, etc.
      const skipWords = ['total', 'subtotal', 'tax', 'tip', 'change', 'cash', 'credit', 'debit'];
      const isSkip = skipWords.some(word => description.toLowerCase().includes(word));
      
      if (!isSkip && description.length > 1 && amount > 0 && amount < 1000) {
        items.push({ description, amount });
      }
    }
  }

  return items;
}

/**
 * Upload receipt image to storage and get URL
 * In production, this would upload to Supabase Storage or S3
 */
export async function uploadReceiptImage(file: File): Promise<string> {
  // In production with Supabase:
  // const supabase = createClient();
  // const fileName = `receipts/${Date.now()}-${file.name}`;
  // const { data, error } = await supabase.storage
  //   .from('receipts')
  //   .upload(fileName, file);
  // if (error) throw error;
  // const { data: { publicUrl } } = supabase.storage
  //   .from('receipts')
  //   .getPublicUrl(fileName);
  // return publicUrl;

  // Demo mode - return data URL
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
