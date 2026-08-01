'use client';
import { JSX } from 'react';
import { Star } from 'lucide-react';

const REVIEWS = [
  {
    quote: "I found a pediatrician for my daughter at 11pm and we were seen the next morning. Lifesaver.",
    author: "Sarah O.",
    location: "Accra",
  },
  {
    quote: "No more driving around looking for a lab that does the specific test I need. Booked and done in 20 mins.",
    author: "Kwame A.",
    location: "Kumasi",
  },
];

const PatientReviews = (): JSX.Element => (
  <section className="bg-slate-50 py-24 md:py-32">
    <div className="container mx-auto px-4 md:px-8 max-w-6xl">
      <div className="mb-16 text-center">
        <span className="mb-4 inline-block rounded-full bg-teal-50 px-4 py-1.5 text-sm font-bold tracking-wide text-teal-700">
          What Patients Are Saying
        </span>
        <h2 className="mt-4 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Real stories from <span className="text-teal-600">real people</span>
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {REVIEWS.map((review, index) => (
          <div 
            key={index} 
            className="flex flex-col rounded-3xl bg-white p-8 md:p-10 shadow-sm border border-slate-100"
          >
            <div className="flex gap-1 mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            
            <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed mb-8 flex-1">
              &ldquo;{review.quote}&rdquo;
            </p>
            
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-teal-100 flex items-center justify-center text-teal-700 font-bold text-lg">
                {review.author.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-slate-900">{review.author}</p>
                <p className="text-slate-500 text-sm">{review.location}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default PatientReviews;
