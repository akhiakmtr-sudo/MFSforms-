import React from 'react';
import Header from './components/Header';
import Section from './components/Section';
import ApplicationForm from './components/ApplicationForm';
import { WarningIcon } from './components/icons/WarningIcon';

const App: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
            <div className="container mx-auto max-w-4xl p-4 sm:p-6 lg:p-8">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    <Header />
                    <main className="p-6 sm:p-8 md:p-10 space-y-8">
                        <Section title="Company Overview">
                            <p className="text-slate-600 leading-relaxed">
                                Metric Flux Solutions Pvt Ltd is a dynamic IT enterprise established in 2022, with operational branches in Kochi, Kerala and Bangalore, Karnataka. We specialize in comprehensive digital solutions including application development, website creation, banking software, digital marketing, and job consultancy services. Our company successfully manages digital advertisement campaigns while delivering cutting-edge IT solutions across diverse sectors.
                            </p>
                        </Section>

                        <Section title="Job Details">
                            <ul className="list-disc list-inside text-slate-600 space-y-2">
                                <li><span className="font-semibold text-slate-700">Position:</span> Personal Assistant</li>
                                <li><span className="font-semibold text-slate-700">Gender:</span> Female only</li>
                                <li><span className="font-semibold text-slate-700">Age:</span> 19 to 40 years</li>
                                <li><span className="font-semibold text-slate-700">Type:</span> 90% Work From Home</li>
                                <li><span className="font-semibold text-slate-700">Salary:</span> Based on interview performance</li>
                                <li><span className="font-semibold text-slate-700">Qualification:</span> Any with basic computer knowledge</li>
                            </ul>
                        </Section>

                        <Section title="Job Description">
                            <p className="text-slate-600 leading-relaxed mb-4">
                                We are hiring a dependable, organized, and proactive Private Assistant to the Managing Director. This role is 95% remote, with occasional travel (2–3 days, once a month) for meetings or events. The ideal candidate should handle office coordination, communication, and scheduling responsibilities with professionalism and confidentiality. Candidates must be adaptable, confident, and comfortable working closely with management.
                            </p>
                             <ul className="list-disc list-inside text-slate-600 space-y-2">
                                <li>Coordinate Office Staff and Projects</li>
                                <li>Check everything working properly</li>
                                <li>Pass informations from MD to appropriate Team Leaders</li>
                                <li>Support MD travel Plans</li>
                                <li>Manage and schedule MD meetings</li>
                            </ul>
                        </Section>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
                            <div className="flex items-start">
                                <div className="flex-shrink-0">
                                    <WarningIcon />
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm text-yellow-800">
                                        <span className="font-bold">Note:</span> Please do not apply if you are uncomfortable with occasional travel or prefer a rigid or traditional work style. We value modern thinking, flexibility, and trust.
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <ApplicationForm />
                    </main>
                </div>
                 <footer className="text-center text-sm text-slate-500 py-6">
                    © {new Date().getFullYear()} Metric Flux Solutions Pvt Ltd. All rights reserved.
                </footer>
            </div>
        </div>
    );
};

export default App;