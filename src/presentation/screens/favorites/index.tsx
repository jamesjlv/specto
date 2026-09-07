import { useMemo, useState } from "react";
import { View } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { IShow } from "@/domain/models";
import { useFavoritesStore } from "@/presentation/store";
import { ScreenHeader, ShowStatusFilter } from "@/presentation/components/ui/screen-header";
import { ShowPosterCard, StateFeedback } from "@/presentation/components";

interface FavoritesScreenProps {
  onSelectShow: (showId: number) => void;
  onExplore: () => void;
  onBack?: () => void;
}

export function FavoritesScreen({ onSelectShow, onExplore, onBack }: FavoritesScreenProps) {
  const favoritesMap = useFavoritesStore((state) => state.favorites);
  const [activeStatus, setActiveStatus] = useState<ShowStatusFilter>("ALL");

  const filteredFavorites = useMemo(() => {
    const list = Object.values(favoritesMap);
    if (activeStatus === "ALL") return list;
    return list.filter((s) => s.status.toLowerCase() === activeStatus.toLowerCase());
  }, [favoritesMap, activeStatus]);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Favorites"
        onBack={onBack}
        showFilter={Object.keys(favoritesMap).length > 0}
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
      />

      {Object.keys(favoritesMap).length === 0 ? (
        <StateFeedback
          icon="bookmark"
          title="Your List is Empty"
          description="Save series and movies to your personal list to watch them later."
          actionTitle="Explore Shows"
          onAction={onExplore}
        />
      ) : (
        <View className="flex-1 px-2.5">
          <FlashList
            data={filteredFavorites}
            numColumns={2}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 110 }}
            renderItem={({ item }: { item: IShow }) => (
              <ShowPosterCard show={item} onPress={() => onSelectShow(item.id)} />
            )}
          />
        </View>
      )}
    </View>
  );
}
