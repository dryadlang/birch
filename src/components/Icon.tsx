import React from 'react';

interface IconProps {
    name: string;
    size?: number;
    className?: string;
    onClick?: () => void;
    style?: React.CSSProperties;
}

export const Icon: React.FC<IconProps> = ({ name, size = 20, className = '', onClick, style }) => {
    return (
        <img
            src={`/icons/outline/${name}.svg`}
            alt={name}
            width={size}
            height={size}
            className={`icon ${className}`}
            onClick={onClick}
            style={{ opacity: 0.9, filter: 'invert(0.8)', ...style }}
        />
    );
};
