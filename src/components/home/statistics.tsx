import React, { JSX, useEffect, useState, useRef } from 'react';
import { useInView } from 'react-intersection-observer';

interface CountUpProps {
  end: number;
  suffix?: string;
  duration?: number;
  isVisible: boolean;
}

const CountUp = ({ end, suffix = '', duration = 2000, isVisible }: CountUpProps): JSX.Element => {
  const [count, setCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) {
      return;
    }

    hasAnimated.current = true;
    const startTime = Date.now();
    const startValue = 0;

    const animate = (): void => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);
      const currentCount = Math.floor(startValue + (end - startValue) * easeOutQuart);

      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    requestAnimationFrame(animate);
  }, [end, duration, isVisible]);

  const formatNumber = (num: number): string => num.toLocaleString('en-US');

  return (
    <span>
      {formatNumber(count)}
      {suffix}
    </span>
  );
};

interface CountUp24_7Props {
  duration?: number;
  isVisible: boolean;
}

const CountUp24_7 = ({ duration = 2000, isVisible }: CountUp24_7Props): JSX.Element => {
  const [firstCount, setFirstCount] = useState(0);
  const [secondCount, setSecondCount] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!isVisible || hasAnimated.current) {
      return;
    }

    hasAnimated.current = true;
    const startTime = Date.now();
    const firstEnd = 24;
    const secondEnd = 7;

    const animate = (): void => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      // Animate first number to 24
      const currentFirstCount = Math.floor(0 + (firstEnd - 0) * easeOutQuart);
      setFirstCount(currentFirstCount);

      // Animate second number to 7 (slightly delayed or together)
      const currentSecondCount = Math.floor(0 + (secondEnd - 0) * easeOutQuart);
      setSecondCount(currentSecondCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setFirstCount(firstEnd);
        setSecondCount(secondEnd);
      }
    };

    requestAnimationFrame(animate);
  }, [duration, isVisible]);

  return (
    <span>
      {firstCount}/{secondCount}
    </span>
  );
};

import { Activity, Clock, Users } from 'lucide-react';

const Statistics = (): JSX.Element => {
  const { ref, inView } = useInView({
    threshold: 0.2,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="bg-slate-50 py-24">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl md:text-5xl">
            Empowering the Future
            <br />
            of Healthcare in Africa
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-500">
            Connecting you directly to the care you need, powered by a platform that puts patients
            and doctors in control.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {/* Stat 1 */}
          <div className="group flex flex-col items-center rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/10">
            <div className="mb-4 rounded-2xl bg-teal-50 p-3 text-teal-600 transition-colors group-hover:bg-teal-100">
              <Clock className="h-7 w-7" />
            </div>
            <div className="mb-3 bg-gradient-to-r from-teal-600 to-emerald-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
              <CountUp24_7 duration={2000} isVisible={inView} />
            </div>
            <p className="text-center text-sm leading-relaxed font-medium text-slate-500">
              Access healthcare specialists
              <br />
              anytime, anywhere
            </p>
          </div>

          {/* Stat 2 */}
          <div className="group flex flex-col items-center rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/10">
            <div className="mb-4 rounded-2xl bg-emerald-50 p-3 text-emerald-600 transition-colors group-hover:bg-emerald-100">
              <Users className="h-7 w-7" />
            </div>
            <div className="mb-3 bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
              <CountUp end={1000} suffix="+" duration={2000} isVisible={inView} />
            </div>
            <p className="text-center text-sm leading-relaxed font-medium text-slate-500">
              Empowered
              <br />
              Clients
            </p>
          </div>

          {/* Stat 3 */}
          <div className="group flex flex-col items-center rounded-3xl border border-slate-200/60 bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-teal-500/10">
            <div className="mb-4 rounded-2xl bg-cyan-50 p-3 text-cyan-600 transition-colors group-hover:bg-cyan-100">
              <Activity className="h-7 w-7" />
            </div>
            <div className="mb-3 bg-gradient-to-r from-cyan-600 to-teal-500 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent">
              <CountUp end={150} duration={2000} isVisible={inView} />
            </div>
            <p className="text-center text-sm leading-relaxed font-medium text-slate-500">
              Expert
              <br />
              Collaborations
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statistics;
