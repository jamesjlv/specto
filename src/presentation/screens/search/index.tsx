import { useEffect, useMemo, useState } from "react";
import { View, TextInput, Platform, Keyboard } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { FlashList } from "@shopify/flash-list";

import { IShow } from "@/domain/models";
import { useDebounce, useSearchShows } from "@/presentation/hooks";
import { ScreenHeader, ShowStatusFilter } from "@/presentation/components/ui/screen-header";
import { useInfiniteShows } from "@/presentation/hooks/use-infinite-shows";
import { ShowPosterCard, Skeleton, StateFeedback } from "@/presentation/components";
import Animated, { useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";

interface SearchScreenProps {
  onSelectShow: (showId: number) => void;
  onBack?: () => void;
}

export function SearchScreen({ onSelectShow, onBack }: SearchScreenProps) {
  const insets = useSafeAreaInsets();
  const [term, setTerm] = useState("");
  const debouncedTerm = useDebounce(term, 350);
  const [activeStatus, setActiveStatus] = useState<ShowStatusFilter>("ALL");

  const keyboardHeight = useSharedValue(0);

  useEffect(() => {
    const showEvent = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSub = Keyboard.addListener(showEvent, (e) => {
      keyboardHeight.value = withTiming(e.endCoordinates.height, { duration: 250 });
    });

    const hideSub = Keyboard.addListener(hideEvent, () => {
      keyboardHeight.value = withTiming(0, { duration: 200 });
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [keyboardHeight]);

  const animatedInputStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -keyboardHeight.value }],
  }));

  const {
    data: searchResults,
    isLoading: isSearchLoading,
    isError: isSearchError,
    refetch: refetchSearch,
  } = useSearchShows(debouncedTerm);

  const {
    data: catalogData,
    isLoading: isCatalogLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteShows();

  const isSearching = debouncedTerm.trim().length >= 2;

  const displayedShows = useMemo(() => {
    let list: IShow[] = [];

    if (isSearching) {
      list = (searchResults ?? []).map((item) => item.show);
    } else {
      list = catalogData?.pages ? catalogData.pages.flat() : [];
    }

    const uniqueMap = new Map<number, IShow>();
    for (const show of list) {
      if (!uniqueMap.has(show.id)) {
        uniqueMap.set(show.id, show);
      }
    }
    const unique = Array.from(uniqueMap.values());

    if (activeStatus === "ALL") return unique;
    return unique.filter((s) => s.status.toLowerCase() === activeStatus.toLowerCase());
  }, [isSearching, searchResults, catalogData, activeStatus]);

  const isLoading = isSearching ? isSearchLoading : isCatalogLoading && displayedShows.length === 0;

  return (
    <View className="flex-1 bg-background">
      <ScreenHeader
        title="Search"
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
      ) : isSearchError ? (
        <StateFeedback
          icon="film"
          title="Search Failed"
          description="Could not complete query."
          actionTitle="Retry"
          onAction={refetchSearch}
        />
      ) : displayedShows.length === 0 && isSearching ? (
        <StateFeedback
          icon="search"
          title="No Results Found"
          description={`We couldn't find any shows matching "${debouncedTerm}".`}
        />
      ) : (
        <View className="flex-1 px-2">
          <FlashList
            data={displayedShows}
            extraData={activeStatus}
            numColumns={2}
            keyExtractor={(item) => String(item.id)}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 120 }}
            onEndReached={() => {
              if (!isSearching && hasNextPage && !isFetchingNextPage) {
                fetchNextPage();
              }
            }}
            onEndReachedThreshold={0.5}
            renderItem={({ item }: { item: IShow }) => (
              <ShowPosterCard show={item} onPress={() => onSelectShow(item.id)} />
            )}
          />
        </View>
      )}

      <Animated.View
        style={[
          {
            position: "absolute",
            bottom: Math.max(insets.bottom, 16),
            left: 0,
            right: 0,
            alignItems: "center",
            paddingHorizontal: 16,
          },
          animatedInputStyle,
        ]}
        pointerEvents="box-none"
      >
        <View className="h-12 w-full max-w-[345px] justify-center rounded-full bg-[#647480]/85 px-5 backdrop-blur-md">
          <TextInput
            value={term}
            onChangeText={setTerm}
            placeholder="Search show name..."
            placeholderTextColor="rgba(253, 253, 252, 0.65)"
            style={{
              color: "#FDFDFC",
              fontFamily: "Geist-Regular",
              fontSize: 14,
              padding: 0,
              margin: 0,
            }}
            autoCorrect={false}
            autoCapitalize="none"
            returnKeyType="search"
          />
        </View>
      </Animated.View>
    </View>
  );
}
