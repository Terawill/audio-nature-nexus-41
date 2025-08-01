
import React, { useState } from "react";
import { usePortfolioData } from "@/hooks/usePortfolioData";
import { type PortfolioItem } from "@/types/portfolio";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { RefreshCw, AlertCircle } from "lucide-react";
import LoadingSpinner from "../animations/LoadingSpinner";
import PortfolioFilters from "./PortfolioFilters";
import PortfolioCard from "./PortfolioCard";
import FadeInView from "../animations/FadeInView";

interface PortfolioGridEnhancedProps {
  showFeaturedOnly?: boolean;
  limit?: number;
}

const PortfolioGridEnhanced: React.FC<PortfolioGridEnhancedProps> = ({ 
  showFeaturedOnly = false, 
  limit 
}) => {
  const { portfolioItems, featuredItems, isLoading, error, refetch } = usePortfolioData();
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const items = showFeaturedOnly ? featuredItems : portfolioItems;
  const displayItems = limit ? items.slice(0, limit) : items;

  const categories = ["All", ...Array.from(new Set(portfolioItems.map(item => item.category)))];

  const filteredItems = selectedCategory === "All" 
    ? displayItems 
    : displayItems.filter(item => item.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-20">
        <div className="text-center px-4">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-nature-bark dark:text-gray-300 text-sm sm:text-base">
            Loading portfolio items...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12 sm:py-20 px-4">
        <div className="max-w-md w-full">
          <Alert className="border-red-200 bg-red-50 dark:bg-red-950/20 dark:border-red-800">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800 dark:text-red-200 text-sm">
              <strong>Failed to load portfolio items</strong>
              <br />
              {error.message || 'An unexpected error occurred'}
            </AlertDescription>
          </Alert>
          <div className="mt-4 text-center">
            <Button 
              onClick={() => refetch()} 
              variant="outline"
              className="text-nature-forest border-nature-forest hover:bg-nature-forest hover:text-white"
              size="sm"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full overflow-hidden">
      {!showFeaturedOnly && (
        <FadeInView direction="up" delay={0.1}>
          <div className="px-2 sm:px-4 md:px-0">
            <PortfolioFilters 
              categories={categories}
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </FadeInView>
      )}

      {filteredItems.length > 0 ? (
        <div className="w-full">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-4 md:px-0">
            {filteredItems.map((item, index) => (
              <FadeInView key={item.id} direction="up" delay={0.1 * (index % 6)}>
                <div className="w-full">
                  <PortfolioCard item={item} />
                </div>
              </FadeInView>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12 animate-fade-in px-4">
          <div className="max-w-md mx-auto">
            <div className="text-4xl sm:text-6xl mb-4 opacity-20">🎵</div>
            <h3 className="text-lg font-medium text-nature-forest dark:text-white mb-2">
              No projects found
            </h3>
            <p className="text-nature-bark dark:text-gray-300 text-sm sm:text-base">
              {selectedCategory === "All" 
                ? "No portfolio items available yet." 
                : `No projects found in the "${selectedCategory}" category.`}
            </p>
            {selectedCategory !== "All" && (
              <Button 
                variant="outline" 
                onClick={() => setSelectedCategory("All")}
                className="mt-4"
                size="sm"
              >
                View All Projects
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PortfolioGridEnhanced;
