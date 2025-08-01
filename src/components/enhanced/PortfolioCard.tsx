
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, Star, Clock, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { type PortfolioItem } from "@/types/portfolio";
import HoverSoundPreview from "../interactive/HoverSoundPreview";
import Card3D from "../effects/Card3D";
import { useIsMobile } from "@/hooks/use-mobile";
import MediaTypeBadges from "./MediaTypeBadges";
import AudioPlayerManager, { validateAudioUrl } from "../audio/AudioPlayerManager";
import VideoPlayerSection from "./VideoPlayerSection";
import ExternalLinksSection from "./ExternalLinksSection";

interface PortfolioCardProps {
  item: PortfolioItem;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ item }) => {
  const isMobile = useIsMobile();
  
  const getCategoryColor = (category: string) => {
    const colors = {
      "Mixing & Mastering": "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      "Sound Design": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      "Podcasting": "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
      "Sound for Picture": "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200",
      "Dolby Atmos": "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const hasValidMedia = (url?: string) => {
    const isValid = url && url.trim() !== '' && url !== 'undefined' && url !== 'null';
    return isValid;
  };

  return (
    <div className="w-full h-full">
      <Card3D intensity="medium" glowEffect={true} className="group h-full">
        <Card className="overflow-hidden transition-all duration-500 border-0 bg-white dark:bg-gray-800 transform h-full flex flex-col">
          {/* Cover Image with Hover Sound Preview */}
          <div className="relative h-48 sm:h-52 overflow-hidden shrink-0">
            {item.audioUrl && !isMobile ? (
              <HoverSoundPreview audioUrl={item.audioUrl} title={item.title} className="h-full w-full">
                {item.coverImageUrl ? (
                  <img 
                    src={item.coverImageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-nature-sage to-nature-mist dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <div className="text-nature-forest dark:text-white text-3xl sm:text-4xl font-bold opacity-20">
                      {item.title.charAt(0)}
                    </div>
                  </div>
                )}
              </HoverSoundPreview>
            ) : (
              <>
                {item.coverImageUrl ? (
                  <img 
                    src={item.coverImageUrl} 
                    alt={item.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-nature-sage to-nature-mist dark:from-gray-700 dark:to-gray-600 flex items-center justify-center">
                    <div className="text-nature-forest dark:text-white text-3xl sm:text-4xl font-bold opacity-20">
                      {item.title.charAt(0)}
                    </div>
                  </div>
                )}
              </>
            )}
            
            {/* Featured Badge */}
            {item.featured && (
              <div className="absolute top-2 right-2 sm:top-3 sm:right-3 animate-pulse">
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg text-xs">
                  <Star className="w-3 h-3 mr-1" />
                  Featured
                </Badge>
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-2 left-2 sm:top-3 sm:left-3 transform transition-transform duration-300 group-hover:scale-110">
              <Badge className={`${getCategoryColor(item.category)} text-xs`}>
                {item.category}
              </Badge>
            </div>

            {/* Media Type Indicators */}
            <MediaTypeBadges item={item} />
          </div>

          <CardContent className="p-4 sm:p-6 flex-1 flex flex-col">
            <div className="space-y-3 sm:space-y-4 flex-1">
              <div>
                <h3 className="font-bold text-base sm:text-lg text-nature-forest dark:text-white group-hover:text-nature-leaf dark:group-hover:text-blue-400 transition-colors duration-300 line-clamp-2">
                  {item.title}
                </h3>
                <div className="flex items-center text-xs sm:text-sm text-nature-bark dark:text-gray-400 mt-1">
                  <User className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="truncate">{item.client}</span>
                </div>
                
                {/* Date information with priority for recorded date */}
                {item.recordedDate && (
                  <div className="flex items-center mt-2 text-xs text-nature-bark dark:text-gray-400">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className="font-medium">Completed:</span>
                    <span className="ml-1">{formatDate(item.recordedDate)}</span>
                  </div>
                )}
              </div>

              <p className="text-nature-bark dark:text-gray-300 text-xs sm:text-sm line-clamp-3 flex-1">
                {item.description}
              </p>

              {/* Audio Player Section */}
              {validateAudioUrl(item.audioUrl) && (
                <div className="py-2">
                  <AudioPlayerManager 
                    audioUrl={item.audioUrl} 
                    title={item.title} 
                    variant="compact" 
                  />
                </div>
              )}

              {/* Video Player Section */}
              {hasValidMedia(item.videoUrl) && (
                <VideoPlayerSection videoUrl={item.videoUrl} />
              )}

              {/* External Links Section */}
              {item.externalLinks && item.externalLinks.length > 0 && (
                <ExternalLinksSection links={item.externalLinks} />
              )}

              {/* View Details Button */}
              <div className="pt-2 mt-auto">
                <Button asChild className="w-full bg-nature-forest hover:bg-nature-leaf text-white text-sm h-9 sm:h-10">
                  <Link to={`/portfolio/${item.id}`} className="flex items-center justify-center">
                    View Full Details
                    <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </Card3D>
    </div>
  );
};

export default PortfolioCard;
