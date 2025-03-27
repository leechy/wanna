// hooks
import { useEffect, useRef, useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';
import { wrapScrollView, useScrollIntoView, ScrollIntoView } from 'react-native-scroll-into-view';

// components
import PagerView from 'react-native-pager-view';
import { ColorValue, ScrollView, StyleSheet, Text, View } from 'react-native';
import { PressableArea } from '@/components/PressableArea';

const TabsScrollView = wrapScrollView(ScrollView);

export type TabContent = {
  title: string;
  content: string | JSX.Element;
  items?: number;
  color?: ColorValue;
};

interface ScrollingTabsProps {
  tabs: TabContent[];
}

interface ScrollingTabsContentProps {
  tab: TabContent;
  index: number;
  isActive: boolean;
  textColor: ColorValue;
  selectTab: (index: number) => void;
}

// separate component to get the context from TabsScrollView
function ScrollingTabsContent({ tab, index, isActive, textColor, selectTab }: ScrollingTabsContentProps) {
  const scrollIntoView = useScrollIntoView();
  const scrollRef = useRef(null);
  const activeRef = useRef(isActive);
  const primaryColor = useThemeColor({}, 'primary');

  useEffect(() => {
    if (isActive && !activeRef.current && scrollRef.current) {
      activeRef.current = true;
      scrollIntoView(scrollRef.current, { animated: true });
    } else if (!isActive && activeRef.current) {
      activeRef.current = false;
    }
  }, [isActive, scrollIntoView, tab.title]);

  function onPress() {
    if (!activeRef.current) {
      console.log('onPress', tab.title);
      activeRef.current = true;
      selectTab(index);
    }
  }

  return (
    // @ts-ignore align is a valid prop for ScrollIntoView
    <ScrollIntoView key={tab.title + index} ref={scrollRef} align="stert">
      <PressableArea
        style={styles.tab}
        onPress={onPress}
        accessible={true}
        accessibilityRole="button"
        accessibilityLabel={tab.title || 'Button'}
        accessibilityHint={`Press to switch to ${tab.title}`}
      >
        <Text style={styles.title}>
          {tab.title}
          {(tab.items || 0) > 0 ? tab.items : ''}
        </Text>
        <View style={styles.titleOverlay}>
          <Text
            style={[
              styles.title,
              {
                color: isActive ? primaryColor : tab.color || textColor,
                fontWeight: isActive ? '700' : '600',
              },
            ]}
          >
            {tab.title}
          </Text>
          {(tab.items || 0) > 0 && (
            <Text style={[styles.number, { color: isActive ? primaryColor : textColor }]}>{tab.items}</Text>
          )}
        </View>
      </PressableArea>
    </ScrollIntoView>
  );
}

export default function ScrollingTabs({ tabs }: ScrollingTabsProps) {
  const pagerRef = useRef<PagerView>(null);
  const [activeTab, setActiveTab] = useState(0);

  const textColor = useThemeColor({}, 'text');

  function selectTab(index: number) {
    setActiveTab(index);
    pagerRef.current?.setPage(index);
  }

  function onTabsScroll(e: { offset: number; position: number }) {
    if (e.offset === 0 && activeTab !== e.position) {
      setActiveTab(e.position);
    }
  }

  return (
    <View style={styles.container}>
      <View style={{ flex: 0 }}>
        <TabsScrollView
          contentContainerStyle={styles.tabs}
          alwaysBounceHorizontal={false}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        >
          {tabs.map((tab, index) => (
            <ScrollingTabsContent
              tab={tab}
              index={index}
              isActive={activeTab === index}
              textColor={textColor}
              selectTab={selectTab}
              key={`tab-${index}`}
            />
          ))}
        </TabsScrollView>
      </View>
      <PagerView
        ref={pagerRef}
        style={styles.pagerView}
        initialPage={0}
        onPageScroll={(e) => {
          onTabsScroll(e.nativeEvent);
        }}
      >
        {tabs.map((tab, index) => (
          <View key={`content-${index}`} style={styles.page}>
            {tab.content}
          </View>
        ))}
      </PagerView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'flex-start',
  },
  tabs: {
    padding: 0,
    paddingBottom: 16,
    margin: 0,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    minWidth: '100%',
  },
  tab: {
    paddingHorizontal: 16,
  },
  title: {
    position: 'relative',
    fontFamily: 'Montserrat',
    fontSize: 18,
    fontWeight: '700',
    lineHeight: 24,
    paddingHorizontal: 2,
    color: 'transparent',
  },
  titleOverlay: {
    position: 'absolute',
    left: 16,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    justifyContent: 'center',
  },
  pagerView: {
    flexGrow: 1,
    flexShrink: 0,
  },
  page: {
    paddingTop: 0,
  },
  number: {
    paddingTop: 2,
    fontFamily: 'Montserrat',
    fontSize: 14,
    fontWeight: '500',
    opacity: 0.5,
  },
});
