
import React from 'react';

interface ProgressBarProps {
    progress: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ progress }) => {
    const clampedProgress = Math.min(100, Math.max(0, progress));

    return (
        <div className="w-full bg-slate-200 rounded-full h-3 my-4">
            <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${clampedProgress}%` }}
            ></div>
        </div>
    );
};

export default ProgressBar;
