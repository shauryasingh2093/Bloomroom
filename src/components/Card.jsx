// Reusable Card Component

const Card = ({
    children,
    className = '',
    padding = 'medium',
    hover = false,
    ...props
}) => {
    // Base styles
    const baseStyles = 'bg-white rounded-2xl shadow-soft border border-sage-100 transition-all duration-300';

    // Padding variants
    const paddingStyles = {
        small: 'p-4',
        medium: 'p-6',
        large: 'p-8'
    };

    // Hover effect
    const hoverStyles = hover ? 'hover:shadow-md hover:border-sage-200 cursor-pointer' : '';

    const classes = `${baseStyles} ${paddingStyles[padding] || paddingStyles.medium} ${hoverStyles} ${className}`.trim();

    return (
        <div className={classes} {...props}>
            {children}
        </div>
    );
};

export default Card;
