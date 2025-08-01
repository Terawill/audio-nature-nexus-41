
import React from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PortfolioFiltersProps {
  categories: string[];
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

const PortfolioFilters: React.FC<PortfolioFiltersProps> = ({
  categories,
  selectedCategory,
  onCategoryChange
}) => {
  return (
    <div className="w-full">
      {/* Mobile: Horizontal scrollable filters with better touch targets */}
      <div className="block sm:hidden">
        <ScrollArea className="w-full whitespace-nowrap pb-2">
          <div className="flex space-x-3 px-2 py-2 min-w-max">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                size="sm"
                onClick={() => onCategoryChange(category)}
                className={`transition-all duration-300 whitespace-nowrap shrink-0 min-h-[44px] px-4 py-2 text-sm font-medium ${
                  selectedCategory === category 
                    ? "bg-nature-forest hover:bg-nature-leaf text-white shadow-md" 
                    : "hover:bg-nature-mist text-nature-forest border-nature-forest/30 bg-white"
                }`}
              >
                {category}
              </Button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Tablet: Centered flex wrap with better spacing */}
      <div className="hidden sm:flex md:hidden flex-wrap gap-3 justify-center px-4">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className={`transition-all duration-300 transform hover:scale-105 ${
              selectedCategory === category 
                ? "bg-nature-forest hover:bg-nature-leaf text-white" 
                : "hover:bg-nature-mist text-nature-forest border-nature-forest/30"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>

      {/* Desktop: Centered flex wrap */}
      <div className="hidden md:flex flex-wrap gap-2 justify-center">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "default" : "outline"}
            size="sm"
            onClick={() => onCategoryChange(category)}
            className={`transition-all duration-300 transform hover:scale-105 ${
              selectedCategory === category 
                ? "bg-nature-forest hover:bg-nature-leaf text-white" 
                : "hover:bg-nature-mist text-nature-forest border-nature-forest/30"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default PortfolioFilters;
