import { useState, useEffect, useRef } from 'react';
import { TestCountries } from '@/utils/countries';
import MapTooltips from '../ui/map-tooltips';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import jsonData from '@/data/countries.json';
gsap.registerPlugin(ScrollTrigger);

const items = [
  { count: 10, title: 'countries', progress: 0 },
  { count: 200, title: 'churches', progress: 50 },
  { count: 25, title: 'years', progress: 100 },
];

export function Map() {
  const [currentState, setCurrentState] = useState('countries');
  const sectionRef = useRef(null);
  const progressBarRef = useRef(null);
  const maxBarHeight = 375;
  const intervalDuration = 5;

  useEffect(() => {
    let currentIndex = 0;

    const updateProgressBar = () => {
      const nextIndex = (currentIndex + 1) % items.length;

      const nextItem = items[nextIndex];

      const isReturningToStart = currentIndex === items.length - 1 && nextIndex === 0;

      if (window.innerWidth > 768) {
        if (isReturningToStart) {
          gsap.set(progressBarRef.current, { height: 0, width: '3px' });
        } else {
          gsap.to(progressBarRef.current, {
            height: `${(nextIndex / (items.length - 1)) * maxBarHeight}px`,
            width: '3px',
            duration: intervalDuration,
            ease: 'linear',
          });
        }
      } else {
        if (isReturningToStart) {
          gsap.set(progressBarRef.current, { width: 0, height: '3px' });
        } else {
          gsap.to(progressBarRef.current, {
            width: `${nextItem.progress}%`,
            height: '3px',
            duration: intervalDuration,
            ease: 'linear',
          });
        }
      }

      gsap.delayedCall(isReturningToStart ? 0.1 : intervalDuration, () => {
        setCurrentState(nextItem.title);
        currentIndex = nextIndex;
      });
    };

    const interval = setInterval(updateProgressBar, intervalDuration * 1000);
    updateProgressBar(); // Start the first iteration immediately

    return () => {
      clearInterval(interval);
      gsap.killTweensOf(progressBarRef.current);
    };
  }, []);

  return (
    <section className="map container pt-20 md:pt-[120px]" id="eastern" ref={sectionRef}>
      <div className="relative mb-10 flex h-[900px] w-full flex-col md:h-[950px] lg:flex-row xl:h-auto">
        <div className="z-20 max-w-4xl">
          <div className="mb-10">
            <h2 className="mb-6 text-[29px] leading-[38px] md:mb-10 md:text-2xl xl:text-3xl">
              Starting Churches in the Nations of <span className="text-gray-3">Eastern Europe</span>
            </h2>
            <p className="mb-4 max-w-[605px] text-sm sm:text-base">
              Albania, Bosnia, Bulgaria, Croatia, Czech Republic, Hungary, Poland, Romania, Serbia, Slovakia and Slovenia already have new churches with God's help through CMI.
            </p>
            <a href="/countries" className="text-[18px] font-medium text-black underline decoration-2 underline-offset-4">
              Learn more
            </a>
          </div>
          <div className="relative z-20">
            <div className="absolute left-0 top-0 h-[3px] w-full bg-gray-300 lg:top-12 lg:h-[375px] lg:w-[3px]"></div>
            <div className="absolute left-0 top-0 h-[3px] overflow-x-hidden bg-black lg:top-12 lg:h-0 lg:w-[3px]" ref={progressBarRef}></div>
            <ol className="relative flex justify-between lg:z-0 lg:flex-col lg:gap-10 lg:pl-14">
              {items.map((item, index) => (
                <li
                  key={index}
                  className={`relative z-20 w-fit pt-10 transition-colors after:absolute after:-top-[7px] after:size-4 after:-translate-x-1/2 after:rounded-full last:after:left-full lg:pt-0 lg:after:-left-[55px] lg:after:-top-[5px] lg:first:after:top-10 lg:last:after:-left-[55px] lg:last:after:top-10 [&:nth-child(2)]:after:left-1/2 lg:[&:nth-child(2)]:after:-left-[55px] lg:[&:nth-child(2)]:after:top-12 ${
                    currentState === item.title ? 'text-black after:bg-black' : 'text-gray-1 after:bg-gray-1'
                  }`}>
                  <div className="flex flex-col gap-2">
                    <span className="lg:text-25 text-[40px] font-medium leading-none text-current sm:text-2xl md:text-3xl md:font-normal lg:text-[100px] lg:leading-[110px]">{item.count}+</span>
                    <span className="text-sm capitalize text-current md:text-lg">{item.title}</span>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
        <div className="absolute -bottom-20 -left-[500px] sm:-left-[400px] md:-bottom-40 md:-left-[300px] lg:left-0 lg:top-20 lg:translate-x-[200px] xl:translate-x-[400px]" id="map">
          <div className="relative after:pointer-events-none after:absolute after:top-20 after:z-10 after:h-[350px] after:w-full after:bg-steps md:mb-20 lg:mb-0 lg:after:hidden">
            <img src="/europe.svg" alt="map" className="max-w-none" />
            <MapTooltips items={TestCountries(jsonData)} currentState={currentState} />
          </div>
        </div>
      </div>
    </section>
  );
}
