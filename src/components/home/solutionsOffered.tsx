'use client';
import { ArrowRight, Star, Loader2, Quote, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { JSX, useEffect, useMemo, useState } from 'react';
import { ILandingPageReview } from '@/types/review.interface';
import { useAppDispatch } from '@/lib/hooks';
import { getLandingPageReviews } from '@/lib/features/reviews/reviewsThunk';
import { showErrorToast } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

const SolutionsOffered = (): JSX.Element => {
  const dispatch = useAppDispatch();
  const [reviews, setReviews] = useState<ILandingPageReview[]>([]);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);
  const [isLoadingReviews, setIsLoadingReviews] = useState(true);

  useEffect(() => {
    const fetchLandingPageReviews = async (): Promise<void> => {
      setIsLoadingReviews(true);
      const { payload } = await dispatch(getLandingPageReviews());
      if (payload && showErrorToast(payload)) {
        toast(payload);
        setIsLoadingReviews(false);
        return;
      }
      if (payload && Array.isArray(payload) && payload.length > 0) {
        setReviews(payload);
      }
      setIsLoadingReviews(false);
    };

    void fetchLandingPageReviews();
  }, [dispatch]);

  useEffect(() => {
    if (reviews.length > 1) {
      const interval = setInterval(() => {
        setCurrentReviewIndex((prev) => (prev + 1) % reviews.length);
      }, 6000);
      return (): void => clearInterval(interval);
    }
  }, [reviews.length]);

  const currentReview = reviews[currentReviewIndex];

  const getReviewUser = (review: ILandingPageReview): { name: string; role: string } => {
    if (review.patient) {
      return {
        name: `${review.patient.firstName} ${review.patient.lastName}`.trim(),
        role: 'Patient',
      };
    }
    if (review.doctor) {
      return {
        name: `${review.doctor.firstName} ${review.doctor.lastName}`.trim(),
        role: 'Doctor',
      };
    }
    return { name: 'Anonymous', role: 'User' };
  };

  const currentUser = useMemo(
    () => (currentReview ? getReviewUser(currentReview) : { name: 'Anonymous', role: 'User' }),
    [currentReview],
  );

  const getInitials = (name: string): string => {
    if (!name) {
      return 'U';
    }
    const words = name.trim().split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return name[0].toUpperCase();
  };

  return (
    <section className="bg-slate-50 py-24 lg:py-32 overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        
        <div className="mb-24 text-center">
          <span className="mb-4 inline-block rounded-full bg-slate-200/50 px-5 py-2 text-sm font-bold tracking-wide text-slate-700">
            Platform Features
          </span>
          <h2 className="mb-6 text-4xl font-extrabold text-slate-900 sm:text-5xl md:text-6xl tracking-tight">
            Solutions for Everyone
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-500">
            Whether you&apos;re a patient seeking care or a healthcare provider, our platform has
            the tools you need to succeed.
          </p>
        </div>

        {/* ZIG-ZAG LAYOUT */}
        <div className="flex flex-col gap-32 mb-32">
          
          {/* Row 1: For Patients */}
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">
            <div className="lg:w-1/2 text-left">
              <div className="mb-6 text-teal-600 font-bold uppercase tracking-wider text-sm">Patient Experience</div>
              <h3 className="mb-6 text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Your health data, <br/><span className="text-teal-600">secure and accessible.</span>
              </h3>
              <p className="mb-8 text-xl text-slate-600 leading-relaxed">
                Connect with top healthcare providers, book verified doctors instantly, and securely manage your entire medical history in one place.
              </p>
              
              <ul className="mb-10 space-y-5">
                {['Book verified doctors instantly', 'HD video consultations from home', 'Secure digital prescriptions'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg text-slate-700 font-medium">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-100 text-teal-700 shadow-sm shrink-0">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link href="/search" className="inline-flex items-center gap-3 rounded-full bg-teal-600 px-8 py-4 text-base font-bold text-white transition-transform hover:scale-105 shadow-xl shadow-teal-600/20">
                Find a Doctor <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
            
            {/* CSS Mockup: Patient View */}
            <div className="lg:w-1/2 w-full relative">
              <div className="absolute inset-0 bg-teal-200/30 blur-[100px] rounded-full translate-x-10 translate-y-10"></div>
              <div className="relative rounded-[3rem] bg-white p-8 shadow-2xl shadow-slate-200/50 border border-slate-100">
                <div className="flex items-center justify-between mb-8">
                  <div className="h-8 w-32 bg-slate-100 rounded-lg"></div>
                  <div className="h-10 w-10 bg-teal-50 rounded-full"></div>
                </div>
                {/* Doctor Profile Mockup */}
                <div className="flex items-center gap-6 rounded-2xl bg-slate-50 p-6 border border-slate-100 mb-6">
                  <div className="h-20 w-20 shrink-0 rounded-full bg-teal-100"></div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-5 w-40 rounded-md bg-slate-800"></div>
                      <CheckCircle className="h-5 w-5 text-teal-500" />
                    </div>
                    <div className="mb-3 h-3 w-24 rounded bg-slate-400"></div>
                    <div className="flex gap-1">
                      {[1,2,3,4,5].map(i => <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />)}
                    </div>
                  </div>
                </div>
                {/* Available Slots */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl bg-teal-50 border border-teal-100 p-4 text-center text-teal-700 font-bold">09:00 AM</div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-center text-slate-500 font-bold">10:30 AM</div>
                  <div className="rounded-xl bg-slate-50 border border-slate-100 p-4 text-center text-slate-500 font-bold">02:00 PM</div>
                </div>
                <div className="mt-6 h-14 w-full rounded-2xl bg-teal-600 shadow-lg shadow-teal-600/20"></div>
              </div>
            </div>
          </div>

          {/* Row 2: For Providers */}
          <div className="flex flex-col-reverse lg:flex-row items-center gap-16 lg:gap-24">
            {/* CSS Mockup: Provider View */}
            <div className="lg:w-1/2 w-full relative">
              <div className="absolute inset-0 bg-blue-200/30 blur-[100px] rounded-full -translate-x-10 translate-y-10"></div>
              <div className="relative rounded-[3rem] bg-white p-8 shadow-2xl shadow-slate-200/50 border border-slate-100">
                <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-6">
                  <div className="flex gap-3 items-center">
                    <div className="h-10 w-10 bg-blue-600 rounded-xl"></div>
                    <div className="h-6 w-32 bg-slate-800 rounded-md"></div>
                  </div>
                  <div className="h-8 w-8 bg-slate-100 rounded-full"></div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Metric 1 */}
                  <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                    <div className="mb-4 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="mb-2 h-3 w-20 rounded bg-slate-400"></div>
                    <div className="h-8 w-16 rounded bg-slate-800"></div>
                  </div>
                  {/* Metric 2 */}
                  <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                    <div className="mb-4 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="mb-2 h-3 w-24 rounded bg-slate-400"></div>
                    <div className="h-8 w-20 rounded bg-slate-800"></div>
                  </div>
                </div>
                {/* List of patients */}
                <div className="space-y-3">
                  {[1,2,3].map(i => (
                    <div key={i} className="flex items-center justify-between rounded-xl p-3 bg-slate-50 border border-slate-100">
                      <div className="flex items-center gap-4">
                        <div className="h-10 w-10 rounded-full bg-slate-200"></div>
                        <div className="h-4 w-24 rounded bg-slate-700"></div>
                      </div>
                      <div className="h-6 w-16 rounded-full bg-blue-100"></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:w-1/2 text-left">
              <div className="mb-6 text-blue-600 font-bold uppercase tracking-wider text-sm">Provider Tools</div>
              <h3 className="mb-6 text-4xl lg:text-5xl font-extrabold text-slate-900 leading-tight">
                Go independent, <br/><span className="text-blue-600">go completely digital.</span>
              </h3>
              <p className="mb-8 text-xl text-slate-600 leading-relaxed">
                Seamless operations management to simplify scheduling, integrate billing, and track patient visits effortlessly.
              </p>
              
              <ul className="mb-10 space-y-5">
                {['Integrated billing & scheduling', 'Built-in telehealth platform', 'Zero upfront setup costs'].map((item, i) => (
                  <li key={i} className="flex items-center gap-4 text-lg text-slate-700 font-medium">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-sm shrink-0">✓</div>
                    {item}
                  </li>
                ))}
              </ul>
              
              <Link href="/for-providers" className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white transition-transform hover:scale-105 shadow-xl shadow-blue-600/20">
                Join the Network <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
          
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="relative mx-auto max-w-5xl rounded-[3rem] bg-white p-10 md:p-16 shadow-2xl shadow-slate-200/40">
            <div className="absolute -top-6 -left-2 text-slate-100">
              <Quote className="h-32 w-32 rotate-180 opacity-50" />
            </div>

            {isLoadingReviews ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-10 w-10 animate-spin text-teal-500" />
              </div>
            ) : (
              <div className="relative z-10 text-center">
                <AnimatePresence mode="wait">
                  {currentReview && (
                    <motion.div
                      key={currentReviewIndex}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.4 }}
                    >
                      <blockquote className="mx-auto mb-10 max-w-4xl text-3xl font-extrabold leading-snug text-slate-800 md:text-5xl">
                        &ldquo;
                        {currentReview.comment ||
                          'An incredible platform that makes healthcare so much easier.'}
                        &rdquo;
                      </blockquote>
                      
                      <div className="flex flex-col items-center justify-center gap-4">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-900 text-xl font-bold text-white shadow-lg shadow-slate-900/20">
                          {getInitials(currentUser.name)}
                        </div>
                        <div>
                          <div className="flex items-center justify-center gap-2">
                            <h4 className="text-lg font-bold text-slate-900">{currentUser.name}</h4>
                            {currentReview.rating > 0 && (
                              <div className="flex items-center gap-1 rounded-full bg-yellow-50 px-2 py-0.5">
                                <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                                <span className="text-xs font-bold text-yellow-600">{currentReview.rating}.0</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm font-medium text-slate-500 uppercase tracking-wider mt-1">{currentUser.role}</p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {reviews.length > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-3">
                    {reviews.map((review, index) => {
                      const uniqueKey = `${review.comment?.substring(0, 10) || index}-${review.rating}`;
                      return (
                        <button
                          key={uniqueKey}
                          onClick={() => setCurrentReviewIndex(index)}
                          className={`h-3 rounded-full transition-all duration-300 ${
                            index === currentReviewIndex
                              ? 'w-12 bg-slate-900'
                              : 'w-3 bg-slate-200 hover:bg-slate-300'
                          }`}
                          aria-label={`Go to review ${index + 1}`}
                        />
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default SolutionsOffered;
