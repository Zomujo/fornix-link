'use client';

import { ArrowRight, Star, Loader2, Quote, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { JSX, useEffect, useMemo, useState } from 'react';
import { ILandingPageReview } from '@/types/review.interface';
import { useAppDispatch } from '@/lib/hooks';
import { getLandingPageReviews } from '@/lib/features/reviews/reviewsThunk';
import { showErrorToast } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { StarRating } from '@/components/ui/starRating';
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
    <section className="overflow-hidden bg-slate-50 py-24 lg:py-32">
      <div className="container mx-auto max-w-7xl px-4">
        <div className="mb-24 text-center">
          <span className="mb-4 inline-block rounded-full bg-slate-200/50 px-5 py-2 text-sm font-bold tracking-wide text-slate-700">
            Platform Features
          </span>
          <h2 className="mb-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl md:text-6xl">
            Solutions for Everyone
          </h2>
          <p className="mx-auto max-w-2xl text-xl text-slate-500">
            Whether you&apos;re a patient seeking care or a healthcare provider, our platform has
            the tools you need to succeed.
          </p>
        </div>

        {/* ZIG-ZAG LAYOUT */}
        <div className="mb-32 flex flex-col gap-32">
          {/* Row 1: For Patients */}
          <div className="flex flex-col items-center gap-16 lg:flex-row lg:gap-24">
            <div className="text-left lg:w-1/2">
              <div className="mb-6 text-sm font-bold tracking-wider text-teal-600 uppercase">
                Patient Experience
              </div>
              <h3 className="mb-6 text-4xl leading-tight font-extrabold text-slate-900 lg:text-5xl">
                Your health data, <br />
                <span className="text-teal-600">secure and accessible.</span>
              </h3>
              <p className="mb-8 text-xl leading-relaxed text-slate-600">
                Connect with top healthcare providers, book verified doctors instantly, and securely
                manage your entire medical history in one place.
              </p>

              <ul className="mb-10 space-y-5">
                {[
                  'Book verified doctors instantly',
                  'HD video consultations from home',
                  'Secure digital prescriptions',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-lg font-medium text-slate-700">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-teal-100 text-teal-700 shadow-sm">
                      ✓
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/search"
                className="inline-flex items-center gap-3 rounded-full bg-teal-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-teal-600/20 transition-transform hover:scale-105"
              >
                Find a Doctor <ArrowRight className="h-5 w-5" />
              </Link>
            </div>

            {/* CSS Mockup: Patient View */}
            <div className="relative w-full lg:w-1/2">
              <div className="absolute inset-0 translate-x-10 translate-y-10 rounded-full bg-teal-200/30 blur-[100px]"></div>
              <div className="relative rounded-[3rem] border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200/50">
                <div className="mb-8 flex items-center justify-between">
                  <div className="h-8 w-32 rounded-lg bg-slate-100"></div>
                  <div className="h-10 w-10 rounded-full bg-teal-50"></div>
                </div>
                {/* Doctor Profile Mockup */}
                <div className="mb-6 flex items-center gap-6 rounded-2xl border border-slate-100 bg-slate-50 p-6">
                  <div className="h-20 w-20 shrink-0 rounded-full bg-teal-100"></div>
                  <div className="flex-1">
                    <div className="mb-2 flex items-center gap-2">
                      <div className="h-5 w-40 rounded-md bg-slate-800"></div>
                      <CheckCircle className="h-5 w-5 text-teal-500" />
                    </div>
                    <div className="mb-3 h-3 w-24 rounded bg-slate-400"></div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                  </div>
                </div>
                {/* Available Slots */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="rounded-xl border border-teal-100 bg-teal-50 p-4 text-center font-bold text-teal-700">
                    09:00 AM
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center font-bold text-slate-500">
                    10:30 AM
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4 text-center font-bold text-slate-500">
                    02:00 PM
                  </div>
                </div>
                <div className="mt-6 h-14 w-full rounded-2xl bg-teal-600 shadow-lg shadow-teal-600/20"></div>
              </div>
            </div>
          </div>

          {/* Row 2: For Providers */}
          <div className="flex flex-col-reverse items-center gap-16 lg:flex-row lg:gap-24">
            {/* CSS Mockup: Provider View */}
            <div className="relative w-full lg:w-1/2">
              <div className="absolute inset-0 -translate-x-10 translate-y-10 rounded-full bg-blue-200/30 blur-[100px]"></div>
              <div className="relative rounded-[3rem] border border-slate-100 bg-white p-8 shadow-2xl shadow-slate-200/50">
                <div className="mb-8 flex items-center justify-between border-b border-slate-100 pb-6">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-blue-600"></div>
                    <div className="h-6 w-32 rounded-md bg-slate-800"></div>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-slate-100"></div>
                </div>
                <div className="mb-6 grid grid-cols-2 gap-4">
                  {/* Metric 1 */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                      <TrendingUp className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="mb-2 h-3 w-20 rounded bg-slate-400"></div>
                    <div className="h-8 w-16 rounded bg-slate-800"></div>
                  </div>
                  {/* Metric 2 */}
                  <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                    <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100">
                      <Calendar className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="mb-2 h-3 w-24 rounded bg-slate-400"></div>
                    <div className="h-8 w-20 rounded bg-slate-800"></div>
                  </div>
                </div>
                {/* List of patients */}
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 p-3"
                    >
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

            <div className="text-left lg:w-1/2">
              <div className="mb-6 text-sm font-bold tracking-wider text-blue-600 uppercase">
                Provider Tools
              </div>
              <h3 className="mb-6 text-4xl leading-tight font-extrabold text-slate-900 lg:text-5xl">
                Go independent, <br />
                <span className="text-blue-600">go completely digital.</span>
              </h3>
              <p className="mb-8 text-xl leading-relaxed text-slate-600">
                Seamless operations management to simplify scheduling, integrate billing, and track
                patient visits effortlessly.
              </p>

              <ul className="mb-10 space-y-5">
                {[
                  'Integrated billing & scheduling',
                  'Built-in telehealth platform',
                  'Zero upfront setup costs',
                ].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-lg font-medium text-slate-700">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-700 shadow-sm">
                
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <Link
                href="/for-providers"
                className="inline-flex items-center gap-3 rounded-full bg-blue-600 px-8 py-4 text-base font-bold text-white shadow-xl shadow-blue-600/20 transition-transform hover:scale-105"
              >
                Join the Network <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        {reviews.length > 0 && (
          <div className="relative mx-auto max-w-5xl rounded-[3rem] bg-white p-10 shadow-2xl shadow-slate-200/40 md:p-16">
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
                      <blockquote className="mx-auto mb-10 max-w-4xl text-3xl leading-snug font-extrabold text-slate-800 md:text-5xl">
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
                          <div className="flex flex-col items-center justify-center gap-2 sm:flex-row">
                            <h4 className="text-lg font-bold text-slate-900">{currentUser.name}</h4>
                            {currentReview.rating > 0 && (
                              <StarRating rating={currentReview.rating} size="sm" disabled />
                            )}
                          </div>
                          <p className="mt-1 text-sm font-medium tracking-wider text-slate-500 uppercase">
                            {currentUser.role}
                          </p>
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
