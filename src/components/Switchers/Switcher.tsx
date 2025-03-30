import React from 'react';

interface SwitcherProps {
    enabled: boolean;
    onToggle?: (newState: boolean) => void; // Make onToggle optional
}

const Switcher:React.FC<SwitcherProps> = ({ enabled, onToggle }) => {

    const handleToggle = () => {
        if (onToggle) {
            onToggle(!enabled); // Call onToggle if it exists
        }
    };


    return (
        <div>
            <label
                htmlFor="toggle1"
                className="flex cursor-pointer select-none items-center"
            >
                <div className="relative">
                    <input
                        type="checkbox"
                        id="toggle1"
                        className="sr-only"
                        checked={enabled}
                        onChange={handleToggle}
                    />
                    <div className="block h-8 w-14 rounded-full bg-green-3"></div>
                    <div
                        className={`absolute left-1 top-1 h-6 w-6 rounded-full bg-whiten transition ${enabled && '!right-1 !translate-x-full !bg-green-6 '
                            }`}
                    ></div>
                </div>
            </label>
        </div>
    );
};

export default Switcher