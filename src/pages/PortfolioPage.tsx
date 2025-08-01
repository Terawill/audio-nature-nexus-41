
import React from 'react';
import UnifiedNavbar from '@/components/UnifiedNavbar';
import PortfolioGridEnhanced from '@/components/enhanced/PortfolioGridEnhanced';
import Footer from '@/components/Footer';
import SEOManager from '@/components/SEO/SEOManager';
import FadeInView from '@/components/animations/FadeInView';

const PortfolioPage = () => {
  return (
    <>
      <SEOManager
        title="Portfolio | Terra Echo Studios - Professional Audio Engineering Projects"
        description="Explore our extensive portfolio of professional audio engineering projects including mixing, mastering, sound design, and Dolby Atmos productions across various industries."
        keywords={[
          "audio engineering portfolio",
          "mixing examples",
          "mastering samples",
          "sound design portfolio",
          "dolby atmos projects",
          "professional audio work",
          "terra echo studios projects"
        ]}
        structuredDataType="portfolio"
        structuredData={{
          name: "Terra Echo Studios Portfolio",
          description: "Professional audio engineering project showcase"
        }}
      />

      <div className="min-h-screen bg-white dark:bg-gray-900">
        <UnifiedNavbar />
        
         <main className="pt-20 sm:pt-20 pb-8">
          <div className="w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <FadeInView direction="up">
                <div className="text-center mb-8 sm:mb-12">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-nature-forest dark:text-white mb-4">
                    Our Portfolio
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl text-nature-bark dark:text-gray-300 max-w-3xl mx-auto">
                    Discover our extensive collection of professional audio engineering projects, 
                    showcasing our expertise in mixing, mastering, sound design, and Dolby Atmos production.
                  </p>
                </div>
              </FadeInView>

              <FadeInView direction="up" delay={0.2}>
                <div className="w-full">
                  <PortfolioGridEnhanced />
                </div>
              </FadeInView>
            </div>
          </div>
        </main>
        
        <Footer />
      </div>
    </>
  );
};

export default PortfolioPage;
