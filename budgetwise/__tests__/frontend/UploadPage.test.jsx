import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import UploadPage from '@/app/upload/page';
import api from '@/services/api';

// Mock api
jest.mock('@/services/api', () => ({
  statements: {
    upload: jest.fn(),
  },
}));

describe('UploadPage', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders file input', () => {
    render(<UploadPage />);
    expect(screen.getByLabelText(/choose csv file/i)).toBeInTheDocument();
    expect(screen.getByText(/choose files/i)).toBeInTheDocument();
  });

  it('handles file selection', () => {
    render(<UploadPage />);
    const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/choose csv file/i);

    fireEvent.change(input, { target: { files: [file] } });

    expect(screen.getAllByText('test.csv').length).toBeGreaterThan(0);
    expect(screen.getByText(/upload file/i)).toBeInTheDocument();
  });

  it('uploads file successfully', async () => {
    api.statements.upload.mockResolvedValue({ data: { file: 'test.csv' } });

    render(<UploadPage />);
    const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/choose csv file/i);

    fireEvent.change(input, { target: { files: [file] } });
    
    const uploadButton = screen.getByRole('button', { name: /upload file/i });
    fireEvent.click(uploadButton);

    expect(screen.getByRole('button', { name: /uploading.../i })).toBeInTheDocument();

    await waitFor(() => {
      expect(api.statements.upload).toHaveBeenCalled();
      expect(screen.getByText(/✅ uploaded: test.csv/i)).toBeInTheDocument();
    });
  });

  it('handles upload failure', async () => {
    api.statements.upload.mockRejectedValue({ message: 'Upload failed' });

    render(<UploadPage />);
    const file = new File(['dummy content'], 'test.csv', { type: 'text/csv' });
    const input = screen.getByLabelText(/choose csv file/i);

    fireEvent.change(input, { target: { files: [file] } });
    
    const uploadButton = screen.getByRole('button', { name: /upload file/i });
    fireEvent.click(uploadButton);

    await waitFor(() => {
      expect(screen.getByText(/❌ failed: upload failed/i)).toBeInTheDocument();
    });
  });
});
