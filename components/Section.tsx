
import React, { ReactNode } from 'react';

interface SectionProps {
    title: string;
    children: ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => {
    return (
        <section>
            <h2 className="text-xl font-bold text-slate-800 border-b-2 border-slate-200 pb-2 mb-4">{title}</h2>
            <div>{children}</div>
        </section>
    );
};

export default Section;
