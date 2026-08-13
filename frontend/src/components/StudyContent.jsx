import React, { useState } from 'react';
import { parseStudyContent } from '../utils/formatters';
import { 
  AlertCircle, 
  Lightbulb, 
  BookOpen, 
  AlertTriangle, 
  HelpCircle, 
  Activity, 
  Video, 
  Columns, 
  Eye, 
  ExternalLink 
} from 'lucide-react';
import { api } from '../api/api';

export default function StudyContent({ material, imagePath }) {
  const [imageError, setImageError] = useState(false);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isCompareMode, setIsCompareMode] = useState(false);
  const [failedImages, setFailedImages] = useState({});

  if (!material) {
    return (
      <div className="bg-white rounded-2xl p-8 border border-slate-100 shadow-sm text-center">
        <p className="text-slate-500 font-medium font-display">No study materials available for this topic.</p>
      </div>
    );
  }

  const handleImageError = (idx) => {
    setFailedImages(prev => ({ ...prev, [idx]: true }));
  };

  // Build the list of images, prioritizing the new dynamic backend directory scanning,
  // falling back to legacy video fallback path if none are found.
  const imageList = (material.images && material.images.length > 0)
    ? material.images.map(path => path.startsWith('http') ? path : `${api.baseUrl}/${path}`)
    : (imagePath && !imagePath.toLowerCase().endsWith('.mp4') ? [imagePath.startsWith('http') ? imagePath : `./${imagePath}`] : []);

  const isVideo = imagePath && imagePath.toLowerCase().endsWith('.mp4') && (!material.images || material.images.length === 0);

  const sections = parseStudyContent(material.content);

  // Helper to determine the header styling & icon based on section title
  const getSectionDecoration = (title) => {
    switch (title) {
      case 'Formula':
      case 'Meaning of Symbols':
        return {
          cardClass: 'border-l-4 border-l-physics-formula border-slate-100 bg-white shadow-sm',
          headerClass: 'text-physics-formula font-semibold',
          icon: Activity
        };
      case 'Board Exam Tip':
        return {
          cardClass: 'bg-indigo-50/60 border border-indigo-100/80 shadow-sm shadow-indigo-100/20',
          headerClass: 'text-indigo-600 font-bold',
          icon: Lightbulb
        };
      case 'Common Mistake':
        return {
          cardClass: 'bg-red-50/50 border border-red-100/80 shadow-sm shadow-red-100/10',
          headerClass: 'text-red-600 font-bold',
          icon: AlertTriangle
        };
      case 'Simple Explanation':
      case 'What is happening in the image':
        return {
          cardClass: 'border-l-4 border-l-primary-500 border-slate-100 bg-primary-50/30 shadow-sm shadow-slate-100/20',
          headerClass: 'text-primary-600 font-bold',
          icon: BookOpen
        };
      case 'Video Reference Link':
        return {
          cardClass: 'bg-violet-50/50 border border-violet-100 shadow-sm shadow-violet-100/10',
          headerClass: 'text-violet-600 font-bold',
          icon: Video
        };
      default:
        return {
          cardClass: 'border border-slate-100 bg-white shadow-sm',
          headerClass: 'text-slate-700 font-semibold',
          icon: HelpCircle
        };
    }
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      {/* 1. Topic Media Display */}
      <div className="bg-white p-5 rounded-2xl border border-slate-100 space-y-4" style={{ boxShadow: '0 2px 12px -4px rgba(15,23,42,0.06)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-50 pb-3">
          <div>
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest font-display">Topic Visual</h4>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Interact with concept diagrams and visual aids.</p>
          </div>
          
          {/* Controls if multiple images exist */}
          {imageList.length > 1 && (
            <div className="flex flex-wrap items-center gap-2">
              <div className="flex bg-slate-100 p-1 rounded-xl">
                {imageList.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActiveImageIdx(idx);
                      setIsCompareMode(false);
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold font-display transition-all ${
                      activeImageIdx === idx && !isCompareMode
                        ? 'bg-white text-primary-600 shadow-sm'
                        : 'text-slate-500 hover:text-slate-700'
                    }`}
                  >
                    Image {idx + 1}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => setIsCompareMode(!isCompareMode)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold font-display transition-all ${
                  isCompareMode
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/10'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200/60'
                }`}
              >
                <Columns className="w-3.5 h-3.5" />
                <span>{isCompareMode ? 'Single View' : 'Compare'}</span>
              </button>
            </div>
          )}
        </div>

        {/* Media Content Container */}
        {isVideo ? (
          <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
            <video
              src={imagePath.startsWith('http') ? imagePath : `./${imagePath}`}
              controls
              className="w-full max-h-[430px] rounded-xl bg-black"
            />
          </div>
        ) : imageList.length > 0 ? (
          isCompareMode && imageList.length > 1 ? (
            /* Split / Compare View Grid */
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {imageList.map((imgUrl, idx) => (
                <div key={idx} className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50/50 flex flex-col items-center justify-center p-3">
                  <div className="w-full flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-display">Image {idx + 1}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-500 rounded-full font-display">Visual Aid</span>
                  </div>
                  {!failedImages[idx] ? (
                    <img
                      src={imgUrl}
                      alt={`${material.title} Visual ${idx + 1}`}
                      onError={() => handleImageError(idx)}
                      className="w-full max-h-[350px] object-contain rounded-lg hover:scale-[1.01] transition-transform duration-300"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 bg-slate-100/50 rounded-lg min-h-[200px] w-full text-center">
                      <AlertCircle className="w-8 h-8 text-slate-300 mb-1" />
                      <p className="text-xs font-semibold text-slate-500">Image {idx + 1} failed to load.</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            /* Single Image View */
            <div className="relative overflow-hidden rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center">
              {!failedImages[activeImageIdx] ? (
                <img
                  src={imageList[activeImageIdx]}
                  alt={`${material.title} Visual`}
                  onError={() => handleImageError(activeImageIdx)}
                  className="w-full max-h-[430px] object-contain rounded-xl hover:scale-[1.01] transition-transform duration-300"
                />
              ) : (
                <div className="flex flex-col items-center justify-center p-12 bg-slate-50 border border-dashed border-slate-200 rounded-xl min-h-[220px] w-full">
                  <AlertCircle className="w-10 h-10 text-slate-300 stroke-[1.5] mb-2" />
                  <p className="text-sm font-semibold text-slate-500 font-display">Visual failed to load.</p>
                  <p className="text-xs text-slate-400 font-medium mt-1">Please check your network or files configuration.</p>
                </div>
              )}
            </div>
          )
        ) : (
          /* Empty / Fallback State */
          <div className="flex flex-col items-center justify-center p-8 bg-slate-50 border border-dashed border-slate-200 rounded-xl min-h-[200px]">
            <AlertCircle className="w-10 h-10 text-slate-300 stroke-[1.5] mb-2 animate-bounce" />
            <p className="text-sm font-semibold text-slate-500 font-display">Topic media will be added soon.</p>
            <p className="text-xs text-slate-400 font-medium mt-1">We are updating visual/video schematics for this topic.</p>
          </div>
        )}
      </div>

      {/* 2. Structured Study Sections */}
      <div className="space-y-6">
        {sections.filter(s => s.title !== 'Video Reference Link').map((section, index) => {
          const { cardClass, headerClass, icon: Icon } = getSectionDecoration(section.title);

          return (
            <div 
              key={index}
              className={`p-6 rounded-2xl transition-all duration-200 ${cardClass}`}
            >
              {/* Section Header */}
              <div className="flex items-center gap-2.5 mb-4">
                <div className={`p-2 rounded-xl flex items-center justify-center ${
                  section.title === 'Formula' ? 'bg-orange-50 text-orange-500' :
                  section.title === 'Board Exam Tip' ? 'bg-indigo-50 text-indigo-500' :
                  section.title === 'Common Mistake' ? 'bg-red-50 text-red-500' :
                  section.title === 'Video Reference Link' ? 'bg-red-50 text-red-500' :
                  'bg-primary-50 text-primary-500'
                }`}>
                  <Icon className="w-4 h-4" />
                </div>
                <h4 className={`text-base font-bold font-display tracking-tight ${headerClass}`}>
                  {section.title}
                </h4>
              </div>

              {/* Render lists (e.g. Important Points, Applications, Real-life Examples) */}
              {section.isList ? (
                <div className="grid gap-3 sm:grid-cols-1 md:grid-cols-2">
                  {section.items.map((item, idx) => (
                    <div 
                      key={idx} 
                      className={`p-4 rounded-xl border flex items-start gap-3 shadow-none hover:shadow-sm hover:border-slate-200 transition-all duration-200 ${
                        section.title === 'Common Mistake'
                          ? 'bg-white border-red-100/60'
                          : section.title === 'Important Points'
                            ? 'bg-slate-50/50 border-slate-100'
                            : 'bg-white border-slate-100'
                      }`}
                    >
                      <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        section.title === 'Common Mistake'
                          ? 'bg-red-100 text-red-600'
                          : 'bg-primary-50 text-primary-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <p className="text-sm font-medium text-slate-600 leading-relaxed pt-0.5">
                        {item}
                      </p>
                    </div>
                  ))}
                </div>
              ) : section.title === 'Formula' ? (
                /* Specialized display for formulas — dark code-block style */
                <div className="rounded-xl overflow-hidden">
                  <div className="px-4 py-2 flex items-center gap-2" style={{ background: '#1e293b' }}>
                    <div className="flex gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
                      <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
                    </div>
                    <span className="text-[10px] font-mono font-bold text-slate-500 ml-1">formula.physics</span>
                  </div>
                  <div className="px-6 py-5 flex items-center justify-center" style={{ background: '#0f172a' }}>
                    <div className="font-mono text-2xl font-bold tracking-wider text-center"
                      style={{ color: '#fb923c', textShadow: '0 0 20px rgba(251,146,60,0.4)' }}>
                      {section.rawText}
                    </div>
                  </div>
                </div>
              ) : section.title === 'Video Reference Link' ? (
                /* Handled by dedicated Reference URL card below */
                null
              ) : (
                /* Regular Text content */
                <p className="text-sm font-medium text-slate-600 leading-relaxed whitespace-pre-line">
                  {section.rawText}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {/* 3. Reference URL Link */}
      {material.reference_url && (
        <div className="bg-white border border-slate-100 p-5 rounded-2xl shadow-sm flex items-start sm:items-center gap-3.5 mt-6 hover:border-slate-200 transition-all">
          <div className="w-10 h-10 rounded-full bg-violet-50 text-violet-500 flex items-center justify-center shrink-0">
            <Video className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h5 className="text-sm font-bold text-slate-700 font-display">Video Reference Link</h5>
            <a
              href={material.reference_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-primary-600 hover:text-primary-700 hover:underline break-all transition-colors"
            >
              <span>
                {material.chapter_id === 2 || (material.video_path && material.video_path.toLowerCase().includes('chapter_2')) || (material.reference_url && material.reference_url.toLowerCase().includes('chapter_2'))
                  ? 'Electrostatic Potential & Capacitance 🔋'
                  : material.chapter_id === 1 || (material.video_path && material.video_path.toLowerCase().includes('chapter_1')) || (material.reference_url && material.reference_url.toLowerCase().includes('chapter_1'))
                    ? 'Electric Charges & Fields⚡'
                    : material.reference_url
                }
              </span>
              <ExternalLink className="w-3.5 h-3.5 shrink-0" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
