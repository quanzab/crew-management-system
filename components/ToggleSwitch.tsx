
import React from 'react';

interface ToggleSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
    id: string;
}

const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ id, checked, onChange, ...rest }) => {
    return (
        <label htmlFor={id} className="relative inline-flex items-center cursor-pointer">
            <input 
                type="checkbox" 
                id={id} 
                className="sr-only peer"
                checked={checked}
                onChange={onChange}
                {...rest}
            />
            <div className="w-11 h-6 bg-muted peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
        </label>
    );
};

export default ToggleSwitch;
