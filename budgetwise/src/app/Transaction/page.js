'use client';

export default function CreateTransactionsPage() {
  const handleClick = async () => {
    try {
      const saved = localStorage.getItem('parsedData');
     
      const res = await fetch('/api/transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: saved,
      });

      if (res.ok) {
        alert('Server received the message!');
      } else {
        alert('Error sending message to server');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={handleClick}
        className="px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Create Transactions
      </button>
    </div>
  );
}
