// Reusable Input Component

const Input = ({
    type = 'text',
    value,
    onChange,
    placeholder = '',
    className = '',
    disabled = false,
    ...props
}) => {
    const inputStyles = 'w-full px-4 py-3 text-base text-sage-900 bg-cream-50 border border-sage-200 rounded-xl font-sans transition-all duration-300 focus:outline-none focus:border-sage-400 focus:ring-4 focus:ring-sage-100 placeholder:text-sage-400 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${inputStyles} ${className}`.trim()}
            disabled={disabled}
            {...props}
        />
    );
};

export const TextArea = ({
    value,
    onChange,
    placeholder = '',
    className = '',
    rows = 4,
    disabled = false,
    ...props
}) => {
    const textareaStyles = 'w-full px-4 py-3 text-base text-sage-900 bg-cream-50 border border-sage-200 rounded-xl font-sans resize-y transition-all duration-300 focus:outline-none focus:border-sage-400 focus:ring-4 focus:ring-sage-100 placeholder:text-sage-400 disabled:opacity-50 disabled:cursor-not-allowed';

    return (
        <textarea
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`${textareaStyles} ${className}`.trim()}
            rows={rows}
            disabled={disabled}
            {...props}
        />
    );
};

export default Input;
