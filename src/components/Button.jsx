// Reusable Button Component

const Button = ({
    children,
    onClick,
    variant = 'primary',
    size = 'medium',
    disabled = false,
    type = 'button',
    className = '',
    ...props
}) => {
    // Base styles
    const baseStyles = 'font-sans font-medium rounded-full transition-all duration-300 cursor-pointer border-none outline-none';

    // Variant styles
    const variantStyles = {
        primary: 'bg-sage-600 text-cream-50 hover:bg-sage-700 hover:shadow-lg',
        secondary: 'bg-cream-200 text-sage-900 hover:bg-cream-300 hover:shadow-md',
        gentle: 'bg-blush-100 text-blush-700 hover:bg-blush-200 hover:shadow-md',
        ghost: 'bg-transparent text-sage-700 border border-sage-300 hover:bg-sage-50 hover:border-sage-400',
        blush: 'bg-blush-500 text-cream-50 hover:bg-blush-600 hover:shadow-lg'
    };

    // Size styles
    const sizeStyles = {
        small: 'px-4 py-2 text-sm',
        medium: 'px-6 py-3 text-base',
        large: 'px-8 py-4 text-lg'
    };

    // Disabled styles
    const disabledStyles = 'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none';

    const classes = `${baseStyles} ${variantStyles[variant] || variantStyles.primary} ${sizeStyles[size] || sizeStyles.medium} ${disabledStyles} ${className}`.trim();

    return (
        <button
            type={type}
            className={classes}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};

export default Button;
