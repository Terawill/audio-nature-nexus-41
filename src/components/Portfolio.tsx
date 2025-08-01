
import React from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import PortfolioGridEnhanced from "./enhanced/PortfolioGridEnhanced";
import FadeInView from "./animations/FadeInView";
import MagneticButton from "./animations/MagneticButton";

const Portfolio = () => {
  return (
    <section id="portfolio" className="py-12 sm:py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <FadeInView direction="up" delay={0.2}>
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-nature-forest dark:text-white mb-4">
              Featured Work
            </h2>
            <p className="text-lg sm:text-xl text-nature-bark dark:text-gray-300 max-w-3xl mx-auto">
              Explore some of our most impactful audio engineering projects, showcasing the breadth of our expertise and creative approach.
            </p>
          </div>
        </FadeInView>

        <div className="w-full overflow-hidden">
          <PortfolioGridEnhanced showFeaturedOnly={true} limit={6} />
        </div>

        <FadeInView direction="up" delay={0.6}>
          <div className="text-center mt-12 sm:mt-16 px-4 sm:px-0">
            <Link to="/portfolio">
              <MagneticButton>
                <Button 
                  size="lg"
                  className="bg-nature-forest hover:bg-nature-leaf text-white px-6 sm:px-8 py-3 rounded-full transition-all duration-200 transform hover:scale-105"
                >
                  View Full Portfolio
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </MagneticButton>
            </Link>
          </div>
        </FadeInView>
      </div>
    </section>
  );
};

export default Portfolio;
