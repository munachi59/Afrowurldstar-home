import React, { useState, useMemo } from 'react';
import { Sparkles, BarChart3, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronUp, Newspaper, Microscope, Music, TrendingUp, Users, Zap, Clock } from 'lucide-react';

// Tailwind CSS is assumed to be available.
// The design is mobile-first, using flex and responsive utilities.

// =================================================================
// 1. DATA & CONFIGURATIONS
// =================================================================

// F4: Sample Clearance Analyzer Logic
const RISK_FACTORS = [
  { id: 'originality', label: '1. Source Popularity', description: 'Famous track = high scrutiny.', options: [{ text: 'Mainstream hit.', score: 40, color: 'bg-red-500' }, { text: 'Niche/known track.', score: 20, color: 'bg-yellow-500' }, { text: 'Obscure/library track.', score: 5, color: 'bg-green-500' }] },
  { id: 'length', label: '2. Sample Length', description: 'Over 3 seconds or 4 bars is substantial.', options: [{ text: 'Substantial (>6 seconds).', score: 35, color: 'bg-red-500' }, { text: 'Moderate (3-6 seconds).', score: 15, color: 'bg-yellow-500' }, { text: 'Minimal (<2 seconds).', score: 0, color: 'bg-green-500' }] },
  { id: 'manipulation', label: '3. Sample Manipulation', description: 'Heavy alteration reduces claim, but doesn\'t eliminate it.', options: [{ text: 'Untouched loop.', score: 25, color: 'bg-red-500' }, { text: 'Pitched, chopped.', score: 10, color: 'bg-yellow-500' }, { text: 'Unrecognizable.', score: 0, color: 'bg-green-500' }] },
  { id: 'usage', label: '4. Sample Usage', description: 'If it\'s the main hook, risk is high.', options: [{ text: 'Main hook/chorus.', score: 30, color: 'bg-red-500' }, { text: 'Background layer.', score: 15, color: 'bg-yellow-500' }, { text: 'One-shot FX.', score: 5, color: 'bg-green-500' }] },
  { id: 'commercial', label: '5. Release Type', description: 'Commercial intent is the primary trigger for legal action.', options: [{ text: 'Major commercial release.', score: 40, color: 'bg-red-500' }, { text: 'Independent/mixtape release.', score: 20, color: 'bg-yellow-500' }, { text: 'Non-profit, free release.', score: 0, color: 'bg-green-500' }] },
];
const RISK_THRESHOLDS = { LOW: 40, MEDIUM: 85 };

// Mock Data for The Culture Feed (Gist)
const initialNewsItems = [
  { type: 'GIST', icon: Zap, title: 'Wizkid’s New Album Leak: Producers Scramble to Secure Master Splits', date: 'Just now', color: 'text-red-500', metric: 'RISK ALERT' },
  { type: 'NEW MUSIC', icon: Music, title: 'DAWIE’s Pick: Rema drops genre-bending new single “Bounce Back”', date: '30 min ago', color: 'text-green-500', metric: 'HOOK: 5.2s' },
  { type: 'SPOTLIGHT', icon: Users, title: 'Rising Star: Tems\' engineer reveals her secret recording workflow', date: '1 hr ago', color: 'text-yellow-500', metric: 'Vocal Stack' },
  { type: 'GIST', icon: TrendingUp, title: 'TurnTable Charts: Amapiano reigns supreme for 5th consecutive week', date: '2 hr ago', color: 'text-blue-500', metric: 'Tempo Trend' },
];

// =================================================================
// 2. FEATURE COMPONENTS
// =================================================================

// F4 Component (Sample Clearance Analyzer)
const SampleClearanceAnalyzer = () => {
  const [answers, setAnswers] = useState(() => RISK_FACTORS.reduce((acc, factor) => { acc[factor.id] = null; return acc; }, {}));
  const [expandedFactor, setExpandedFactor] = useState(RISK_FACTORS[0].id);

  const totalScore = useMemo(() => Object.values(answers).reduce((sum, score) => sum + (score || 0), 0), [answers]);
  const allAnswered = useMemo(() => Object.values(answers).every(score => score !== null), [answers]);

  const riskResult = useMemo(() => {
    if (!allAnswered) return { level: 'Incomplete', icon: BarChart3, color: 'text-gray-500', message: 'Answer all questions to get your risk analysis.', background: 'bg-gray-100' };
    if (totalScore <= RISK_THRESHOLDS.LOW) return { level: 'LOW RISK', icon: CheckCircle, color: 'text-green-500', message: 'Low risk. Document your process thoroughly.', background: 'bg-green-100' };
    if (totalScore <= RISK_THRESHOLDS.MEDIUM) return { level: 'MEDIUM RISK', icon: AlertTriangle, color: 'text-yellow-500', message: 'Medium risk. Seek permission or re-create the part.', background: 'bg-yellow-100' };
    return { level: 'HIGH RISK', icon: XCircle, color: 'text-red-500', message: 'STOP. Highly likely to result in a copyright claim.', background: 'bg-red-100' };
  }, [allAnswered, totalScore]);

  const handleSelect = (factorId, score) => {
    setAnswers(prev => ({ ...prev, [factorId]: score }));
    const currentIndex = RISK_FACTORS.findIndex(f => f.id === factorId);
    if (currentIndex < RISK_FACTORS.length - 1) setExpandedFactor(RISK_FACTORS[currentIndex + 1].id);
    else setExpandedFactor(null);
  };
  const handleReset = () => { setAnswers(RISK_FACTORS.reduce((acc, factor) => { acc[factor.id] = null; return acc; }, {})); setExpandedFactor(RISK_FACTORS[0].id); };
  const toggleExpand = (factorId) => setExpandedFactor(expandedFactor === factorId ? null : factorId);
  const IconComponent = riskResult.icon;

  return (
    <div className="p-4 sm:p-6 bg-white rounded-xl shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
        <AlertTriangle className="w-5 h-5 mr-2 text-red-500"/>
        Sample Clearance Risk Analyzer (F4)
      </h3>

      <div className={`p-4 rounded-lg ${riskResult.background} mb-4`}>
        <div className="flex items-center space-x-3">
          <IconComponent className={`w-6 h-6 ${riskResult.color}`}/>
          <div>
            <p className="text-sm font-semibold uppercase text-gray-700">DAWIE Risk Status:</p>
            <p className={`text-xl font-bold ${riskResult.color}`}>{riskResult.level}</p>
          </div>
          {allAnswered && <span className="ml-auto text-sm font-bold text-gray-700">Score: {totalScore} / 170</span>}
        </div>
      </div>

      <div className="space-y-2">
        {RISK_FACTORS.map((factor) => (
          <div key={factor.id} className="border border-gray-200 rounded-md">
            <div
              className={`p-3 cursor-pointer flex justify-between items-center ${answers[factor.id] !== null ? 'bg-indigo-50 border-l-4 border-indigo-500' : 'hover:bg-gray-50'}`}
              onClick={() => toggleExpand(factor.id)}
            >
              <span className="font-semibold text-sm text-gray-800">{factor.label}</span>
              {expandedFactor === factor.id ? <ChevronUp className="w-4 h-4 text-indigo-600"/> : <ChevronDown className="w-4 h-4 text-gray-400"/>}
            </div>

            {expandedFactor === factor.id && (
              <div className="p-3 border-t border-gray-200 bg-white space-y-1">
                {factor.options.map((option, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelect(factor.id, option.score)}
                    className={`w-full text-left p-2 rounded-md border flex justify-between items-center text-xs
                      ${answers[factor.id] === option.score ? 'border-indigo-600 bg-indigo-100 font-semibold' : 'border-gray-200 hover:bg-gray-50'}`}
                  >
                    <span>{option.text}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {allAnswered && (
        <button onClick={handleReset} className="w-full mt-4 py-2 bg-indigo-600 text-white text-sm font-semibold rounded-lg hover:bg-indigo-700">
          Reset Analysis
        </button>
      )}
    </div>
  );
};

// F3 Placeholder component with promotion
const HookTimelineToolPromotion = ({ setCurrentPage }) => {
    return (
        <div className="p-4 bg-gray-900 text-white rounded-xl shadow-lg border border-indigo-600">
            <div className="flex items-center space-x-3 mb-2">
                <Clock className="w-6 h-6 text-yellow-400" />
                <h3 className="text-xl font-bold">Hook Timeline Tool (F3)</h3>
            </div>
            <p className="text-gray-300 text-sm mb-4">
                **DAWIE's First Tool:** Analyze where your hook, drums, and bass drop in relation to the critical 7-second skip window. Engineer your streams!
            </p>
            <button
                className="w-full py-2 bg-yellow-500 text-gray-900 font-bold rounded-lg hover:bg-yellow-400 transition duration-150 shadow-md"
                // In a real app, this would render F3 or navigate. For now, it stays a promo.
                onClick={() => alert("Hook Timeline Tool (F3) - Ready for development in The Lab!")} 
            >
                Launch Hook Tool (F3)
            </button>
        </div>
    );
};

// F5 Placeholder component with pre-promotion
const VocalAnalyzerPromotion = () => {
    return (
        <div className="p-4 bg-gray-100 rounded-xl shadow-lg border border-gray-300">
            <div className="flex items-center space-x-3 mb-2">
                <Users className="w-6 h-6 text-indigo-600" />
                <h3 className="text-xl font-bold text-gray-900">Vocal Performance Analyzer (F5)</h3>
            </div>
            <p className="text-gray-700 text-sm mb-4">
                **PRE-LAUNCH HYPE:** The first tool for artists. Analyze vocal clarity, timing deviation (ms), and dynamic range consistency against chart standards.
            </p>
            <button
                className="w-full py-2 bg-indigo-600 text-white font-bold rounded-lg opacity-70 cursor-not-allowed"
                disabled
            >
                Pre-Register for Early Access
            </button>
        </div>
    )
}

// Culture Feed Component with News Analysis Card
const CultureFeed = ({ setCurrentPage }) => {
  const newsItems = initialNewsItems;

  // The critical feature: A card that ties the news to a tool (F4)
  const NewsAnalysisCard = () => (
    <div className="bg-indigo-600 text-white p-5 rounded-xl shadow-xl mb-6">
      <div className="flex items-center mb-3">
        <Microscope className="w-6 h-6 mr-2 text-yellow-300"/>
        <h2 className="text-lg font-bold">DAWIE ANALYSIS: The Wizkid Gist</h2>
      </div>
      <p className="text-indigo-100 text-sm mb-4">
        The master splits leak is a massive legal warning. **DAWIE says** never rely on trust when money is involved. We predict 90% of producers fail the legal check.
      </p>
      <button
        onClick={() => setCurrentPage('lab')}
        className="w-full py-2 bg-white text-indigo-700 font-bold rounded-lg hover:bg-gray-100 transition duration-150 flex items-center justify-center text-sm shadow-md"
      >
        <AlertTriangle className="w-4 h-4 mr-2"/>
        DAWIE Wants You To Check YOUR Risk Now (F4)
      </button>
    </div>
  );

  return (
    <div className="p-4 sm:p-6">
      <h2 className="text-2xl font-extrabold text-gray-900 mb-4 flex items-center">
        <Newspaper className="w-6 h-6 mr-2 text-indigo-600"/>
        The Culture Feed & Gist
      </h2>

      <NewsAnalysisCard />

      <div className="space-y-4">
        {newsItems.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div key={index} className="bg-white p-4 rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition duration-200">
              <div className="flex items-start space-x-3">
                <IconComponent className={`w-6 h-6 mt-1 ${item.color}`} />
                <div className="flex-1">
                  <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">{item.type}</span>
                  <h3 className="text-lg font-bold text-gray-900 mt-0.5">{item.title}</h3>
                  <p className="text-sm text-gray-500 mt-1 flex items-center">
                    <Clock className="w-3 h-3 mr-1"/>
                    {item.date}
                  </p>
                </div>
                <div className="text-right flex-shrink-0">
                  <span className="text-xs font-bold px-3 py-1 bg-gray-200 rounded-full text-gray-700">
                    {item.metric}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <button className="w-full mt-6 py-3 bg-indigo-50 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-100 transition duration-150">
        Load More Gist & Stories
      </button>
    </div>
  );
};


// The Lab Component
const TheLab = ({ setCurrentPage }) => (
    <div className="p-4 sm:p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Microscope className="w-6 h-6 mr-2 text-indigo-600"/>
            The Lab: Producer & Artist Tools
        </h2>

        {/* Tool List / Promos */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <HookTimelineToolPromotion setCurrentPage={setCurrentPage} />
            <VocalAnalyzerPromotion />
        </div>

        {/* Current Live Tool (F4) */}
        <SampleClearanceAnalyzer />
    </div>
);


// =================================================================
// 3. MAIN APPLICATION (App Component)
// =================================================================

const App = () => {
  const [currentPage, setCurrentPage] = useState('feed'); // 'feed' or 'lab'

  const NavItem = ({ name, icon: Icon, pageKey }) => (
    <button
      onClick={() => setCurrentPage(pageKey)}
      className={`flex flex-col items-center justify-center p-2 sm:p-3 rounded-xl transition duration-200 w-1/2 sm:w-auto
        ${currentPage === pageKey ? 'text-indigo-600 bg-indigo-50 font-bold shadow-inner' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-100'}`}
    >
      <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
      <span className="text-xs sm:text-sm mt-1 leading-none">{name}</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-50 font-inter">
      {/* Header */}
      <header className="bg-gray-900 text-white shadow-lg p-4 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight flex items-center">
            <Sparkles className="w-6 h-6 mr-1.5 text-yellow-400"/>
            AFROWURLDSTAR
          </h1>
          <span className="text-sm text-gray-400 hidden sm:block">Culture, Commerce, Code.</span>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-4xl mx-auto pb-20">
        {/* Navigation Tabs (Hidden on small screens, using bottom bar) */}
        <div className="hidden sm:flex bg-white p-4 sticky top-[64px] z-10 border-b border-gray-200 justify-center space-x-4">
          <NavItem name="The Culture Feed" icon={Newspaper} pageKey="feed" />
          <NavItem name="The Lab (Tools)" icon={Microscope} pageKey="lab" />
        </div>

        {/* Dynamic Content */}
        {currentPage === 'feed' && <CultureFeed setCurrentPage={setCurrentPage} />}
        {currentPage === 'lab' && <TheLab setCurrentPage={setCurrentPage} />}
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl sm:hidden z-20">
        <div className="flex justify-around py-2">
          <NavItem name="Gist" icon={Newspaper} pageKey="feed" />
          <NavItem name="The Lab" icon={Microscope} pageKey="lab" />
        </div>
      </nav>
    </div>
  );
};

export default App;
    
