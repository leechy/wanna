// hooks
import { useRef } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import { AccessibilityActionEvent, Pressable, StyleProp, StyleSheet, Text, View, ViewStyle } from 'react-native';
import Animated, { interpolate, useAnimatedStyle, type SharedValue } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import ReanimatedSwipeable, {
  SwipeDirection,
  type SwipeableMethods,
} from 'react-native-gesture-handler/ReanimatedSwipeable';
import { DropdownMenu } from '@/components/DropdownMenu';
import ListItemLabel from '@/components/ListItemLabel';

// icons
import SquareIcon from '@/assets/symbols/square.svg';
import SquareCheckIcon from '@/assets/symbols/square-check.svg';
import SquareMinusIcon from '@/assets/symbols/square-minus.svg';
import EditIcon from '@/assets/symbols/edit.svg';
import DuplicateIcon from '@/assets/symbols/duplicate.svg';
import CircleRestoreIcon from '@/assets/symbols/circle-restore.svg';
import XIcon from '@/assets/symbols/x.svg';

// types
import { SvgProps } from 'react-native-svg';
import { ListItem } from '@/types/listItem';
import { DropdownItem } from '@/types/DropdownItem';

export type ShoppingItemActions = {
  // tap: put in the cart / take out of it
  onToggle?: (item: ListItem) => void;
  onEdit?: (item: ListItem) => void;
  onDelete?: (item: ListItem) => void;
  onUnavailable?: (item: ListItem, unavailable: boolean) => void;
  onNote?: (item: ListItem) => void;
  // reply: null asks for a custom text
  onReply?: (item: ListItem, reply: string | null) => void;
  // already got: picked by mistake
  onRestore?: (item: ListItem) => void;
  onBuyAgain?: (item: ListItem) => void;
  // the current user, the author of the item gets the reply buttons
  uid?: string | null;
};

interface ShoppingItemRowProps extends ShoppingItemActions {
  item: ListItem;
  itemBorderRadius: StyleProp<ViewStyle>;
}

const QUICK_REPLIES = ['Any is fine', 'Skip it'];

/**
 * A shopping list item: tap to pick, swipe left to delete,
 * swipe right for out of stock (or buy again when already got),
 * long press for all the actions
 */
export function ShoppingItemRow({
  item,
  itemBorderRadius,
  onToggle,
  onEdit,
  onDelete,
  onUnavailable,
  onNote,
  onReply,
  onRestore,
  onBuyAgain,
  uid,
}: ShoppingItemRowProps) {
  const backgroundColor = useThemeColor({}, 'listBackground');
  const touchableColor = useThemeColor({}, 'touchable');
  const inactiveColor = useThemeColor({}, 'inactive');
  const primaryColor = useThemeColor({}, 'primary');
  const secondaryColor = useThemeColor({}, 'secondary');
  const dangerColor = useThemeColor({}, 'danger');
  const warningColor = useThemeColor({}, 'warning');
  const onPrimaryColor = useThemeColor({}, 'onPrimary');
  const onDangerColor = useThemeColor({}, 'onDanger');
  const onWarningColor = useThemeColor({}, 'onWarning');
  const swipeableRef = useRef<SwipeableMethods>(null);

  const bought = Boolean(item.completed);
  const picked = Boolean(item.ongoing) && !bought;
  const unavailable = Boolean(item.unavailable) && !bought;
  // found or bought, but it wasn't there at some point
  const wasUnavailable = !unavailable && Boolean(item.unavailableAt || item.unavailableNote || item.unavailableReply);
  const isAuthor = Boolean(uid) && item.addedById === uid;

  // the same icons as in the menu
  const rightSwipe: SwipeActionProps & { run: () => void } = bought
    ? { label: 'Buy again', icon: DuplicateIcon, color: primaryColor, textColor: onPrimaryColor, run: () => onBuyAgain?.(item) }
    : unavailable
    ? { label: 'Found it', icon: SquareCheckIcon, color: primaryColor, textColor: onPrimaryColor, run: () => onUnavailable?.(item, false) }
    : { label: 'Out of stock', icon: XIcon, color: warningColor, textColor: onWarningColor, run: () => onUnavailable?.(item, true) };
  const leftSwipe: SwipeActionProps = { label: 'Delete', icon: SquareMinusIcon, color: dangerColor, textColor: onDangerColor };

  // past the threshold the action is going to happen
  function onSwipeableWillOpen() {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  }

  function onSwipeableOpen(direction: SwipeDirection) {
    // full swipe: run the action and put the row back
    swipeableRef.current?.close();
    if (direction === SwipeDirection.RIGHT) {
      rightSwipe.run();
    } else {
      onDelete?.(item);
    }
  }

  const menuItems = (
    bought
      ? [
          onEdit && { label: 'Edit', onPress: () => onEdit(item), icon: EditIcon },
          onRestore && { label: 'Back to the list', onPress: () => onRestore(item), icon: CircleRestoreIcon },
          onBuyAgain && { label: 'Buy again', onPress: () => onBuyAgain(item), icon: DuplicateIcon },
          onDelete && { label: 'Delete', onPress: () => onDelete(item), color: dangerColor, icon: SquareMinusIcon },
        ]
      : [
          onEdit && { label: 'Edit', onPress: () => onEdit(item), icon: EditIcon },
          onUnavailable && {
            label: unavailable ? 'Found it' : 'Out of stock',
            onPress: () => onUnavailable(item, !unavailable),
            icon: XIcon,
          },
          unavailable && onNote && { label: item.unavailableNote ? 'Edit the note' : 'Add a note', onPress: () => onNote(item), icon: EditIcon },
          onDelete && { label: 'Delete', onPress: () => onDelete(item), color: dangerColor, icon: SquareMinusIcon },
        ]
  ).filter(Boolean) as DropdownItem[];

  // the swipes for VoiceOver and TalkBack
  const accessibilityActions = [
    { name: 'delete', label: 'Delete' },
    { name: 'swipeRight', label: rightSwipe.label },
    ...(onEdit && !bought ? [{ name: 'edit', label: 'Edit' }] : []),
  ];
  function onAccessibilityAction(event: AccessibilityActionEvent) {
    if (event.nativeEvent.actionName === 'delete') onDelete?.(item);
    if (event.nativeEvent.actionName === 'swipeRight') rightSwipe.run();
    if (event.nativeEvent.actionName === 'edit') onEdit?.(item);
  }

  return (
    <ReanimatedSwipeable
      ref={swipeableRef}
      containerStyle={[styles.container, itemBorderRadius]}
      friction={1.5}
      leftThreshold={96}
      rightThreshold={96}
      overshootLeft={false}
      overshootRight={false}
      onSwipeableWillOpen={onSwipeableWillOpen}
      onSwipeableOpen={onSwipeableOpen}
      renderLeftActions={(progress) => <SwipeAction {...rightSwipe} progress={progress} align="left" />}
      renderRightActions={(progress) => <SwipeAction {...leftSwipe} progress={progress} align="right" />}
    >
      <View style={[styles.row, { backgroundColor }]}>
        <DropdownMenu
          trigger="longPress"
          onPress={() => !bought && onToggle?.(item)}
          triggerStyle={styles.trigger}
          items={menuItems}
          accessibilityLabel={
            bought ? `${item.label}, bought` : picked ? `${item.label}, in the cart` : item.label
          }
          accessibilityHint={bought ? 'Hold for more actions' : picked ? 'Tap to take out of the cart' : 'Tap to put in the cart'}
          accessibilityActions={accessibilityActions}
          onAccessibilityAction={onAccessibilityAction}
        >
          <View style={styles.content}>
            <View style={styles.check}>
              {bought || picked ? (
                <SquareCheckIcon width={28} height={28} color={bought ? inactiveColor : primaryColor} />
              ) : (
                <SquareIcon width={28} height={28} color={unavailable ? inactiveColor : touchableColor} />
              )}
            </View>
            <View style={[styles.label, (picked || unavailable) && styles.dimmed]}>
              <ListItemLabel item={item} showQuantity={true} />
            </View>
          </View>
        </DropdownMenu>

        {(unavailable || wasUnavailable) && (
          <View style={styles.status}>
            <Pressable
              onPress={() => unavailable && onNote?.(item)}
              disabled={!unavailable}
              accessibilityRole={unavailable ? 'button' : 'text'}
              accessibilityLabel={`${unavailable ? 'Out of stock' : 'Was out of stock'} since ${formatTime(item.unavailableAt)}`}
              accessibilityHint={unavailable ? 'Add a note about what was on the shelf' : undefined}
              hitSlop={8}
            >
              <Text style={[styles.statusText, { color: unavailable ? secondaryColor : inactiveColor }]}>
                {unavailable ? 'Out of stock' : 'Was out of stock'} · {formatTime(item.unavailableAt)}
                {item.unavailableNote ? `: ${item.unavailableNote}` : unavailable && onNote ? ' · add a note' : ''}
              </Text>
            </Pressable>
            {item.unavailableReply ? (
              <Text style={[styles.statusText, { color: primaryColor }]}>↳ {item.unavailableReply}</Text>
            ) : (
              unavailable &&
              isAuthor &&
              onReply && (
                <View style={styles.replies}>
                  {QUICK_REPLIES.map((reply) => (
                    <ReplyChip key={reply} label={reply} color={primaryColor} onPress={() => onReply(item, reply)} />
                  ))}
                  <ReplyChip label="Reply…" color={primaryColor} onPress={() => onReply(item, null)} />
                </View>
              )
            )}
          </View>
        )}
      </View>
    </ReanimatedSwipeable>
  );
}

type SwipeActionProps = {
  label: string;
  icon: React.FC<SvgProps>;
  color: string;
  textColor: string;
};

/**
 * A pill with the icon and the name of the action, grows in as the row is swiped
 */
function SwipeAction({
  label,
  icon: Icon,
  color,
  textColor,
  progress,
  align,
}: SwipeActionProps & { progress: SharedValue<number>; align: 'left' | 'right' }) {
  const pillStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 0.4, 1], [0, 0.6, 1], 'clamp'),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.7, 1], 'clamp') }],
  }));

  return (
    <View style={[styles.swipeAction, { alignItems: align === 'left' ? 'flex-start' : 'flex-end' }]}>
      <Animated.View style={[styles.pill, { backgroundColor: color }, pillStyle]}>
        <Icon width={20} height={20} color={textColor} />
        <Text style={[styles.pillText, { color: textColor }]}>{label}</Text>
      </Animated.View>
    </View>
  );
}

function ReplyChip({ label, color, onPress }: { label: string; color: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.chip, { borderColor: color }]}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityHint="Sends the answer to the shopper"
      hitSlop={4}
    >
      <Text style={[styles.chipText, { color }]}>{label}</Text>
    </Pressable>
  );
}

/**
 * Time for today, date and time for the older days
 */
function formatTime(value?: string | null) {
  if (!value) {
    return 'now';
  }
  const date = new Date(value);
  const time = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  return date.toDateString() === new Date().toDateString()
    ? time
    : `${date.toLocaleDateString([], { day: 'numeric', month: 'short' })} ${time}`;
}

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  row: {
    minHeight: 56,
    justifyContent: 'center',
  },
  trigger: {
    minHeight: 56,
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  check: {
    padding: 5,
  },
  label: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dimmed: {
    opacity: 0.55,
  },
  status: {
    paddingLeft: 38,
    paddingRight: 12,
    paddingBottom: 10,
    gap: 6,
  },
  statusText: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
  },
  replies: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  chip: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  chipText: {
    fontFamily: 'Montserrat_600SemiBold',
    fontSize: 13,
  },
  swipeAction: {
    width: 160,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: 18,
  },
  pillText: {
    fontFamily: 'Montserrat_700Bold',
    fontSize: 14,
  },
});
