import { useEffect, useMemo, useState } from "react";
import { View, ActivityIndicator } from "react-native";
import { FlashList } from "@shopify/flash-list";

import { IShow } from "@/domain/models";
import { useInfiniteShows } from "@/presentation/hooks/use-infinite-shows";
import { ScreenHeader, ShowStatusFilter } from "@/presentation/components/ui/screen-header";
import { ShowPosterCard, Skeleton, StateFeedback } from "@/presentation/components";

interface DiscoverScreenProps {
  onSelectShow: (showId: number) => void;
  onBack?: () => void;
}

export function DiscoverScreen({ onSelectShow, onBack }: DiscoverScreenProps) {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage, refetch } = useInfiniteShows();

  const [activeStatus, setActiveStatus] = useState<ShowStatusFilter>("ALL");

  const filteredShows = useMemo(() => {
    if (!data?.pages) return [];
    const all = data.pages.flat();

    const uniqueMap = new Map<number, IShow>();
    for (const show of all) {
      if (!uniqueMap.has(show.id)) {
        uniqueMap.set(show.id, show);
      }
    }
    const unique = Array.from(uniqueMap.values());

    if (activeStatus === "ALL") return unique;
    return unique.filter((s) => s.status.toLowerCase() === activeStatus.toLowerCase());
  }, [data?.pages, activeStatus]);

  useEffect(() => {
    if (filteredShows.length < 8 && hasNextPage && !isFetchingNextPage && !isLoading) {
      fetchNextPage();
    }
  }, [filteredShows.length, hasNextPage, isFetchingNextPage, isLoading, fetchNextPage]);

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Discover"
        onBack={onBack}
        showFilter
        activeStatus={activeStatus}
        onStatusChange={setActiveStatus}
      />

      {isLoading ? (
        <View className="flex-1 flex-row flex-wrap justify-between px-3 pt-2">
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={i} className="mb-3 w-[48%]">
              <Skeleton className="aspect-[2/3] w-full rounded-[10px]" />
              <Skeleton className="mt-1.5 h-3.5 w-24" />
            </View>
          ))}
        </View>
      ) : isError ? (
        <StateFeedback
          icon="film"
          title="Feed Unavailable"
          description="Could not load catalog."
          actionTitle="Retry"
          onAction={refetch}
        />
      ) : (
        <View className="flex-1 px-2">
          <FlashList
            data={filteredShows}
            extraData={activeStatus}
            numColumns={2}
            keyExtractor={(item) => String(item.id)}
            onEndReached={() => {
              if (hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.4}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 110 }}
            ListFooterComponent={
              isFetchingNextPage ? (
                <View className="items-center py-4">
                  <ActivityIndicator size="small" color="#FAC554" />
                </View>
              ) : null
            }
            renderItem={({ item }: { item: IShow }) => (
              <ShowPosterCard show={item} onPress={() => onSelectShow(item.id)} />
            )}
          />
        </View>
      )}
    </View>
  );
}
