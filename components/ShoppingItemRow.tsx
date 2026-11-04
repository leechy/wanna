// hooks
import { useEffect, useRef, useState } from 'react';
import { useThemeColor } from '@/hooks/useThemeColor';

// components
import {
  AccessibilityActionEvent,
  Keyboard,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
  type TextInputInstance,
} from 'react-native';
import Animated, {
  interpolate,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';
import { scheduleOnRN } from 'react-native-worklets';
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
import TrashIcon from '@/assets/symbols/trash.svg';
import EditIcon from '@/assets/symbols/edit.svg';
import DuplicateIcon from '@/assets/symbols/duplicate.svg';
import CircleRestoreIcon from '@/assets/symbols/circle-restore.svg';
import SquareQuestionIcon from '@/assets/symbols/square-question.svg';

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
  // the shopper's note about what was on the shelf, an empty one removes it
  onNote?: (item: ListItem, note: string) => void;
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

// a short swipe reveals the button and keeps it open (the row stops by the button),
// a swipe past FULL_SWIPE runs the action right away
const OPEN_THRESHOLD = 40;
const FULL_SWIPE = 220;
// the release of a swipe is reported as a press too, it must not toggle the item
const PRESS_AFTER_SWIPE_MS = 350;

// like on iOS, only one row has its buttons revealed
let openRow: SwipeableMethods | null = null;

/**
 * Puts back the row with the revealed buttons, e.g. when the list scrolls
 */
export function closeOpenShoppingRow() {
  openRow?.close();
  openRow = null;
}

/**
 * A shopping list item: tap to pick, swipe left to delete,
 * swipe right for out of stock (or buy again when already got),
 * long press for all the actions.
 * Out of stock is a question about the item: a tap writes a note right in the row
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
  const textColor = useThemeColor({}, 'text');
  // the note field looks like the other fields in the app
  const inputTextColor = useThemeColor({}, 'inputText');
  const inputBackground = useThemeColor({}, 'inputBackground');
  const inputPlaceholder = useThemeColor({}, 'inputPlaceholder');
  const cursorColor = useThemeColor({}, 'cursorColor');
  const swipeableRef = useRef<SwipeableMethods>(null);
  const isOpen = useRef(false);
  const isFullSwipe = useRef(false);
  const isDragging = useRef(false);
  const swipeEndedAt = useRef(0);

  const bought = Boolean(item.completed);
  const picked = Boolean(item.ongoing) && !bought;
  const unavailable = Boolean(item.unavailable) && !bought;
  // found or bought, but it wasn't there at some point
  const wasUnavailable = !unavailable && Boolean(item.unavailableAt || item.unavailableNote || item.unavailableReply);
  const isAuthor = Boolean(uid) && item.addedById === uid;

  // the note and the reply, read out with the item
  const unavailableStory =
    unavailable || wasUnavailable
      ? `${wasUnavailable ? ', was out of stock' : ''}${item.unavailableNote ? `: ${item.unavailableNote}` : ''}` +
        ` at ${formatTime(item.unavailableAt)}` +
        (item.unavailableReply ? `. Reply: ${item.unavailableReply}` : '')
      : '';

  // the note is typed right under the item
  const [editing, setEditing] = useState(false);
  const [noteText, setNoteText] = useState('');
  const noteInput = useRef<TextInputInstance>(null);
  // found it or bought on another phone: nothing to write about
  const editingNote = editing && unavailable;

  function startNote() {
    setNoteText(item.unavailableNote ?? '');
    setEditing(true);
  }

  // Send, a tap anywhere else or the hidden keyboard: saves what's typed, nothing typed - nothing changes
  function endNote() {
    const note = noteText.trim();
    if (note !== (item.unavailableNote ?? '')) {
      onNote?.(item, note);
    }
    setEditing(false);
  }

  // on Android the back button hides the keyboard, but keeps the focus
  useEffect(() => {
    if (!editingNote) {
      return;
    }
    const subscription = Keyboard.addListener('keyboardDidHide', () => noteInput.current?.blur());
    return () => subscription.remove();
  }, [editingNote]);

  // the same icons as in the menu
  const rightSwipe: SwipeActionProps & { run: () => void } = bought
    ? { label: 'Buy again', icon: DuplicateIcon, color: primaryColor, textColor: onPrimaryColor, run: () => onBuyAgain?.(item) }
    : unavailable
    ? { label: 'Found it', icon: SquareCheckIcon, color: primaryColor, textColor: onPrimaryColor, run: () => onUnavailable?.(item, false) }
    : { label: 'Out of stock', icon: SquareQuestionIcon, color: warningColor, textColor: onWarningColor, run: markUnavailable };
  const leftSwipe: SwipeActionProps = { label: 'Delete', icon: TrashIcon, color: dangerColor, textColor: onDangerColor };

  // out of stock opens the field for the question right away
  function markUnavailable() {
    onUnavailable?.(item, true);
    if (onNote) {
      // a new question, the note of the last time is gone
      setNoteText('');
      setEditing(true);
    }
  }

  function runSwipeAction(direction: SwipeDirection) {
    swipeableRef.current?.close();
    if (direction === SwipeDirection.RIGHT) {
      rightSwipe.run();
    } else {
      onDelete?.(item);
    }
  }

  // the finger crossed the full swipe line, one way or the other
  function onFullSwipeChange(full: boolean) {
    isFullSwipe.current = full;
    if (full) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }

  function onSwipeStart() {
    isDragging.current = true;
    if (openRow && openRow !== swipeableRef.current) {
      openRow.close();
    }
  }

  function onSwipeEnd() {
    isDragging.current = false;
    swipeEndedAt.current = Date.now();
  }

  // released: past the line it's done, otherwise the button stays on view
  function onSwipeableWillOpen(direction: SwipeDirection) {
    onSwipeEnd();
    if (isFullSwipe.current) {
      isFullSwipe.current = false;
      runSwipeAction(direction);
    }
  }

  function onSwipeableOpen() {
    isOpen.current = true;
    openRow = swipeableRef.current;
  }

  function onSwipeableClose() {
    isOpen.current = false;
    if (openRow === swipeableRef.current) {
      openRow = null;
    }
  }

  function onRowPress() {
    if (isDragging.current || Date.now() - swipeEndedAt.current < PRESS_AFTER_SWIPE_MS) {
      return;
    }
    // a tap on the row with a button revealed just puts the row back
    if (isOpen.current) {
      swipeableRef.current?.close();
      return;
    }
    // too easy to put in the cart what isn't there, a tap writes the note instead
    if (unavailable) {
      if (onNote) {
        startNote();
      }
      return;
    }
    if (!bought) {
      onToggle?.(item);
    }
  }

  const menuItems = (
    bought
      ? [
          onEdit && { label: 'Edit', onPress: () => onEdit(item), icon: EditIcon },
          onRestore && { label: 'Back to the list', onPress: () => onRestore(item), icon: CircleRestoreIcon },
          onBuyAgain && { label: 'Buy again', onPress: () => onBuyAgain(item), icon: DuplicateIcon },
          onDelete && { label: 'Delete', onPress: () => onDelete(item), color: dangerColor, icon: TrashIcon },
        ]
      : [
          onEdit && { label: 'Edit', onPress: () => onEdit(item), icon: EditIcon },
          onUnavailable && {
            label: unavailable ? 'Found it' : 'Out of stock',
            onPress: () => (unavailable ? onUnavailable(item, false) : markUnavailable()),
            icon: unavailable ? SquareCheckIcon : SquareQuestionIcon,
          },
          unavailable && onNote && { label: item.unavailableNote ? 'Edit the note' : 'Add a note', onPress: startNote, icon: EditIcon },
          onDelete && { label: 'Delete', onPress: () => onDelete(item), color: dangerColor, icon: TrashIcon },
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
      friction={1}
      leftThreshold={OPEN_THRESHOLD}
      rightThreshold={OPEN_THRESHOLD}
      overshootLeft={true}
      overshootRight={true}
      overshootFriction={1}
      onSwipeableOpenStartDrag={onSwipeStart}
      onSwipeableCloseStartDrag={onSwipeStart}
      onSwipeableWillOpen={onSwipeableWillOpen}
      onSwipeableWillClose={onSwipeEnd}
      onSwipeableOpen={onSwipeableOpen}
      onSwipeableClose={onSwipeableClose}
      renderLeftActions={(progress, translation) => (
        <SwipeAction
          {...rightSwipe}
          progress={progress}
          translation={translation}
          align="left"
          onPress={() => runSwipeAction(SwipeDirection.RIGHT)}
          onFullSwipeChange={onFullSwipeChange}
        />
      )}
      renderRightActions={(progress, translation) => (
        <SwipeAction
          {...leftSwipe}
          progress={progress}
          translation={translation}
          align="right"
          onPress={() => runSwipeAction(SwipeDirection.LEFT)}
          onFullSwipeChange={onFullSwipeChange}
        />
      )}
    >
      <View style={[styles.row, { backgroundColor }]}>
        <DropdownMenu
          trigger="longPress"
          onPress={onRowPress}
          triggerStyle={styles.trigger}
          items={menuItems}
          accessibilityLabel={
            (bought
              ? `${item.label}, bought`
              : picked
                ? `${item.label}, in the cart`
                : unavailable
                  ? `${item.label}, out of stock`
                  : item.label) + unavailableStory
          }
          accessibilityHint={
            bought
              ? 'Hold for more actions'
              : picked
                ? 'Tap to take out of the cart'
                : unavailable
                  ? 'Tap to write what was on the shelf'
                  : 'Tap to put in the cart'
          }
          accessibilityActions={accessibilityActions}
          onAccessibilityAction={onAccessibilityAction}
        >
          <View style={[styles.content, (unavailable || wasUnavailable) && styles.contentWithStatus]}>
            <View style={styles.check}>
              {bought || picked ? (
                <SquareCheckIcon width={28} height={28} color={bought ? inactiveColor : primaryColor} />
              ) : unavailable ? (
                // the question icon is by the status line below
                <View style={styles.checkPlaceholder} />
              ) : (
                <SquareIcon width={28} height={28} color={touchableColor} />
              )}
            </View>
            <View style={[styles.label, (picked || unavailable) && styles.dimmed]}>
              <ListItemLabel item={item} showQuantity={true} />
            </View>
          </View>

          {(unavailable || wasUnavailable) && (
            // the question and the answer, like in a chat: each line with its time on the right
            <View style={styles.unavailable}>
              <View style={styles.statusLine}>
                <View style={styles.statusIcon}>
                  {unavailable && <SquareQuestionIcon width={24} height={24} color={secondaryColor} />}
                </View>
                {editingNote ? (
                  <TextInput
                    ref={noteInput}
                    style={[styles.note, styles.noteInput, { color: inputTextColor, backgroundColor: inputBackground }]}
                    value={noteText}
                    onChangeText={setNoteText}
                    placeholder="Out of stock"
                    placeholderTextColor={inputPlaceholder}
                    cursorColor={cursorColor}
                    selectionColor={cursorColor + '66'}
                    selectionHandleColor={cursorColor}
                    autoFocus={true}
                    multiline={true}
                    submitBehavior="blurAndSubmit"
                    returnKeyType="send"
                    enterKeyHint="send"
                    onBlur={endNote}
                    accessibilityLabel={`Out of stock, what was on the shelf instead of ${item.label}`}
                    accessibilityHint="Send saves the note"
                  />
                ) : (
                  <Text
                    style={[styles.note, { color: unavailable ? secondaryColor : inactiveColor }]}
                    // Android measures a long line as two with the default strategy
                    textBreakStrategy="simple"
                  >
                    {item.unavailableNote || 'Out of stock'}
                  </Text>
                )}
                <Text style={[styles.time, { color: unavailable ? secondaryColor : inactiveColor }]}>
                  {formatTime(item.unavailableAt)}
                </Text>
              </View>

              {item.unavailableReply ? (
                <View style={styles.statusLine}>
                  <View style={styles.statusIcon} />
                  <Text
                    style={[styles.note, { color: unavailable ? textColor : inactiveColor }]}
                    textBreakStrategy="simple"
                  >
                    {item.unavailableReply}
                  </Text>
                  {item.unavailableReplyAt && (
                    <Text style={[styles.time, { color: unavailable ? textColor : inactiveColor }]}>
                      {formatTime(item.unavailableReplyAt)}
                    </Text>
                  )}
                </View>
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
        </DropdownMenu>
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
 * A pill with the icon and the name of the action: grows in as the row is swiped,
 * stays tappable when the row is left open, follows the finger on a full swipe
 */
function SwipeAction({
  label,
  icon: Icon,
  color,
  textColor,
  progress,
  translation,
  align,
  onPress,
  onFullSwipeChange,
}: SwipeActionProps & {
  progress: SharedValue<number>;
  translation: SharedValue<number>;
  align: 'left' | 'right';
  onPress: () => void;
  onFullSwipeChange: (full: boolean) => void;
}) {
  useAnimatedReaction(
    () => Math.abs(translation.value) > FULL_SWIPE,
    (full, wasFull) => {
      if (wasFull !== null && full !== wasFull) {
        scheduleOnRN(onFullSwipeChange, full);
      }
    }
  );

  // the row opens as wide as the pill
  const openWidth = useSharedValue(FULL_SWIPE / 2);

  const pillStyle = useAnimatedStyle(() => {
    const distance = Math.abs(translation.value);
    // past the open position the pill travels with the edge of the row
    const follow = Math.max(0, distance - openWidth.value) * (align === 'left' ? 1 : -1);
    return {
      opacity: interpolate(progress.value, [0, 0.4, 1], [0, 0.6, 1], 'clamp'),
      transform: [
        { translateX: follow },
        { scale: interpolate(distance, [0, openWidth.value, FULL_SWIPE], [0.7, 1, 1.08], 'clamp') },
      ],
    };
  });

  return (
    <View
      style={[styles.swipeAction, { alignItems: align === 'left' ? 'flex-end' : 'flex-start' }]}
      onLayout={(event) => openWidth.set(event.nativeEvent.layout.width)}
    >
      <Pressable onPress={onPress} accessibilityRole="button" accessibilityLabel={label} accessibilityHint={`${label} this item`}>
        <Animated.View style={[styles.pill, { backgroundColor: color }, pillStyle]}>
          <Icon width={20} height={20} color={textColor} />
          <Text style={[styles.pillText, { color: textColor }]}>{label}</Text>
        </Animated.View>
      </Pressable>
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
  checkPlaceholder: {
    width: 28,
    height: 28,
  },
  // the name and the status read as one item
  contentWithStatus: {
    minHeight: 40,
    paddingTop: 6,
  },
  unavailable: {
    paddingBottom: 12,
    gap: 6,
  },
  // the icon column, the text, the time on the right of the first line
  statusLine: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingRight: 12,
    gap: 8,
  },
  statusIcon: {
    width: 38,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -8,
  },
  note: {
    flex: 1,
    fontFamily: 'Montserrat_500Medium',
    fontSize: 15,
    lineHeight: 20,
  },
  noteInput: {
    // a smaller version of the other fields, the text stays where the note is
    marginLeft: -8,
    marginVertical: -6,
    paddingTop: 6,
    paddingBottom: 6,
    paddingHorizontal: 8,
    borderRadius: 8,
    textAlignVertical: 'top',
  },
  time: {
    fontFamily: 'Montserrat_500Medium',
    fontSize: 13,
    lineHeight: 20,
  },
  label: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  dimmed: {
    opacity: 0.55,
  },
  replies: {
    marginLeft: 38,
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
    // full height of the row, as wide as the pill
    alignSelf: 'stretch',
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
