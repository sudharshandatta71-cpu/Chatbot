import * as mammoth from 'mammoth';
import * as XLSX from 'xlsx';
import JSZip from 'jszip';

export const extractTextFromFile = async (file: File): Promise<string> => {
  const type = file.type;
  const arrayBuffer = await file.arrayBuffer();

  if (type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } else if (type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || type === 'application/vnd.ms-excel') {
    const workbook = XLSX.read(arrayBuffer);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    return XLSX.utils.sheet_to_txt(worksheet);
  } else if (type === 'text/plain') {
    return await file.text();
  } else if (type === 'application/vnd.openxmlformats-officedocument.presentationml.presentation') {
    // Basic PPTX text extraction
    try {
      const zip = await JSZip.loadAsync(arrayBuffer);
      let fullText = '';
      const slideFiles = Object.keys(zip.files).filter(name => name.startsWith('ppt/slides/slide') && name.endsWith('.xml'));
      
      // Sort slides by number
      slideFiles.sort((a, b) => {
        const numA = parseInt(a.match(/\d+/)![0]);
        const numB = parseInt(b.match(/\d+/)![0]);
        return numA - numB;
      });

      for (const slideFile of slideFiles) {
        const content = await zip.files[slideFile].async('string');
        // Simple regex to extract text from <a:t> tags
        const matches = content.match(/<a:t>([^<]*)<\/a:t>/g);
        if (matches) {
          const slideText = matches.map(m => m.replace(/<a:t>|<\/a:t>/g, '')).join(' ');
          fullText += `Slide ${slideFile.match(/\d+/)![0]}: ${slideText}\n\n`;
        }
      }
      return fullText;
    } catch (err) {
      console.error('PPTX extraction error:', err);
      return '';
    }
  }

  return '';
};
