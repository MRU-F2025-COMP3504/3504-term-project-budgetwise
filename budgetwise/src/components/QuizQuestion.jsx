/**
 * QuizQuestion - Renders a single quiz question and input based on provided metadata.
 * Props:
 * - question: { id, text, inputType, options? }
 * - value: current answer string
 * - onChange: (newValue) => void
 * - disabled: boolean (loading state)
 */
export default function QuizQuestion({ question, value, onChange, disabled }) {
  if (!question) return null;
  const { text, inputType, options } = question;

  return (
    <div className="space-y-3">
      <p className="text-lg font-medium text-center">{text}</p>

      <div className="max-w-sm w-full mx-auto">
        {inputType === 'number' && (
          <input
            type="number"
            className="bw-input w-full"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Enter amount"
            disabled={disabled}
          />
        )}

        {inputType === 'select' && Array.isArray(options) && (
          <select
            className="bw-input w-full"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
          >
            <option value="">Select...</option>
            {options.map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        )}

        {(inputType === 'text' || !inputType) && (
          <input
            type="text"
            className="bw-input w-full"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Type your answer"
            disabled={disabled}
          />
        )}
      </div>
    </div>
  );
}
